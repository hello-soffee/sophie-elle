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
   Instead of allowing the browser to create a masonry layout
   and then measuring that layout, we now create the initial
   composition ourselves.

   The photographs form a tight, slightly overlapping cluster.
*/

function initDragGallery() {

  /*
     Don't enable the freeform gallery on phones.
  */

  if (window.innerWidth <= 800) {
    return;
  }


  var containers =
    document.querySelectorAll('.masonry');


  containers.forEach(function (container) {

    var items =
      Array.from(
        container.querySelectorAll('.masonry-item')
      );


    if (!items.length) {
      return;
    }


    /* --------------------------------------------------------
       Turn the masonry container into our photo canvas
       -------------------------------------------------------- */

  container.classList.add(
  'drag-gallery'
);

container.classList.remove(
  'drag-gallery-pending'
);

    /*
       Give the composition enough vertical space.

       This is deliberately not enormous — the photographs
       should feel grouped together.
    */

    var canvasHeight = getCanvasHeight(
      items.length
    );

    container.style.height =
      canvasHeight + 'px';


    var canvasWidth =
      container.clientWidth;


    /*
       Create the initial arrangement.
    */

    var positions =
      createPhotoPile(
        items.length
      );


    /*
       We use a z-index counter so the most recently
       interacted-with photograph always comes forward.
    */

    var zCounter = 10;


    /* --------------------------------------------------------
       Position every photograph
       -------------------------------------------------------- */

    items.forEach(function (item, index) {

      var position =
        positions[index];


      /*
         Calculate image width from the container width.
         
         This makes the layout responsive rather than relying
         on fixed pixel sizes.
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
         Slight rotation gives the photographs the feeling
         of physical prints sitting on top of one another.
      */

      item.style.transform =
        'rotate(' +
        position.rotation +
        'deg)';


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


    /*
       Prevent the browser's native image dragging.
    */

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

/*
   These positions are percentages of the gallery width/height.

   They are deliberately close together.

   The result is more like a pile of photographs on a table
   than a conventional grid.
*/

function createPhotoPile(count) {

  var layouts = {


    /* --------------------------------------------------------
       3 photographs
       -------------------------------------------------------- */

    3: [

      {
        x: 4,
        y: 13,
        width: 38,
       /* rotation: -2 */
      },

      {
        x: 31,
        y: 4,
        width: 39,
        /* rotation: 1.5 */
      },

      {
        x: 59,
        y: 19,
        width: 37,
       /* rotation: -1 */
      }

    ],


    /* --------------------------------------------------------
       4 photographs
       -------------------------------------------------------- */

    4: [

      {
        x: 3,
        y: 12,
        width: 35,
        /* rotation: -2 */
      },

      {
        x: 28,
        y: 4,
        width: 36,
       /* rotation: 1.5 */
      },

      {
        x: 55,
        y: 12,
        width: 39,
      /*  rotation: -1.5 */
      },

      {
        x: 17,
        y: 47,
        width: 38,
       /* rotation: 1.5 */
      }

    ],


    /* --------------------------------------------------------
       5 photographs
       -------------------------------------------------------- */

    5: [

      {
        x: 3,
        y: 13,
        width: 34,
       /* rotation: -2 */
      },

      {
        x: 26,
        y: 4,
        width: 34,
       /* rotation: 1 */
      },

      {
        x: 51,
        y: 9,
        width: 36,
       /* rotation: -1 */
      },

      {
        x: 64,
        y: 39,
        width: 32,
        /* rotation: 2 */
      },

      {
        x: 17,
        y: 45,
        width: 36,
       /* rotation: -1 */
      }

    ],


    /* --------------------------------------------------------
       6 photographs
       -------------------------------------------------------- */

    6: [

      {
        x: 2,
        y: 10,
        width: 31,
       /* rotation: -2 */
      },

      {
        x: 25,
        y: 3,
        width: 32,
       /* rotation: 1.5 */
      },

      {
        x: 49,
        y: 8,
        width: 34,
       /* rotation: -1 */
      },

      {
        x: 70,
        y: 25,
        width: 28,
       /* rotation: 2 */
      },

      {
        x: 43,
        y: 48,
        width: 34,
     /*   rotation: -2 */
      },

      {
        x: 12,
        y: 48,
        width: 34,
       /* rotation: 1 */
      }

    ],


    /* --------------------------------------------------------
       7 photographs
       -------------------------------------------------------- */

    7: [

      {
        x: 2,
        y: 11,
        width: 29,
      /*  rotation: -2 */
      },

      {
        x: 24,
        y: 3,
        width: 31,
      /*  rotation: 1 */
      },

      {
        x: 47,
        y: 7,
        width: 31,
     /*   rotation: -1 */
      },

      {
        x: 69,
        y: 20,
        width: 29,
     /*   rotation: 2 */
      },

      {
        x: 51,
        y: 48,
        width: 32,
      /*  rotation: -2 */
      },

      {
        x: 27,
        y: 51,
        width: 31,
     /*   rotation: 1 */
      },

      {
        x: 4,
        y: 46,
        width: 29,
    /*    rotation: -1 */
      }

    ],


    /* --------------------------------------------------------
       8 photographs
       -------------------------------------------------------- */

    8: [

      {
        x: 2,
        y: 10,
        width: 28,
       /* rotation: -2 */
      },

      {
        x: 23,
        y: 3,
        width: 30,
       /* rotation: 1 */
      },

      {
        x: 46,
        y: 6,
        width: 30,
       /* rotation: -1 */
      },

      {
        x: 69,
        y: 18,
        width: 29,
      /*  rotation: 2 */
      },

      {
        x: 56,
        y: 43,
        width: 31,
       /* rotation: -1.5 */
      },

      {
        x: 33,
        y: 51,
        width: 30,
      /*  rotation: 1 */
      },

      {
        x: 11,
        y: 48,
        width: 30,
       /* rotation: -2 */
      },

      {
        x: 2,
        y: 29,
        width: 27,
      /*  rotation: 1 */
      }

    ]

  };


  /*
     If the gallery has one of the common numbers above,
     use the carefully composed layout.
  */

  if (layouts[count]) {
    return layouts[count];
  }


  /*
     For galleries with more than 8 photographs, build
     additional positions automatically.

     The first 8 remain the tight core.
  */

  var base =
    layouts[8].slice();


  for (var i = 8; i < count; i++) {

    /*
       Add photographs into the existing cluster.

       These values intentionally overlap the central area.
    */

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

  /*
     The gallery gets slightly taller as more photographs
     are added.

     Still intentionally compact.
  */

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
   DRAGGING
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

      /*
         Only respond to the primary mouse/touch pointer.
      */

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


      /*
         Bring this photograph to the front.
      */

      item.style.zIndex =
        getNextZ();


      item.classList.add(
        'is-dragging'
      );


      /*
         Pointer capture keeps the photograph attached
         to the pointer even if the cursor moves outside
         the photograph.
      */

      try {

        item.setPointerCapture(
          e.pointerId
        );

      } catch (error) {
        /* Older browsers can safely ignore this. */
      }


      /*
         Prevent browser text/image selection.
      */

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
   INITIALIZE DRAG GALLERY AFTER IMAGES HAVE LOADED
   ============================================================ */

document.addEventListener(
  'DOMContentLoaded',
  function () {

    initDragGallery();

  }
);

/* ============================================================
   contact form
   ============================================================ */

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const formStatus = document.getElementById("form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "sending...";
    formStatus.textContent = "";

    const formData = new FormData(contactForm);

const data = {
  name: formData.get("name"),
  email: formData.get("email"),
  phone: formData.get("phone"),
  project: formData.get("project"),
  message: formData.get("message"),
};

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      contactForm.reset();
      formStatus.textContent = "thank you! i'll be in touch soon <3 ";
    } catch (error) {
      console.error(error);
      formStatus.textContent =
        "oops! something went wrong here. please email me directly at hellosoffee@gmail.com";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "send";
    }
  });
}
