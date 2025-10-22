# reCAPTCHA Setup Guide for Galaltix Contact Form

This guide will help you set up Google reCAPTCHA v2 for your contact form to prevent spam and bot submissions.

## 🔧 Setup Steps

### 1. Register Your Site with Google reCAPTCHA

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/)
2. Click "**+**" to create a new site
3. Fill in the registration form:
   - **Label**: `Galaltix Contact Form`
   - **reCAPTCHA type**: Select "**reCAPTCHA v2**" → "**I'm not a robot Checkbox**"
   - **Domains**: Add your domains:
     - `localhost` (for development)
     - `galaltix-frntpg.vercel.app` (your Vercel domain)
     - `galaltixnig.com` (if you have a custom domain)
4. Accept the reCAPTCHA Terms of Service
5. Click "**Submit**"

### 2. Get Your Keys

After registration, you'll receive two keys:
- **Site Key** (Public key - safe to expose)
- **Secret Key** (Private key - keep secure)

### 3. Configure Your Website

#### A. Update Site Key in HTML
Replace `YOUR_RECAPTCHA_SITE_KEY` in `contact.html` (line 172) with your actual Site Key:

```html
<div class="g-recaptcha" data-sitekey="6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"></div>
```

#### B. Update Configuration File
In `assets/js/recaptcha-config.js` (lines 23 & 27):

```javascript
// Site Key (public)
SITE_KEY: '6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',

// Secret Key (private) 
SECRET_KEY: '6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
```

### 4. Test the Integration

1. Save all files and deploy your changes
2. Visit your contact form
3. You should see the reCAPTCHA widget appearing before the "Send Message" button
4. Try submitting the form without completing the reCAPTCHA - it should show an error
5. Complete the reCAPTCHA and submit - it should work normally

## 🔒 Security Notes

### Development vs Production

**Current Setup (Development-friendly):**
- Client-side validation only
- Suitable for development and basic spam prevention
- reCAPTCHA widget still prevents most automated bots

**Production Recommendations:**
- Implement server-side verification using the Secret Key
- Add rate limiting on your server
- Consider additional spam filters

### Server-Side Verification (Optional)

For enhanced security, implement server-side verification:

```javascript
// Example server-side verification (Node.js/Express)
const verifyRecaptcha = async (token, secret) => {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`
  });
  
  const data = await response.json();
  return data.success;
};
```

## 📊 Features Added

### ✅ What's Working Now:
- reCAPTCHA widget displays on contact form
- Form validation includes reCAPTCHA check  
- Widget resets after form submission (success/error)
- Graceful fallback if reCAPTCHA fails to load
- Compatible with existing EmailJS and Supabase integrations

### 🔧 Form Behavior:
- **Without reCAPTCHA completion**: Shows "Please complete the reCAPTCHA verification" error
- **With reCAPTCHA completion**: Proceeds with normal form submission
- **After submission**: reCAPTCHA widget resets for next use

## 🐛 Troubleshooting

### reCAPTCHA Not Showing
1. Check browser console for errors
2. Verify Site Key is correct in `contact.html`
3. Ensure domain is registered in reCAPTCHA admin
4. Check if JavaScript is enabled

### Form Validation Errors
1. Complete the reCAPTCHA widget before submitting
2. Check network connectivity
3. Verify all required fields are filled

### Domain Issues
- Add all your domains (including subdomains) to reCAPTCHA admin
- Include both `www` and non-`www` versions if applicable
- For localhost development, add `localhost` or `127.0.0.1`

## 📱 Mobile Compatibility

reCAPTCHA v2 is mobile-responsive and will automatically adjust for mobile devices. The checkbox version is generally more mobile-friendly than other reCAPTCHA types.

## 🎯 Next Steps

1. **Complete the setup** by adding your actual reCAPTCHA keys
2. **Test thoroughly** on both desktop and mobile
3. **Monitor spam levels** - if issues persist, consider server-side verification
4. **Update domains** when you get your custom domain

## 📞 Support

If you encounter issues:
1. Check the [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/display)
2. Review browser console for error messages
3. Test with different browsers and devices
4. Ensure all domains are properly registered

---

**Note**: The current implementation provides good protection against basic spam and bots while maintaining user-friendliness. For enterprise-level security, consider implementing additional server-side verification and monitoring.