#!/bin/bash

# Galaltix Website Deployment Script
# This script commits and pushes changes to GitHub, which automatically deploys to Vercel

set -e  # Exit on any error

echo "🚀 Starting Galaltix Website Deployment..."
echo "=================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Found uncommitted changes..."
    
    # Show current status
    echo ""
    echo "Current changes:"
    git status --short
    echo ""
    
    # Add all changes
    echo "➕ Adding all changes..."
    git add .
    
    # Get commit message from user or use default
    if [ -z "$1" ]; then
        # Default commit message with timestamp
        TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
        COMMIT_MSG="Update website - $TIMESTAMP

- Enhanced dual sticky navigation (price ticker + header)
- Modernized About page with brand-consistent colors
- Fixed header-breadcrumb overlap issues
- Updated price ticker with comprehensive agricultural commodities
- Optimized responsive design across all screen sizes"
    else
        COMMIT_MSG="$1"
    fi
    
    echo "💾 Committing changes..."
    git commit -m "$COMMIT_MSG"
    
else
    echo "✅ No uncommitted changes found"
fi

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "🌿 Current branch: $BRANCH"

# Push to GitHub
echo "🔄 Pushing to GitHub..."
if git push origin $BRANCH; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi

echo ""
echo "🎉 Deployment initiated!"
echo "=================================================="
echo "✨ Your changes have been pushed to GitHub"
echo "🔄 Vercel will automatically deploy your changes"
echo "⏱️  Deployment usually takes 1-3 minutes"
echo ""
echo "📊 Monitor deployment status:"
echo "   - Vercel Dashboard: https://vercel.com/dashboard"
echo "   - GitHub Actions: https://github.com/Nabil-00/Galaltix-frntpg/actions"
echo ""
echo "🌐 Your website will be updated at your Vercel URL"
echo "=================================================="