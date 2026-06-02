# Form Service Backup & Recovery Guide

This document provides backup form services and quick recovery instructions in case the primary form service fails.

## Current Setup (Primary)

**Service:** Formspree  
**Endpoint:** `https://formspree.io/f/mpwwabdd`  
**Status Dashboard:** https://formspree.io (log in to check)  
**Activation:** Must verify `officialmicropatches@gmail.com` at formspree.io  

## Form Fields

All fields are submitted exactly as named in the form:
- `customer_name` (required)
- `customer_email` (required)
- `customer_phone` (optional)
- `product_type` (required)
- `quantity` (required)
- `artwork_reference_type` (required)
- `has_reference_image` (optional)
- `reference_image` (optional file upload)
- `reference_image_link` (optional URL)
- `organization` (optional)
- `needed_by_date` (optional)
- `shipping_state` (optional)
- `additional_details` (required)
- `quote_request_consent` (required checkbox)

## Backup Services (Ready to Deploy)

### Backup #1: Basin (basin.io)

**Why:** Similar to Formspree, very reliable, instant setup  
**Setup Time:** 2 minutes  

1. Go to https://basin.io
2. Create account
3. Create a new form (get a form ID like `xxx`)
4. Set up email to `officialmicropatches@gmail.com`
5. In `script.js`, change line 237:
   ```javascript
   form.action = 'https://basin.io/form/xxx'; // Replace xxx with your form ID
   ```
6. Test immediately

### Backup #2: Getform (getform.io)

**Why:** Professional form backend, very stable  
**Setup Time:** 3 minutes  

1. Go to https://getform.io
2. Create account
3. Create new form, select "Email"
4. Set recipient to `officialmicropatches@gmail.com`
5. Copy your form endpoint (looks like `https://getform.io/f/xxxxx`)
6. In `script.js`, change line 237:
   ```javascript
   form.action = 'https://getform.io/f/xxxxx'; // Replace with your endpoint
   ```
7. Test immediately

### Backup #3: EmailJS (emailjs.com)

**Why:** Client-side JavaScript, no external form service needed  
**Setup Time:** 5 minutes  
**Note:** Requires adding EmailJS library to `<script>` tags in HTML

1. Go to https://emailjs.com
2. Create free account
3. Add Gmail service: Connect to `officialmicropatches@gmail.com`
4. Create email template with fields mapping to form fields
5. Get your Service ID and Template ID
6. Replace `configureForm()` function in script.js with email template approach
7. Include EmailJS library in index.html

### Backup #4: Direct Email Fallback (No External Service)

**Why:** Emergency only - sends email via client browser  
**Limitation:** Requires user's email client or webmail to work  

In `script.js`, add fallback in the submit handler:
```javascript
// If primary form fails, use mailto as last resort
var mailtoLink = 'mailto:officialmicropatches@gmail.com?subject=' + 
  encodeURIComponent('New MicroPatches Quote Request from ' + data.get('customer_name')) +
  '&body=' + encodeURIComponent(formDataAsText);
window.location.href = mailtoLink;
```

## Quick Recovery Checklist

**If form stops working:**

1. ✅ Check Formspree status: https://status.formspree.io
2. ✅ Test form submission - check for error in browser console (F12 → Console)
3. ✅ Verify email notification settings at https://formspree.io
4. ✅ If Formspree is down, immediately switch to Basin:
   - Create Basin form (2 min)
   - Update `form.action` in script.js line 237
   - Git commit: `git add script.js && git commit -m "Emergency: Switched to Basin form service"`
   - Git push: `git push origin claude/link-bio-patch-pricing-EzNkv`
   - Test new form
5. ✅ Keep previous form ID in comments for reference

## Testing the Form

Always test after any service change:

1. Open the website
2. Fill out form with test data
3. Check `officialmicropatches@gmail.com` inbox for notification
4. Verify all fields are included in the email

## Why Services Fail

- **Cloudflare errors (521):** Origin server unreachable, infrastructure issue
- **Service downtime:** Rare, but happens (usually announced on status page)
- **Email delivery:** Check spam folder, verify email verified at service
- **CORS/Network:** Browser blocking request, check browser console

## Prevention

- Monitor status pages monthly: https://status.formspree.io
- Keep multiple services activated (cost: free)
- Test form monthly with dummy submission
- Subscribe to Formspree status notifications

## Form Code Reference

**Current implementation (script.js lines 230-268):**
- Uses native HTML form submission (reliable)
- Posts to configured endpoint
- Shows success message after 800ms
- Displays error message if validation fails

**Never go back to:**
- ❌ JavaScript fetch with custom data transformation
- ❌ Shopify generic endpoints
- ❌ FormSubmit (proven unreliable)

## Contact Information

- Primary form email: `officialmicropatches@gmail.com`
- Formspree dashboard: https://formspree.io
- Basin dashboard: https://basin.io
- Getform dashboard: https://getform.io
