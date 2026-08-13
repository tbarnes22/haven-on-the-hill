# Haven on the Hill

Marketing landing page for **Haven Jiu Jitsu**’s new Syracuse location — Haven on the Hill (Onondaga Hill / OCC area).

Built for the site slug `/syracuse-jiu-jitsu`.

## Preview locally

This is a static site (HTML + CSS + JS) with one Vercel serverless function for lead email.

```bash
# Install API dependency (Resend)
npm install

# Static preview only (form POST needs the API)
python3 -m http.server 8080

# Full local preview with /api/lead
npx vercel dev
```

Then visit [http://localhost:8080](http://localhost:8080) (or the URL `vercel dev` prints).

## Project structure

```
index.html              # Landing page
css/styles.css
js/main.js              # Nav, FAQ, lead form → /api/lead
api/lead.js             # Vercel serverless → Resend email
vercel.json
assets/images/          # Logo + vendored photography
```

## Free class form → email (Resend)

Submissions `POST` JSON to **`/api/lead`**, which sends email with [Resend](https://resend.com).

| Field | Value |
| --- | --- |
| To | `info@cnyjiujitsu.com` (`LEAD_TO_EMAIL`) |
| CC | `tbarnes22@gmail.com` (`LEAD_CC_EMAIL`) |
| From | `Haven Jiu Jitsu <noreply@cnyjiujitsu.com>` (`LEAD_FROM_EMAIL`) |
| Reply-To | visitor email |
| Subject | Haven on the Hill — free class pass |

Visitors stay on the page and see the **YOU’RE IN** thank-you on success.

### Environment variables (Vercel)

Set these in the Vercel project — **never commit secrets**.

| Name | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | From Resend dashboard |
| `LEAD_FROM_EMAIL` | recommended | Must use a **verified Resend domain** (default `Haven Jiu Jitsu <noreply@cnyjiujitsu.com>`) |
| `LEAD_TO_EMAIL` | optional | Default `info@cnyjiujitsu.com` |
| `LEAD_CC_EMAIL` | optional | Default `tbarnes22@gmail.com` |

Copy `.env.example` for local `vercel dev`.

### GitHub Pages → Vercel API

If the static lander is hosted on GitHub Pages, point the form at the Vercel function:

```html
<script>
  window.HAVEN_LEAD_API = "https://YOUR-VERCEL-DEPLOYMENT.vercel.app/api/lead";
</script>
<script src="js/main.js" defer></script>
```

CORS allows `https://cnyjiujitsu.com`, `https://tbarnes22.github.io`, localhost, and same-origin.

## Notes

- SEO title/description and canonical URL target `https://cnyjiujitsu.com/syracuse-jiu-jitsu`.
- Brand: Haven Jiu Jitsu — black / red / white. HQ: Baldwinsville, NY. New location: inside TruFitness, Syracuse.
- Header matches the live site nav; Haven on the Hill is page content, not a separate brand mark in the header.
