#!/usr/bin/env node
// Removes the repo worm from branches with a normal commit on top (never a force-push).
//
//   node scripts/security/clean-branches.mjs                      # dry run, every infected origin/* branch
//   node scripts/security/clean-branches.mjs feat/x fix/y          # dry run, named branches
//   node scripts/security/clean-branches.mjs --push                # clean and push every infected branch
//
// Run it only AFTER every collaborator's GitHub credentials are revoked and force-pushes are
// blocked by branch protection. Until then the attacker re-infects a pushed fix within seconds.
//
// Safety: it works in throwaway worktrees with git hooks disabled, edits files as text,
// and never runs npm, node or anything else from the branch being cleaned.

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const IOC_FILES = [
  "init", ".env",
  ".vscode/eslint", ".vscode/eslint-check.cmd", ".vscode/eslint-check.sh", ".vscode/tasks.json",
  ".vscode/settings.json", ".vscode/launch.json", ".vscode/extensions.json", ".vscode/spellright.dict",
];
// Packages the loader adds for itself; removed only when no source file still imports them.
const LOADER_DEPS = ["node-fetch", "dotenv"];
// Visible code, 200+ spaces/tabs, then the hidden payload to end of line. Applied in place so
// every original line ending (CRLF, LF or mixed) is preserved exactly.
const PADDED_PAYLOAD = /([^\s])[ \t]{200,}\S[^\r\n]*/g;
// Stage-1 header. Files that are nothing but payload (e.g. public/fonts/fa-solid-400.woff2,
// a fake font that the old tasks.json ran with `node`) are deleted outright.
const PAYLOAD_SIGNATURE = /global\.i *= *['"]A[0-9]/;
// The guard's own files contain the signatures on purpose; excluded by exact path only.
const GUARD_FILES = ["scripts/security/iocs.sh", "scripts/security/scan-branches.sh",
  "scripts/security/clean-branches.mjs", ".github/workflows/malware-guard.yml"];
const NEXT_LOADER = /\r?\n*\(async \(\) => \{[\s\S]*?eval\(proxyInfo\);[\s\S]*?\}\)\(\);[ \t]*(\r?\n)?/;

const args = process.argv.slice(2);
const push = args.includes("--push");
let branches = args.filter((a) => !a.startsWith("--"));

const git = (cwd, ...a) =>
  execFileSync("git", ["-c", "core.hooksPath=/dev/null", "-c", "core.autocrlf=false", ...a], {
    cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, MSYS_NO_PATHCONV: "1" },
  }).trim();

