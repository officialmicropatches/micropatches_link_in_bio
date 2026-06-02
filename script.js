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

  function safeImage(img, src, alt) {
    if (!img) return;
    var fallback = getValue('assets.imageFallback') || 'assets/products/product_photo_placeholder.svg';
    img.src = src || fallback;
    if (alt) img.alt = alt;
    img.onerror = function () {
      img.onerror = null;
      img.src = fallback;
      img.alt = 'MicroPatches product photo';
    };
  }

  function renderButtons() {
    var container = document.querySelector('[data-config="mainButtons"]');
    if (!container) return;

    var links = config.links || {};
    var labels = config.buttons || {};
    var buttons = [
      { label: labels.customQuote || 'Request a Custom Quote', href: '#quote', className: 'primary-button' },
      { label: labels.etsy || 'Shop Etsy', href: links.etsy, className: 'secondary-button' },
      { label: labels.instagram || 'Instagram', href: links.instagram, className: 'link-button' },
      { label: labels.tiktok || 'TikTok', href: links.tiktok, className: 'link-button' },
      { label: labels.facebook || 'Facebook', href: links.facebook, className: 'link-button' },
      { label: labels.email || 'Email', href: links.email, className: 'link-button' }
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
        return '<a class="' + button.className + '" href="' + escapeHtml(button.href) + '"' + target + '>' + escapeHtml(button.label) + '</a>';
      })
      .join('');
  }

  function renderComparisonCards() {
    var container = document.querySelector('[data-config="comparisonCards"]');
    if (!container) return;

    container.innerHTML = (config.pricingTransparency.comparisonCards || []).map(function (card) {
      return '<article class="comparison-card ' + escapeHtml(card.type || '') + '"><h3>' + escapeHtml(card.title) + '</h3><ul>' +
        card.bullets.map(function (item) {
          var text = typeof item === 'string' ? item : item.text;
          return '<li>' + escapeHtml(text) + '</li>';
        }).join('') +
        '</ul></article>';
    }).join('');
  }

  function renderPricingTabs() {
    var container = document.querySelector('[data-config="pricingTabs"]');
    if (!container) return;

    var groups = config.pricing.groups || [];
    if (!groups.length) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML =
      '<div class="tab-list" role="tablist" aria-label="Product pricing">' +
        groups.map(function (group, index) {
          var price = group.startingPrice ? '<span>' + escapeHtml(group.startingPrice) + '</span>' : '';
          return '<button class="tab-button' + (index === 0 ? ' is-active' : '') + '" type="button" role="tab" aria-selected="' +
            (index === 0 ? 'true' : 'false') + '" aria-controls="pricing-panel-' + index + '" id="pricing-tab-' + index +
            '" data-pricing-tab="' + index + '"><strong>' + escapeHtml(group.name) + '</strong>' + price + '</button>';
        }).join('') +
      '</div>' +
      groups.map(function (group, index) {
        var meta = [group.size, group.thickness].filter(Boolean).map(function (item) {
          return '<span>' + escapeHtml(item) + '</span>';
        }).join('');
        var rows = (group.pricing || []).map(function (row) {
          return '<div class="pricing-row"><strong>' + escapeHtml(row.quantity) + '</strong><span>' +
            escapeHtml(row.price) + '</span><span>' + escapeHtml(row.fee) + '</span></div>';
        }).join('');
        var table = rows ? '<div class="pricing-table">' + rows + '</div>' : '';
        var note = group.note ? '<p class="pricing-note">' + escapeHtml(group.note) + '</p>' : '';

        var headingPrice = group.startingPrice ? '<span class="panel-price">' + escapeHtml(group.startingPrice) + '</span>' : '';
        return '<article class="pricing-panel' + (index === 0 ? ' is-active' : '') + '" role="tabpanel" id="pricing-panel-' +
          index + '" aria-labelledby="pricing-tab-' + index + '">' +
          '<div class="pricing-panel-head"><h3>' + escapeHtml(group.name) + headingPrice + '</h3><div class="pricing-meta">' + meta +
          '</div><p>' + escapeHtml(group.description || '') + '</p></div>' + table + note + '</article>';
      }).join('');

    var tabs = Array.prototype.slice.call(container.querySelectorAll('[data-pricing-tab]'));
    var panels = Array.prototype.slice.call(container.querySelectorAll('.pricing-panel'));

    function showTab(index) {
      tabs.forEach(function (tab, tabIndex) {
        var isActive = tabIndex === index;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      panels.forEach(function (panel, panelIndex) {
        panel.classList.toggle('is-active', panelIndex === index);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        showTab(Number(tab.getAttribute('data-pricing-tab')));
      });
    });
  }

  function renderGallery() {
    var container = document.querySelector('[data-config="gallery"]');
    if (!container) return;
    var images = config.gallery.images || [];

    if (!images.length) {
      container.innerHTML = '';
      return;
    }

    var thumbImages = images.slice(0, 4);
    container.classList.add('is-carousel');
    container.innerHTML =
      '<div class="gallery-carousel" aria-label="MicroPatches product photo carousel">' +
        '<button class="gallery-nav gallery-prev" type="button" aria-label="Previous product photo" title="Previous product photo">&lsaquo;</button>' +
        '<figure class="gallery-stage">' +
          '<img class="gallery-stage-image" src="' + escapeHtml(images[0].src) + '" alt="' + escapeHtml(images[0].alt) + '">' +
          '<figcaption>' + escapeHtml(config.gallery.caption || images[0].alt) + '</figcaption>' +
        '</figure>' +
        '<button class="gallery-nav gallery-next" type="button" aria-label="Next product photo" title="Next product photo">&rsaquo;</button>' +
        '<div class="gallery-thumbs" role="list" aria-label="Choose featured product photo">' +
          thumbImages.map(function (image, index) {
            return '<button class="gallery-thumb' + (index === 0 ? ' is-active' : '') + '" type="button" role="listitem" aria-label="Show photo ' +
              (index + 1) + '" aria-current="' + (index === 0 ? 'true' : 'false') + '" data-gallery-index="' + index + '">' +
              '<img src="' + escapeHtml(image.src) + '" alt="' + escapeHtml(image.alt) + '" loading="lazy">' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>';

    var activeIndex = 0;
    var stageImage = container.querySelector('.gallery-stage-image');
    var thumbs = Array.prototype.slice.call(container.querySelectorAll('.gallery-thumb'));

    function showImage(nextIndex) {
      activeIndex = (nextIndex + images.length) % images.length;
      stageImage.src = images[activeIndex].src;
      stageImage.alt = images[activeIndex].alt;
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

    container.querySelectorAll('img').forEach(function (img) {
      safeImage(img, img.getAttribute('src'), img.getAttribute('alt'));
    });
  }

  function renderFormOptions() {
    var productSelect = document.getElementById('productType');
    var artworkSelect = document.getElementById('artworkReferenceType');

    if (productSelect) {
      productSelect.innerHTML = '<option value="">Choose one</option>' + config.quoteForm.productTypes.map(function (option) {
        return '<option>' + escapeHtml(option) + '</option>';
      }).join('');
    }

    if (artworkSelect) {
      artworkSelect.innerHTML = '<option value="">Choose one</option>' + config.quoteForm.artworkReferenceTypes.map(function (option) {
        return '<option>' + escapeHtml(option) + '</option>';
      }).join('');
    }
  }

  function configureForm() {
    var form = document.getElementById('quoteForm');
    if (!form || !config.quoteForm) return;

    var status = document.getElementById('formStatus');
    var successEl = document.getElementById('formSuccess');

    form.method = 'POST';
    form.action = 'https://formspree.io/f/mpwwabdd';

    form.addEventListener('input', function (event) {
      event.target.classList.remove('field-error');
    });

    form.addEventListener('submit', function (event) {
      form.querySelectorAll('.field-error').forEach(function (field) {
        field.classList.remove('field-error');
      });

      if (!form.checkValidity()) {
        event.preventDefault();
        var invalidFields = Array.prototype.slice.call(form.querySelectorAll(':invalid'));
        invalidFields.forEach(function (field) {
          field.classList.add('field-error');
        });
        if (status) status.textContent = 'Please complete the highlighted required fields before submitting.';
        if (invalidFields[0]) invalidFields[0].focus();
        return;
      }

      if (status) status.textContent = 'Submitting your request…';

      setTimeout(function() {
        form.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
        if (status) status.textContent = '';
      }, 800);
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
      'pricingTransparency.headline',
      'pricingTransparency.intro',
      'pricingTransparency.note',
      'pricing.globalNote',
      'pricing.designFeeNote',
      'gallery.headline',
      'gallery.description',
      'quoteForm.intro',
      'quoteForm.warning',
      'quoteForm.consentText',
      'footer.privacyNote'
    ].forEach(setText);

    safeImage(document.querySelector('[data-config-img="logo"]'), config.assets.logo, config.business.name + ' logo');

    document.querySelectorAll('[data-config-link="email"]').forEach(function (link) {
      link.href = config.links.email;
      link.textContent = config.business.email;
      if (config.links.email.indexOf('http') === 0) {
        link.target = '_blank';
        link.rel = 'noopener';
      }
    });

    renderButtons();
    renderGallery();
    renderComparisonCards();
    renderPricingTabs();
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
