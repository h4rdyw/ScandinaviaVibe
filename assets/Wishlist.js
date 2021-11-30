var LOCAL_STORAGE_WISHLIST_KEY = 'shopify-wishlist';
var LOCAL_STORAGE_DELIMITER = ',';
var BUTTON_ACTIVE_CLASS = 'active';
var GRID_LOADED_CLASS = 'loaded';
var DEFAULT_LANG = 'en';
var selectors = {
  button: '[button-wishlist]',
  grid: '[grid-wishlist]',
};

document.addEventListener('DOMContentLoaded', function () {
  initButtons();
  initGrid();
});

document.addEventListener('shopify-wishlist:updated', function (event) {
  //console.log('[Shopify Wishlist] Wishlist Updated ✅', event.detail.wishlist);
  initGrid();
});

document.addEventListener(
  'shopify-wishlist:init-product-grid',
  function (event) {
    /* console.log(
      '[Shopify Wishlist] Wishlist Product List Loaded ✅',
      event.detail.wishlist
    ); */
  }
);

document.addEventListener('shopify-wishlist:init-buttons', function (event) {
  /* console.log(
    '[Shopify Wishlist] Wishlist Buttons Loaded ✅',
    event.detail.wishlist
  ); */
});

var setupGrid = function (grid) {
  var wishlist = getWishlist();

  // wishlist button in header
  var buttoncart = document.querySelector('#button-wishlist-cart');
  if (wishlist.length > 0) {
    buttoncart.classList.add(BUTTON_ACTIVE_CLASS);
  } else {
    buttoncart.classList.remove(BUTTON_ACTIVE_CLASS);
    var WishlistItems = document.querySelector('#wishlist-text');
    WishlistItems.classList.remove('d-none');
  }

  var requests = wishlist.map(function (handle) {
    var prdUrl = '/products/' + handle + '.js';
    fetch(prdUrl)
      .then(resp => resp.json())
      .then(function (data) {
        //for modal
        //console.log(data);
        document.addEventListener('dispatchPrdWishlist', function (event) {
          //event.preventDefault();
          //console.log(`registering productInfoAnchor ${data.id}`);
          getProductAnchors(`productInfoAnchor-${data.id}`);
        });
      });

    var productTileTemplateUrl;
    var shoplocal = Shopify.locale;
    if(shoplocal == DEFAULT_LANG){
      productTileTemplateUrl = '/products/' + handle + '?view=wishlist';
    }else{
      productTileTemplateUrl = '/'+shoplocal+'/products/' + handle + '?view=wishlist';
    }
    
    return fetch(productTileTemplateUrl).then(function (res) {
      return res.text();
    });
  });
  Promise.all(requests).then(function (responses) {
    var wishlistProductCards = responses.join('');
    grid.innerHTML = wishlistProductCards;
    grid.classList.add(GRID_LOADED_CLASS);
    initButtons();

    var event = new CustomEvent('shopify-wishlist:init-product-grid', {
      detail: { wishlist: wishlist },
    });
    document.dispatchEvent(event);

    // Create a custom event and dispatch PopUp Modal for Wishlist items
    let myEvent = new CustomEvent('dispatchPrdWishlist', {
      bubbles: true,
      cancelable: true,
    });

    setTimeout(() => {
      const body = document.body;
      document.dispatchEvent(myEvent);
    }, 2);
    
    clearTimeout();
  });
};

var setupButtons = function (buttons) {
  buttons.forEach(function (button) {
    var productHandle = button.dataset.productHandle || false;
    //console.log(productHandle);
    if (!productHandle)
      return console.error(
        '[Shopify Wishlist] Missing `data-product-handle` attribute. Failed to update the wishlist.'
      );

    if (wishlistContains(productHandle)) {
      button.classList.add(BUTTON_ACTIVE_CLASS);
      //console.log("add active");
    }

    button.addEventListener('click', function () {
      updateWishlist(productHandle);
      button.classList.toggle(BUTTON_ACTIVE_CLASS);
    });
  });
};

var initGrid = function () {
  var grid = document.querySelector(selectors.grid) || false;
  if (grid) {
    setupGrid(grid);
  } else {
    var wishlist = getWishlist();

    //wishlist button in header
    var buttoncart = document.querySelector('#button-wishlist-cart') || false;
    if (wishlist.length > 0) {
      if (buttoncart) {
        buttoncart.classList.add(BUTTON_ACTIVE_CLASS);
      }
    } else {
      if (buttoncart) {
        buttoncart.classList.remove(BUTTON_ACTIVE_CLASS);
      }
    }
  }
};

var initButtons = function () {
  var buttons = document.querySelectorAll(selectors.button) || [];
  if (buttons.length) setupButtons(buttons);
  else return;
  var event = new CustomEvent('shopify-wishlist:init-buttons', {
    detail: { wishlist: getWishlist() },
  });
  document.dispatchEvent(event);
  //console.log("done init btn");
};

var getWishlist = function () {
  var wishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY) || false;
  if (wishlist) return wishlist.split(LOCAL_STORAGE_DELIMITER);
  return [];
};

var setWishlist = function (array) {
  var wishlist = array.join(LOCAL_STORAGE_DELIMITER);
  if (array.length) localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, wishlist);
  else localStorage.removeItem(LOCAL_STORAGE_WISHLIST_KEY);

  var event = new CustomEvent('shopify-wishlist:updated', {
    detail: { wishlist: array },
  });
  document.dispatchEvent(event);

  return wishlist;
};

var updateWishlist = function (handle) {
  //console.log(handle);
  var wishlist = getWishlist();
  var indexInWishlist = wishlist.indexOf(handle);
  if (indexInWishlist === -1) wishlist.push(handle);
  else wishlist.splice(indexInWishlist, 1);
  return setWishlist(wishlist);
};

var wishlistContains = function (handle) {
  var wishlist = getWishlist();
  return wishlist.indexOf(handle) !== -1;
};

var resetWishlist = function () {
  return setWishlist([]);
};
