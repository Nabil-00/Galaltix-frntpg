# Galaltix API Integration Guide

## 🎯 Overview

Your Galaltix website now dynamically fetches products from your admin dashboard while maintaining the beautiful existing design. Here's how it works:

## 🔄 How It Works

```
Admin Dashboard → Supabase Database → API Endpoints → Main Website
```

1. **Admin Dashboard**: You add/edit products at your admin dashboard
2. **API**: Products are stored in Supabase and served via API
3. **Main Website**: Automatically fetches and displays products

## 📁 Files Added/Modified

### New Files:
- `assets/js/products-api.js` - Main API integration logic
- `assets/js/config.js` - Configuration settings
- `product-detail.html` - Dynamic product detail page
- `API-INTEGRATION.md` - This documentation

### Modified Files:
- `index.html` - Updated products section to use API
- `products.html` - Updated to use dynamic products
- Both files now include the API scripts

## ⚙️ Configuration

Update `assets/js/config.js` with your settings:

```javascript
window.GalaltixConfig = {
  // Your admin dashboard API URL
  API_BASE_URL: 'https://your-admin-dashboard.vercel.app/api',
  
  // Other settings...
};
```

## 🚀 Features

### ✅ What Works Now:
- **Dynamic Products**: Products load from your admin dashboard
- **Fallback System**: If API fails, shows your existing static products
- **Same Design**: All your existing styling and animations preserved
- **Responsive**: Works on all devices
- **Loading States**: Shows loading spinners while fetching data
- **Error Handling**: Graceful fallbacks if something goes wrong

### 🔄 Dynamic Pages:
- **Homepage**: Shows featured products (first 6 from API)
- **Products Page**: Shows all products in grid layout
- **Product Detail**: Individual product pages with full details

## 📊 Admin Dashboard Integration

Your admin dashboard at: `https://modular-blog-portfolio.vercel.app`

### To Add New Products:
1. Login to your admin dashboard
2. Go to "Products" section
3. Click "New Product"
4. Fill in:
   - Title
   - Category
   - Description/Content
   - Upload image
5. Save

### Product Fields:
- **Title**: Product name (e.g., "Premium Pigeon Peas")
- **Category**: Product category (e.g., "Legumes", "Spices")
- **Content**: Full product description
- **Image**: Product photo (uploaded to Supabase storage)

## 🎨 Design Preservation

### Your Existing Design Elements Maintained:
- ✅ Product cards with hover effects
- ✅ Brand colors (#c87935)
- ✅ Animations and transitions
- ✅ Responsive layout
- ✅ Typography and spacing
- ✅ Button styles and interactions

### New Dynamic Features:
- 🔄 Products load from admin dashboard
- 🔄 Product categories from database
- 🔄 Dynamic product detail pages
- 🔄 Automatic image handling
- 🔄 SEO-friendly URLs

## 🔗 URL Structure

### Product Links:
- **Homepage**: Products link to `product-detail.html?id={product-id}`
- **Products Page**: Same dynamic linking
- **Product Detail**: Shows individual product information

### Quote Requests:
- Quote buttons link to `request-quote.html?product={product-name}`
- Pre-fills the product name in quote forms

## 🛠️ Troubleshooting

### If Products Don't Load:
1. **Check API URL**: Verify `config.js` has correct admin dashboard URL
2. **Check Console**: Open browser dev tools for error messages
3. **Fallback Mode**: Static products will show if API fails
4. **Network Issues**: Check internet connection

### Common Issues:

#### Products Show "Loading..." Forever:
- Check if admin dashboard is deployed and accessible
- Verify API URL in `config.js`
- Check browser console for CORS errors

#### Images Not Loading:
- Ensure images are uploaded in admin dashboard
- Check Supabase storage bucket is public
- Fallback to default image if needed

#### Styling Looks Different:
- All existing CSS is preserved
- Check if Bootstrap/CSS files are loading
- Verify no JavaScript errors in console

## 🔧 Customization

### To Change API URL:
Update `assets/js/config.js`:
```javascript
API_BASE_URL: 'https://your-new-url.vercel.app/api'
```

### To Modify Product Display:
Edit `assets/js/products-api.js`:
- `createProductCard()` - Homepage product cards
- `createProductGridCard()` - Products page grid

### To Add New Fields:
1. Add fields in admin dashboard
2. Update API integration to handle new fields
3. Modify product card templates

## 📈 Benefits

### For You:
- ✅ **Easy Management**: Add products via web interface
- ✅ **No Code Changes**: Update products without touching code
- ✅ **Image Upload**: Direct image upload to cloud storage
- ✅ **Instant Updates**: Changes appear immediately on website

### For Visitors:
- ✅ **Fast Loading**: Optimized API calls with fallbacks
- ✅ **Same Experience**: Identical design and functionality
- ✅ **Better SEO**: Dynamic meta tags for product pages
- ✅ **Mobile Friendly**: Responsive on all devices

## 🚀 Next Steps

1. **Test the Integration**: 
   - Visit your website
   - Check if products load
   - Test product detail pages

2. **Add Products via Admin**:
   - Login to admin dashboard
   - Add a few test products
   - Verify they appear on website

3. **Customize as Needed**:
   - Update API URL in config
   - Modify styling if desired
   - Add more product fields

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify admin dashboard is accessible
3. Test API endpoints directly
4. Check this documentation for troubleshooting

---

**Your website now has the best of both worlds**: beautiful static design with dynamic content management! 🎉