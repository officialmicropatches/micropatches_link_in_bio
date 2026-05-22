# MicroPatches Link in Bio Troubleshooting

## GitHub Pages Site Not Loading

Likely cause:

- GitHub Pages is not enabled.
- Wrong branch or folder selected.
- `index.html` is not in the repository root.

Simple fix:

- Go to repository `Settings` then `Pages`.
- Choose branch `main`.
- Choose folder `/root`.
- Confirm `index.html` is at the top level.

## Changes Not Appearing

Likely cause:

- GitHub Pages has not finished deploying.
- Browser cache is showing the old page.
- File was uploaded to the wrong repository.

Simple fix:

- Wait a few minutes.
- Hard refresh the browser.
- Confirm the changed file is in `micropatches_link_in_bio`.
- Check the GitHub Pages deployment status.

## Images Not Showing

Likely cause:

- File name does not match `siteConfig.json`.
- Image was uploaded to the wrong folder.
- File name has spaces or capital letters that do not match.

Simple fix:

- Put images in `assets/products/`.
- Use lowercase file names with underscores.
- Match the exact path in `siteConfig.json`.

## Form Not Submitting

Likely cause:

- Required fields are missing.
- `siteConfig.json` did not load.
- FormSubmit activation is not complete.

Simple fix:

- Fill every required field.
- Check that `siteConfig.json` is valid JSON.
- Submit a test form and click the FormSubmit activation email.

## Form Submits But No Email Arrives

Likely cause:

- First FormSubmit activation email was not confirmed.
- Email went to spam.
- Recipient email is wrong in `siteConfig.json`.

Simple fix:

- Check spam for FormSubmit and quote request emails.
- Confirm `quoteForm.recipientEmail` is `officialmicropatches@gmail.com`.
- Submit another test request after activation.

## Uploaded Image Does Not Arrive

Likely cause:

- Email provider stripped the attachment.
- File is too large.
- FormSubmit attachment support needs testing for your account.

Simple fix:

- Ask customers to paste a reference image link.
- Keep uploads small.
- Consider Firebase Storage later if image upload storage becomes important.

## Buttons Go To Wrong Links

Likely cause:

- Social link in `siteConfig.json` is a placeholder or typo.

Simple fix:

- Edit the `links` section in `siteConfig.json`.
- Save and redeploy.

## Website Looks Bad On Mobile

Likely cause:

- A product image is too large or oddly cropped.
- Browser cache is old.

Simple fix:

- Use portrait or square product images.
- Keep images around `1200 x 1600 px` or `1200 x 1200 px`.
- Hard refresh and test again.

## Social Preview Image Not Updating

Likely cause:

- Social platforms cache preview images.

Simple fix:

- Update `seo.socialPreviewImage` in `siteConfig.json`.
- Use a new file name for the preview image.
- Wait for the social platform cache to refresh.

## Favicon Not Changing

Likely cause:

- Browser cached the old favicon.

Simple fix:

- Use a new favicon file name.
- Update `seo.favicon` in `siteConfig.json`.
- Clear browser cache.

## Custom Domain Not Working

Likely cause:

- DNS records are not set correctly.
- DNS has not finished updating.
- GitHub Pages custom domain is not configured.

Simple fix:

- Follow GitHub Pages custom domain instructions.
- Confirm DNS records at your domain registrar.
- Wait up to 24 hours.

## Firebase Permission Denied Error

Likely cause:

- Firebase is not used in this first version.
- A future Firebase setup has incorrect security rules.

Simple fix:

- For this version, remove any Firebase code you added.
- If upgrading later, write rules that allow public create-only submissions but block public reads, deletes, and overwrites.

## Firebase Billing Warning

Likely cause:

- Firebase is not required in this version.
- Future Firebase features may require billing depending on services used.

Simple fix:

- Do not enable Firebase unless you are intentionally upgrading.
- Review Firebase pricing before enabling Storage, Functions, or Extensions.

## Repository Accidentally Connected To The Wrong Project

Likely cause:

- Files were uploaded to an existing website repository.

Simple fix:

- Stop editing that repository.
- Create a new repository named `micropatches_link_in_bio`.
- Upload this project there.
- Remove accidental files from the wrong repository only if you are sure they do not belong there.

## Future Shopify Or Website Link Showing When It Should Be Hidden

Likely cause:

- `futureShopifyEnabled` or `futureWebsiteEnabled` was changed to `true`.

Simple fix:

- Open `siteConfig.json`.
- Set both values to `false`:

```json
"futureShopifyEnabled": false,
"futureWebsiteEnabled": false
```

## Broken `siteConfig.json`

Likely cause:

- Missing comma.
- Missing quote.
- Extra trailing comma.

Simple fix:

- Use a JSON validator.
- Restore the last working version from GitHub history.