const repo = git(process.cwd(), "rev-parse", "--show-toplevel");
git(repo, "fetch", "--quiet", "--prune", "origin");
if (branches.length === 0) {
  branches = git(repo, "for-each-ref", "--format=%(refname:short)", "refs/remotes/origin")
    .split("\n").filter((b) => b && b !== "origin" && !b.endsWith("/HEAD"))
    .map((b) => b.replace(/^origin\//, ""));
}

const readText = (p) => readFileSync(p, "utf8");
const writeText = (p, s) => writeFileSync(p, s, "utf8");

function cleanTree(dir) {
  const changes = [];
  for (const f of IOC_FILES) {
    if (existsSync(join(dir, f))) { git(dir, "rm", "-q", "-f", "--", f); changes.push(`deleted ${f}`); }
  }

  // Only text files that carry a signature or a padded line; real binaries are skipped by -I.
  let suspects = [];
  try {
    suspects = git(dir, "grep", "-I", "-l", "-E",
      "global\\.i *= *['\"]A[0-9]|eval\\(proxyInfo\\)|[^[:space:]][[:space:]]{200,}[^[:space:]]",
      "--", ".", ":(exclude)node_modules/", ...GUARD_FILES.map((g) => `:(exclude)${g}`)).split("\n").filter(Boolean);
  } catch (e) {
    if (e.status !== 1) throw e;
  }
  for (const f of suspects) {
    const path = join(dir, f);
    const before = readText(path);
    if (PAYLOAD_SIGNATURE.test(before.trimStart().slice(0, 200))) {
      git(dir, "rm", "-q", "-f", "--", f);
      changes.push(`deleted ${f} (payload disguised as a project file)`);
      continue;
    }
    let after = before.replace(PADDED_PAYLOAD, (m, lastVisible) =>
      PAYLOAD_SIGNATURE.test(m) || /eval\(|require\(|Function\(/.test(m) ? lastVisible : m);
    if (/(^|\/)next\.config\.[cm]?[jt]s$/.test(f) && NEXT_LOADER.test(after)) {
      const eol = after.includes("\r\n") ? "\r\n" : "\n";
      after = after.replace(NEXT_LOADER, "").replace(/(\r?\n)+$/, "") + eol;
    }
    if (after !== before) { writeText(path, after); changes.push(`cleaned ${f}`); }
  }

  const pkgPath = join(dir, "package.json");
  if (existsSync(pkgPath)) {
    const raw = readText(pkgPath);
    let next = raw.replace(/"node init && /g, '"');
    const pkg = JSON.parse(next);
    for (const dep of LOADER_DEPS) {
      if (!pkg.dependencies?.[dep]) continue;
      let used = "";
      try { used = git(dir, "grep", "-l", "-E", `from ['"]${dep}['"]|require\\(['"]${dep}['"]\\)|import\\(['"]${dep}['"]\\)`, "--", ".", ":(exclude)node_modules"); } catch { /* no match */ }
      if (!used) next = next.replace(new RegExp(`\\s*"${dep}": "[^"]*",?`), "");
    }
    next = next.replace(/,(\s*\})/g, "$1"); // drop a trailing comma left by the last removal
    if (next !== raw) { JSON.parse(next); writeText(pkgPath, next); changes.push("cleaned package.json"); }
  }

  const giPath = join(dir, ".gitignore");
  if (existsSync(giPath)) {
    const raw = readText(giPath);
    const eol = raw.includes("\r\n") ? "\r\n" : "\n";
    let lines = raw.split(/\r?\n/).filter((l) => !/^(\.gitignore|config\.bat)$/.test(l.trim()));
    if (!lines.some((l) => l.trim() === ".env*")) lines.push(".env*");
    const next = lines.join(eol);
    if (next !== raw) { writeText(giPath, next); changes.push("cleaned .gitignore"); }
  }
  return changes;
}

let failed = 0;
for (const branch of branches) {
  const dir = mkdtempSync(join(tmpdir(), "worm-clean-"));
  try {
    git(repo, "worktree", "add", "--quiet", "--detach", dir, `origin/${branch}`);
    const changes = cleanTree(dir);
    if (changes.length === 0) { console.log(`clean     ${branch}`); continue; }
    git(dir, "add", "-A");
    git(dir, "commit", "--quiet", "-m",
      "fix(security): remove repo worm loader\n\nRemoves the VS Code auto-run task, `init` loader, next.config.ts eval loader,\npadded payloads and committed .env added by the repo worm.\n\n" + changes.map((c) => `- ${c}`).join("\n"));
    let leftovers = "";
    try {
      leftovers = git(dir, "grep", "-I", "-l", "-E",
        "global\\.i *= *['\"]A[0-9]|eval\\(proxyInfo\\)|node init *&&|\"runOn\" *: *\"folderOpen\"",
        "HEAD", "--", ".", ...GUARD_FILES.map((g) => `:(exclude)${g}`));
    } catch (e) {
      if (e.status !== 1) throw e; // status 1 = no match = clean
    }
    if (leftovers) throw new Error(`signatures remain after cleaning: ${leftovers.replace(/\n/g, ", ")}`);
    const sha = git(dir, "rev-parse", "--short", "HEAD");
    if (push) {
      git(dir, "push", "--quiet", "origin", `HEAD:refs/heads/${branch}`); // fast-forward only
      console.log(`PUSHED    ${branch} -> ${sha}  (${changes.length} changes)`);
    } else {
      console.log(`would fix ${branch} -> ${sha}  ${changes.join(", ")}`);
    }
  } catch (err) {
    const msg = String(err.stderr || err.message || err);
    failed++;
    console.error(`FAILED    ${branch}: ${msg.split("\n").slice(0, 4).join(" | ")}`);
  } finally {
    try { git(repo, "worktree", "remove", "--force", dir); } catch { rmSync(dir, { recursive: true, force: true }); }
  }
}
git(repo, "worktree", "prune");
process.exit(failed ? 1 : 0);
