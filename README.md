# Aveek Patra

Source for [aveek.site](https://www.aveek.site), my personal website: who I am, what I build, where I have worked, and websites I have made for clients.

## Stack

- Next.js 16 (Pages Router, Turbopack)
- React 19
- Tailwind CSS 4, configured in `src/styles/tailwind.css`
- Motion 13 for the page animations
- Geist, loaded with `next/font`
- pnpm, ESLint 9, Prettier 3

Requires Node.js 20.9 or newer.

## Getting started

```bash
pnpm install
pnpm dev --port 3002
```

Then open http://localhost:3002. No environment variables are needed.

## Editing content

- `src/lib/profile.js`: name, email addresses and social links
- `src/lib/projects.js`: products and client websites (description, link, logo and screenshot), shown on the home and Projects pages
- `src/pages/index.jsx`: the home page, including what I'm working on right now
- `src/pages/about.jsx`: the About page text, how I build, work history and education
- `src/components/PillShell.jsx`: the floating nav and the footer with the contact section
- `src/components/Isometric.jsx`: the line illustrations, drawn in code
- `public/shots/`: website and app screenshots
- `public/devices/`: the Mac mockups, made with `scripts/mac-mockup.mjs` from a full-screen 16-inch screenshot and Apple's MacBook Pro bezel (not in the repo; get it from [Apple Design Resources](https://developer.apple.com/design/resources/#product-bezels))
- `src/images/logos/`: project, company and client logos

## Animations

Each page tells a short story on load: headings come into focus word by word, text and cards appear out of a soft blur, and logos pop into place. Items side by side appear together, top to bottom. The timing lives in `src/components/Reveal.jsx`; change `pace` there to make everything faster or slower at once. Visitors who ask for reduced motion get simple fades.

## Deployment

Deployed on Vercel. Every push to `master` goes to production at aveek.site; other branches get preview URLs.

Images are served from GitHub Pages rather than Vercel. On each push to `master` that touches an image, `.github/workflows/media.yml` runs `scripts/media.mjs`, which saves every image in `public/` and `src/images/` as WebP at the widths in `media.config.mjs`, and publishes them to https://aveekpatra.github.io/portfolio. In production, `NEXT_PUBLIC_MEDIA_URL` points there and `src/lib/image-loader.js` picks the right file. Without that variable (locally and in previews), Next.js resizes images itself.

## License

The site started from Spotlight, a [Tailwind UI](https://tailwindui.com) template, and has since been rewritten. What remains of the template is under the [Tailwind UI license](LICENSE.md). The Mac mockups use Apple's product bezels under the Apple Design Resources license.
