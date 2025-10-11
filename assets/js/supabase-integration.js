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
      linkEl.className = 'btn btn-outline-primary mt-2 align-self-start';
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
      
      // Only replace content if we get valid products from API
      if (products && products.length > 0) {
        // Safely clear grid content
        while (grid.firstChild) {
          grid.removeChild(grid.firstChild);
        }
        if (emptyState) emptyState.hidden = true;

        products.forEach((product) => {
          const col = createColElement();
          const card = createCard({
            imageUrl: product.image_url || placeholderImage,
            title: product.title,
            content: product.content,
            meta: product.category ? `Category: ${product.category}` : null
          });
          col.appendChild(card);
          grid.appendChild(col);
        });
      } else {
        // Keep existing static content if no API products
        console.log('No API products found, keeping static content');
        if (emptyState) emptyState.hidden = true;
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      // Keep existing static content on error
      console.log('API failed, keeping static content');
      if (emptyState) emptyState.hidden = true;
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

      // Validate form inputs
      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const subjectInput = form.querySelector('[name="subject"]');
      const messageInput = form.querySelector('[name="message"]');
      
      if (!nameInput || !emailInput || !subjectInput || !messageInput) {
        console.error('Required form fields not found');
        return;
      }
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();
      
      // Basic validation
      if (!name || !email || !subject || !message) {
        if (elements.error) {
          elements.error.textContent = 'Please fill in all required fields.';
        }
        setVisibility(elements, { loading: false, error: true, success: false });
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (elements.error) {
          elements.error.textContent = 'Please enter a valid email address.';
        }
        setVisibility(elements, { loading: false, error: true, success: false });
        return;
      }
      
      const payload = { name, email, subject, message };

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
          // Sanitize error message to prevent information disclosure
          const safeErrorMessage = error.name === 'AbortError' 
            ? 'Request timed out. Please try again.'
            : 'An error occurred. Please try again later.';
          elements.error.textContent = safeErrorMessage;
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
      if (!emailInput) {
        console.error('Email input field not found');
        return;
      }
      
      const email = emailInput.value.trim().toLowerCase();
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
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
          // Sanitize error message to prevent information disclosure
          const safeErrorMessage = error.name === 'AbortError' 
            ? 'Request timed out. Please try again.'
            : 'Unable to subscribe right now. Please try again later.';
          elements.error.textContent = safeErrorMessage;
        }
        setVisibility(elements, { loading: false, error: true, success: false });
      } finally {
        if (elements.submit) elements.submit.disabled = false;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    bindContactForm();
    bindNewsletterForm();
  });
})();
