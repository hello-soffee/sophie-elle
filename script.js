/* ============================================================
   VERCEL ANALYTICS
   ============================================================ */

window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

const vercelAnalytics = document.createElement("script");
vercelAnalytics.src = "/_vercel/insights/script.js";
vercelAnalytics.defer = true;
document.head.appendChild(vercelAnalytics);


/* ============================================================
   HIDE DESKTOP MASONRY BEFORE INITIALIZATION
   ============================================================ */

(function () {

  if (window.innerWidth <= 800) {
    return;
  }

  var galleries =
    document.querySelectorAll('.masonry');

  galleries.forEach(function (gallery) {

    gallery.classList.add(
      'drag-gallery-pending'
    );

  });

})();


/* ============================================================
   MAIN DOM READY
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ========================================================
     MOBILE NAVIGATION
     ======================================================== */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {

    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });

  }


  /* ========================================================
     SPLIT PANELS
     ======================================================== */

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


  /* ========================================================
     ACCORDIONS
     ======================================================== */

  var triggers =
    document.querySelectorAll('.accordion-trigger');

  triggers.forEach(function (btn) {

    btn.addEventListener('click', function () {

      var item = btn.closest('.accordion-item');
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


  /* ========================================================
     LIGHTBOX
     ======================================================== */

  initLightbox();


  /* ========================================================
     ENVELOPES
     ======================================================== */

  initEnvelopes();


  /* ========================================================
     ACTIVE NAVIGATION
     ======================================================== */

  var navLinks =
    document.querySelectorAll('.main-nav a');

  var currentFile =
    window.location.pathname.split('/').pop()
    || 'index.html';

  navLinks.forEach(function (link) {

    link.removeAttribute('aria-current');

    var linkFile =
      link.getAttribute('href');

    if (linkFile === currentFile) {
      link.setAttribute(
        'aria-current',
        'page'
      );
    }

  });

});


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


  /* ----------------------------------------------------------
     Show image
     ---------------------------------------------------------- */

  function show(index) {

    currentIndex =
      (index + items.length) % items.length;

    var currentItem =
      items[currentIndex];

    var img =
      currentItem.querySelector('img');

    if (!img) return;

    stage.style.backgroundImage =
      'url("' + img.src + '")';


    /* Project link */

    var link =
      currentItem.getAttribute('data-link');

    if (link) {

      linkBtn.href = link;

      linkBtn.style.display =
        'inline-block';

    } else {

      linkBtn.style.display =
        'none';

    }


    /* Caption */

    var caption =
      currentItem.getAttribute('data-caption');

    if (caption) {

      captionEl.textContent =
        caption;

      captionEl.style.display =
        'block';

    } else {

      captionEl.style.display =
        'none';

    }

    lightbox.classList.add('open');

  }


  /* ----------------------------------------------------------
     Close
     ---------------------------------------------------------- */

  function closeLightbox() {
    lightbox.classList.remove('open');
  }


  /* ----------------------------------------------------------
     Clicking photographs

     A normal click opens the lightbox.
     A drag does NOT open the lightbox.
     ---------------------------------------------------------- */

  items.forEach(function (item, index) {

    item.addEventListener('click', function () {

      if (item.dataset.dragged === 'true') {

        item.dataset.dragged = 'false';

        return;
      }

      show(index);

    });

  });


  /* ----------------------------------------------------------
     Lightbox controls
     ---------------------------------------------------------- */

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


  /* ----------------------------------------------------------
     Keyboard controls
     ---------------------------------------------------------- */

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
   DRAG GALLERY
   ============================================================ */

/*
   Normal photography galleries:
   each individual photograph is draggable.

   Events gallery:
   each .event-stack is draggable as ONE collection,
   while the photographs inside remain individually clickable.
*/

function initDragGallery() {

  /*
     Keep the simple masonry layout on phones.
  */

  if (window.innerWidth <= 800) {
    return;
  }


  var containers =
    document.querySelectorAll('.masonry');


  containers.forEach(function (container) {


    /* ========================================================
       EVENTS PAGE
       ======================================================== */

    if (container.classList.contains('event-gallery')) {

      var stacks =
        Array.from(
          container.querySelectorAll('.event-stack')
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


      /*
         The Events canvas is deliberately larger because
         each draggable object contains several photographs.
      */

      var eventCanvasHeight = 850;

      container.style.height =
        eventCanvasHeight + 'px';


      var eventCanvasWidth =
        container.clientWidth;


      /*
         Starting positions for the event collections.

         x and width are percentages of the gallery width.
         y is a percentage of the gallery height.

         These positions can be adjusted later without
         changing the drag system.
      */

      var stackPositions = [

        /* Jason & Maria */
        {
          x: 1,
          y: 3,
          width: 34
        },

        /* Karina */
        {
          x: 34,
          y: 30,
          width: 31
        },

        /* Karina & William */
        {
          x: 65,
          y: 5,
          width: 34
        }

      ];


      var eventZCounter = 10;


      stacks.forEach(function (stack, index) {

        var position =
          stackPositions[index] ||
          {
            x: 8 + ((index % 3) * 30),
            y: 10 + (Math.floor(index / 3) * 35),
            width: 32
          };


        var stackWidth =
          eventCanvasWidth *
          (position.width / 100);


        stack.style.width =
          stackWidth + 'px';


        stack.style.left =
          (
            eventCanvasWidth *
            (position.x / 100)
          ) + 'px';


        stack.style.top =
          (
            eventCanvasHeight *
            (position.y / 100)
          ) + 'px';


        stack.style.zIndex =
          eventZCounter;


        makeEventStackDraggable(
          stack,
          function () {

            eventZCounter++;

            return eventZCounter;

          }
        );

      });


      /*
         Prevent native browser image dragging.
      */

      container.addEventListener(
        'dragstart',
        function (e) {
          e.preventDefault();
        }
      );


      /*
         IMPORTANT:
         Stop here.

         We do NOT want the individual photos inside Events
         to also receive the normal draggable-photo behavior.
      */

      return;
    }


    /* ========================================================
       ALL OTHER PHOTOGRAPHY GALLERIES
       ======================================================== */

    var items =
      Array.from(
        container.querySelectorAll('.masonry-item')
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


    /*
       Give the composition enough vertical space.
    */

    var canvasHeight =
      getCanvasHeight(
        items.length
      );


    container.style.height =
      canvasHeight + 'px';


    var canvasWidth =
      container.clientWidth;


    /*
       Create the initial scattered arrangement.
    */

    var positions =
      createPhotoPile(
        items.length
      );


    /*
       The most recently interacted-with photograph
       comes to the front.
    */

    var zCounter = 10;


    items.forEach(function (item, index) {

      var position =
        positions[index];


      /*
         Scale width responsively.

         The image height remains automatic in CSS,
         so portrait/landscape proportions are preserved.
      */

      var itemWidth =
        canvasWidth *
        (position.width / 100);


      item.style.width =
        itemWidth + 'px';


      item.style.left =
        (
          canvasWidth *
          (position.x / 100)
        ) + 'px';


      item.style.top =
        (
          canvasHeight *
          (position.y / 100)
        ) + 'px';


      /*
         Some of your original layouts currently have
         rotation commented out.

         Only apply a rotation when a value actually exists.
      */

      if (typeof position.rotation === 'number') {

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

    });


    container.addEventListener(
      'dragstart',
      function (e) {
        e.preventDefault();
      }
    );

  });

}


/* ============================================================
   PHOTO PILE POSITIONING
   ============================================================ */

function createPhotoPile(count) {

  var layouts = {


    /* --------------------------------------------------------
       3 photographs
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       4 photographs
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       5 photographs
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       6 photographs
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       7 photographs
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       8 photographs
       -------------------------------------------------------- */

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
     Use the hand-composed layouts above when available.
  */

  if (layouts[count]) {
    return layouts[count];
  }


  /*
     For galleries containing more than 8 photographs,
     start with the 8-photo composition and add more
     photographs into the cluster.
  */

  var base =
    layouts[8].slice();


  for (var i = 8; i < count; i++) {

    var column =
      (i - 8) % 3;

    var row =
      Math.floor((i - 8) / 3);


    base.push({

      x: 10 + (column * 27),

      y: 12 + (row * 25),

      width: 29,

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
   NORMAL INDIVIDUAL PHOTO DRAGGING
   ============================================================ */

function makeDraggable(item, getNextZ) {

  var dragging = false;

  var startX;
  var startY;

  var originLeft;
  var originTop;


  /* ----------------------------------------------------------
     Pointer down
     ---------------------------------------------------------- */

  item.addEventListener(
    'pointerdown',
    function (e) {

      if (e.button !== undefined && e.button !== 0) {
        return;
      }


      dragging = true;

      item.dataset.dragged =
        'false';


      startX =
        e.clientX;

      startY =
        e.clientY;


      originLeft =
        parseFloat(item.style.left) || 0;

      originTop =
        parseFloat(item.style.top) || 0;


      item.style.zIndex =
        getNextZ();


      item.classList.add(
        'is-dragging'
      );


      try {

        item.setPointerCapture(
          e.pointerId
        );

      } catch (error) {
        /* Older browsers can safely ignore this. */
      }


      e.preventDefault();

    }
  );


  /* ----------------------------------------------------------
     Pointer move
     ---------------------------------------------------------- */

  item.addEventListener(
    'pointermove',
    function (e) {

      if (!dragging) {
        return;
      }


      var dx =
        e.clientX - startX;

      var dy =
        e.clientY - startY;


      /*
         A tiny movement still counts as a click.

         Only after 4px do we consider this an actual drag.
      */

      if (
        Math.abs(dx) > 4 ||
        Math.abs(dy) > 4
      ) {

        item.dataset.dragged =
          'true';


        item.style.left =
          (
            originLeft + dx
          ) + 'px';


        item.style.top =
          (
            originTop + dy
          ) + 'px';

      }

    }
  );


  /* ----------------------------------------------------------
     Pointer up
     ---------------------------------------------------------- */

  function stopDragging(e) {

    if (!dragging) {
      return;
    }


    dragging = false;


    item.classList.remove(
      'is-dragging'
    );


    try {

      item.releasePointerCapture(
        e.pointerId
      );

    } catch (error) {
      /* Nothing needed here. */
    }

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
   EVENT COLLECTION DRAGGING
   ============================================================ */

/*
   The entire .event-stack moves together.

   The individual .masonry-item photographs inside the stack
   remain clickable, so your existing lightbox still works.
*/

function makeEventStackDraggable(stack, getNextZ) {

  var dragging = false;
  var actuallyDragged = false;

  var startX;
  var startY;

  var originLeft;
  var originTop;


  /* ----------------------------------------------------------
     Pointer down
     ---------------------------------------------------------- */

  stack.addEventListener(
    'pointerdown',
    function (e) {

      if (e.button !== undefined && e.button !== 0) {
        return;
      }


      dragging = true;
      actuallyDragged = false;


      /*
         Reset every photo in this collection before
         beginning a new interaction.
      */

      var photos =
        stack.querySelectorAll('.masonry-item');

      photos.forEach(function (photo) {
        photo.dataset.dragged = 'false';
      });


      startX =
        e.clientX;

      startY =
        e.clientY;


      originLeft =
        parseFloat(stack.style.left) || 0;

      originTop =
        parseFloat(stack.style.top) || 0;


      /*
         Bring the whole collection forward.
      */

      stack.style.zIndex =
        getNextZ();


      stack.classList.add(
        'is-dragging'
      );


      try {

        stack.setPointerCapture(
          e.pointerId
        );

      } catch (error) {
        /* Safe to ignore. */
      }

    }
  );


  /* ----------------------------------------------------------
     Pointer move
     ---------------------------------------------------------- */

  stack.addEventListener(
    'pointermove',
    function (e) {

      if (!dragging) {
        return;
      }


      var dx =
        e.clientX - startX;

      var dy =
        e.clientY - startY;


      /*
         Don't treat tiny accidental mouse movement as a drag.
      */

      if (
        Math.abs(dx) > 4 ||
        Math.abs(dy) > 4
      ) {

        actuallyDragged = true;


        /*
           Mark every photograph in this stack so the
           click generated after dragging does not
           accidentally open the lightbox.
        */

        var photos =
          stack.querySelectorAll('.masonry-item');

        photos.forEach(function (photo) {
          photo.dataset.dragged = 'true';
        });


        stack.style.left =
          (
            originLeft + dx
          ) + 'px';


        stack.style.top =
          (
            originTop + dy
          ) + 'px';

      }

    }
  );


  /* ----------------------------------------------------------
     Pointer up
     ---------------------------------------------------------- */

  function stopDragging(e) {

    if (!dragging) {
      return;
    }


    dragging = false;


    stack.classList.remove(
      'is-dragging'
    );


    try {

      stack.releasePointerCapture(
        e.pointerId
      );

    } catch (error) {
      /* Safe to ignore. */
    }


    /*
       If this interaction was just a click, make sure
       the individual photo can open normally.
    */

    if (!actuallyDragged) {

      var photos =
        stack.querySelectorAll('.masonry-item');

      photos.forEach(function (photo) {
        photo.dataset.dragged = 'false';
      });

    }

  }


  stack.addEventListener(
    'pointerup',
    stopDragging
  );


  stack.addEventListener(
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


  cards.forEach(function (card) {

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
            isOpen ? 'true' : 'false'
          );

        }

      }
    );

  });

}


/* ============================================================
   INITIALIZE DRAG GALLERY
   ============================================================ */

document.addEventListener(
  'DOMContentLoaded',
  function () {

    initDragGallery();

  }
);


/* ============================================================
   CONTACT FORM
   ============================================================ */

const contactForm =
  document.getElementById("contact-form");


if (contactForm) {

  const formStatus =
    document.getElementById("form-status");

  const submitButton =
    contactForm.querySelector(
      'button[type="submit"]'
    );


  contactForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      submitButton.disabled = true;
      submitButton.textContent = "sending...";
      formStatus.textContent = "";


      const formData =
        new FormData(contactForm);


      const data = {

        name:
          formData.get("name"),

        email:
          formData.get("email"),

        phone:
          formData.get("phone"),

        project:
          formData.get("project"),

        message:
          formData.get("message")

      };


      try {

        const response =
          await fetch("/api/contact", {

            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body:
              JSON.stringify(data)

          });


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.error ||
            "Something went wrong."
          );

        }


        contactForm.reset();

        formStatus.textContent =
          "thank you! i'll be in touch soon <3 ";


      } catch (error) {

        console.error(error);

        formStatus.textContent =
          "oops! something went wrong here. please email me directly at hellosoffee@gmail.com";


      } finally {

        submitButton.disabled = false;

        submitButton.textContent =
          "send";

      }

    }
  );

}


/* ============================================================
   PHOTOGRAPHY ACCORDION HEADER
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
      photoIntro.classList.toggle('open');


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
    (event) => {

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
   DESIGN ACCORDION HEADER
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
      designIntro.classList.toggle('open');


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
    (event) => {

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

  const spiralCursor =
    document.createElement('img');


  spiralCursor.src =
    'images/swirls.gif';

  spiralCursor.className =
    'spiral-cursor';

  spiralCursor.alt = '';

  spiralCursor.setAttribute(
    'aria-hidden',
    'true'
  );


  /*
     Only activate the custom cursor after the GIF
     successfully loads.

     This prevents the normal cursor from disappearing
     if the image path ever fails.
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
        event.clientX + 'px';

      spiralCursor.style.top =
        event.clientY + 'px';

    }
  );

}


if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    initSpiralCursor
  );

} else {

  initSpiralCursor();

}
