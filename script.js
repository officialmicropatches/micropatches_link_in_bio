(function () {
  var config = null;

  function getValue(path) {
    return path.split('.').reduce(function (value, part) {
      return value && value[part] !== undefined ? value[part] : '';
    }, config);
  }

  function setText(path) {
    document.querySelectorAll('[data-config-text="' + path + '"]').forEach(function (element) {
      var value = getValue(path);
      if (value) element.textContent = value;
    });
  }

  function setMeta(selector, value) {
    var element = document.querySelector(selector);
    if (element && value) element.setAttribute('content', value);
  }

  function safeImage(img, src, alt) {
    if (!img) return;
    var fallback = getValue('assets.imageFallback') || 'assets/products/product_photo_placeholder.svg';
    img.src = src || fallback;
    if (alt) img.alt = alt;
    img.onerror = function () {
      img.onerror = null;
      img.src = fallback;
      img.alt = 'Product photo placeholder. Add the real MicroPatches product photo at the configured file path.';
    };
  }

  function renderButtons() {
    var container = document.querySelector('[data-config="mainButtons"]');
    if (!container) return;

    var links = config.links || {};
    var labels = config.buttons || {};
    var buttons = [
      { label: labels.customQuote || 'Request a Custom Quote', href: '#quote', className: 'primary-button' },
      { label: labels.etsy || 'Shop on Etsy', href: links.etsy, className: 'secondary-button' },
      { label: labels.instagram || 'Instagram', href: links.instagram, className: 'link-button' },
      { label: labels.tiktok || 'TikTok', href: links.tiktok, className: 'link-button' },
      { label: labels.facebook || 'Facebook', href: links.facebook, className: 'link-button' },
      { label: labels.email || 'Email Us', href: links.email, className: 'link-button' }
    ];

    if (links.futureShopifyEnabled && links.futureShopify) {
      buttons.push({ label: labels.futureShopify || 'Shop MicroPatches', href: links.futureShopify, className: 'link-button' });
    }
    if (links.futureWebsiteEnabled && links.futureWebsite) {
      buttons.push({ label: labels.futureWebsite || 'Visit Website', href: links.futureWebsite, className: 'link-button' });
    }

    container.innerHTML = buttons
      .filter(function (button) { return button.href; })
      .map(function (button) {
        var target = button.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
        return '<a class="' + button.className + '" href="' + button.href + '"' + target + '>' + button.label + '</a>';
      })
      .join('');
  }

  function renderBulkTiers() {
    var container = document.querySelector('[data-config="bulkTiers"]');
    if (!container) return;

    container.innerHTML = (config.bulkPricing.tiers || []).map(function (tier) {
      return '<article class="tier-card"><strong>' + tier.quantity + '</strong><span>' + tier.label + '</span><p>' + tier.description + '</p></article>';
    }).join('');

    var figure = document.querySelector('[data-config="bulkGraphic"]');
    if (!figure) return;
    var image = config.assets.bulkPricingImage || config.assets.bulkPricingFallback;
    figure.innerHTML = '<img src="' + image + '" alt="Bulk pricing graphic or placeholder">';
  }

  function renderProducts() {
    var container = document.querySelector('[data-config="products"]');
    if (!container) return;

    container.innerHTML = (config.products || []).map(function (product) {
      return '<article class="product-card"><h3>' + product.name + '</h3><p>' + product.description + '</p></article>';
    }).join('');
  }

  function renderGallery() {
    var container = document.querySelector('[data-config="gallery"]');
    if (!container) return;

    container.innerHTML = (config.gallery.images || []).map(function (image, index) {
      return '<article class="gallery-card"><img data-gallery-index="' + index + '" src="' + image.src + '" alt="' + image.alt + '" loading="lazy"><p>' + image.alt + '</p></article>';
    }).join('');

    container.querySelectorAll('img').forEach(function (img) {
      img.onerror = function () {
        img.onerror = null;
        img.src = config.assets.imageFallback;
        img.alt = 'Product photo placeholder. Add the real MicroPatches product photo at the configured file path.';
      };
    });
  }

  function renderFormOptions() {
    var productSelect = document.getElementById('productType');
    var artworkSelect = document.getElementById('artworkReferenceType');

    if (productSelect) {
      productSelect.innerHTML = '<option value="">Choose one</option>' + config.quoteForm.productTypes.map(function (option) {
        return '<option>' + option + '</option>';
      }).join('');
    }

    if (artworkSelect) {
      artworkSelect.innerHTML = '<option value="">Choose one</option>' + config.quoteForm.artworkReferenceTypes.map(function (option) {
        return '<option>' + option + '</option>';
      }).join('');
    }
  }

  function configureForm() {
    var form = document.getElementById('quoteForm');
    if (!form || !config.quoteForm) return;

    var subject = document.getElementById('formSubject');
    var next = document.getElementById('formNext');
    var status = document.getElementById('formStatus');

    form.action = 'https://formsubmit.co/' + encodeURIComponent(config.quoteForm.recipientEmail);
    if (subject) subject.value = config.quoteForm.subject;
    if (next) next.value = new URL(config.quoteForm.successPage || 'thankyou.html', window.location.href).href;

    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        status.textContent = 'Please complete the required fields before submitting.';
        form.reportValidity();
        return;
      }
      status.textContent = 'Submitting your quote request...';
    });
  }

  function applyConfig() {
    document.title = config.seo.pageTitle;
    setMeta('meta[name="description"]', config.seo.metaDescription);
    setMeta('meta[name="theme-color"]', config.seo.themeColor);
    setMeta('meta[property="og:title"]', config.seo.ogTitle);
    setMeta('meta[property="og:description"]', config.seo.ogDescription);
    setMeta('meta[property="og:image"]', config.seo.socialPreviewImage);
    setMeta('meta[name="twitter:title"]', config.seo.ogTitle);
    setMeta('meta[name="twitter:description"]', config.seo.ogDescription);
    setMeta('meta[name="twitter:image"]', config.seo.socialPreviewImage);

    document.querySelector('link[rel="icon"]').href = config.seo.favicon;

    [
      'business.name',
      'business.tagline',
      'business.secondaryTagline',
      'business.shortDescription',
      'business.madeIn',
      'business.ownerNote',
      'bulkPricing.headline',
      'bulkPricing.description',
      'bulkPricing.note',
      'customProducts.headline',
      'customProducts.intro',
      'customProducts.developmentNote',
      'customProducts.reviewNote',
      'gallery.headline',
      'gallery.description',
      'quoteForm.intro',
      'quoteForm.warning',
      'quoteForm.uploadHelpText',
      'quoteForm.consentText',
      'footer.text',
      'footer.privacyNote'
    ].forEach(setText);

    var announcement = document.querySelector('[data-config="announcement"]');
    if (announcement && config.announcement && config.announcement.enabled) {
      announcement.textContent = config.announcement.text;
      announcement.classList.add('is-visible');
    }

    safeImage(document.querySelector('[data-config-img="logo"]'), config.assets.logo, config.business.name + ' logo');
    safeImage(document.querySelector('[data-config-img="heroImage"]'), config.assets.heroImage, 'Premium raised texture MicroKeychain product photo');

    document.querySelectorAll('[data-config-link="email"]').forEach(function (link) {
      link.href = config.links.email;
      link.textContent = config.business.email;
    });

    renderButtons();
    renderBulkTiers();
    renderProducts();
    renderGallery();
    renderFormOptions();
    configureForm();
  }

  fetch('siteConfig.json')
    .then(function (response) { return response.json(); })
    .then(function (loadedConfig) {
      config = loadedConfig;
      applyConfig();
    })
    .catch(function () {
      var status = document.getElementById('formStatus');
      if (status) status.textContent = 'Site configuration could not load. Check siteConfig.json.';
    });
})();
