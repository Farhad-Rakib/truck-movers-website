# HaulRight – static truck/vehicle rental website

Files: `index.html`, `styles.css`, `main.js` (no build step, no dependencies).

## 1. Make the contact form send email
A static site can't send mail itself, so the form posts to a form-forwarding service. Easiest free option: **Formspree**.

1. Sign up at https://formspree.io and create a form. Set the destination email to your business address.
2. Copy your form ID (looks like `xyzabcde`).
3. In `index.html`, replace `YOUR_FORM_ID` in
   `action="https://formspree.io/f/YOUR_FORM_ID"` with your ID.

Alternatives with the same approach: Web3Forms, Getform, Netlify Forms (just add `netlify` attribute if hosted on Netlify).
Spam protection: a hidden honeypot field is already included; enable reCAPTCHA in the Formspree dashboard if needed.

## 2. Replace placeholders
Search & replace in `index.html`:
- `HaulRight` → your business name
- `+1 000 000 0000` / `+10000000000` → your phone (and WhatsApp number in the `wa.me` link)
- `hello@haulright.example` → your public email
- Address, coverage cities, vehicle sizes and testimonials.

Brand colors are CSS variables at the top of `styles.css` (`--navy`, `--amber`).

## 3. Host it (free)
Drag the folder onto Netlify Drop, or use Cloudflare Pages, GitHub Pages or Vercel. Point your domain at it.

## Photos & video (royalty-free)
All media is hot-linked from Pexels (free to use, no attribution required, credit kept in the footer anyway):
- Hero video: EJ Merl – https://www.pexels.com/video/a-semi-truck-is-driving-down-the-road-17899033/
- Hero poster / coverage band: Shantum Singh – https://www.pexels.com/photo/heavy-cargo-trucks-on-indian-highway-29057946/
- Pickup: kall – /photo/pick-up-truck-on-field-16521273/
- Mini truck: throughnislens – /photo/side-view-of-a-delivery-truck-on-coastal-road-33897865/
- Covered van: Mathias Reding – /photo/a-parked-white-van-12821568/
- 14 ft truck: José luis Rivera correa – /photo/bags-with-cargo-in-truck-17358983/
- 20 ft truck: Markie Mad – /photo/truck-traveling-a-highway-14005602/
- "Why us" blurred background: Tom Jackson – /photo/trailers-on-a-parking-lot-27099093/
- Trailer/container: theshuttervision – /photo/truck-on-road-near-park-9754798/

Tip: for production, download these files and host them with your site (put them in an `assets/` folder and change the URLs) so the page doesn't depend on Pexels' servers. Swap in photos of your own vehicles when you have them.

## Languages (English / বাংলা)
- The header button switches language instantly; the choice is remembered in the browser. First-time visitors whose browser language is Bangla see Bangla automatically. You can also link directly with `?lang=bn` or `?lang=en`.
- All text lives in `strings.js` (one `en` and one `bn` entry per key). To change wording, edit the matching key in both languages. The English fallback text is also written in `index.html`.
- Form submissions always arrive in English field names, with an extra `site_language` field telling you which language the visitor used. Vehicle choices are always sent as English values.
- Bangla uses the free Noto Sans Bengali font (Google Fonts). Please have a native speaker review the Bangla copy before launch.

## Client logo slider & recommendations
- **All client names, logos, people and quotes are fictional placeholders.** Replace them with your real clients (with their permission).
- To use real logos: in `index.html`, inside `<ul id="logosTrack">`, replace each `<li class="logo-item">…</li>` with e.g. `<li class="logo-item"><img src="assets/client1.png" alt="Client name" height="36"></li>`. Use grayscale or transparent PNG/SVG logos at about 36 px high. The slider duplicates the list automatically for a seamless loop and pauses on hover.
- Recommendations: edit the `r1`–`r4` keys in `strings.js` (quote, name, role) and the initials inside each `<figure class="reco__slide">` in `index.html`. To add a fifth, copy a `<figure>` block and add `r5.q`, `r5.n`, `r5.r` keys.
