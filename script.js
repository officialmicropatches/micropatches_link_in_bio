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

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
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
    figure.innerHTML = '<img src="' + image + '" alt="Custom MicroKeychain pricing schedule">';
  }

  function renderProducts() {
    var container = document.querySelector('[data-config="products"]');
    if (!container) return;

    container.innerHTML = (config.products || []).map(function (product) {
      var size = product.size ? '<span class="size-badge">' + product.size + '</span>' : '';
      return '<article class="product-card"><div class="product-card-header"><h3>' + product.name + '</h3>' + size + '</div><p>' + product.description + '</p></article>';
    }).join('');
  }

  function renderGallery() {
    var container = document.querySelector('[data-config="gallery"]');
    if (!container) return;
    var images = config.gallery.images || [];

    if (!images.length) {
      container.innerHTML = '';
      return;
    }

    container.classList.add('is-carousel');
    container.innerHTML =
      '<div class="gallery-carousel" aria-label="MicroPatches product photo carousel">' +
        '<button class="gallery-nav gallery-prev" type="button" aria-label="Previous product photo" title="Previous product photo">&lsaquo;</button>' +
        '<figure class="gallery-stage">' +
          '<img class="gallery-stage-image" src="' + escapeHtml(images[0].src) + '" alt="' + escapeHtml(images[0].alt) + '">' +
          '<figcaption>' + escapeHtml(images[0].alt) + '</figcaption>' +
        '</figure>' +
        '<button class="gallery-nav gallery-next" type="button" aria-label="Next product photo" title="Next product photo">&rsaquo;</button>' +
        '<div class="gallery-thumbs" role="list" aria-label="Choose product photo">' +
          images.map(function (image, index) {
            return '<button class="gallery-thumb' + (index === 0 ? ' is-active' : '') + '" type="button" role="listitem" aria-label="Show photo ' + (index + 1) + '" aria-current="' + (index === 0 ? 'true' : 'false') + '" data-gallery-index="' + index + '">' +
              '<img src="' + escapeHtml(image.src) + '" alt="' + escapeHtml(image.alt) + '" loading="lazy">' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>';

    var activeIndex = 0;
    var stageImage = container.querySelector('.gallery-stage-image');
    var caption = container.querySelector('.gallery-stage figcaption');
    var thumbs = Array.prototype.slice.call(container.querySelectorAll('.gallery-thumb'));

    function showImage(nextIndex) {
      activeIndex = (nextIndex + images.length) % images.length;
      stageImage.src = images[activeIndex].src;
      stageImage.alt = images[activeIndex].alt;
      caption.textContent = images[activeIndex].alt;
      thumbs.forEach(function (thumb, index) {
        var isActive = index === activeIndex;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    container.querySelector('.gallery-prev').addEventListener('click', function () {
      showImage(activeIndex - 1);
    });

    container.querySelector('.gallery-next').addEventListener('click', function () {
      showImage(activeIndex + 1);
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        showImage(Number(thumb.getAttribute('data-gallery-index')));
      });
    });

    container.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
      if (event.key === 'ArrowRight') showImage(activeIndex + 1);
    });

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

    var formTarget = config.quoteForm.endpointToken || encodeURIComponent(config.quoteForm.recipientEmail);
    form.action = 'https://formsubmit.co/' + formTarget;
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
      'gallery.headline',
      'gallery.description',
      'quoteForm.intro',
      'quoteForm.warning',
      'quoteForm.uploadHelpText',
      'quoteForm.consentText',
      'footer.text',
      'footer.privacyNote'
    ].forEach(setText);

    safeImage(document.querySelector('[data-config-img="logo"]'), config.assets.logo, config.business.name + ' logo');
    safeImage(document.querySelector('[data-config-img="heroImage"]'), config.assets.heroImage, 'Premium raised texture MicroKeychain product photo');

    document.querySelectorAll('[data-config-link="email"]').forEach(function (link) {
      link.href = config.links.email;
      link.textContent = config.business.email;
      if (config.links.email.indexOf('http') === 0) {
        link.target = '_blank';
        link.rel = 'noopener';
      }
    });

    renderButtons();
    renderBulkTiers();
    renderProducts();
    renderGallery();
    renderFormOptions();
    configureForm();
  }

  fetch('siteConfig.json', { cache: 'no-store' })
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
