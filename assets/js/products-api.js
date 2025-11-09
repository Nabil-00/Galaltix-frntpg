/**
 * Galaltix Products API Integration
 * Fetches products from admin dashboard while maintaining existing design
 */

class GalaltixProductsAPI {
  constructor() {
    // Use config if available, otherwise fallback to default
    this.API_BASE_URL = window.GalaltixConfig?.API_BASE_URL || 'https://supabase-blog.vercel.app/api';
    this.DEBUG = window.GalaltixConfig?.DEBUG || false;
    this.fallbackProducts = this.getFallbackProducts();
    
    if (this.DEBUG) {
      console.log('📋 GalaltixProductsAPI initialized with URL:', this.API_BASE_URL);
    }
  }

  /**
   * Fetch products from admin dashboard API
   */
  async fetchProducts() {
    try {
      console.log('🔄 Fetching products from admin dashboard...');
      
      const response = await fetch(`${this.API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products = await response.json();
      console.log('✅ Successfully fetched products:', products.length);
      
      return products;
    } catch (error) {
      console.warn('⚠️ Failed to fetch products from API:', error.message);
      console.log('📦 Using fallback products instead');
      return this.fallbackProducts;
    }
  }

  /**
   * Render products in the existing design
   */
  renderProducts(products, containerId = 'products-container') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID '${containerId}' not found`);
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    // If no products, show message
    if (!products || products.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <p class="text-muted">No products available at the moment.</p>
        </div>
      `;
      return;
    }

    // Render each product with existing design
    products.forEach((product, index) => {
      const productCard = this.createProductCard(product, index);
      container.appendChild(productCard);
    });

    // Reinitialize AOS animations if they exist
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  /**
   * Create a product card with existing design
   */
  createProductCard(product, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', (index * 100 + 100).toString());

    // Generate product slug for detail page
    const productSlug = this.generateSlug(product.title);
    
    // Use product image or fallback
    const imageUrl = product.image_url || 'assets/img/portfolio/default-product.jpg';
    
    // Truncate content for card display
    const shortDescription = this.truncateText(product.content, 120);
    
    // Get category or default
    const category = product.category || 'Agricultural Products';

    col.innerHTML = `
      <div class="product-card">
        <div class="product-image">
          <img src="${imageUrl}" alt="${product.title}" class="img-fluid" 
               onerror="this.src='assets/img/portfolio/default-product.jpg'">
          <div class="product-badge">${category}</div>
        </div>
        <div class="product-content">
          <div class="product-category">${category}</div>
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${shortDescription}</p>
          <div class="product-actions">
            <a href="product-detail.html?id=${product.id}" class="btn-secondary-custom">Learn More</a>
            <a href="request-quote.html?product=${encodeURIComponent(product.title)}" class="btn-primary-custom">Request Quote</a>
          </div>
        </div>
      </div>
    `;

    return col;
  }

  /**
   * Render products for the main products page (grid layout)
   */
  renderProductsGrid(products, containerId = 'products-grid') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID '${containerId}' not found`);
      return;
    }

    container.innerHTML = '';

    if (!products || products.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <div class="alert alert-info">
            <h4>No Products Available</h4>
            <p>We're currently updating our product catalog. Please check back soon!</p>
          </div>
        </div>
      `;
      return;
    }

    products.forEach((product, index) => {
      const productCard = this.createProductGridCard(product, index);
      container.appendChild(productCard);
    });

    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  /**
   * Create product card for products page grid
   */
  createProductGridCard(product, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 col-sm-12';
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', (index * 100 + 100).toString());

    const imageUrl = product.image_url || 'assets/img/portfolio/default-product.jpg';
    const shortDescription = this.truncateText(product.content, 150);
    const category = product.category || 'Agricultural Products';

    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0">
        <div class="position-relative overflow-hidden">
          <img src="${imageUrl}" class="card-img-top" alt="${product.title}" 
               style="height: 250px; object-fit: cover;"
               onerror="this.src='assets/img/portfolio/default-product.jpg'">
          <div class="position-absolute top-0 start-0 m-3">
            <span class="badge bg-primary">${category}</span>
          </div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-primary">${product.title}</h5>
          <p class="card-text flex-grow-1">${shortDescription}</p>
          <div class="mt-auto">
            <div class="d-flex gap-2 flex-wrap">
              <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-eye"></i> View Details
              </a>
              <a href="request-quote.html?product=${encodeURIComponent(product.title)}" class="btn btn-primary btn-sm">
                <i class="bi bi-envelope"></i> Get Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    return col;
  }

  /**
   * Initialize products on page load
   */
  async init() {
    console.log('🚀 Initializing Galaltix Products API...');
    
    // Check which page we're on and render accordingly
    const currentPage = window.location.pathname;
    
    try {
      const products = await this.fetchProducts();
      
      if (currentPage.includes('index.html') || currentPage === '/') {
        // Homepage - render featured products
        this.renderProducts(products.slice(0, 6), 'products-container');
      } else if (currentPage.includes('products.html')) {
        // Products page - render all products
        this.renderProductsGrid(products, 'products-grid');
      }
      
      console.log('✅ Products initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize products:', error);
    }
  }

  /**
   * Utility: Generate URL-friendly slug
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  /**
   * Utility: Truncate text to specified length
   */
  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Fallback products (your existing static products)
   */
  getFallbackProducts() {
    return [
      {
        id: 'pigeon-peas',
        title: 'Premium Pigeon Peas',
        content: 'High-quality pigeon peas rich in protein and fiber, perfect for traditional Nigerian dishes and international cuisine.',
        image_url: 'assets/img/portfolio/PIGEON PEAS.jpeg',
        category: 'Legumes',
        created_at: new Date().toISOString()
      },
      {
        id: 'cocoa-beans',
        title: 'Dried Fermented Cocoa Beans',
        content: 'Premium quality cocoa beans, properly fermented and dried to international standards for chocolate production.',
        image_url: 'assets/img/portfolio/DRIED FERMENTED COCOA BEANS.jpeg',
        category: 'Cash Crops',
        created_at: new Date().toISOString()
      },
      {
        id: 'hibiscus-flowers',
        title: 'Dried Hibiscus Flowers',
        content: 'Premium dried hibiscus petals perfect for herbal teas and beverages, rich in antioxidants and natural flavor.',
        image_url: 'assets/img/portfolio/DRIED HIBISCUS FLOWER.jpeg',
        category: 'Herbs & Spices',
        created_at: new Date().toISOString()
      },
      {
        id: 'cashew-nuts',
        title: 'Raw Cashew Nuts',
        content: 'Premium raw cashew nuts sourced from the finest farms, perfect for processing and export.',
        image_url: 'assets/img/portfolio/RAW CASHEW NUTS.jpeg',
        category: 'Nuts',
        created_at: new Date().toISOString()
      },
      {
        id: 'dried-ginger',
        title: 'Dried Split Ginger',
        content: 'High-quality dried ginger with excellent aroma and flavor, perfect for culinary and medicinal uses.',
        image_url: 'assets/img/portfolio/DRIED SPLIT GINGER.jpeg',
        category: 'Spices',
        created_at: new Date().toISOString()
      },
      {
        id: 'sesame-seeds',
        title: 'Natural Sesame Seeds',
        content: 'Premium natural sesame seeds with high oil content, perfect for oil extraction and culinary applications.',
        image_url: 'assets/img/portfolio/NATURAL SESAME SEEDS.jpeg',
        category: 'Seeds & Grains',
        created_at: new Date().toISOString()
      }
    ];
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.galaltixAPI = new GalaltixProductsAPI();
  window.galaltixAPI.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GalaltixProductsAPI;
}