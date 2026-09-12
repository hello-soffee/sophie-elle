/* ============================================================
   VERCEL ANALYTICS
   ============================================================ */

window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

const vercelAnalytics = document.createElement('script');
vercelAnalytics.src = '/_vercel/insights/script.js';
vercelAnalytics.defer = true;
document.head.appendChild(vercelAnalytics);


/* ============================================================
   HIDE DESKTOP GALLERIES BEFORE INITIALIZATION
   ============================================================ */

(function () {
  if (window.innerWidth <= 800) return;

  document.querySelectorAll('.masonry').forEach(function (gallery) {
    gallery.classList.add('drag-gallery-pending');
  });
})();


/* ============================================================
   MAIN DOM READY
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initSplitPanels();
  initAccordions();
  initLightbox();
  initEnvelopes();
  initActiveNav();
  initDragGallery();
});


/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */

function initMobileNav() {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  });
}


/* ============================================================
   SPLIT PANELS
   ============================================================ */

function initSplitPanels() {
  var splitPanels = document.querySelectorAll('.split-panel');

  splitPanels.forEach(function (panel) {
    panel.addEventListener('click', function (e) {
      if (e.target.closest('.btn')) return;

      var alreadyExpanded =
        panel.classList.contains('expanded');

      splitPanels.forEach(function (p) {
        p.classList.remove('expanded');
      });

      if (!alreadyExpanded) {
        panel.classList.add('expanded');
      }
    });
  });
}


/* ============================================================
   HOME ACCORDIONS
   ============================================================ */

function initAccordions() {
  var triggers =
    document.querySelectorAll('.accordion-trigger');

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item =
        btn.closest('.accordion-item');

      if (!item) return;

      var isOpen =
        item.classList.toggle('open');

      btn.setAttribute(
        'aria-expanded',
        isOpen ? 'true' : 'false'
      );

      var symbol =
        btn.querySelector('.plus');

      if (symbol) {
        symbol.textContent =
          isOpen ? '\u2212' : '+';
      }
    });
  });
}


/* ============================================================
   LIGHTBOX
   ============================================================ */

function initLightbox() {
  var items =
    document.querySelectorAll('.masonry-item');

  var lightbox =
    document.getElementById('lightbox');

  if (!items.length || !lightbox) return;

  var stage =
    lightbox.querySelector('.lightbox-stage');

  var closeBtn =
    lightbox.querySelector('.lightbox-close');

  var prevBtn =
    lightbox.querySelector('.lightbox-prev');

  var nextBtn =
    lightbox.querySelector('.lightbox-next');

  var linkBtn =
    lightbox.querySelector('.lightbox-link');

  var captionEl =
    lightbox.querySelector('.lightbox-caption');

  var currentIndex = 0;


  function show(index) {
    currentIndex =
      (index + items.length) % items.length;

    var currentItem =
      items[currentIndex];

    var img =
      currentItem.querySelector('img');

    if (!img || !stage) return;

    stage.style.backgroundImage =
      'url("' + img.src + '")';


    var link =
      currentItem.getAttribute('data-link');

    if (linkBtn) {
      if (link) {
        linkBtn.href = link;
        linkBtn.style.display =
          'inline-block';
      } else {
        linkBtn.style.display =
          'none';
      }
    }


    var caption =
      currentItem.getAttribute('data-caption');

    if (captionEl) {
      if (caption) {
        captionEl.textContent =
          caption;

        captionEl.style.display =
          'block';
      } else {
        captionEl.style.display =
          'none';
      }
    }

    lightbox.classList.add('open');
  }


  function closeLightbox() {
    lightbox.classList.remove('open');
  }


  /*
     CLICK VS DRAG

     Click = open lightbox.
     Drag = don't open lightbox afterward.
  */

  items.forEach(function (item, index) {
    item.addEventListener('click', function () {
      if (item.dataset.dragged === 'true') {
        item.dataset.dragged = 'false';
        return;
      }

      show(index);
    });
  });


  if (closeBtn) {
    closeBtn.addEventListener(
      'click',
      closeLightbox
    );
  }


  lightbox.addEventListener(
    'click',
    function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    }
  );


  if (prevBtn) {
    prevBtn.addEventListener(
      'click',
      function () {
        show(currentIndex - 1);
      }
    );
  }


  if (nextBtn) {
    nextBtn.addEventListener(
      'click',
      function () {
        show(currentIndex + 1);
      }
    );
  }


  document.addEventListener(
    'keydown',
    function (e) {
      if (!lightbox.classList.contains('open')) {
        return;
      }

      if (e.key === 'Escape') {
        closeLightbox();
      }

      if (e.key === 'ArrowLeft') {
        show(currentIndex - 1);
      }

      if (e.key === 'ArrowRight') {
        show(currentIndex + 1);
      }
    }
  );
}


