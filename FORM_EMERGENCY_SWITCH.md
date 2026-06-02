# Form Service Emergency Switch Guide

**Use this if form stops working. Time estimate: 5 minutes to restore.**

---

## Step 1: Diagnose (1 minute)

```bash
# Check if form is still failing
# - Try submitting a test form
# - Open browser console (F12)
# - Look for network errors
# - Check if email received at officialmicropatches@gmail.com
```

---

## Step 2: Activate Backup Service (2 minutes)

### Option A: Basin (FASTEST - RECOMMENDED)

1. Go to https://basin.io → Sign up → Create new form
2. Set recipient: `officialmicropatches@gmail.com`
3. Copy your form endpoint (looks like `https://basin.io/form/abc123def`)

**In script.js, line 238, change:**
```javascript
form.action = 'https://basin.io/form/abc123def'; // Replace abc123def with your ID
```

### Option B: Getform (Also Reliable)

1. Go to https://getform.io → Sign up → Create new form
2. Select "Email" delivery method
3. Set recipient: `officialmicropatches@gmail.com`
4. Copy your endpoint (looks like `https://getform.io/f/xyz789`)

**In script.js, line 238, change:**
```javascript
form.action = 'https://getform.io/f/xyz789'; // Replace xyz789 with your ID
```

### Option C: Formspree (Restore Original)

1. Go to https://formspree.io → Sign up
2. Create form with ID `mpwwabdd` (if not already)
3. Set recipient: `officialmicropatches@gmail.com`

**In script.js, line 238 (restore to):**
```javascript
form.action = 'https://formspree.io/f/mpwwabdd';
```

---

## Step 3: Verify & Commit (2 minutes)

```bash
# Test the form
# - Open website
# - Fill and submit test form
# - Check if email received

# Commit the change
git add script.js
git commit -m "Emergency: Switched to [Basin/Getform/Formspree] form service"

# Push to your branch
git push origin claude/link-bio-patch-pricing-EzNkv
```

---

## AUTOMATIC FALLBACK

**Good news:** If form submission fails, after 5 seconds the form automatically opens an email draft to `officialmicropatches@gmail.com`. Customer won't lose their request.

---

## Signs Form is Broken

❌ "There was an error submitting your request"  
❌ Form just reloads without confirming  
❌ No email received after 5 minutes  
❌ Browser console shows network error  

---

## How to Prevent

✅ Monthly test: Submit dummy form, check for email  
✅ Monitor status: https://status.formspree.io  
✅ Keep backups: 2-3 services configured and tested  
✅ Document changes: Update VERSION_HISTORY.md when switching  

---

## Contact Info

- **Email:** officialmicropatches@gmail.com
- **Formspree:** https://formspree.io
- **Basin:** https://basin.io
- **Getform:** https://getform.io

---

## FAQ

**Q: Will customers lose their submission if form fails?**  
A: No. After 5 seconds, form opens a mailto link. They can send via email instead.

**Q: How often do these services go down?**  
A: Rarely (< 1% downtime/year). But backups make sure you never miss a lead.

**Q: Can I use multiple services at once?**  
A: Yes. Script.js only uses one endpoint, but you can have multiple accounts ready.

**Q: What if all services are down?**  
A: Customers can email `officialmicropatches@gmail.com` directly. Fallback email link is visible in the form error.

**Q: Do I need to test monthly?**  
A: Yes. Submit a test form quarterly and verify email arrives.
