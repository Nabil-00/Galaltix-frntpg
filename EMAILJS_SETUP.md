# EmailJS Setup Guide for Galaltix Contact Form

## Overview
The contact form now uses EmailJS to send emails directly to your inbox. This guide will help you configure EmailJS with your credentials.

## Setup Steps

### 1. Create an EmailJS Account
1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month) or paid plan
3. Verify your email address

### 2. Create an Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID** (e.g., `service_abc123`)

### 3. Create an Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Set up your template with these variables:
   ```
   Subject: {{subject}}
   
   From: {{from_name}} ({{from_email}})
   
   Message:
   {{message}}
   ```
4. In the "To email" field, enter your email address
5. Save the template
6. Note down your **Template ID** (e.g., `template_xyz789`)

### 4. Get Your Public Key
1. Go to **Account** > **API Keys**
2. Copy your **Public Key** (e.g., `AbCdEfGhIjKlMnOpQr`)

### 5. Update the Configuration
1. Open `/assets/js/emailjs-integration.js`
2. Replace the placeholders with your actual values:
   ```javascript
   const EMAILJS_CONFIG = {
     SERVICE_ID: 'YOUR_SERVICE_ID',    // Replace with your Service ID
     TEMPLATE_ID: 'YOUR_TEMPLATE_ID',  // Replace with your Template ID
     PUBLIC_KEY: 'YOUR_PUBLIC_KEY'     // Replace with your Public Key
   };
   ```

### 6. Test the Integration
1. Open your website
2. Go to the Contact section
3. Fill out the form and submit
4. Check your email inbox
5. Check EmailJS dashboard for sent email logs

## Template Variables
The following variables are sent to your EmailJS template:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Email subject
- `{{message}}` - Message content
- `{{to_name}}` - Recipient name (defaults to "Galaltix Team")
- `{{reply_to}}` - Reply-to email (same as from_email)

## Features
- ✅ Form validation before sending
- ✅ Loading state during submission
- ✅ Success/error messages
- ✅ Automatic form reset on success
- ✅ Dual storage (EmailJS + Supabase backup)
- ✅ Responsive and accessible design

## Troubleshooting

### Emails not sending?
1. Check browser console for errors
2. Verify your EmailJS credentials are correct
3. Check EmailJS dashboard for quota limits
4. Ensure your email service is properly connected

### Testing in Console
You can test your configuration in the browser console:
```javascript
// Check if configured
EmailJSConfig.isConfigured()

// Test send (will send a test email)
EmailJSConfig.testConnection()
```

## Security Notes
- Never commit your EmailJS credentials to version control
- Use environment variables in production
- Consider implementing rate limiting for production use
- The public key is safe to expose (it's meant to be public)
- Never expose your private API key

## Support
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/contact/
