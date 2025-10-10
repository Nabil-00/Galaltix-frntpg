# Firebase Integration Setup Guide

This guide will help you set up Firebase for the Galaltix Nigeria Limited website to handle contact form submissions and newsletter subscriptions.

## Prerequisites

- A Google account
- Access to [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "Galaltix Website")
4. (Optional) Enable Google Analytics for your project
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Galaltix Web App")
3. (Optional) Check **"Also set up Firebase Hosting"** if you want to host on Firebase
4. Click **"Register app"**
5. Copy the Firebase configuration object shown on the screen

## Step 3: Configure Firebase in Your Project

1. Open the `firebase-config.js` file in the root directory of your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
};
```

**Example:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxx...",
  authDomain: "galaltix-website.firebaseapp.com",
  projectId: "galaltix-website",
  storageBucket: "galaltix-website.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 4: Set Up Firestore Database

1. In the Firebase Console, go to **"Build" > "Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** or **"Start in test mode"**
   - **Test mode**: Allows read/write access for 30 days (good for development)
   - **Production mode**: Requires security rules (recommended for live sites)
4. Select a Cloud Firestore location (choose the closest to your users, e.g., `eur3` for Europe)
5. Click **"Enable"**

## Step 5: Configure Firestore Security Rules

For production, set up proper security rules. In the Firebase Console:

1. Go to **"Firestore Database" > "Rules"**
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow anyone to write to contact_messages
    match /contact_messages/{document} {
      allow read: if false; // Only admins can read (set up in Firebase Console)
      allow write: if request.resource.data.keys().hasAll(['name', 'email', 'subject', 'message']) 
                   && request.resource.data.name is string
                   && request.resource.data.email is string
                   && request.resource.data.subject is string
                   && request.resource.data.message is string
                   && request.resource.data.email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    }
    
    // Allow anyone to write to newsletter_subscribers
    match /newsletter_subscribers/{document} {
      allow read: if false; // Only admins can read
      allow write: if request.resource.data.keys().hasAll(['email']) 
                   && request.resource.data.email is string
                   && request.resource.data.email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    }
  }
}
```

3. Click **"Publish"**

### Alternative: Test Mode Rules (Development Only)

For testing purposes, you can use these rules (⚠️ **NOT recommended for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Step 6: Test Your Integration

1. Open your website in a browser
2. Open the browser's Developer Console (F12 or Right-click > Inspect > Console)
3. You should see: `"Firebase integration initialized successfully!"`
4. Try submitting the contact form or subscribing to the newsletter
5. Check the Firestore Database in Firebase Console to see if the data was saved

## Step 7: View Submitted Data

### Contact Messages

1. Go to Firebase Console > **Firestore Database**
2. Navigate to the `contact_messages` collection
3. You'll see all submitted contact forms with:
   - Name
   - Email
   - Subject
   - Message
   - Timestamp
   - Status (unread/read)

### Newsletter Subscribers

1. Go to Firebase Console > **Firestore Database**
2. Navigate to the `newsletter_subscribers` collection
3. You'll see all newsletter subscriptions with:
   - Email
   - Subscribed date
   - Status (active/inactive)

## Optional: Set Up Email Notifications

To receive email notifications when someone submits a form, you can use Firebase Cloud Functions:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase Functions: `firebase init functions`
3. Create a function to send emails using services like SendGrid, Mailgun, or Gmail SMTP
4. Deploy the function: `firebase deploy --only functions`

## Optional: Create an Admin Dashboard

You can create a simple admin page to view submissions:

1. Create a new HTML file (e.g., `admin.html`)
2. Add Firebase Authentication to protect the page
3. Use the provided functions in `firebase-integration.js`:
   - `firebaseIntegration.getContactMessages()`
   - `firebaseIntegration.getNewsletterSubscribers()`

## Troubleshooting

### Issue: "Firebase SDK not loaded"
- **Solution**: Check your internet connection and ensure the Firebase CDN links are accessible

### Issue: "Permission denied" errors
- **Solution**: Review your Firestore security rules and ensure they allow write access

### Issue: Forms not submitting
- **Solution**: 
  1. Check the browser console for error messages
  2. Verify your Firebase configuration is correct
  3. Ensure Firestore is enabled in your Firebase project

### Issue: Data not appearing in Firestore
- **Solution**:
  1. Check if the collection names are correct (`contact_messages`, `newsletter_subscribers`)
  2. Verify your security rules allow write operations
  3. Check the browser console for any JavaScript errors

## Security Best Practices

1. ✅ Never commit `firebase-config.js` with real credentials to public repositories
2. ✅ Use environment variables for sensitive data in production
3. ✅ Set up proper Firestore security rules
4. ✅ Enable Firebase App Check to prevent abuse
5. ✅ Monitor usage in Firebase Console to detect unusual activity
6. ✅ Set up billing alerts to avoid unexpected charges

## Data Structure

### Contact Messages Collection
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  subject: "Product Inquiry",
  message: "I would like to know more about...",
  timestamp: Timestamp,
  status: "unread"
}
```

### Newsletter Subscribers Collection
```javascript
{
  email: "subscriber@example.com",
  subscribedAt: Timestamp,
  status: "active"
}
```

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firebase Support](https://firebase.google.com/support)

## Support

For issues specific to this integration, check the browser console for error messages and refer to the troubleshooting section above.

---

**Note**: The free Firebase Spark plan includes:
- 50,000 document reads per day
- 20,000 document writes per day
- 20,000 document deletes per day
- 1 GB storage

This should be more than sufficient for most small to medium-sized business websites.
