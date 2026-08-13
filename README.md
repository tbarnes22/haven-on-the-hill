# Haven on the Hill

Marketing landing page for **Haven Jiu Jitsu**’s new Syracuse location — Haven on the Hill (Onondaga Hill / OCC area).

Built for the site slug `/syracuse-jiu-jitsu`.

## Preview locally

This is a static site (HTML + CSS + JS). No build step or package install required.

**Option A — open the file**

```bash
open index.html
# or double-click index.html in Finder / File Explorer
```

**Option B — local server (recommended)**

```bash
# Python
python3 -m http.server 8080

# or Node
npx --yes serve -l 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## Project structure

```
index.html              # Landing page
css/styles.css          # Styles
js/main.js              # Nav, FAQ accordion, FormSubmit AJAX + thank-you
assets/images/          # Logo + vendored photography (no hotlinks)
```

## Free class form → email

Submissions POST to [FormSubmit](https://formsubmit.co/) and email **info@cnyjiujitsu.com**.

- Endpoint: `https://formsubmit.co/ajax/info@cnyjiujitsu.com`
- Subject: `Haven on the Hill — free class pass`
- Visitors stay on the page and see the **YOU’RE IN** thank-you state (AJAX / fetch, not a FormSubmit redirect page)

### One-time inbox confirmation (required)

The first time FormSubmit receives a submission for a new address, it emails that inbox an activation link.

**Thomas:** check **info@cnyjiujitsu.com** for a message from FormSubmit and click **Confirm email** / activate. Until that link is clicked, new leads will not arrive. After activation, submissions go through normally.

Spam tip: FormSubmit also uses a honeypot field (`_honey`) on this form.

## Notes

- SEO title/description and canonical URL target `https://cnyjiujitsu.com/syracuse-jiu-jitsu`.
- Brand: Haven Jiu Jitsu — black / red / white. HQ: Baldwinsville, NY. New location: inside TruFitness, Syracuse.
- Header matches the live site nav; Haven on the Hill is page content, not a separate brand mark in the header.
