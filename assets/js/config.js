/**
 * Galaltix Website Configuration
 * Update these settings to match your deployment
 */

window.GalaltixConfig = {
  // Your admin dashboard API URL
  // Update this with your actual Vercel deployment URL
  API_BASE_URL: 'https://supabase-blog.vercel.app/api',
  
  // Fallback settings
  ENABLE_FALLBACK: true,
  
  // Debug mode (set to false in production)
  DEBUG: true,
  
  // Default product image
  DEFAULT_PRODUCT_IMAGE: 'assets/img/portfolio/default-product.jpg',
  
  // Products per page
  PRODUCTS_PER_PAGE: 12,
  
  // Cache duration (in milliseconds)
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};