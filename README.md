# MicroPatches Link in Bio

This is a standalone Link in Bio landing page for MicroPatches.

It is built with simple static files:

- `index.html`
- `thankyou.html`
- `styles.css`
- `script.js`
- `siteConfig.json`
- `assets/`

It is designed to run on GitHub Pages and does not require paid hosting for the basic version.

## Important Confirmation

- This project is standalone.
- This project does not modify any existing MicroPatches repository.
- This project does not launch the future full MicroPatches website.
- This project does not depend on Shopify.
- This project does not depend on Etsy and Shopify communicating.
- This project can run on GitHub Pages.
- The quote request workflow is documented below.
- Firebase is not used in this first version.
- Uploaded reference image storage is handled by the form email provider if supported, not Firebase.
- Email notification setup is documented below.
- The owner can update links, images, and content in `siteConfig.json` without being a developer.
- The site does not describe MicroPatches as selling embroidered patches.
- The site does not describe MicroPatches as selling traditional full size patches.
- The provided product images are intended to be treated as real product photography, not mockups.

## File Map

| File or folder | Purpose |
| --- | --- |
| `index.html` | Main Link in Bio landing page |
| `thankyou.html` | Branded thank you page after quote request |
| `styles.css` | Visual design and mobile layout |
| `script.js` | Loads `siteConfig.json`, builds buttons, gallery, pricing, and form settings |
| `siteConfig.json` | Main owner-editable content file |
| `assets/logo/` | Logo image |
| `assets/products/` | Product photos |
| `assets/social/` | Optional social icons or graphics |
| `assets/favicon/` | Favicon |
| `assets/preview/` | Social preview image |
| `assets/bulk_pricing/` | Optional bulk pricing graphic |
| `LAUNCH_CHECKLIST.md` | Step-by-step launch testing checklist |
| `TROUBLESHOOTING.md` | Common problems and simple fixes |

## What This Page Is For

Use this page in:

- Instagram bio
- TikTok bio
- Facebook profile
- Etsy profile
- QR codes
- Packaging inserts
- Customer messages

This page is only a public-facing landing page. It is not the future full MicroPatches website.

## What MicroPatches Offers

Correct language:

- Mini patch inspired products
- Premium raised texture MicroKeychains
- Custom MicroKeychains
- Custom MicroMagnets
- Custom MicroCharms
- Custom MicroPins
- Flexible Patch
- Custom products based on patch style artwork
- Real physical product examples
- Real MicroPatches product photos
- Patch artwork reference
- Badge artwork reference
- Logo artwork reference
- Emblem artwork reference

Do not change the public wording to say:

- Embroidered patches
- PVC patches
- Traditional patches
- Full size patches
- Patch manufacturer
- AI render
- Mockup
- Concept product

Current product sizes:

- MicroKeychains: approximately `45 x 45 mm` (`1.77 x 1.77 in`)
- MicroMagnets: approximately `65 x 65 mm` (`2.56 x 2.56 in`)
- MicroCharms: approximately `25 mm` (`0.98 in`)
- MicroPins: approximately `25 mm` (`0.98 in`)
- Flexible Patch: custom sizes available by customer request

## Owner Editable File

Most updates happen in:

```text
siteConfig.json
```

Open that file when you need to update:

- Business name
- Tagline
- Short description
- Email address
- Etsy link
- Instagram link
- TikTok link
- Facebook link
- Future Shopify link
- Future website link
- Button labels
- Announcement banner
- Product names
- Product descriptions
- Bulk pricing text
- Bulk pricing image path
- Logo image path
- Product image paths
- Social preview image path
- Favicon path
- Custom quote form options
- Footer text
- Privacy note

After editing `siteConfig.json`, keep the commas and quotation marks valid. If the page stops loading content, the most common cause is a missing comma or quote in this file.

## Updating Links

In `siteConfig.json`, edit this section:

```json
"links": {
  "etsy": "https://www.etsy.com/shop/MicroPatches",
  "instagram": "https://www.instagram.com/micropatches",
  "tiktok": "https://www.instagram.com/micropatches",
  "facebook": "https://www.facebook.com/MicroPatches/",
  "email": "https://mail.google.com/mail/?view=cm&fs=1&to=officialmicropatches@gmail.com&su=MicroPatches%20Question",
  "futureShopify": "",
  "futureWebsite": "",
  "futureShopifyEnabled": false,
  "futureWebsiteEnabled": false
}
```

The future Shopify and future website links are disabled by default.

To show one later:

1. Add the real URL.
2. Change the matching enabled value from `false` to `true`.

Do not enable those links until the destination is ready.

## Updating Product Photos

Product photos live in:

```text
assets/products/
```