/* ============================================================
   ACTIVE NAVIGATION
   ============================================================ */

function initActiveNav() {
  var navLinks =
    document.querySelectorAll('.main-nav a');

  var currentFile =
    window.location.pathname
      .split('/')
      .pop() || 'index.html';

  navLinks.forEach(function (link) {
    link.removeAttribute('aria-current');

    if (
      link.getAttribute('href') ===
      currentFile
    ) {
      link.setAttribute(
        'aria-current',
        'page'
      );
    }
  });
}


/* ============================================================
   DRAG GALLERY
   ============================================================ */

function initDragGallery() {
  if (window.innerWidth <= 800) return;

  var containers =
    document.querySelectorAll('.masonry');

  containers.forEach(function (container) {

    if (
      container.classList.contains(
        'event-gallery'
      )
    ) {
      initEventGallery(container);
      return;
    }

    initNormalDragGallery(container);
  });
}


/* ============================================================
   EVENTS GALLERY

   The EVENT STACK controls the starting arrangement only.

   Every photograph inside:
   - can be clicked
   - can be dragged individually
   - keeps its own original aspect ratio
   ============================================================ */

function initEventGallery(container) {
  var stacks =
    Array.from(
      container.querySelectorAll(
        '.event-stack'
      )
    );

  if (!stacks.length) {
    container.classList.remove(
      'drag-gallery-pending'
    );

    return;
  }

  container.classList.add(
    'drag-gallery'
  );

  container.classList.remove(
    'drag-gallery-pending'
  );


  var canvasHeight = 850;

  var canvasWidth =
    container.clientWidth;

  container.style.height =
    canvasHeight + 'px';


  /*
     Starting position of the three EVENT GROUPS.
  */

  var stackPositions = [

    {
      x: 2,
      y: 5,
      width: 34
    },

    {
      x: 36,
      y: 28,
      width: 31
    },

    {
      x: 67,
      y: 7,
      width: 34
    }

  ];


  var stackZCounter = 10;


  stacks.forEach(
    function (stack, index) {

      var position =
        stackPositions[index] ||
        {
          x:
            10 +
            ((index % 3) * 28),

          y:
            12 +
            (
              Math.floor(index / 3) *
              36
            ),

          width: 32
        };


      var stackWidth =
        canvasWidth *
        (position.width / 100);


      stack.style.width =
        stackWidth + 'px';


      stack.style.left =
        (
          canvasWidth *
          (position.x / 100)
        ) + 'px';


      stack.style.top =
        (
          canvasHeight *
          (position.y / 100)
        ) + 'px';


      stack.style.zIndex =
        stackZCounter;


      /*
         EACH PHOTO inside this event group
         becomes independently draggable.
      */

      var photos =
        Array.from(
          stack.querySelectorAll(
            '.masonry-item'
          )
        );


      var photoZCounter = 20;


      photos.forEach(
        function (photo) {

          photo.style.zIndex =
            photoZCounter;


          makeDraggable(
            photo,
            function () {

              photoZCounter++;
              stackZCounter++;


              /*
                 Bring the event group forward
                 whenever one of its photos
                 is interacted with.
              */

              stack.style.zIndex =
                stackZCounter;


              return photoZCounter;
            }
          );

        }
      );
    }
  );


  container.addEventListener(
    'dragstart',
    function (e) {
      e.preventDefault();
    }
  );
}


/* ============================================================
   NORMAL PHOTOGRAPHY GALLERIES
   ============================================================ */

