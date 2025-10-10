(function () {
  const config = window.SiteConfig;

  if (!config || !config.apiBase) {
    console.error('SupabaseIntegration: Missing API base URL.');
    return;
  }

  const API_BASE = config.apiBase.replace(/\/$/, '');
  const endpoints = config.endpoints;
  const placeholderImage = 'assets/img/placeholder.svg';

  function setVisibility(elements, state) {
    const { loading, error, success } = state;

    if (elements.loading) {
      elements.loading.style.display = loading ? 'block' : 'none';
    }
    if (elements.error) {
      elements.error.style.display = error ? 'block' : 'none';
      if (!error) elements.error.textContent = '';
    }
    if (elements.success) {
      elements.success.style.display = success ? 'block' : 'none';
    }
  }

  async function fetchJson(path, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? 12000);

    try {
      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        signal: controller.signal
      });

      if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch (error) {
          // ignore JSON parse errors
        }
        throw new Error(message);
      }

      if (response.status === 204) return null;
      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function createColElement(classes = 'col-lg-4 col-md-6') {
    const col = document.createElement('div');
    col.className = classes;
    return col;
  }

  function createCard({ imageUrl, title, content, meta, link }) {
    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm border-0';

    if (imageUrl) {
      const img = document.createElement('img');
      img.className = 'card-img-top';
      img.src = imageUrl;
      img.alt = title || 'Image';
      card.appendChild(img);
    }

    const body = document.createElement('div');
    body.className = 'card-body d-flex flex-column';

    if (title) {
      const heading = document.createElement('h3');
      heading.className = 'card-title fs-5';
      heading.textContent = title;
      body.appendChild(heading);
    }

    if (meta) {
      const metaEl = document.createElement('p');
      metaEl.className = 'text-muted mb-2 small';
      metaEl.textContent = meta;
      body.appendChild(metaEl);
    }

    if (content) {
      const contentEl = document.createElement('p');
      contentEl.className = 'card-text flex-grow-1';
      contentEl.textContent = content;
      body.appendChild(contentEl);
    }

    if (link?.href && link?.label) {
      const linkEl = document.createElement('a');
      linkEl.href = link.href;
      linkEl.className = 'btn btn-outline-primary mt-2 align-self-start read-more-btn';
      linkEl.textContent = link.label;
      if (link.newTab) {
        linkEl.target = '_blank';
        linkEl.rel = 'noopener';
      }
      body.appendChild(linkEl);
    }

    card.appendChild(body);
    return card;
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      }).format(new Date(dateString));
    } catch (error) {
      return '';
    }
  }

  async function loadProducts() {
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('products-empty');

    if (!grid) return;

    try {
      const products = await fetchJson(endpoints.products);
      grid.innerHTML = '';

      if (!products || !products.length) {
        if (emptyState) emptyState.hidden = false;
        return;
      }

      if (emptyState) emptyState.hidden = true;

      products.forEach((product) => {
        const col = createColElement();
        
        // Truncate content to 120 characters
        const truncatedContent = product.content && product.content.length > 120
          ? product.content.slice(0, 120) + '...'
          : product.content;
        
        const card = createCard({
          imageUrl: product.image_url || placeholderImage,
          title: product.title,
          content: truncatedContent,
          meta: product.category ? `Category: ${product.category}` : null,
          link: {
            href: `product-details.html?id=${product.id}`,
            label: 'Read More',
            newTab: false
          }
        });
        col.appendChild(card);
        grid.appendChild(col);
      });
    } catch (error) {
      console.error('Failed to load products:', error);
      if (emptyState) {
        emptyState.hidden = false;
        emptyState.textContent = 'Unable to load products right now. Please try again later.';
      }
    }
  }

  async function loadPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    const emptyState = document.getElementById('portfolio-empty');

    if (!grid) return;

    try {
      const items = await fetchJson(endpoints.portfolio);
      grid.innerHTML = '';

      if (!items || !items.length) {
        if (emptyState) emptyState.hidden = false;
        return;
      }

      if (emptyState) emptyState.hidden = true;

      items.forEach((item) => {
        const col = createColElement('col-lg-4 col-md-6');
        const card = document.createElement('div');
        card.className = 'portfolio-item shadow-sm border-0 rounded overflow-hidden';

        const figure = document.createElement('figure');
        figure.className = 'position-relative mb-0';

        const img = document.createElement('img');
        img.className = 'img-fluid w-100';
        img.src = item.image_url || placeholderImage;
        img.alt = item.title || 'Portfolio image';
        figure.appendChild(img);

        const overlay = document.createElement('div');
        overlay.className = 'portfolio-info p-3';

        const heading = document.createElement('h4');
        heading.textContent = item.title || 'Project';
        overlay.appendChild(heading);

        const detailsLink = document.createElement('a');
        detailsLink.href = `portfolio-details.html?id=${item.id}`;
        detailsLink.className = 'details-link';
        detailsLink.title = 'View Details';
        detailsLink.innerHTML = '<i class="bi bi-link-45deg"></i>';
        overlay.appendChild(detailsLink);

        const lightboxLink = document.createElement('a');
        lightboxLink.href = item.image_url || placeholderImage;
        lightboxLink.className = 'glightbox preview-link';
        lightboxLink.dataset.gallery = 'portfolio-gallery';
        lightboxLink.title = heading.textContent;
        lightboxLink.innerHTML = '<i class="bi bi-zoom-in"></i>';
        overlay.appendChild(lightboxLink);

        figure.appendChild(overlay);
        card.appendChild(figure);
        col.appendChild(card);
        grid.appendChild(col);
      });

      if (typeof GLightbox === 'function') {
        GLightbox({ selector: '.portfolio .glightbox' });
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      if (emptyState) {
        emptyState.hidden = false;
        emptyState.textContent = 'Unable to load portfolio items right now.';
      }
    }
  }

  async function loadPosts() {
    const grid = document.getElementById('blog-posts');
    const emptyState = document.getElementById('blog-empty');

    if (!grid) return;

    try {
      const posts = await fetchJson(endpoints.posts);
      grid.innerHTML = '';

      if (!posts || !posts.length) {
        if (emptyState) emptyState.hidden = false;
        return;
      }

      if (emptyState) emptyState.hidden = true;

      posts.forEach((post) => {
        const col = createColElement('col-lg-4 col-md-6');
        
        // Truncate content to 120 characters
        const truncatedContent = post.content && post.content.length > 120
          ? post.content.slice(0, 120) + '...'
          : post.content;
        
        const card = createCard({
          imageUrl: post.image_url || placeholderImage,
          title: post.title,
          content: truncatedContent,
          meta: formatDate(post.created_at),
          link: {
            href: `blog-details.html?id=${post.id}`,
            label: 'Read More',
            newTab: false
          }
        });
        col.appendChild(card);
        grid.appendChild(col);
      });
    } catch (error) {
      console.error('Failed to load posts:', error);
      if (emptyState) {
        emptyState.hidden = false;
        emptyState.textContent = 'Unable to load blog posts right now.';
      }
    }
  }

  function bindContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const elements = {
      loading: form.querySelector('.loading'),
      error: form.querySelector('.error-message'),
      success: form.querySelector('.sent-message'),
      submit: form.querySelector('button[type="submit"]')
    };

    setVisibility(elements, { loading: false, error: false, success: false });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      setVisibility(elements, { loading: true, error: false, success: false });
      if (elements.submit) elements.submit.disabled = true;

      const payload = {
        name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        subject: form.querySelector('[name="subject"]').value.trim(),
        message: form.querySelector('[name="message"]').value.trim()
      };

      try {
        await fetchJson(endpoints.contact, {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        form.reset();
        setVisibility(elements, { loading: false, error: false, success: true });

        setTimeout(() => {
          setVisibility(elements, { loading: false, error: false, success: false });
        }, 5000);
      } catch (error) {
        console.error('Contact form submission failed:', error);
        if (elements.error) {
          elements.error.textContent = error.message || 'An error occurred. Please try again later.';
        }
        setVisibility(elements, { loading: false, error: true, success: false });
      } finally {
        if (elements.submit) elements.submit.disabled = false;
      }
    });
  }

  function bindNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    const elements = {
      loading: form.querySelector('.loading'),
      error: form.querySelector('.error-message'),
      success: form.querySelector('.sent-message'),
      submit: form.querySelector('input[type="submit"]')
    };

    setVisibility(elements, { loading: false, error: false, success: false });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      setVisibility(elements, { loading: true, error: false, success: false });
      if (elements.submit) elements.submit.disabled = true;

      const emailInput = form.querySelector('[name="email"]');
      const email = emailInput.value.trim().toLowerCase();

      if (!email) {
        if (elements.error) {
          elements.error.textContent = 'Please enter a valid email address.';
        }
        setVisibility(elements, { loading: false, error: true, success: false });
        if (elements.submit) elements.submit.disabled = false;
        return;
      }

      try {
        await fetchJson(endpoints.newsletter, {
          method: 'POST',
          body: JSON.stringify({ email })
        });

        form.reset();
        setVisibility(elements, { loading: false, error: false, success: true });
        setTimeout(() => {
          setVisibility(elements, { loading: false, error: false, success: false });
        }, 4000);
      } catch (error) {
        console.error('Newsletter subscription failed:', error);
        if (elements.error) {
          elements.error.textContent = error.message || 'Unable to subscribe right now. Please try again later.';
        }
        setVisibility(elements, { loading: false, error: true, success: false });
      } finally {
        if (elements.submit) elements.submit.disabled = false;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    loadPortfolio();
    loadPosts();
    bindContactForm();
    bindNewsletterForm();
  });
})();
