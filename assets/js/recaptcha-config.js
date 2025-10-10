/**
 * Google reCAPTCHA Configuration
 * 
 * This file contains configuration for Google reCAPTCHA v2 integration with the contact form.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://www.google.com/recaptcha/admin/
 * 2. Register your site and get the Site Key and Secret Key
 * 3. Replace YOUR_RECAPTCHA_SITE_KEY in contact.html with your actual Site Key
 * 4. Replace YOUR_RECAPTCHA_SECRET_KEY below with your actual Secret Key
 * 5. Update the SITE_DOMAINS with your actual domain(s)
 * 
 * IMPORTANT SECURITY NOTES:
 * - Site Key is public and can be visible to users (it's meant to be public)
 * - Secret Key should be kept private and used only for server-side verification
 * - In production, the secret key should be stored as an environment variable
 */

(function() {
  // reCAPTCHA Configuration
  const RECAPTCHA_CONFIG = {
    // Site Key (public) - Replace with your actual site key from Google reCAPTCHA
    SITE_KEY: 'YOUR_RECAPTCHA_SITE_KEY',
    
    // Secret Key (private) - Replace with your actual secret key
    // Note: In production, this should be stored server-side as an environment variable
    SECRET_KEY: 'YOUR_RECAPTCHA_SECRET_KEY',
    
    // Your site domains (for validation)
    SITE_DOMAINS: [
      'localhost',
      'galaltixnig.com',
      'galaltix-frntpg.vercel.app',
      // Add your actual domain here
    ],
    
    // reCAPTCHA API endpoint
    VERIFY_URL: 'https://www.google.com/recaptcha/api/siteverify'
  };

  // Verify reCAPTCHA response
  async function verifyRecaptcha(recaptchaResponse) {
    if (!recaptchaResponse) {
      throw new Error('Please complete the reCAPTCHA verification');
    }

    // Note: In a real production environment, this verification should be done server-side
    // For now, we'll do basic client-side validation and rely on the reCAPTCHA widget
    // to prevent most bot submissions
    
    try {
      // Basic validation - ensure reCAPTCHA response exists
      if (recaptchaResponse.length < 10) {
        throw new Error('Invalid reCAPTCHA response');
      }
      
      // In production, you would send this to your backend server for verification:
      /*
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          recaptchaResponse: recaptchaResponse,
          remoteip: getUserIP() // Optional
        })
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error('reCAPTCHA verification failed');
      }
      */
      
      console.log('reCAPTCHA validation passed (client-side)');
      return true;
      
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      throw new Error('reCAPTCHA verification failed. Please try again.');
    }
  }

  // Get reCAPTCHA response from the widget
  function getRecaptchaResponse() {
    if (typeof grecaptcha === 'undefined') {
      throw new Error('reCAPTCHA not loaded');
    }
    
    return grecaptcha.getResponse();
  }

  // Reset reCAPTCHA widget
  function resetRecaptcha() {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.reset();
    }
  }

  // Check if reCAPTCHA is configured
  function isRecaptchaConfigured() {
    return RECAPTCHA_CONFIG.SITE_KEY !== 'YOUR_RECAPTCHA_SITE_KEY';
  }

  // Get configuration status for debugging
  function getConfigStatus() {
    return {
      configured: isRecaptchaConfigured(),
      siteKey: RECAPTCHA_CONFIG.SITE_KEY,
      domains: RECAPTCHA_CONFIG.SITE_DOMAINS,
      loaded: typeof grecaptcha !== 'undefined'
    };
  }

  // Export functions globally for use in other scripts
  window.RecaptchaConfig = {
    verify: verifyRecaptcha,
    getResponse: getRecaptchaResponse,
    reset: resetRecaptcha,
    isConfigured: isRecaptchaConfigured,
    getStatus: getConfigStatus,
    config: RECAPTCHA_CONFIG
  };

  console.log('reCAPTCHA Configuration loaded');
})();