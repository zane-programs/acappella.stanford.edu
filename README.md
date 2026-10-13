This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Accessibility verification

Run `npm run build`, then `npm run test:a11y`. Install Playwright's browser once
with `npx playwright install chromium`; to use an installed Google Chrome,
run `PLAYWRIGHT_CHANNEL=chrome npm run test:a11y` instead.

The suite audits all eleven group pages, home, about, shows, privacy and the 404
page at 1280, 375 and 320 CSS pixels. It also checks keyboard skip navigation,
anchor and route focus, mobile dialog focus trapping and Escape, notice dismissal,
and reduced motion both at load and during active animation. External player
and analytics requests are blocked so the checks cover our own interface.

Reduced motion uses the hero poster without loading the video, removes scrolling
and page entrance animation, and finishes active sequences when the preference
changes. Re-enabling motion does not automatically restart a stopped background
video; a fresh page load can enable it again.

Automated checks cannot establish complete accessibility. Before release, also
check with VoiceOver/Safari and NVDA/Firefox, keyboard-only navigation, 200–400%
zoom, forced colors, and the third-party media players (including captions).