The current page expects these file names:

- `product_fhp_keychain.jpg`
- `product_lapd_keychain.jpg`
- `product_lafd_keychain.jpg`
- `product_75th_ranger_keychain.jpg`
- `product_chicago_pd_keychain.jpg`
- `product_phoenix_pd_keychain.jpg`
- `product_pomona_pink_keychain.jpg`
- `product_airborne_keychain.jpg`

Recommended product image size:

- Portrait images: about `1200 x 1600 px`
- Square images: about `1200 x 1200 px`
- File type: `.jpg` or `.webp` is best for speed. `.png` also works.
- Keep file sizes as small as practical without making the product blurry

Use lowercase names with underscores and no spaces. File name capitalization matters on GitHub Pages.

If an image is missing, the page shows a clean placeholder.

## Current Image Note

The project is configured with optimized real MicroPatches product photos copied from the product image folder. The original source photos remain outside this repository.

## Updating the Logo

Logo file:

```text
assets/logo/micropatches_logo.png
```

To replace it:

1. Add your logo file to `assets/logo/`.
2. Open `siteConfig.json`.
3. Update:

```json
"logo": "assets/logo/your_logo_file.png"
```

Recommended logo size:

- `512 x 512 px`
- `.png` or `.svg`

## Updating the Bulk Pricing Graphic

The site can show either text pricing tiers or a bulk pricing image.

To use a graphic:

1. Add the image to `assets/bulk_pricing/`.
2. Open `siteConfig.json`.
3. Set:

```json
"bulkPricingImage": "assets/bulk_pricing/keychain_pricing_schedule.jpg"
```

The current live pricing graphic is `assets/bulk_pricing/keychain_pricing_schedule.jpg`. If `bulkPricingImage` is blank, the page uses clean text-based tiers and a placeholder graphic.

Current MicroKeychain pricing:

- `1`: `$13.99 each`, `$25.00` design and work-up fee
- `2-10`: `$12.99 each`, `$25.00` design and work-up fee
- `11-24`: `$11.99 each`, `$25.00` design and work-up fee
- `25-49`: `$10.99 each`, `$25.00` design and work-up fee
- `50-99`: `$10.49 each`, design and work-up fee waived
- `100-249`: `$9.99 each`, design and work-up fee waived
- `250+`: `$8.99 each`, design and work-up fee waived

## Updating SEO and Social Preview

In `siteConfig.json`, edit:

```json
"seo": {
  "pageTitle": "...",
  "metaDescription": "...",
  "ogTitle": "...",
  "ogDescription": "...",
  "socialPreviewImage": "assets/preview/social_preview.svg",
  "favicon": "assets/favicon/favicon.svg"
}
```

Recommended social preview image size:

- `1200 x 630 px`
- `.png` is best for most platforms

Recommended favicon size:

- `512 x 512 px`
- `.png` or `.svg`

Social sites cache preview images. If a preview does not update immediately, wait a while or use the social platform's sharing debugger tool.

## Quote Form Workflow

This version uses FormSubmit.

Why:

- GitHub Pages cannot send email by itself.
- FormSubmit can receive the form and send it to `officialmicropatches@gmail.com`.
- No private API keys are placed in the public repository.
- No customer accounts, payments, inventory, or checkout are added.

What the form collects:

- Customer name
- Customer email
- Optional phone number
- Agency, department, team, unit, or organization name
- Product type requested
- Quantity requested
- Artwork reference type
- Whether the customer has a photo or reference image
- Optional reference image upload
- Optional reference image link
- Needed by date
- Shipping state
- Additional details
- Consent checkbox

Important customer wording:

- This is a quote request, not an automatic order.
- MicroPatches will review the request and follow up by email.
- Customers should not submit payment information through the form.

## Email Notification Setup

The form sends to:

```text
officialmicropatches@gmail.com
```

Form action:

```text
https://formsubmit.co/68de8aba668d52538d40fb476ae515fb
```

The form still notifies `officialmicropatches@gmail.com`. FormSubmit provided the token above after activation so the public form action does not need to expose the email address directly.

First-time activation:

1. Publish the site.
2. Open the live GitHub Pages URL.
3. Submit a test quote request.
4. Check `officialmicropatches@gmail.com`.
5. FormSubmit should send an activation email.
6. Click the activation link.
7. Copy the token FormSubmit provides into `quoteForm.endpointToken` in `siteConfig.json`.
8. Submit a second test request.
9. Confirm the second request arrives as an email.

Expected email subject:

```text
New MicroPatches Custom Quote Request
```

The email should contain:

