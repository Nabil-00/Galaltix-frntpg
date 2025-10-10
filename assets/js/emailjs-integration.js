/**
 * EmailJS Integration for Contact Form
 * 
 * This script handles sending emails through EmailJS when the contact form is submitted.
 * It works alongside the existing Supabase integration to provide dual functionality:
 * - Emails are sent directly to the recipient via EmailJS
 * - Form data is also stored in Supabase for record-keeping
 * 
 * IMPORTANT: Replace the following placeholders with your actual EmailJS credentials:
 * - YOUR_SERVICE_ID: Your EmailJS service ID (found in EmailJS dashboard)
 * - YOUR_TEMPLATE_ID: Your EmailJS template ID (found in EmailJS dashboard)
 * - YOUR_PUBLIC_KEY: Your EmailJS public key (found in Account > API Keys)
 */

(function() {
  // EmailJS Configuration - REPLACE THESE WITH YOUR ACTUAL VALUES
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'YOUR_SERVICE_ID',
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID',
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY'
  };

  // Initialize EmailJS when the script loads
  function initEmailJS() {
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS SDK not loaded. Please include the EmailJS SDK script.');
      return false;
    }
    
    try {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      return true;
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      return false;
    }
  }

  // Validate form fields including reCAPTCHA
  function validateFormData(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!formData.subject || formData.subject.length < 3) {
      errors.push('Subject must be at least 3 characters long');
    }
    
    if (!formData.message || formData.message.length < 10) {
      errors.push('Message must be at least 10 characters long');
    }
    
    // Validate reCAPTCHA if available
    if (window.RecaptchaConfig && window.RecaptchaConfig.isConfigured()) {
      try {
        const recaptchaResponse = window.RecaptchaConfig.getResponse();
        if (!recaptchaResponse) {
          errors.push('Please complete the reCAPTCHA verification');
        }
      } catch (error) {
        errors.push('reCAPTCHA verification required');
      }
    }
    
    return errors;
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show/hide UI elements
  function setElementVisibility(elements, states) {
    if (elements.loading) {
      elements.loading.style.display = states.loading ? 'block' : 'none';
    }
    if (elements.error) {
      elements.error.style.display = states.error ? 'block' : 'none';
      if (!states.error) elements.error.textContent = '';
    }
    if (elements.success) {
      elements.success.style.display = states.success ? 'block' : 'none';
    }
  }

  // Send email via EmailJS
  async function sendEmailJS(templateParams) {
    if (!initEmailJS()) {
      throw new Error('EmailJS is not properly configured');
    }

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
      
      console.log('EmailJS Success:', response);
      return response;
    } catch (error) {
      console.error('EmailJS Error:', error);
      throw new Error('Failed to send email. Please try again later.');
    }
  }

  // Enhanced contact form handler with EmailJS
  function enhanceContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Get UI elements
    const elements = {
      loading: form.querySelector('.loading'),
      error: form.querySelector('.error-message'),
      success: form.querySelector('.sent-message'),
      submit: form.querySelector('button[type="submit"]')
    };

    // Update success message
    if (elements.success) {
      elements.success.textContent = 'Message sent successfully! We\'ll get back to you soon.';
    }

    // Store the original submit handler
    const originalSubmitHandler = form.onsubmit;

    // Override the form submission
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Get form data
      const formData = {
        name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        subject: form.querySelector('[name="subject"]').value.trim(),
        message: form.querySelector('[name="message"]').value.trim()
      };

      // Validate form data
      const validationErrors = validateFormData(formData);
      if (validationErrors.length > 0) {
        if (elements.error) {
          elements.error.textContent = validationErrors.join('. ');
        }
        setElementVisibility(elements, { loading: false, error: true, success: false });
        return;
      }

      // Show loading state
      setElementVisibility(elements, { loading: true, error: false, success: false });
      if (elements.submit) {
        elements.submit.disabled = true;
        elements.submit.textContent = 'Sending...';
      }

      try {
        // Verify reCAPTCHA if configured
        if (window.RecaptchaConfig && window.RecaptchaConfig.isConfigured()) {
          const recaptchaResponse = window.RecaptchaConfig.getResponse();
          await window.RecaptchaConfig.verify(recaptchaResponse);
        }
        
        // Prepare template parameters for EmailJS
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: 'Galaltix Team', // You can customize this
          reply_to: formData.email
        };

        // Send email via EmailJS
        await sendEmailJS(templateParams);

        // Also try to save to Supabase (optional - won't fail if Supabase is down)
        try {
          const supabaseConfig = window.SiteConfig;
          if (supabaseConfig && supabaseConfig.apiBase) {
            await fetch(`${supabaseConfig.apiBase}/contact`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            });
          }
        } catch (supabaseError) {
          // Silently fail Supabase save - email was sent successfully
          console.log('Supabase save failed (non-critical):', supabaseError);
        }

        // Success! Reset form and show success message
        form.reset();
        
        // Reset reCAPTCHA if available
        if (window.RecaptchaConfig) {
          window.RecaptchaConfig.reset();
        }
        
        setElementVisibility(elements, { loading: false, error: false, success: true });

        // Hide success message after 5 seconds
        setTimeout(() => {
          setElementVisibility(elements, { loading: false, error: false, success: false });
        }, 5000);

      } catch (error) {
        console.error('Form submission error:', error);
        
        // Reset reCAPTCHA on error
        if (window.RecaptchaConfig) {
          window.RecaptchaConfig.reset();
        }
        
        // Show error message
        if (elements.error) {
          elements.error.textContent = error.message || 'Failed to send message. Please try again.';
        }
        setElementVisibility(elements, { loading: false, error: true, success: false });
        
        // Hide error message after 5 seconds
        setTimeout(() => {
          setElementVisibility(elements, { loading: false, error: false, success: false });
        }, 5000);
      } finally {
        // Re-enable submit button
        if (elements.submit) {
          elements.submit.disabled = false;
          elements.submit.textContent = 'Send Message';
        }
      }
    }, true); // Use capture phase to ensure our handler runs first
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceContactForm);
  } else {
    enhanceContactForm();
  }

  // Expose configuration for debugging (optional)
  window.EmailJSConfig = {
    isConfigured: () => {
      return EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
             EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
             EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
    },
    testConnection: async () => {
      if (!window.EmailJSConfig.isConfigured()) {
        console.error('EmailJS is not configured. Please update the configuration.');
        return false;
      }
      try {
        await sendEmailJS({
          from_name: 'Test User',
          from_email: 'test@example.com',
          subject: 'Test Message',
          message: 'This is a test message to verify EmailJS configuration.'
        });
        console.log('EmailJS test successful!');
        return true;
      } catch (error) {
        console.error('EmailJS test failed:', error);
        return false;
      }
    }
  };
})();
