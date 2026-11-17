# Smart Table Export website

Static, English-only product website: HTML, CSS, and local PNG assets. No framework, client-side JavaScript, external fonts, analytics, cookies, dependencies, or build step.

## Preview and validate locally

Open `index.html` directly in a browser, or serve this directory using an existing static file server. All page and asset links are relative and support the GitHub Pages project path `/smart-table-export-site/`.

Run `node scripts/validate.mjs` with an existing Node.js installation for local asset, fragment, accessibility-reference, metadata, and prelaunch CTA checks. This does not contact Gumroad or the Chrome Web Store. There is no package install or build command.

## Repository and deployment configuration

This repository contains only the product website and its local validation script. It contains no extension source, extension manifest, credentials, or extension development history. Links labeled Website repository point to this public repository, not to extension source.

Repository: https://github.com/georgescugpccristian-jpg/smart-table-export-site

The intended hosting configuration is GitHub Pages, **Deploy from a branch**, **main**, **/ (root)**, with HTTPS. `.nojekyll` keeps the site static; no custom workflow or domain is required. Repository files do not verify the current remote Pages settings. Updating local files does not deploy the website; publication requires a separate owner-authorized action.

Homepage: https://georgescugpccristian-jpg.github.io/smart-table-export-site/

Privacy Policy: https://georgescugpccristian-jpg.github.io/smart-table-export-site/privacy.html

## Verified product and launch status

- Product: **Smart Table Export – Lifetime License**.
- Price: **USD 7.99**, one-time lifetime license, no subscription.
- Payment and license verification provider: **Gumroad**.
- Final purchase URL: https://georgescu0.gumroad.com/l/smart-table-export
- The Gumroad product is **unpublished**. The extension is **not yet publicly available** on the Chrome Web Store; no store URL has been supplied.

Free includes table detection, preview, and five completed exports per browser installation, shared across CSV and XLSX, with no monthly reset. Pending or uncertain downloads reserve slots. Pro unlocks unlimited exports, column customization, cleanup, numeric Excel formatting, and saved preferences. Free users can view and delete saved preferences; creating, editing, and applying them require Pro.

Table processing stays local. Activation and revalidation send only the license key, public product ID, and `increment_uses_count=false` to Gumroad over HTTPS. Table contents, page URLs, preferences, and quota data are not sent. Verification normally occurs on use after seven days; cached access lasts at most 30 days after the last success. Removing a license is local, works offline, and does not revoke the purchase. No device count or activation-slot policy is promised. The Privacy Policy also covers local storage, download metadata/history cleanup, and separate website hosting.

## Launch gates: enable only after owner authorization

Both CTAs are native disabled buttons in `index.html`. They have no `href`, event handlers, or client-side script. The purchase URL is stored as inert `data-launch-url` on `#purchase-cta`; it cannot navigate. `#install-cta` has no destination until the owner supplies the actual public store URL. The two gates can be enabled independently through small, reversible HTML edits; no deployment or payment configuration change is needed to prepare them locally.

### Gumroad gate

1. After owner authorization, verify that the exact purchase URL above is public and displays the intended lifetime product at USD 7.99. Confirm license-key generation and sale terms with the owner. Do not make a purchase as part of website validation.
2. Replace only the disabled `#purchase-cta` button with this ordinary link, retaining the existing visual classes:

   ```html
   <a class="button button-green plan-cta" id="purchase-cta" href="https://georgescu0.gumroad.com/l/smart-table-export">Buy Pro — $7.99 USD</a>
   ```

3. Update `#purchase-status`, the pricing note, the privacy introduction and checkout paragraph, and this README to reflect the actual checkout status. Keep the installation gate closed until its separate requirements are met. Retain the activation/internet disclosures.

### Chrome Web Store gate

1. Obtain the exact public listing URL from the owner and verify the correct extension is available. No Chrome Web Store URL has been invented or embedded here.
2. After owner authorization, replace only the disabled `#install-cta` button with an `<a>` using the same `id` and `class`, set `href` to that verified URL, keep `aria-describedby="install-status"`, and label it `Install from Chrome Web Store`.
3. Update `#install-status`, the homepage description metadata, pricing note, privacy introduction, and this README to match the actual installation status. Keep the purchase gate closed if Gumroad is still unpublished.

The validator intentionally enforces the current prelaunch state. When an authorized gate is opened, update its prelaunch assertions to validate the real HTTPS destination and enabled link. To restore prelaunch locally, restore the disabled button and matching status copy. Publishing the resulting files remains a separate action.

## Remaining release checks

- Publish the Gumroad product and Chrome Web Store listing through separate owner actions, then authorize the website links.
- Confirm license-key delivery and real authorized-license activation/revalidation/removal in the extension. Website checks do not establish live provider behavior.
- Confirm whether any older-provider licenses were issued and resolve their migration before release; the website offers no automatic conversion or device policy.
- Confirm publisher identity, a real support/privacy contact, and applicable sale/refund/tax terms before release. None are invented on these pages.
- Review the policy and both pages visually at desktop, tablet, and narrow mobile widths before authorizing publication.

For visual review: check the header/navigation, hero and illustration, two pricing cards, USD price, both disabled Coming soon controls, privacy banner, footer, and all privacy sections at 1440, 768, 390, and 320 CSS pixels. Check 200% zoom, keyboard skip link/focus order, no horizontal page scrolling, and links between pages and feature/pricing anchors. Disabled CTAs should be skipped by Tab and must not navigate. Recheck these controls and status text after each authorized launch edit.

Branding, layout, typography, navigation, assets, and responsive breakpoints are retained. The website remains static with no scripts, forms, analytics, or embedded checkout.
