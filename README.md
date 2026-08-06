# Wizkoo — Technical Runbook

## Before you touch anything: how this site ships

**The repository is not the website.** wizkoo.com serves the built directory
`_site/`, assembled by `npm run build` (`node scripts/build-site.js`). Netlify
runs that same command on every deploy, so every deploy produces a build log.
Read it.

**`publish-allowlist.txt` decides what ships.** The build copies into `_site/`
exactly the paths named under its `publish:` section and nothing else. To put a
page on the website, add one line to that file. That is the whole edit.

**The build hard-fails on an unaccounted page.** A root-level `.html` file that
appears in neither section of the manifest stops the build: a bordered
`BUILD FAILED — publish-allowlist.txt does not account for every page` block on
stderr, exit code 1, and Netlify deploys nothing. The message names the file and
the one line that clears it. Do not disable it.

### What that guard does not catch

Limits of the mechanism, not defects to go fix. Changing any of them is a
separate ruling.

- **The guard covers root-level `.html` only.** A page in a subdirectory that
  the manifest does not name is silently absent from the website, and nothing
  fails.
- **A manifest entry naming a file that does not exist only warns.** The build
  prints `WARNING  ... matches no file` and exits 0. A green deploy can be
  missing a page.
- **The local build reads the working tree, not git.** An uncommitted file can
  appear in your `_site/`, in a build Netlify can never reproduce.
- **The dev server and the test suite both serve the repository root**, which is
  not the website — `npm run serve` and Playwright's `webServer` both run
  `serve .`. A green test run and a local preview are not evidence about
  production.

### Evidence is pasted output, never prose

A claim about a build, a status code, or a deploy comes back as the actual
terminal output and the command that produced it. "The build passed" is a claim.
The build log is evidence. A result that would look identical whether the
underlying fact were true or false is not evidence.

---

This project is governed by the Technical Runbook.
Before touching any file in this codebase, read:
  TECHNICAL_RUNBOOK.md

Every session starts with one line:
  "Run the Technical Runbook"

The Technical Runbook contains:
  - The complete design system and all locked values
  - Every file map and token definition
  - The session startup sequence (read this first)
  - The build session close protocol
  - Known bugs and Claude Code failure patterns
  - Git protocol and deployment instructions
  - Quality standards ($200 Standard, Completion Standard)

If you are an AI: do not begin work until you have read
TECHNICAL_RUNBOOK.md completely and confirmed the three
startup items in its Session Startup Instruction.

If you are a developer: same instruction.

`GEMINI.md` exists at the root and points here, as `AGENTS.md` does.