function initNormalDragGallery(
  container
) {

  var items =
    Array.from(
      container.querySelectorAll(
        '.masonry-item'
      )
    );


  if (!items.length) {

    container.classList.remove(
      'drag-gallery-pending'
    );

    return;
  }


  container.classList.add(
    'drag-gallery'
  );


  container.classList.remove(
    'drag-gallery-pending'
  );


  var canvasHeight =
    getCanvasHeight(
      items.length
    );


  var canvasWidth =
    container.clientWidth;


  var positions =
    createPhotoPile(
      items.length
    );


  container.style.height =
    canvasHeight + 'px';


  var zCounter = 10;


  items.forEach(
    function (item, index) {

      var position =
        positions[index];


      if (!position) return;


      var itemWidth =
        canvasWidth *
        (
          position.width /
          100
        );


      item.style.width =
        itemWidth + 'px';


      item.style.left =
        (
          canvasWidth *
          (
            position.x /
            100
          )
        ) + 'px';


      item.style.top =
        (
          canvasHeight *
          (
            position.y /
            100
          )
        ) + 'px';


      if (
        typeof position.rotation ===
        'number'
      ) {

        item.style.transform =
          'rotate(' +
          position.rotation +
          'deg)';

      } else {

        item.style.transform =
          'none';
      }


      item.style.zIndex =
        zCounter;


      makeDraggable(
        item,
        function () {

          zCounter++;

          return zCounter;
        }
      );

    }
  );


  container.addEventListener(
    'dragstart',
    function (e) {
      e.preventDefault();
    }
  );
}


/* ============================================================
   PHOTO PILE POSITIONING
   ============================================================ */

function createPhotoPile(count) {

  var layouts = {


    /* 3 PHOTOS */

    3: [

      {
        x: 4,
        y: 13,
        width: 38
      },

      {
        x: 31,
        y: 4,
        width: 39
      },

      {
        x: 59,
        y: 19,
        width: 37
      }

    ],


    /* 4 PHOTOS */

    4: [

      {
        x: 3,
        y: 12,
        width: 35
      },

      {
        x: 28,
        y: 4,
        width: 36
      },

      {
        x: 55,
        y: 12,
        width: 39
      },

      {
        x: 17,
        y: 47,
        width: 38
      }

    ],


    /* 5 PHOTOS */

    5: [

      {
        x: 3,
        y: 13,
        width: 34
      },

      {
        x: 26,
        y: 4,
        width: 34
      },

      {
        x: 51,
        y: 9,
        width: 36
      },

      {
        x: 64,
        y: 39,
        width: 32
      },

      {
        x: 17,
        y: 45,
        width: 36
      }

    ],


    /* 6 PHOTOS */

    6: [

      {
        x: 2,
        y: 10,
        width: 31
      },

      {
        x: 25,
        y: 3,
        width: 32
      },

      {
        x: 49,
        y: 8,
        width: 34
      },

      {
        x: 70,
        y: 25,
        width: 28
      },

      {
        x: 43,
        y: 48,
        width: 34
      },

      {
        x: 12,
        y: 48,
        width: 34
      }

    ],


    /* 7 PHOTOS */

    7: [

      {
        x: 2,
        y: 11,
        width: 29
      },

      {
        x: 24,
        y: 3,
        width: 31
      },

      {
        x: 47,
        y: 7,
        width: 31
      },

      {
        x: 69,
        y: 20,
        width: 29
      },

      {
        x: 51,
        y: 48,
        width: 32
      },

      {
        x: 27,
        y: 51,
        width: 31
      },

      {
        x: 4,
        y: 46,
        width: 29
      }

    ],


    /* 8 PHOTOS */

    8: [

      {
        x: 2,
        y: 10,
        width: 28
      },

      {
        x: 23,
        y: 3,
        width: 30
      },

      {
        x: 46,
        y: 6,
        width: 30
      },

      {
        x: 69,
        y: 18,
        width: 29
      },

      {
        x: 56,
        y: 43,
        width: 31
      },

      {
        x: 33,
        y: 51,
        width: 30
      },

      {
        x: 11,
        y: 48,
        width: 30
      },

      {
        x: 2,
        y: 29,
        width: 27
      }

    ]

  };


  /*
     FALLBACK FOR 1 PHOTO
  */

  if (count === 1) {

    return [

      {
        x: 30,
        y: 10,
        width: 40
      }

    ];

  }


  /*
     FALLBACK FOR 2 PHOTOS
  */

  if (count === 2) {

    return [

      {
        x: 12,
        y: 12,
        width: 38
      },

      {
        x: 50,
        y: 22,
        width: 38
      }

    ];

  }


  if (layouts[count]) {

    return layouts[count];

  }


  /*
     MORE THAN 8 PHOTOS
  */

  var base =
    layouts[8].slice();


  for (
    var i = 8;
    i < count;
    i++
  ) {

    var column =
      (i - 8) % 3;


    var row =
      Math.floor(
        (i - 8) / 3
      );


    base.push({

      x:
        10 +
        (
          column *
          27
        ),

      y:
        12 +
        (
          row *
          25
        ),

      width:
        29,

      rotation:
        column % 2 === 0
          ? -1.5
          : 1.5

    });

  }


  return base;
}


