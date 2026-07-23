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
