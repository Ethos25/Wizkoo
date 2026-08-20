# Marketing deployment architecture

## What ships

Netlify builds this repository with `node scripts/build-site.js` (the same
command as `npm run build`) and serves `_site/`. The build copies only paths
listed under `publish:` in `publish-allowlist.txt`.

## Deploy commit stamp

During every build, `scripts/build-site.js` reads Netlify's read-only
`COMMIT_REF` variable and adds this invisible tag to the `<head>` of every
published HTML entry point:

```html
<meta name="wizkoo-deploy-sha" content="FULL_40_CHARACTER_COMMIT_SHA">
```

If `COMMIT_REF` is absent, the literal value is `unknown`. If it is present but
is not a 40-character hexadecimal commit SHA, the build fails rather than
publishing ambiguous metadata.

From PowerShell, read the live marketing SHA without executing page JavaScript:

```powershell
curl.exe -fsSL https://wizkoo.com/ | rg -o '<meta name="wizkoo-deploy-sha" content="([0-9a-f]{40}|unknown)">'
```

The command must return one meta tag containing a 40-character SHA. `unknown`
or no match means production identity is not established and must not be
treated as a verified deploy.

For the post-deploy check, compare that SHA with the exact commit Amy authorized
for Order #67. Do not infer production state from the branch name or deploy time.