/* ============================================================
   CANVAS HEIGHT
   ============================================================ */

function getCanvasHeight(count) {

  if (count <= 4) {
    return 600;
  }

  if (count <= 6) {
    return 680;
  }

  if (count <= 8) {
    return 740;
  }

  return 820;
}


/* ============================================================
   INDIVIDUAL PHOTO DRAGGING
   ============================================================ */

function makeDraggable(
  item,
  getNextZ
) {

  var dragging = false;
  var moved = false;
  var pointerId = null;

  var startX = 0;
  var startY = 0;

  var originLeft = 0;
  var originTop = 0;


  /* ----------------------------------------------------------
     POINTER DOWN
     ---------------------------------------------------------- */

  item.addEventListener(
    'pointerdown',
    function (e) {

      if (
        window.innerWidth <= 800
      ) {
        return;
      }


      if (
        e.button !== undefined &&
        e.button !== 0
      ) {
        return;
      }


      dragging = true;
      moved = false;

      pointerId =
        e.pointerId;


      item.dataset.dragged =
        'false';


      startX =
        e.clientX;

      startY =
        e.clientY;


     originLeft =
  item.offsetLeft;

originTop =
  item.offsetTop;


      item.style.zIndex =
        getNextZ();


      item.classList.add(
        'is-dragging'
      );


      try {

        item.setPointerCapture(
          pointerId
        );

      } catch (error) {

        /*
           Safe to ignore
           on older browsers.
        */

      }


      e.preventDefault();

    }
  );


  /* ----------------------------------------------------------
     POINTER MOVE
     ---------------------------------------------------------- */

  item.addEventListener(
    'pointermove',
    function (e) {

      if (
        !dragging ||
        e.pointerId !== pointerId
      ) {
        return;
      }


      var dx =
        e.clientX -
        startX;


      var dy =
        e.clientY -
        startY;


      /*
         Tiny mouse movements
         still count as a click.

         After 4px, it becomes
         an actual drag.
      */

      if (
        !moved &&
        Math.hypot(
          dx,
          dy
        ) > 4
      ) {

        moved = true;

        item.dataset.dragged =
          'true';
      }


      if (!moved) {
        return;
      }


      item.style.left =
        (
          originLeft +
          dx
        ) + 'px';


      item.style.top =
        (
          originTop +
          dy
        ) + 'px';

    }
  );


  /* ----------------------------------------------------------
     STOP DRAGGING
     ---------------------------------------------------------- */

  function stopDragging(e) {

    if (
      !dragging ||
      e.pointerId !== pointerId
    ) {
      return;
    }


    dragging = false;


    item.classList.remove(
      'is-dragging'
    );


    try {

      if (
        item.hasPointerCapture(
          pointerId
        )
      ) {

        item.releasePointerCapture(
          pointerId
        );
      }

    } catch (error) {

      /*
         Nothing needed.
      */

    }


    pointerId = null;
  }


  item.addEventListener(
    'pointerup',
    stopDragging
  );


  item.addEventListener(
    'pointercancel',
    stopDragging
  );

}


/* ============================================================
   ENVELOPES
   ============================================================ */

function initEnvelopes() {

  var cards =
    document.querySelectorAll(
      '.envelope-card'
    );


  cards.forEach(
    function (card) {

      var flap =
        card.querySelector(
          '.envelope-flap'
        );


      card.addEventListener(
        'click',
        function () {

          var isOpen =
            card.classList.toggle(
              'open'
            );


          if (flap) {

            flap.setAttribute(
              'aria-expanded',
              isOpen
                ? 'true'
                : 'false'
            );

          }

        }
      );

    }
  );

}


/* ============================================================
   CONTACT FORM
   ============================================================ */

const contactForm =
  document.getElementById(
    'contact-form'
  );


