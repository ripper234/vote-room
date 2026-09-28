import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cp, mkdtemp, rm, symlink } from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const temporary = await mkdtemp(path.join(os.tmpdir(), "vote-room-smoke-"));
const excluded = new Set([".git", "node_modules", ".wrangler", ".sites-runtime", "dist", ".next"]);
const key = "a1".repeat(32); // A test-only guest key in an isolated local database.
let dev;
let log = "";

function run(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve(output) : reject(new Error(output)));
  });
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "::1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

try {
  await cp(root, temporary, {
    recursive: true,
    filter: (source) => source === root || !excluded.has(path.basename(source)),
  });
  await symlink(path.join(root, "node_modules"), path.join(temporary, "node_modules"), "dir");

  await run([
    "--import", path.join(root, "scripts/sites-env.mjs"),
    path.join(root, "node_modules/wrangler/bin/wrangler.js"),
    "d1", "execute", "DB", "--config", path.join(root, "dist/server/wrangler.json"),
    "--local", "--persist-to", path.join(temporary, ".wrangler/state"),
    "--file", path.join(temporary, "drizzle/0000_uneven_xavin.sql"), "--yes",
  ], root);

  const port = await freePort();
  dev = spawn(process.execPath, ["scripts/run-framework.mjs", "dev", "--port", String(port), "--strictPort"], {
    cwd: temporary, env: process.env, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"],
  });
  dev.stdout.on("data", (chunk) => { log = (log + chunk).slice(-12000); });
  dev.stderr.on("data", (chunk) => { log = (log + chunk).slice(-12000); });

  async function request(route, { method = "GET", body, cookie, guestKey } = {}) {
    const headers = {};
    if (guestKey) headers["x-decision-key"] = guestKey;
    if (cookie) headers.cookie = cookie;
    if (body) headers["Content-Type"] = "application/json";
    const payload = body && JSON.stringify(body);
    if (payload) headers["Content-Length"] = Buffer.byteLength(payload);
    const response = await new Promise((resolve, reject) => {
      const connection = http.request({ hostname: "::1", port, path: route, method, headers }, (incoming) => {
        const chunks = [];
        incoming.on("data", (chunk) => chunks.push(chunk));
        incoming.on("end", () => resolve({
          status: incoming.statusCode,
          ok: incoming.statusCode >= 200 && incoming.statusCode < 300,
          headers: incoming.headers,
          text: Buffer.concat(chunks).toString("utf8"),
        }));
      });
      connection.on("error", reject);
      connection.setTimeout(12000, () => connection.destroy(new Error("Local request timed out.")));
      connection.end(payload);
    });
    const contentType = response.headers["content-type"] ?? "";
    const result = contentType.includes("application/json") ? JSON.parse(response.text) : response.text;
    return { response, result };
  }

  let ready = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    if (dev.exitCode !== null) throw new Error("Local server exited before becoming ready.");
    try {
      const { response, result } = await request("/");
      if (response.ok) {
        assert.match(result, /סרטון קצר של המועמד/);
        ready = true;
        break;
      }
    } catch { /* The local server may still be starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(ready, "Local server did not become ready.");

  const guest = await request("/api/decision", { guestKey: key });
  assert.equal(guest.response.status, 200);
  assert.equal(guest.result.revision, 0);
  assert.equal(guest.result.account, null);
  const state = { ...guest.result.state, orientation: "explore" };
  const saved = await request("/api/decision", {
    method: "POST", guestKey: key, body: { state, expectedRevision: 0, kind: "orientation" },
  });
  assert.equal(saved.response.status, 200);
  assert.equal(saved.result.revision, 1);
  const reloaded = await request("/api/decision", { guestKey: key });
  assert.equal(reloaded.result.state.orientation, "explore");
  const invalid = await request("/api/decision", {
    method: "POST", guestKey: key,
    body: { state: { ...state, unexpected: "must not be stored" }, expectedRevision: 1, kind: "invalid" },
  });
  assert.equal(invalid.response.status, 400);
  const guestExport = await request("/api/decision/export", { guestKey: key });
  assert.equal(guestExport.response.status, 200);
  assert.equal(guestExport.result.history.length, 1);
  assert.equal(guestExport.result.history[0].state.orientation, "explore");

  const party = await request("/party/yahad");
  assert.equal(party.response.status, 200);
  assert.match(party.result, /youtube-nocookie\.com/);
  assert.match(party.result, /הטיעון החזק נגד/);
  assert.match(party.result, /פוסטים נבחרים/);
  assert.match(party.result, /naftalibennett\/status\/2048485392865755469/);
  for (const [slug, statusId] of [["utj", "1773427743604031865"], ["amcha", "2092278960021274918"]]) {
    const anotherParty = await request(`/party/${slug}`);
    assert.equal(anotherParty.response.status, 200);
    assert.match(anotherParty.result, new RegExp(statusId));
  }

  const signIn = await request("/signin-with-chatgpt?return_to=%2Fmap");
  assert.equal(signIn.response.status, 302);
  assert.equal(signIn.response.headers.location, "/map");
  assert.match(signIn.response.headers["set-cookie"]?.join(";") ?? "", /__sites_local_auth=1/);
  const cookie = "__sites_local_auth=1";
  const account = await request("/api/decision", { guestKey: key, cookie });
  assert.equal(account.response.status, 200);
  assert.equal(account.result.account.email, "seedy@sites.test");
  assert.equal(account.result.state.orientation, "explore");
  const accountPage = await request("/account", { cookie });
  assert.match(accountPage.result, /החשבון שלך מוכן/);

  const secondKey = "b2".repeat(32);
  const secondGuest = await request("/api/decision", { guestKey: secondKey });
  const otherState = { ...secondGuest.result.state, orientation: "continue", generalNotes: "A separate guest thought" };
  const otherSaved = await request("/api/decision", {
    method: "POST", guestKey: secondKey, body: { state: otherState, expectedRevision: 0, kind: "general_note" },
  });
  assert.equal(otherSaved.response.status, 200);
  const conflict = await request("/api/decision", { guestKey: secondKey, cookie });
  assert.equal(conflict.result.state.orientation, "explore");
  assert.equal(conflict.result.guestConflict.state.orientation, "continue");
  const kept = await request("/api/decision", {
    method: "POST", guestKey: secondKey, cookie,
    body: { state: conflict.result.state, expectedRevision: conflict.result.revision, kind: conflict.result.guestConflict.choiceKind },
  });
  assert.equal(kept.response.status, 200);
  assert.equal((await request("/api/decision", { guestKey: secondKey, cookie })).result.guestConflict, null);
  const editedAccountState = { ...conflict.result.state, generalNotes: "An account edit after keeping it" };
  const editedAccount = await request("/api/decision", {
    method: "POST", guestKey: secondKey, cookie,
    body: { state: editedAccountState, expectedRevision: kept.result.revision, kind: "general_note" },
  });
  assert.equal(editedAccount.response.status, 200);
  assert.equal((await request("/api/decision", { guestKey: secondKey, cookie })).result.guestConflict, null);
  const changedGuestState = { ...otherState, generalNotes: "A newer guest thought" };
  const changedGuest = await request("/api/decision", {
    method: "POST", guestKey: secondKey,
    body: { state: changedGuestState, expectedRevision: otherSaved.result.revision, kind: "general_note" },
  });
  assert.equal(changedGuest.response.status, 200);
  const newConflict = await request("/api/decision", { guestKey: secondKey, cookie });
  assert.equal(newConflict.result.guestConflict.state.generalNotes, "A newer guest thought");
  assert.notEqual(newConflict.result.guestConflict.choiceKind, conflict.result.guestConflict.choiceKind);
  const replaced = await request("/api/decision", {
    method: "POST", guestKey: secondKey, cookie,
    body: { state: changedGuestState, expectedRevision: newConflict.result.revision, kind: "guest_replace" },
  });
  assert.equal(replaced.response.status, 200);
  assert.equal((await request("/api/decision", { guestKey: secondKey, cookie })).result.guestConflict, null);
  const accountExport = await request("/api/decision/export", { guestKey: secondKey, cookie });
  assert.equal(accountExport.result.history.length, 4);
  assert.equal(accountExport.result.decision.state.generalNotes, "A newer guest thought");
  const deleted = await request("/api/decision", {
    method: "DELETE", guestKey: secondKey, cookie, body: { confirm: "delete_my_decisions" },
  });
  assert.equal(deleted.response.status, 200, JSON.stringify(deleted.result));
  assert.equal((await request("/api/decision", { guestKey: secondKey })).result.revision, 0);
  assert.equal((await request("/api/decision", { cookie })).result.revision, 0);
  assert.equal((await request("/api/decision/export", { cookie })).result.history.length, 0);

  const signOut = await request("/signout-with-chatgpt?return_to=%2Faccount", { cookie });
  assert.equal(signOut.response.status, 302);
  const guestAgain = await request("/api/decision", { guestKey: key });
  assert.equal(guestAgain.result.account, null);
  assert.equal(guestAgain.result.state.orientation, "explore");
  console.log("Local smoke passed: save, validation, export, party post walls, mock login, persistent guest choice, changed guest, delete, sign-out.");
} catch (error) {
  console.error(error);
  console.error(log.slice(-4000));
  process.exitCode = 1;
} finally {
  if (dev && dev.exitCode === null) {
    try { process.kill(process.platform === "win32" ? dev.pid : -dev.pid, "SIGTERM"); } catch { /* Already stopped. */ }
  }
  await rm(temporary, { recursive: true, force: true });
}
