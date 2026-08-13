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
js/main.js              # Nav, FAQ accordion, form thank-you
assets/images/          # Logo + vendored photography (no hotlinks)
```

## Notes

- Free class form has no backend: submit shows an in-page thank-you state.
- SEO title/description and canonical URL target `https://cnyjiujitsu.com/syracuse-jiu-jitsu`.
- Brand: Haven Jiu Jitsu — black / red / white. HQ: Baldwinsville, NY. New location: inside TruFitness, Syracuse.
