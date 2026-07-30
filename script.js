document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var splitPanels = document.querySelectorAll('.split-panel');
  splitPanels.forEach(function (panel) {
    panel.addEventListener('click', function (e) {
      if (e.target.closest('.btn')) return;
      var alreadyExpanded = panel.classList.contains('expanded');
      splitPanels.forEach(function (p) { p.classList.remove('expanded'); });
      if (!alreadyExpanded) {
        panel.classList.add('expanded');
      }
    });
  });

  var triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.accordion-item');
      var isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      var symbol = btn.querySelector('.plus');
      if (symbol) symbol.textContent = isOpen ? '\u2212' : '+';
    });
  });

  initLightbox();
  initDragGallery();

  var navLinks = document.querySelectorAll('.main-nav a');
  var currentFile = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    link.removeAttribute('aria-current');
    var linkFile = link.getAttribute('href');
    if (linkFile === currentFile) {
      link.setAttribute('aria-current', 'page');
    }
  });
});

function initLightbox() {
  var items = document.querySelectorAll('.masonry-item');
  var lightbox = document.getElementById('lightbox');
  if (!items.length || !lightbox) return;

  var stage = lightbox.querySelector('.lightbox-stage');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var prevBtn = lightbox.querySelector('.lightbox-prev');
  var nextBtn = lightbox.querySelector('.lightbox-next');
  var currentIndex = 0;

  function show(index) {
    currentIndex = (index + items.length) % items.length;
    var thumb = items[currentIndex].querySelector('.thumb-m');
    stage.style.backgroundImage = window.getComputedStyle(thumb).backgroundImage;
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

items.forEach(function (item, index) {
    item.addEventListener('click', function () {
      if (item.dataset.dragged === 'true') {
        item.dataset.dragged = 'false';
        return;
      }
      show(index);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { show(currentIndex + 1); });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });
}

function initDragGallery() {
  if (window.innerWidth <= 800) return;

  var containers = document.querySelectorAll('.masonry');
  containers.forEach(function (container) {
    var items = container.querySelectorAll('.masonry-item');
    if (!items.length) return;

    var containerRect = container.getBoundingClientRect();
    var positions = [];
    items.forEach(function (item) {
      var r = item.getBoundingClientRect();
      positions.push({
        left: r.left - containerRect.left,
        top: r.top - containerRect.top,
        width: r.width
      });
    });

    container.style.height = container.scrollHeight + 'px';
    container.classList.add('drag-gallery');

    items.forEach(function (item, i) {
      item.style.left = positions[i].left + 'px';
      item.style.top = positions[i].top + 'px';
      item.style.width = positions[i].width + 'px';
      makeDraggable(item);
    });
  });
}

function makeDraggable(item) {
  var dragging = false;
  var startX, startY, originLeft, originTop;

  item.addEventListener('pointerdown', function (e) {
    dragging = true;
    item.dataset.dragged = 'false';
    startX = e.clientX;
    startY = e.clientY;
    originLeft = parseFloat(item.style.left) || 0;
    originTop = parseFloat(item.style.top) || 0;
    item.setPointerCapture(e.pointerId);
    item.style.zIndex = 999;
  });

  item.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      item.dataset.dragged = 'true';
      item.style.left = (originLeft + dx) + 'px';
      item.style.top = (originTop + dy) + 'px';
    }
  });

  item.addEventListener('pointerup', function () {
    dragging = false;
    item.style.zIndex = '';
  });
}

function initEnvelopes() {
  var cards = document.querySelectorAll('.envelope-card');
  cards.forEach(function (card) {
    var flap = card.querySelector('.envelope-flap');
    flap.addEventListener('click', function () {
      var isOpen = card.classList.toggle('open');
      flap.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}
