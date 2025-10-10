# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the **Galaltix Nigeria Limited** website - an agricultural goods supplier company website. It's a static Bootstrap-based website with multiple backend integrations for form handling and data storage. The project uses the BizLand Bootstrap template as its foundation.

### Key Features
- Corporate website for agricultural goods supplier
- Contact form with dual backend integration (EmailJS + Firebase/Supabase)
- Newsletter subscription system
- Dynamic content loading from Supabase API
- Products content management
- Responsive design with mobile navigation

## Architecture Overview

### Frontend Structure
- **Static HTML Pages**: `index.html`, `portfolio-details.html`, `service-details.html`, `starter-page.html`
- **Assets Directory**: Contains CSS, JavaScript, images, and vendor libraries
- **Bootstrap-based**: Uses Bootstrap 5.3.3 with custom styling
- **Vendor Dependencies**: AOS animations, Swiper sliders, GLightbox, Isotope layouts

### Backend Integrations

The website supports **three different backend systems** for form handling:

1. **EmailJS Integration** (`assets/js/emailjs-integration.js`)
   - Direct email sending to specified recipients
   - Client-side email service (200 emails/month free tier)
   - Primary contact form handler

2. **Firebase Integration** (`firebase-config.js`, `assets/js/firebase-integration.js`)
   - Firestore database for storing contact messages and newsletter subscriptions
   - Real-time data storage with offline support
   - Collections: `contact_messages`, `newsletter_subscribers`

3. **Supabase Integration** (`assets/js/supabase-integration.js`)
   - REST API for products, contact, and newsletter
   - Dynamic content loading for website sections
   - API base URL configured via meta tag: `supabase-api-base`

### Integration Architecture Pattern

The project implements a **resilient multi-backend pattern**:
- EmailJS handles email delivery (primary)
- Firebase/Supabase store form data (backup/analytics)
- If one service fails, others continue working
- Graceful degradation with user feedback

## Common Development Commands

### Local Development
```bash
# Serve the website locally (requires Python 3)
python3 -m http.server 8000

# Or with Python 2
python -m SimpleHTTPServer 8000

# Or with Node.js http-server (install globally first)
npx http-server . -p 8000

# Or with PHP
php -S localhost:8000
```

### File Serving
Since this is a static site, any local web server will work. The site expects to be served from the root directory.

### Testing Form Integrations
```bash
# Check Firebase console for form submissions
open https://console.firebase.google.com/project/galaltix-53d73/firestore/data

# Test EmailJS configuration in browser console
EmailJSConfig.isConfigured()
EmailJSConfig.testConnection()

# Check Supabase API connectivity
curl "https://supabase-blog-k5c7v8mbr-nabeel-007s-projects.vercel.app/api/products"
```

## Configuration Management

### EmailJS Setup
1. Update `assets/js/emailjs-integration.js` with actual credentials:
```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID',
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', 
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY'
};
```

### Firebase Configuration
- Configuration is in `firebase-config.js` (already configured for galaltix-53d73 project)
- Firestore security rules defined in `FIREBASE_SETUP.md`

### Supabase API Configuration
- API base URL set in `index.html` meta tag: `supabase-api-base`
- Currently points to: `https://supabase-blog-k5c7v8mbr-nabeel-007s-projects.vercel.app/api`

## File Structure Patterns

### JavaScript Organization
- `assets/js/main.js` - Core Bootstrap template functionality (animations, navigation, etc.)
- `assets/js/site-config.js` - API configuration management
- `assets/js/*-integration.js` - Backend service integrations
- `firebase-config.js` - Firebase initialization (root level)

### Form Handling Pattern
All forms follow a consistent pattern:
1. Prevent default submission
2. Show loading state
3. Validate input data
4. Submit to primary service (EmailJS)
5. Backup to secondary services (Firebase/Supabase)
6. Show success/error feedback
7. Reset form on success

### CSS/SCSS Structure
- `assets/css/main.css` - Compiled main stylesheet
- `assets/scss/` - Source SCSS files (requires compilation)
- `assets/vendor/` - Third-party CSS libraries

## Development Guidelines

### Adding New Backend Services
When adding new backend integrations:
1. Create separate `*-integration.js` file
2. Follow the existing error handling pattern
3. Implement graceful fallbacks
4. Update form handlers to include new service
5. Add configuration documentation

### Form Enhancement
- All forms use consistent DOM structure with `.loading`, `.error-message`, `.sent-message` elements
- Validation should happen client-side before submission
- Always provide user feedback for both success and error states
- Implement timeout handling for API calls (12 seconds default)

### Content Management
- Dynamic content loaded via Supabase API endpoints:
  - `/products` - Product listings
  - `/contact` - Contact form submissions
  - `/newsletter` - Newsletter subscriptions

### Image Handling
- Images stored in `assets/img/` directory
- Placeholder image: `assets/img/placeholder.svg`
- Company assets: `galaltixlogo.png`, `galaltixicon.png`

## Security Considerations

### Configuration Security
- EmailJS public key is safe to expose (designed to be public)
- Firebase configuration contains public credentials (normal for client-side)
- Never commit private API keys or sensitive tokens
- Use environment variables in production deployments

### Form Security  
- Client-side validation only (not security boundary)
- Firebase Firestore rules provide server-side security
- Rate limiting should be implemented at the service level
- Email validation regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### API Security
- Supabase API should have proper CORS configuration
- Implement rate limiting for contact/newsletter endpoints
- Monitor Firebase usage to prevent quota exhaustion

## Troubleshooting Common Issues

### Forms Not Submitting
1. Check browser console for JavaScript errors
2. Verify service credentials in configuration files
3. Test individual services (EmailJS, Firebase, Supabase) separately
4. Check network connectivity and CORS policies

### Dynamic Content Not Loading
1. Verify Supabase API base URL in meta tag
2. Check API endpoint responses with curl/browser dev tools
3. Review console for fetch errors
4. Confirm API endpoints match expected data structure

### Styling Issues
1. Ensure `assets/css/main.css` is properly loaded
2. Check for vendor CSS conflicts
3. Verify Bootstrap version compatibility
4. Test responsive behavior across breakpoints

## Setup Documentation

Detailed setup instructions are available in:
- `EMAILJS_SETUP.md` - EmailJS service configuration
- `FIREBASE_SETUP.md` - Firebase project and Firestore setup
- `Readme.txt` - Template attribution and basic info