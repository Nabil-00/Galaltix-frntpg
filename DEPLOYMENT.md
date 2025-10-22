# Galaltix Website Deployment Guide

## 🚀 Auto-Deployment Setup

This website is automatically deployed to Vercel via GitHub integration. Every push to the main branch triggers a new deployment.

## 📋 Quick Deployment

### Option 1: Using the Deployment Script
```bash
# Deploy with automatic commit message
./deploy.sh

# Deploy with custom commit message
./deploy.sh "Your custom commit message here"
```

### Option 2: Manual Git Commands
```bash
# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub (triggers Vercel deployment)
git push origin main
```

## 🔧 Deployment Process

1. **Local Changes** → Edit files locally
2. **Git Commit** → Commit changes to local repository  
3. **GitHub Push** → Push commits to GitHub repository
4. **Vercel Auto-Deploy** → Vercel automatically detects changes and deploys
5. **Live Website** → Updated website goes live (1-3 minutes)

## 📊 Monitoring Deployment

### Vercel Dashboard
- Visit: https://vercel.com/dashboard
- View deployment status, logs, and analytics
- Monitor build times and errors

### GitHub Actions
- Visit: https://github.com/Nabil-00/Galaltix-frntpg/actions
- Check commit history and integration status

## 🏗️ Project Structure

```
Galaltix-frntpg/
├── index.html              # Homepage
├── about.html              # About page
├── products.html           # Products page
├── services.html           # Services page
├── contact.html            # Contact page
├── assets/                 # Static assets
│   ├── css/main.css        # Main stylesheet
│   ├── js/                 # JavaScript files
│   └── img/                # Images
├── vercel.json             # Vercel configuration
├── deploy.sh               # Deployment script
└── DEPLOYMENT.md           # This file
```

## ⚙️ Vercel Configuration

The `vercel.json` file handles:
- Static file serving
- Clean URL routing (/about instead of /about.html)
- Asset caching optimization
- Custom headers

## 🔍 Troubleshooting

### Deployment Failed
1. Check Vercel dashboard for error logs
2. Verify all files are committed and pushed
3. Ensure no syntax errors in HTML/CSS/JS

### Changes Not Showing
1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
2. Check if deployment completed successfully
3. Verify correct branch was pushed (usually 'main')

### Build Errors
1. Check file paths are correct (case-sensitive)
2. Ensure all referenced assets exist
3. Validate HTML/CSS syntax

## 📞 Support

For deployment issues:
1. Check Vercel documentation
2. Review GitHub repository settings
3. Contact repository maintainer

---

**Last Updated:** October 2025  
**Deployment Method:** GitHub → Vercel Integration