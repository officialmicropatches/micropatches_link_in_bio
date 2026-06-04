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

function fallbackImage() {
return getValue('assets.imageFallback') || 'assets/products/product_photo_placeholder.svg';
}

function safeImage(img, src, alt) {
if (!img) return;
var fallback = fallbackImage();
img.src = src || fallback;
if (alt) img.alt = alt;
img.onerror = function () {
img.onerror = null;
img.src = fallback;
img.alt = 'MicroPatches product photo';
};
}

function bindImageFallbacks(container) {
container.querySelectorAll('img').forEach(function (img) {
safeImage(img, img.getAttribute('src'), img.getAttribute('alt'));
});
}

function renderButtons() {
var container = document.querySelector('[data-config="mainButtons"]');
if (!container) return;

var links = config.links || {};
var labels = config.buttons || {};

function anchor(label, href, className) {
if (!href) return '';
var target = href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
return '<a class="' + className + '" href="' + escapeHtml(href) + '"' + target + '>' + escapeHtml(label) + '</a>';
}

var html = '';
html += anchor(labels.customQuote || 'Request Quote', '#quote', 'btn btn-primary');
html += anchor(labels.etsy || 'Shop Etsy', links.etsy, 'btn btn-secondary');

var social = '';
social += anchor(labels.instagram || 'Instagram', links.instagram, 'btn btn-ghost');
social += anchor(labels.tiktok || 'TikTok', links.tiktok, 'btn btn-ghost');
social += anchor(labels.facebook || 'Facebook', links.facebook, 'btn btn-ghost');
social += anchor(labels.email || 'Email', links.email, 'btn btn-ghost');
if (social) html += '<div class="social-grid">' + social + '</div>';

container.innerHTML = html;
}

function renderTrustRow() {
var container = document.querySelector('[data-config="trustRow"]');
if (!container) return;
var items = getValue('hero.trustRow') || [];
container.innerHTML = items.map(function (item) {
return '<li>' + escapeHtml(item) + '</li>';
}).join('');
}

function renderShowcase() {
var container = document.querySelector('[data-config="productShowcase"]');
if (!container) return;
var items = getValue('productShowcase.items') || [];
container.innerHTML = items.map(function (item) {
return '<article class="swipe-card">' +
'<img class="card-img" src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.alt || item.name) + '" loading="lazy">' +
'<div class="card-body">' +
'<span class="card-name">' + escapeHtml(item.name) + '</span>' +
'<span class="card-price">' + escapeHtml(item.price) + '</span>' +
'</div></article>';
}).join('');
bindImageFallbacks(container);
setupDots('productShowcase', container);
}

function renderDesignFee() {
var container = document.querySelector('[data-config="designFee"]');
if (!container) return;
var fee = getValue('pricingCards.designFee');
if (!fee) { container.innerHTML = ''; return; }
container.innerHTML = '<div class="design-fee">' +
'<span class="fee-amount">' + escapeHtml(fee.price) + '</span>' +
'<span class="fee-text">' +
'<span class="fee-title">' + escapeHtml(fee.title) + '</span>' +
'<span class="fee-note">' + escapeHtml(fee.note) + '</span>' +
'</span></div>';
}

function renderPricingCards() {
var container = document.querySelector('[data-config="pricingCards"]');
if (!container) return;
var items = getValue('pricingCards.items') || [];
container.innerHTML = items.map(function (item) {
return '<div class="price-card">' +
'<span class="pc-name">' + escapeHtml(item.name) + '</span>' +
'<span class="pc-price">' + escapeHtml(item.price) + '</span>' +
'</div>';
}).join('');
}

function renderProjects() {
var container = document.querySelector('[data-config="recentProjects"]');
if (!container) return;
var items = getValue('recentProjects.items') || [];
container.innerHTML = items.map(function (item) {
return '<article class="project-card">' +
'<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.alt || item.category) + '" loading="lazy">' +
'<span class="project-tag">' + escapeHtml(item.category) + '</span>' +
'</article>';
}).join('');
bindImageFallbacks(container);
setupDots('recentProjects', container);
}

function renderTrustBadges() {
var container = document.querySelector('[data-config="trustBadges"]');
if (!container) return;
var items = getValue('trustBadges.items') || [];
container.innerHTML = items.map(function (item) {
return '<li>' + escapeHtml(item) + '</li>';
}).join('');
}

// Swipe indicator dots for a horizontal rail
function setupDots(key, rail) {
var dotsEl = document.querySelector('[data-dots-for="' + key + '"]');
if (!dotsEl) return;
var cards = Array.prototype.slice.call(rail.children);
if (cards.length < 2) { dotsEl.innerHTML = ''; return; }

dotsEl.innerHTML = cards.map(function (_, index) {
return '<span' + (index === 0 ? ' class="is-active"' : '') + '></span>';
}).join('');
var dots = Array.prototype.slice.call(dotsEl.children);

function updateActive() {
var center = rail.scrollLeft + rail.clientWidth / 2;
var activeIndex = 0;
var closest = Infinity;
cards.forEach(function (card, index) {
var cardCenter = card.offsetLeft + card.offsetWidth / 2;
var distance = Math.abs(cardCenter - center);
if (distance < closest) { closest = distance; activeIndex = index; }
});
dots.forEach(function (dot, index) {
dot.classList.toggle('is-active', index === activeIndex);
});
}

var ticking = false;
rail.addEventListener('scroll', function () {
if (ticking) return;
ticking = true;
window.requestAnimationFrame(function () { updateActive(); ticking = false; });
});
}

