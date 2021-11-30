// window.addEventListener("resize", function() {
// 	"use strict"; window.location.reload();
// });

function darken_activate() {
  el_overlay = document.createElement('span');
  el_overlay.className = 'screen-darken active';
  document.body.appendChild(el_overlay);
}
function darken_remove() {
  document.body.removeChild(document.querySelector('.screen-darken'));
}

function show_menu(everyitem) {
  let el_link = everyitem.querySelector('a[data-bs-toggle]');
  let el_btn = everyitem.querySelector('.btn[data-bs-toggle]');

  if (el_btn) {
    el_link = el_btn;
  }

  if (el_link != null) {
    let nextEl = el_link.nextElementSibling;
    if (nextEl.classList.contains('dropdown-menu')) {
      el_link.classList.add('show');
      nextEl.classList.add('show');
    }
  }
}

function hide_menu(everyitem) {
  let el_link = everyitem.querySelector('a[data-bs-toggle]');
  let el_btn = everyitem.querySelector('.btn[data-bs-toggle]');

  if (el_btn) {
    el_link = el_btn;
  }

  if (el_link != null) {
    let nextEl = el_link.nextElementSibling;
    if (nextEl.classList.contains('dropdown-menu')) {
      el_link.classList.remove('show');
      nextEl.classList.remove('show');
    }
  }
}

function toggle_next_el(nextEl) {
  if (nextEl.style.display == 'block') {
    nextEl.style.display = 'none';
  } else {
    nextEl.style.display = 'block';
  }
}

function padding_top_body(navbar_el) {
  let navbar_height = navbar_el.offsetHeight;
  document.body.style.paddingTop = navbar_height + 'px';
}

document.addEventListener('DOMContentLoaded', function () {
  /////// Prevent closing from click inside dropdown
  document.querySelectorAll('.dropdown-menu').forEach(function (element) {
    element.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  // fixed-top. add padding top to show content behind navbar
  let navbar_el = document.querySelector('.navbar.fixed-top');
  if (navbar_el) {
    //padding_top_body(navbar_el);
  }

  el_fixed = document.querySelector('.fixed-onscroll');
  if (el_fixed) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 150) {
        el_fixed.classList.add('fixed-top');
        // add padding top to show content behind navbar
        //padding_top_body(el_fixed);
      } else {
        el_fixed.classList.remove('fixed-top');
        // remove padding top from body
       // document.body.style.paddingTop = '0';
      }
    });
  }

  el_autohide = document.querySelector('.autohide');
  if (el_autohide) {
    // add padding-top to bady (if necessary)
    //padding_top_body(el_autohide);

    var scrollstep_up = 0;
    var scrollstep_down = 0;
    var last_scroll_top = 0;
    window.addEventListener('scroll', function () {
      let scroll_top = window.scrollY;
      if (scroll_top > 50) {
        if (scroll_top < last_scroll_top) {
          el_autohide.classList.remove('scrolled-down');
          el_autohide.classList.add('scrolled-up');
        } else {
          el_autohide.classList.remove('scrolled-up');
          el_autohide.classList.add('scrolled-down');
        }
        last_scroll_top = scroll_top;
      } else {
        el_autohide.classList.remove('scrolled-up', 'scrolled-down');
      }
    });
    // window.addEventListener scroll
  }
  // if

  // for large screen
  if (window.innerWidth > 992) {
    // hover with js
    document.querySelectorAll('.dropdown').forEach(function (everyitem) {
      everyitem.addEventListener('mouseenter', function () {
        if (everyitem.classList.contains('hover')) {
          show_menu(everyitem);
        }
        if (
          everyitem.classList.contains('hover') &&
          everyitem.classList.contains('darken-onshow')
        ) {
          darken_activate();
        }
      });
      everyitem.addEventListener('mouseleave', function () {
        if (everyitem.classList.contains('hover')) {
          hide_menu(everyitem);
        }
        if (
          everyitem.classList.contains('hover') &&
          document.querySelector('.screen-darken')
        ) {
          darken_remove();
        }
      });
    });

    // screen darken on click
    document.querySelectorAll('.dropdown').forEach(function (everydropdown) {
      everydropdown.addEventListener('shown.bs.dropdown', function () {
        if (everydropdown.classList.contains('darken-onshow')) {
          darken_activate();
        }
      });
      everydropdown.addEventListener('hide.bs.dropdown', function () {
        if (document.querySelector('.screen-darken')) {
          darken_remove();
        }
      });
    });
  }

  // for smaller screen
  if (window.innerWidth < 992) {
    // close all inner dropdowns when parent is closed
    document.querySelectorAll('.dropdown').forEach(function (everydropdown) {
      everydropdown.addEventListener('hidden.bs.dropdown', function () {
        // after dropdown is hidden, then find all submenus
        this.querySelectorAll('.megasubmenu, .submenu').forEach(function (
          everysubmenu
        ) {
          // hide every submenu as well
          everysubmenu.style.display = 'none';
        });
      });
    });

    // mega submenu - dropdown on small screen
    document
      .querySelectorAll('.has-megasubmenu > a')
      .forEach(function (element) {
        element.addEventListener('click', function (e) {
          let nextEl = this.nextElementSibling;
          if (nextEl && nextEl.classList.contains('megasubmenu')) {
            // prevent opening link if link needs to open dropdown
            e.preventDefault();
            toggle_next_el(nextEl);
          }
        });
      });

    // multilevel - dropdown on small screen
    document.querySelectorAll('.dropdown-menu a').forEach(function (element) {
      element.addEventListener('click', function (e) {
        let nextEl = this.nextElementSibling;
        if (nextEl && nextEl.classList.contains('submenu')) {
          // prevent opening link if link needs to open dropdown
          e.preventDefault();
          toggle_next_el(nextEl);
        }
      });
    });
  }
  // end if innerWidth
});
// DOMContentLoaded  end
