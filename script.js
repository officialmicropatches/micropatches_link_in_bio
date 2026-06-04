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
setupRail('productShowcase', container);
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
setupRail('recentProjects', container);
}

function renderTrustBadges() {
var container = document.querySelector('[data-config="trustBadges"]');
if (!container) return;
var items = getValue('trustBadges.items') || [];
container.innerHTML = items.map(function (item) {
return '<li>' + escapeHtml(item) + '</li>';
}).join('');
}

// Horizontal rail navigation. The rail scrolls natively via touch swipe, but
// desktop/mouse users had no way to move it — so this also adds clickable
// indicator dots, prev/next arrows, and click-and-drag scrolling.
function setupRail(key, rail) {
var dotsEl = document.querySelector('[data-dots-for="' + key + '"]');
var cards = Array.prototype.slice.call(rail.children);
var multiple = cards.length >= 2;

// Make the rail its own positioning context so card.offsetLeft lines up with
// rail.scrollLeft, and wrap it once so arrows can sit over it.
var wrap = rail.parentNode;
if (!wrap || !wrap.classList.contains('rail-wrap')) {
wrap = document.createElement('div');
wrap.className = 'rail-wrap';
rail.parentNode.insertBefore(wrap, rail);
wrap.appendChild(rail);
}

function step(direction) {
rail.scrollBy({ left: direction * rail.clientWidth * 0.85, behavior: 'smooth' });
}
function scrollToCard(index) {
if (cards[index]) {
rail.scrollTo({ left: cards[index].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
}
}

// Prev/next arrows (shown on desktop via CSS).
var prev = null, next = null;
if (multiple) {
prev = document.createElement('button');
prev.type = 'button';
prev.className = 'rail-arrow rail-arrow-prev';
prev.setAttribute('aria-label', 'Previous');
prev.innerHTML = '‹';
next = document.createElement('button');
next.type = 'button';
next.className = 'rail-arrow rail-arrow-next';
next.setAttribute('aria-label', 'Next');
next.innerHTML = '›';
prev.addEventListener('click', function () { step(-1); });
next.addEventListener('click', function () { step(1); });
wrap.appendChild(prev);
wrap.appendChild(next);
}

// Clickable indicator dots.
var dots = [];
if (dotsEl) {
if (!multiple) {
dotsEl.innerHTML = '';
} else {
dotsEl.removeAttribute('aria-hidden');
dotsEl.innerHTML = cards.map(function (_, index) {
return '<button type="button"' + (index === 0 ? ' class="is-active"' : '') +
' aria-label="Go to item ' + (index + 1) + '"></button>';
}).join('');
dots = Array.prototype.slice.call(dotsEl.children);
dots.forEach(function (dot, index) {
dot.addEventListener('click', function () { scrollToCard(index); });
});
}
}

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
if (prev) prev.disabled = rail.scrollLeft <= 2;
if (next) next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
}

var ticking = false;
rail.addEventListener('scroll', function () {
if (ticking) return;
ticking = true;
window.requestAnimationFrame(function () { updateActive(); ticking = false; });
});

// Click-and-drag scrolling for mouse/pen (touch keeps native swipe).
var dragging = false, startX = 0, startScroll = 0;
rail.addEventListener('pointerdown', function (event) {
if (event.pointerType === 'touch') return;
dragging = true;
startX = event.clientX;
startScroll = rail.scrollLeft;
rail.classList.add('is-dragging');
rail.setPointerCapture(event.pointerId);
});
rail.addEventListener('pointermove', function (event) {
if (!dragging) return;
rail.scrollLeft = startScroll - (event.clientX - startX);
});
function endDrag() { dragging = false; rail.classList.remove('is-dragging'); }
rail.addEventListener('pointerup', endDrag);
rail.addEventListener('pointercancel', endDrag);
rail.addEventListener('dragstart', function (event) { event.preventDefault(); });

updateActive();
}

function renderFormOptions() {
var productSelect = document.getElementById('productType');
if (productSelect) {
productSelect.innerHTML = '<option value="">Choose one</option>' + (config.quoteForm.productTypes || []).map(function (option) {
return '<option>' + escapeHtml(option) + '</option>';
}).join('');
}
}

// Quote form: two free services working together.
//   1. Cloudinary hosts the optional reference photo (Web3Forms' free tier
//      can't accept files, so the photo uploads here and returns a link).
//   2. Web3Forms emails the request — all text fields PLUS the photo link —
//      to officialmicropatches@gmail.com.
// The customer still does one thing: fill out the form and hit submit.
var MAX_IMAGE_BYTES = 10 * 1024 * 1024; // Cloudinary free-plan per-image ceiling

function configureForm() {
var form = document.getElementById('quoteForm');
if (!form || !config.quoteForm) return;

var status = document.getElementById('formStatus');
var successEl = document.getElementById('formSuccess');
var endpoint = config.quoteForm.formEndpoint || 'https://api.web3forms.com/submit';
var accessKey = config.quoteForm.web3formsAccessKey || '';
var cloudName = config.quoteForm.cloudinaryCloudName || '';
var uploadPreset = config.quoteForm.cloudinaryUploadPreset || '';

// Inject the Web3Forms access key from config so it lives in one place.
var accessKeyInput = document.getElementById('web3formsAccessKey');
if (accessKeyInput) accessKeyInput.value = accessKey;

form.addEventListener('input', function (event) {
event.target.classList.remove('field-error');
});

form.method = 'POST';
form.action = endpoint;

var submitButton = form.querySelector('button[type="submit"]');
var fileInput = document.getElementById('referenceImage');
var photoUrlInput = document.getElementById('referenceImageUrl');
var uploadStatus = document.getElementById('uploadStatus');

// Tracks the in-progress Cloudinary upload (a Promise) so submit can wait
// for it rather than firing without the photo link.
var uploadInFlight = null;

function setUploadStatus(message, state) {
if (!uploadStatus) return;
uploadStatus.textContent = message || '';
uploadStatus.className = 'upload-status' + (state ? ' is-' + state : '');
}

function showError(message) {
if (status) status.textContent = message || 'Something went wrong. Please email officialmicropatches@gmail.com and I’ll help you directly.';
if (submitButton) submitButton.disabled = false;
}

var cloudinaryReady = cloudName && uploadPreset &&
cloudName !== 'YOUR_CLOUDINARY_CLOUD_NAME' && uploadPreset !== 'YOUR_CLOUDINARY_UPLOAD_PRESET';

// Upload the chosen photo to Cloudinary as soon as it's picked. On success
// the returned secure_url is stashed in the hidden field that Web3Forms emails.
function uploadToCloudinary(file) {
var data = new FormData();
data.append('file', file);
data.append('upload_preset', uploadPreset);
return fetch('https://api.cloudinary.com/v1_1/' + cloudName + '/image/upload', {
method: 'POST',
body: data
}).then(function (response) {
return response.json();
}).then(function (result) {
if (result && result.secure_url) {
if (photoUrlInput) photoUrlInput.value = result.secure_url;
setUploadStatus('Photo attached ✓', 'ok');
return true;
}
throw new Error(result && result.error && result.error.message ? result.error.message : 'upload failed');
});
}

if (fileInput) {
fileInput.addEventListener('change', function () {
if (photoUrlInput) photoUrlInput.value = '';
uploadInFlight = null;
fileInput.classList.remove('field-error');

var file = fileInput.files && fileInput.files[0];
if (!file) { setUploadStatus('', null); return; }

if (file.size > MAX_IMAGE_BYTES) {
fileInput.classList.add('field-error');
setUploadStatus('That image is over 10 MB — please choose a smaller one.', 'error');
fileInput.value = '';
return;
}

if (!cloudinaryReady) {
// Photo hosting not configured yet — let them continue without it.
setUploadStatus('', null);
return;
}

setUploadStatus('Uploading photo…', 'busy');
uploadInFlight = uploadToCloudinary(file).catch(function () {
setUploadStatus('Couldn’t upload that photo — you can still submit and we’ll request it by email.', 'error');
if (photoUrlInput) photoUrlInput.value = '';
uploadInFlight = null; // don't block submit on a failed optional upload
});
});
}

function submitForm() {
if (status) status.textContent = 'Submitting your request…';
if (submitButton) submitButton.disabled = true;

// AJAX submit so the page never redirects and we show the in-page success
// message. FormData carries the text fields plus the hidden photo link.
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

// If a photo is still uploading, wait for it to finish before sending so the
// link is included; otherwise submit right away.
if (uploadInFlight) {
if (status) status.textContent = 'Finishing photo upload…';
if (submitButton) submitButton.disabled = true;
uploadInFlight.then(function () { submitForm(); });
return;
}

submitForm();
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