function renderFormOptions() {
var productSelect = document.getElementById('productType');
if (productSelect) {
productSelect.innerHTML = '<option value="">Choose one</option>' + (config.quoteForm.productTypes || []).map(function (option) {
return '<option>' + escapeHtml(option) + '</option>';
}).join('');
}
}

// Web3Forms integration — submissions (including the optional reference
// image) POST to api.web3forms.com and arrive as an email, with the photo
// attached, at officialmicropatches@gmail.com. Everything happens in a single
// submit so the customer never has to send a separate email.
var MAX_ATTACHMENT_BYTES = 9 * 1024 * 1024; // Web3Forms attachment ceiling (~10MB); stay safely under

function configureForm() {
var form = document.getElementById('quoteForm');
if (!form || !config.quoteForm) return;

var status = document.getElementById('formStatus');
var successEl = document.getElementById('formSuccess');
var endpoint = config.quoteForm.formEndpoint || 'https://api.web3forms.com/submit';
var accessKey = config.quoteForm.web3formsAccessKey || '';

// Inject the Web3Forms access key from config so it lives in one place.
var accessKeyInput = document.getElementById('web3formsAccessKey');
if (accessKeyInput) accessKeyInput.value = accessKey;

form.addEventListener('input', function (event) {
event.target.classList.remove('field-error');
});

form.method = 'POST';
form.action = endpoint;
form.enctype = 'multipart/form-data';

var submitButton = form.querySelector('button[type="submit"]');
var fileInput = form.querySelector('input[type="file"]');

function showError(message) {
if (status) status.textContent = message || 'Something went wrong. Please email officialmicropatches@gmail.com and I’ll help you directly.';
if (submitButton) submitButton.disabled = false;
}

form.addEventListener('submit', function (event) {
event.preventDefault();

form.querySelectorAll('.field-error').forEach(function (field) {
field.classList.remove('field-error');
});

if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
showError('This form isn’t fully set up yet. Please email officialmicropatches@gmail.com and I’ll help you directly.');
return;
}

if (!form.checkValidity()) {
var invalidFields = Array.prototype.slice.call(form.querySelectorAll(':invalid'));
invalidFields.forEach(function (field) {
field.classList.add('field-error');
});
if (status) status.textContent = 'Please complete the highlighted required fields before submitting.';
if (invalidFields[0]) invalidFields[0].focus();
return;
}

// Guard against attachments too large for the email delivery.
if (fileInput && fileInput.files && fileInput.files[0] && fileInput.files[0].size > MAX_ATTACHMENT_BYTES) {
fileInput.classList.add('field-error');
if (status) status.textContent = 'That image is a bit large. Please use a photo under 9 MB, or leave it off and we’ll request it later.';
fileInput.focus();
return;
}

if (status) status.textContent = 'Submitting your request…';
if (submitButton) submitButton.disabled = true;

// AJAX multipart submit so the page never redirects and the optional photo
// is delivered as an attachment in the same request. Do NOT set
// Content-Type manually — the browser adds the multipart boundary.
fetch(endpoint, {
method: 'POST',
body: new FormData(form),
headers: { Accept: 'application/json' }
})
.then(function (response) {
return response.json().then(function (data) {
if (response.ok && data && data.success) {
form.style.display = 'none';
if (successEl) successEl.style.display = 'block';
if (status) status.textContent = '';
return;
}
showError(data && data.message ? data.message : '');
}).catch(function () { showError(); });
})
.catch(function () { showError(); });
});
}

// Hide the sticky CTA once the quote form is on screen
function configureStickyCta() {
var cta = document.querySelector('.sticky-cta');
var form = document.getElementById('quote');
if (!cta || !form || !('IntersectionObserver' in window)) return;

var observer = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
cta.classList.toggle('is-hidden', entry.isIntersecting);
});
}, { threshold: 0.12 });

observer.observe(form);
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

var favicon = document.querySelector('link[rel="icon"]');
if (favicon && config.seo.favicon) favicon.href = config.seo.favicon;

[
'business.name',
'business.madeIn',
'business.ownerNote',
'hero.headline',
'hero.subheadline',
'productShowcase.heading',
'pricingCards.heading',
'recentProjects.heading',
'trustBadges.heading',
'quoteForm.warning',
'quoteForm.consentText',
'quoteForm.imageNote',
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
renderTrustRow();
renderShowcase();
renderDesignFee();
renderPricingCards();
renderProjects();
renderTrustBadges();
renderFormOptions();
configureForm();
configureStickyCta();
}

fetch('siteConfig.json?v=20260604-redesign', { cache: 'no-store' })
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
