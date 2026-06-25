# Permute — Brand Film

A polished 15-second B2B SaaS brand-film sequence for **Permute**, built with
[Remotion](https://remotion.dev). Everything (UI, tables, motion graphics) is
rendered as vector React components so zoom-ins / push-ins stay crisp.

## The sequence

| Time        | On-screen text                       | Beat                                                            |
| ----------- | ------------------------------------ | --------------------------------------------------------------- |
| 0.0–3.0s    | Describe the logic. Select the sources. | New Data Table flow — prompt + source selection, slow push-in   |
| 3.0–5.5s    | Get one clean view.                  | Unified spreadsheet resolving via a cleaning sweep              |
| 5.5–8.5s    | CRM meets payments.                  | AI-thinking panel + matched CRM ↔ payment records              |
| 8.5–15.0s   | Contract-to-cash, reconciled.        | Lifecycle (Opportunity → Contract → Invoice → Payment → Reconciled), tracking camera that zooms out to the full reconciled view |

- 1920×1080, 30fps, 450 frames
- Palette: white / neutral surfaces, dark-slate text, vivid product blue
- Inter is self-hosted (`@fontsource/inter`) so renders run fully offline

## Develop

```bash
npm install
npm run dev      # Remotion Studio — composition id: PermuteBrandFilm
```

## Render

```bash
npx remotion render PermuteBrandFilm out/permute.mp4
```

In sandboxed environments where Remotion can't download its own Chrome, point
it at a pre-installed Chromium **headless_shell** binary:

```bash
npx remotion render PermuteBrandFilm out/permute.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## Structure

```
src/permute/
  theme.ts            colors, fonts, radii, shadows
  anim.ts             shared easing / reveal helpers
  BrandFilm.tsx       composes the four beats over a shared stage
  components/         Stage (bg + app chrome), Caption, Sphere, Icons
  beats/              Beat1Describe, Beat2Table, Beat3Thinking, Beat4Lifecycle
```
