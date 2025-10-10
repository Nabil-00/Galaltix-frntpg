/**
 * Firebase Integration for Galaltix Nigeria Limited Website
 * Handles contact form submissions and newsletter subscriptions
 */

// Contact Form Handler
function initializeContactForm() {
  const contactForm = document.querySelector('.php-email-form');
  
  if (contactForm && contactForm.getAttribute('action') === 'forms/contact.php') {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const loadingDiv = this.querySelector('.loading');
      const errorDiv = this.querySelector('.error-message');
      const sentDiv = this.querySelector('.sent-message');
      const submitButton = this.querySelector('button[type="submit"]');
      
      // Show loading
      loadingDiv.style.display = 'block';
      errorDiv.style.display = 'none';
      sentDiv.style.display = 'none';
      submitButton.disabled = true;
      
      // Get form data
      const formData = {
        name: this.querySelector('[name="name"]').value,
        email: this.querySelector('[name="email"]').value,
        subject: this.querySelector('[name="subject"]').value,
        message: this.querySelector('[name="message"]').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'unread'
      };
      
      try {
        // Save to Firestore
        await db.collection('contact_messages').add(formData);
        
        // Hide loading, show success
        loadingDiv.style.display = 'none';
        sentDiv.style.display = 'block';
        
        // Reset form
        this.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          sentDiv.style.display = 'none';
        }, 5000);
        
      } catch (error) {
        console.error('Error submitting contact form:', error);
        loadingDiv.style.display = 'none';
        errorDiv.textContent = 'An error occurred. Please try again later.';
        errorDiv.style.display = 'block';
      } finally {
        submitButton.disabled = false;
      }
    });
  }
}

// Newsletter Form Handler
function initializeNewsletterForm() {
  const newsletterForm = document.querySelector('form[action="forms/newsletter.php"]');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const loadingDiv = this.querySelector('.loading');
      const errorDiv = this.querySelector('.error-message');
      const sentDiv = this.querySelector('.sent-message');
      const submitButton = this.querySelector('input[type="submit"]');
      
      // Show loading
      loadingDiv.style.display = 'block';
      errorDiv.style.display = 'none';
      sentDiv.style.display = 'none';
      submitButton.disabled = true;
      
      // Get email
      const email = this.querySelector('[name="email"]').value;
      
      try {
        // Check if email already exists
        const existingSubscriber = await db.collection('newsletter_subscribers')
          .where('email', '==', email)
          .get();
        
        if (!existingSubscriber.empty) {
          loadingDiv.style.display = 'none';
          errorDiv.textContent = 'This email is already subscribed!';
          errorDiv.style.display = 'block';
          submitButton.disabled = false;
          return;
        }
        
        // Save to Firestore
        await db.collection('newsletter_subscribers').add({
          email: email,
          subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'active'
        });
        
        // Hide loading, show success
        loadingDiv.style.display = 'none';
        sentDiv.style.display = 'block';
        
        // Reset form
        this.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          sentDiv.style.display = 'none';
        }, 5000);
        
      } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        loadingDiv.style.display = 'none';
        errorDiv.textContent = 'An error occurred. Please try again later.';
        errorDiv.style.display = 'block';
      } finally {
        submitButton.disabled = false;
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if Firebase is initialized
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Please check your Firebase configuration.');
    return;
  }
  
  if (typeof db === 'undefined') {
    console.error('Firestore not initialized. Please check your Firebase configuration.');
    return;
  }
  
  // Initialize forms
  initializeContactForm();
  initializeNewsletterForm();
  
  console.log('Firebase integration initialized successfully!');
});

// Optional: Function to fetch and display contact messages (for admin panel)
async function getContactMessages(limit = 10) {
  try {
    const snapshot = await db.collection('contact_messages')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    const messages = [];
    snapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
}

// Optional: Function to fetch newsletter subscribers (for admin panel)
async function getNewsletterSubscribers(limit = 50) {
  try {
    const snapshot = await db.collection('newsletter_subscribers')
      .where('status', '==', 'active')
      .orderBy('subscribedAt', 'desc')
      .limit(limit)
      .get();
    
    const subscribers = [];
    snapshot.forEach(doc => {
      subscribers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return subscribers;
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
}

// Export functions for use in other scripts if needed
window.firebaseIntegration = {
  getContactMessages,
  getNewsletterSubscribers
};
