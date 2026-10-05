# questage-site
QUE Stage website (questageapp.com), served by GitHub Pages.

Plain HTML/CSS/JS — no build step, nothing loads from other sites.

| Page | What it is |
|---|---|
| `index.html` | Home |
| `experience.html` | Browser demo: six virtual lights, cue list, GO / BACK / BLACKOUT, five-step guide |
| `experience.html?reel` | 1080×1920 recording frame for Instagram (cue run). `?reel=blackout` for the BLACKOUT take. Press **R** to restart a take. |
| `learn.html` | Guides |
| `library.html` | Free FX and palette packs (files in `library/`) |
| `privacy.html` | Privacy policy (linked from App Store Connect — keep this path) |

`assets/stage.js` draws the virtual stage; it never talks to a Hue Bridge or a QUE server.