- Customer information
- Product type
- Quantity
- Artwork reference type
- Needed by date
- Shipping state
- Additional details
- Consent confirmation
- Reference image link if entered
- Uploaded file if FormSubmit accepts the attachment

If the uploaded image does not arrive, use the reference image link field or consider the Firebase upgrade path later.

## Firebase Status

Firebase is not used in this first version.

Services not used:

- Firebase App
- Firestore Database
- Firebase Storage
- Firebase Authentication
- Firebase Cloud Functions
- Firebase Extensions
- Firebase App Check
- Firebase Hosting

Why Firebase is not used now:

- The first launch should stay simple.
- GitHub Pages can host the landing page for free.
- The form only needs to send quote requests to the owner email.
- There is no need for customer accounts, payments, dashboards, or databases in version one.

Future Firebase upgrade:

- Firestore collection: `customQuoteRequests`
- Storage folder: `customOrderUploads/`
- Notification recipient: `officialmicropatches@gmail.com`

If Firebase is added later, do not place private service account files, email passwords, or private API keys in the public repository.

## GitHub Pages Hosting Workflow

### 1. Create the GitHub Repository

1. Go to GitHub.
2. Click `New repository`.
3. Name it:

```text
micropatches_link_in_bio
```

4. Keep it separate from every other MicroPatches repository.
5. Do not merge this project into the future full website repository.

### 2. Upload the Files

Upload everything inside this project folder:

```text
micropatches_link_in_bio/
```

Make sure these files are at the top level of the repository:

- `index.html`
- `thankyou.html`
- `styles.css`
- `script.js`
- `siteConfig.json`
- `README.md`

### 3. Turn on GitHub Pages

1. Open the repository on GitHub.
2. Go to `Settings`.
3. Go to `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Choose branch: `main`.
6. Choose folder: `/root`.
7. Save.

### 4. Find the Live URL

GitHub will show a URL like:

```text
https://yourusername.github.io/micropatches_link_in_bio/
```

Open that URL and test the page.

### 5. Updating the Site Later

For most updates:

1. Edit `siteConfig.json`.
2. Commit or upload the changed file.
3. Wait a few minutes.
4. Refresh the live page.

If changes do not show:

- Hard refresh the browser.
- Check that the file was uploaded to the correct repository.
- Check that GitHub Pages finished deploying.
- Clear browser cache if needed.

### 6. Restoring an Older Version

If something breaks:

1. Open the repository on GitHub.
2. Find the file that changed.
3. Click `History`.
4. Open an older working version.
5. Restore that version or copy the old content back.

## Accounts You Need

Required now:

- GitHub account
- Etsy account
- Instagram account if linking Instagram
- TikTok account if linking TikTok
- Facebook business page if linking Facebook
- Gmail or Google account for `officialmicropatches@gmail.com`

Optional later:

- Firebase account or Google account
- Domain registrar account
- Google Analytics account
- Google Search Console account
- Paid form provider account
- Professional email account

## Things You May Need to Purchase

Not required for first launch:

- Custom domain
- Professional email address
- Paid form service
- Firebase paid plan
- Paid hosting
- Analytics tools
- Image design tools

GitHub Pages can host the page for free unless you want a custom domain, advanced hosting, or a more advanced backend.

## Optional Custom Domain Later

You do not need a custom domain.

If you add one later:

1. Buy the domain from a registrar.
2. In GitHub Pages, enter the custom domain.
3. Follow GitHub's DNS instructions.
4. Wait for DNS to update.
5. Test the site on mobile and desktop.

## Routine Maintenance

Check weekly or monthly:

- Broken links
- Etsy link
- Instagram link
- TikTok link
- Facebook link
- Email button
- Quote form submissions
- Form notification emails
- Spam folder
- Product availability
- Bulk pricing text
- Mobile layout
- Product image quality
- Old promotions
- Test submissions
- Whether future Shopify or future website links are still disabled

## Future Upgrade Options

Possible future upgrades:

- Custom domain
- Professional email
- Google Analytics
- Google Search Console
- Shopify integration
- Embedded Etsy listings
- Full company website link
- Owner dashboard
- Quote status tracking
- Customer confirmation emails
- Separate landing pages for police, fire, EMS, and military
- QR code landing page for packaging
- Newsletter signup
- Order tracking page
- Customer quote management system
- Flexible Patch product page

These are future upgrades and are not required for the first launch.

## Final Pre-Launch Reminder

Before sharing the page publicly:

1. Confirm the real MicroPatches product photos display correctly.
2. Confirm all social links are correct.
3. Submit the first FormSubmit activation request.
4. Click the activation email.
5. Submit a second test request.
6. Confirm the thank you page loads.
7. Confirm the quote email arrives.
8. Confirm Shopify and future website links are not visible.
