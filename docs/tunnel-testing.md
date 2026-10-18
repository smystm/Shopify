# Tunnel testing guide — local backend → Vercel frontend

How to connect the frontend deployed on Vercel to the backend running on this
machine, through a Pinggy tunnel. Written so the owner can redo it without help.

Why Pinggy: the Cloudflare quick tunnel (`cloudflared`) does not work on this
network — both its transport channels (QUIC/UDP 7844 and HTTP/2/TCP 7844) are
blocked by the ISP, so the edge connection never registers. Pinggy speaks SSH on
port 443, which this network passes.

---

## 0. One-time setup (skip when already done)

1. **The tunnel binary** — already present at `E:\Documents\Shopify's\tools\pinggy.exe`
   (v0.6.1). If it is ever lost, download a fresh copy and keep it there:

   ```powershell
   Invoke-WebRequest -Uri "https://github.com/Pinggy-io/cli-js/releases/download/v0.6.1/pinggy-win-x64.exe" -OutFile "E:\Documents\Shopify's\tools\pinggy.exe"
   ```

2. **Start the backend** in its own terminal window:

   ```powershell
   cd E:\Documents\Shopify's\shopify-back
   node app.js
   ```

   Leave this window open — it also prints the login codes
   (`{ "id": ..., "phone": "...", "code": "..." }`) when someone logs in.

3. **Vercel CLI, logged in and linked** (once — the login survives on disk):

   ```powershell
   cd E:\Documents\Shopify's\shopify
   npx vercel login        # opens https://vercel.com/oauth/device?user_code=XXXX in a browser
   npx vercel link --project shopify --yes
   ```

---

## 1. Open the tunnel

In a **new terminal window**:

```powershell
E:\Documents\Shopify's\tools\pinggy.exe -p 443 -R0:localhost:5000
```

Reading the flags: `-p 443` connects to Pinggy's relay on port 443 (TCP, SSH —
the only thing this network lets through); `-R0:localhost:5000` asks the relay
to accept public traffic and forward it to the backend on `localhost:5000`
(the `0` means "assign me any free subdomain").

Keep this window open — closing it kills the tunnel. After a few seconds it
prints the public URLs, e.g.

```
Remote URLs:
  https://vmzgf-222-254-35-6.free.pinggy.net          ← use this one
  https://tomui-222-254-35-6.run.pinggy-free.link     ← same tunnel, alias
```

Free tier facts: the tunnel **expires after 60 minutes**, and **every fresh run
gets a new URL**. That is why the Vercel variable has to be updated each time.

## 2. Sanity-check the tunnel before touching Vercel

```powershell
curl.exe https://THE-TUNNEL-HOST/api/auth/mode
```

Expected:

```
{"status":"success","provider":"phone"}
```

(If you test other endpoints as well, note that the free tier shows a browser
"screening page" to requests that look like a real browser — curl is exempt
here, and the deployed proxy strips the problem, see §6.)

## 3. Point Vercel at the new tunnel

From the frontend folder. The CLI reads the variable's value from stdin — a
new URL is **added**; to **replace**, remove the old one first:

```powershell
cd E:\Documents\Shopify's\shopify

npx vercel env rm BACKEND_API_URL production --yes
npx vercel env rm BACKEND_API_URL preview --yes

"https://THE-TUNNEL-HOST/api" | npx vercel env add BACKEND_API_URL production
"https://THE-TUNNEL-HOST/api" | npx vercel env add BACKEND_API_URL preview
```

**The value must end in `/api`** — the proxy and the server pages both append
their paths after it (`/products`, `/auth/login`, …). A value without `/api`
answers every call with a 404 from Express.

Dashboard alternative (works without CLI auth): vercel.com → project *shopify* →
Settings → Environment Variables → change `BACKEND_API_URL` → Save →
Deployments → ⋯ → *Redeploy* on the latest production deployment.

## 4. Redeploy so the variable takes effect

```powershell
npx vercel --prod
```

 waits ~1–2 minutes; finishes with
`Production URL: https://biashopify.vercel.app`. A deploy is always needed
after changing an env var — changing the variable alone does nothing to
already-built functions.

## 5. Verify end to end

```powershell
curl.exe https://biashopify.vercel.app/api/auth/mode
```

then the browser check that mirrors what the site really does
(masked browser user-agent → would have hit Pinggy's screening page without the
header fix described in §6):

```powershell
curl.exe -A "Mozilla/5.0" https://biashopify.vercel.app/api/products -o check.json
# check.json must start with: {"status":"success","products":[{"id":1,...
```

And in a real browser: open https://biashopify.vercel.app/ and Ctrl+F5 — the
catalog and the homepage tiles should fill.

## 6. The screening-page gotcha (already handled)

Pinggy's **free** tunnels serve an interstitial "screening page" HTML to
browser-like traffic instead of the site. Browser-catalog products vanished
because the browser's fetch through the shop's proxy (`app/api/[...path]/route.ts`)
matched Pinggy's browser fingerprint and received that page instead of JSON.
The proxy now stamps every outgoing call with `X-Pinggy-No-Screen: 1`, which
Pinggy accepts as an explicit skip. Two consequences:

- Do **not** remove that header while using a free Pinggy tunnel.
- The header change lives in `route.ts` but is **uncommitted** (per house
  rules). If anything gets pushed from a machine with the older copy, Vercel's
  GitHub integration will auto-deploy and silently drop the header — the
  catalog breaks again with the page returned. Before relying on a
  GitHub-driven deploy, pull that change in and commit it.

## 7. Troubleshooting map

| Symptom | Cause → fix |
| --- | --- |
| Live site: 502 `UPSTREAM_UNREACHABLE` | Tunnel dead (expired / window closed). Restart it, §1; update the env, §3; redeploy, §4. |
| Live site answers but catalog empty | Screening page reached the browser. Check the deploy is new enough to carry the `X-Pinggy-No-Screen` header (§6); hard-refresh with Ctrl+F5. |
| Tunnel URL reachable but `/api/*` → `Cannot GET /...` | The value in `BACKEND_API_URL` is missing its `/api` suffix. Re-add it (§3) and redeploy. |
| `vercel env add` hangs | It is waiting for the value on stdin — pipe the URL as in §3. |
| Tunnel will not connect at all | Check the backend is up (`curl.exe http://localhost:5000/api/auth/mode`). Then check the pinggy window for relay errors; rerun. |
| Quieter operation | Run the CLI rarely: `pinggy --b` (daemon) then `pinggy ps`, `pinggy stop <name>`. `--loglevel INFO` prints fewer lines. |

## 8. Next step: retire the tunnel

The tunnel is for testing only. The production target is a single VPS running
the backend 24/7; once that exists, `BACKEND_API_URL` points at the VPS's real
(TLS) domain and this whole document becomes history for the frontend. If a
tunnel is still needed after that (e.g. the backend temporarily lives on a home
machine), an SSH reverse tunnel to the VPS itself (`ssh -R 0:localhost:5000 …`)
does what Pinggy did, free and unlimited.