if (contactForm) {

  const formStatus =
    document.getElementById(
      'form-status'
    );


  const submitButton =
    contactForm.querySelector(
      'button[type="submit"]'
    );


  contactForm.addEventListener(
    'submit',
    async function (event) {

      event.preventDefault();


      if (!submitButton) {
        return;
      }


      submitButton.disabled =
        true;


      submitButton.textContent =
        'sending...';


      if (formStatus) {

        formStatus.textContent =
          '';

      }


      const formData =
        new FormData(
          contactForm
        );


      const data = {

        name:
          formData.get(
            'name'
          ),

        email:
          formData.get(
            'email'
          ),

        phone:
          formData.get(
            'phone'
          ),

        project:
          formData.get(
            'project'
          ),

        message:
          formData.get(
            'message'
          )

      };


      try {

        const response =
          await fetch(
            '/api/contact',
            {

              method:
                'POST',

              headers: {

                'Content-Type':
                  'application/json'

              },

              body:
                JSON.stringify(
                  data
                )

            }
          );


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.error ||
            'Something went wrong.'
          );

        }


        contactForm.reset();


        if (formStatus) {

          formStatus.textContent =
            "thank you! i'll be in touch soon <3 ";

        }


      } catch (error) {

        console.error(
          error
        );


        if (formStatus) {

          formStatus.textContent =
            'oops! something went wrong here. please email me directly at hellosoffee@gmail.com';

        }


      } finally {

        submitButton.disabled =
          false;


        submitButton.textContent =
          'send';

      }

    }
  );

}


/* ============================================================
   PHOTOGRAPHY INTRO ACCORDION
   ============================================================ */

const photoIntro =
  document.querySelector(
    '.photo-intro-accordion'
  );


const photoIntroHeader =
  document.querySelector(
    '.photo-intro-header'
  );


const photoIntroToggle =
  document.querySelector(
    '.photo-intro-toggle'
  );


if (
  photoIntro &&
  photoIntroHeader &&
  photoIntroToggle
) {

  function togglePhotoIntro() {

    const isOpen =
      photoIntro.classList.toggle(
        'open'
      );


    photoIntroHeader.setAttribute(
      'aria-expanded',
      isOpen
    );


    photoIntroToggle.textContent =
      isOpen
        ? 'details −'
        : 'details +';

  }


  photoIntroHeader.addEventListener(
    'click',
    togglePhotoIntro
  );


  photoIntroHeader.addEventListener(
    'keydown',
    function (event) {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {

        event.preventDefault();

        togglePhotoIntro();

      }

    }
  );

}


/* ============================================================
   DESIGN INTRO ACCORDION
   ============================================================ */

const designIntro =
  document.querySelector(
    '.design-intro-accordion'
  );


const designIntroHeader =
  document.querySelector(
    '.design-intro-header'
  );


const designIntroToggle =
  document.querySelector(
    '.design-intro-toggle'
  );


if (
  designIntro &&
  designIntroHeader &&
  designIntroToggle
) {

  function toggleDesignIntro() {

    const isOpen =
      designIntro.classList.toggle(
        'open'
      );


    designIntroHeader.setAttribute(
      'aria-expanded',
      isOpen
    );


    designIntroToggle.textContent =
      isOpen
        ? 'details −'
        : 'details +';

  }


  designIntroHeader.addEventListener(
    'click',
    toggleDesignIntro
  );


  designIntroHeader.addEventListener(
    'keydown',
    function (event) {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {

        event.preventDefault();

        toggleDesignIntro();

      }

    }
  );

}


/* ============================================================
   ANIMATED SPIRAL CURSOR
   ============================================================ */


function initSpiralCursor() {

  if (window.innerWidth <= 800) {
    return;
  }

  if (
    document.querySelector(
      '.spiral-cursor'
    )
  ) {
    return;
  }

  const spiralCursor =
    document.createElement(
      'img'
    );


  spiralCursor.src =
    'images/swirls.gif';


  spiralCursor.className =
    'spiral-cursor';


  spiralCursor.alt =
    '';


  spiralCursor.setAttribute(
    'aria-hidden',
    'true'
  );


  /*
     Hide the normal cursor only
     if the spiral loads successfully.
  */

  spiralCursor.addEventListener(
    'load',
    function () {

      document.body.classList.add(
        'custom-cursor-active'
      );

    }
  );


  spiralCursor.addEventListener(
    'error',
    function () {

      document.body.classList.remove(
        'custom-cursor-active'
      );


      spiralCursor.remove();

    }
  );


  document.body.appendChild(
    spiralCursor
  );


  document.addEventListener(
    'mousemove',
    function (event) {

      spiralCursor.style.left =
        event.clientX +
        'px';


      spiralCursor.style.top =
        event.clientY +
        'px';

    }
  );

}


if (
  document.readyState ===
  'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    initSpiralCursor
  );

} else {

  initSpiralCursor();

}
