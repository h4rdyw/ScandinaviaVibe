'use strict';
var DefaultLang = 'en';

window.addEventListener('resize', adjustAnnouncementBar);

if (document.readyState !== 'loading') {
  console.log('document is already ready, just execute code here');
  /*myInitCode();*/
} else {
  document.addEventListener('DOMContentLoaded', function () {
    update_cart();
    adjustAnnouncementBar();
    //get all productInfoAnchor
    var testPrd = document.querySelectorAll('[id^="productInfoAnchor-"]');
    var arrtesPrd = Array.from(testPrd);
    //console.log('All productInfoAnchor ');
    //console.log(arrtesPrd);

    testPrd.forEach(item => {
      //console.log(item.id);
      getProductAnchors(item.id);
    });
  });
}

/* hover on ios */
(function (l) {
  var i,
    s = { touchend: function () {} };
  for (i in s) l.addEventListener(i, s);
})(document);

function checkSafari() {
  var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
  var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
  var is_safari = navigator.userAgent.indexOf('Safari') > -1;
  var is_opera = navigator.userAgent.toLowerCase().indexOf('op') > -1;
  if (is_chrome && is_safari) {
    is_safari = false;
  }
  if (is_chrome && is_opera) {
    is_chrome = false;
  }

  if (
    navigator.userAgent.indexOf('Safari') != -1 &&
    navigator.userAgent.indexOf('Chrome') == -1
  ) {
    return true;
  } else {
    return false;
  }
}
/* trigger touch on ios safari */
function touchTrigger() {
  if (checkSafari()) {
    var el = document.getElementById('modalprdbody');
    // desktop
    //el.click();

    // mobile
    if (window.matchMedia('(max-width: 768px)').matches) {
      //alert('touch');
      var event1 = new Event('touchstart');
      var event2 = new Event('touchend');
      el.dispatchEvent(event1);
      el.dispatchEvent(event2);
    }
  }
}

/* adjust annoucement bar position */
var navBarCollapse = document.getElementById('navbarNav') || false;
if (navBarCollapse) {
  navBarCollapse.addEventListener('hidden.bs.collapse', function () {
    // do something...
    //console.log("Collapsed");
    adjustAnnouncementBar();
  });

  navBarCollapse.addEventListener('shown.bs.collapse', function () {
    // do something...
    //console.log("Collapsed");
    adjustAnnouncementBar();
  });
}

var myproductModal = document.getElementById('productInfoModal');
if (myproductModal != null) {
  myproductModal.addEventListener('hidden.bs.modal', function (event) {
    checkLocaleBtn();

    if (checkSafari()) {
      if (window.matchMedia('(max-width: 768px)').matches) {
        document.body.classList.remove('modal-fixed');
        enableDocumentScrolling();
      }
    }
  });

  /* before modal shown */
  myproductModal.addEventListener('show.bs.modal', function (event) {
    if (checkSafari()) {
      if (window.matchMedia('(max-width: 768px)').matches) {
        //console.log("enabling modal fixed, AFTER disabling scroll");
        disableDocumentScrolling();
        document.body.classList.add('modal-fixed');
      }
    }
  });
  /* when modal shown */
  myproductModal.addEventListener('shown.bs.modal', function (event) {
    checkLocaleBtn();
    touchTrigger();
    const element = document.querySelector('#modalItemID') || false;
    if (element) {
      let changeEvent = new Event('change');
      element.dispatchEvent(changeEvent);
    }
  });
}

function adjustAnnouncementBar() {
  var headerEl = document.getElementById('navBar') || false;
  var headerHeight = headerEl.offsetHeight || false;
  /*var headerBoxShadow = window.getComputedStyle(headerEl).boxShadow;*/
  /*var headerBoxShadowY = +headerBoxShadow.split("px")[2].trim();    ;*/
  //console.log('HeaderHeight:' + headerHeight);

  /*var x = document.getElementsByTagName("BODY")[0];
      console.log(x);*/

  if (headerHeight) {
    if (document.getElementById('barPosition')) {
      var elName = document.getElementById('barPosition');
      /*console.log(elName.innerHTML);*/
      elName.innerHTML = `body {
            position:relative;
            top: ${headerHeight}px !important;
          }`;
      /*var topElAfter = window.getComputedStyle(document.body).getPropertyValue('top');
          console.log('After:'+topElAfter);*/
    }
  }
}

if (document.getElementById('sort_by') != null) {
  document.querySelector('#sort_by').addEventListener('change', function (e) {
    var url = new URL(window.location.href);
    url.searchParams.set('sort_by', e.currentTarget.value);
    window.location = url.href;
  });
}

if (document.getElementById('AddressCountryNew') != null) {
  document
    .getElementById('AddressCountryNew')
    .addEventListener('change', function (e) {
      var province =
        this.options[this.selectedIndex].getAttribute('data-provinces');
      var provinceSelector = document.getElementById('AddressProvinceNew');
      var provinceArray = JSON.parse(province);
      //console.log(provinceArray);

      if (provinceArray.length < 1) {
        provinceSelector.setAttribute('disabled', 'disabled');
      } else {
        provinceSelector.removeAttribute('disabled');
      }
      provinceSelector.innerHTML = '';
      var options = '';
      for (var i = 0; i < provinceArray.length; i++) {
        options +=
          '<option value="' +
          provinceArray[i][0] +
          '">' +
          provinceArray[i][0] +
          '</option>';
      }
      provinceSelector.innerHTML = options;
    });
}

if (document.getElementById('forgotPassword') != null) {
  document
    .getElementById('forgotPassword')
    .addEventListener('click', function (e) {
      //console.log('Clicked');
      const element = document.querySelector('#forgot_password_form');
      if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
        element.classList.add('d-block');
      } else {
        element.classList.remove('d-block');
        element.classList.add('d-none');
      }
    });
}

var localeItems = document.querySelectorAll('#localeItem');
if (localeItems.length > 0) {
  localeItems.forEach(item => {
    item.addEventListener('click', event => {
      document.getElementById('localeCode').value = item.getAttribute('lang');
      document.getElementById('localization_form_tag').submit();
    });
  });
}

/* toggle display of localeBtn (translation)*/
function checkLocaleBtn() {
  var checkPage = document.getElementById('product_details');

  var checklocaleItem = document.querySelector('#localeBtn');

  if (checkPage != null) {
    if (checklocaleItem.classList.contains('d-none')) {
      //do nothing
      //console.log("Details Page");
    } else {
      checklocaleItem.classList.add('d-none');
    }
  } else {
    if (checklocaleItem.classList.contains('d-none')) {
      checklocaleItem.classList.remove('d-none');
    } else {
      checklocaleItem.classList.add('d-none');
    }
  }
}

let mybutton = document.getElementById('btn-back-to-top') || false;

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 1400 ||
    document.documentElement.scrollTop > 1400
  ) {
    if (mybutton) mybutton.style.display = 'block';
  } else {
    if (mybutton) mybutton.style.display = 'none';
  }
}
// When the user clicks on the button, scroll to the top of the document
if (mybutton) mybutton.addEventListener('click', backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

var chekproductModal = document.getElementById('productInfoModal');
if (chekproductModal != null) {
  //console.log("clean up ProductInfoModal");

  //cleanup modal data
  chekproductModal.addEventListener('hidden.bs.modal', function () {
    setTimeout(() => {
      document.getElementById('productInfoImg').src = '';
      document.getElementById('productInfoTitle').innerHTML = '';
      document.getElementById('productInfoPrice').innerHTML = '';
      document.getElementById('productInfoDescription').innerHTML = '';
      document.getElementById('modalItemID').value = '1';
      document.getElementById('modalItemQuantity').value = '1';
    }, 1);
    clearTimeout();
  });
}

var myModalEl = document.querySelector('#productInfoModal');
if (myModalEl != null) {
  // Returns a Bootstrap modal instance
  var productModal = bootstrap.Modal.getOrCreateInstance(myModalEl);
}

function truncate(str, max = 10) {
  const array = str.trim().split(' ');
  const ellipsis = array.length > max ? '...' : '';

  return array.slice(0, max).join(' ') + ellipsis;
}
// Product POP UP MODAL
function getProductAnchors(prdId) {
  //console.log(prdId);

  /*
  var productModal = new bootstrap.Modal(
    document.getElementById('productInfoModal'),
    {}
  );   */

  const prdID = document.getElementById(`${prdId}`);
  if (prdID != null) {
    //console.log(`Found ${prdId}`);

    var productInfoAnchors = document.querySelectorAll(`#${prdId}`);

    if (productInfoAnchors.length > 0) {
      //console.log(`Length ${prdId} ${productInfoAnchors.length}`);

      productInfoAnchors.forEach(item => {
        //console.log(item);
        item.addEventListener('click', event => {
          //console.log('Clicked');
          event.stopImmediatePropagation();

          var url = '/products/' + item.getAttribute('product-handle') + '.js';

          fetch(url)
            .then(resp => resp.json())
            .then(function (data) {
              //console.log(data);

              const modalSelectElement =
                document.getElementById('modalItemID') || false;

              if (modalSelectElement) {
                modalSelectElement.addEventListener('click', e =>
                  varModalSelectChange(e, data)
                );
                modalSelectElement.addEventListener('change', e =>
                  varModalSelectChange(e, data)
                );
                modalSelectElement.addEventListener('focus', e =>
                  varModalSelectChange(e, data)
                );
              }

              let productDescArr = data.description.split('$$$$$$');
              let productDesc;
              if (productDescArr.length > 1) {
                productDesc = productDescArr[0];
              } else {
                productDesc = truncate(productDescArr[0], 20);
              }
              let prdBadge = ``;
              let finalsaletag = '';

              if (data.tags.includes('Final Sale')) {
                finalsaletag = ` - FINAL SALE*`;
              }

              if (data.tags.includes('Special')) {
                prdBadge = `<div><svg class="star-badge" style="top:18px; left:18px!important;z-index:2001;"><svg xmlns="http://www.w3.org/2000/svg" id="star-badge"  height="30" width="24" fill="#D1B000" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg></svg></div>`;
                /*iconstyle = ``;*/
              } else {
                /*iconstyle = `style="transform: translateX(-40px);"`;*/
              }

              if (data.tags.includes('Award')) {
                if (data.tags.includes('Special')) {
                  prdBadge += `<div><svg class="award-badge" style="top:18px;left:50px!important;z-index:2001;"><svg xmlns="http://www.w3.org/2000/svg" id="award-badge" height="30" width="24" fill="#005BEA" class="bi bi-award-fill" viewBox="0 0 16 16">
                  <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/>
                  <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                </svg></svg></div>`;
                } else {
                  prdBadge += `<div><svg class="award-badge" style="top:18px;left:18px!important;z-index:2001;"><svg xmlns="http://www.w3.org/2000/svg" id="award-badge" height="30" width="24" fill="#005BEA" class="bi bi-award-fill" viewBox="0 0 16 16">
                <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/>
                <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
              </svg></svg></div>`;
                }
              } else {
                /* do nothing*/
              }

              let prd_variant = item.getAttribute('variant') || false;
              let prd_badge = item.getAttribute('product-badge') || false;
              let prd_badge_tag;

              if (prd_badge) {
                prd_badge_tag = `<span>   </span><span class="badge rounded-0 badge-text">${prd_badge}</span>`;
              } else {
                prd_badge_tag = '';
              }

              //let productFeaturedImg = data.featured_image.split('?');
              //if (productFeaturedImg.length > 0) {
              //  document.getElementById('productInfoImg').style = `background: url(${productFeaturedImg[0]});`;
              //}

              document.getElementById('productInfoImg').src =
                data.featured_image;
              //const modalimg = document.getElementById('modalimgcol');
              //modalimg.style.background = `url(${data.featured_image}) no-repeat center center`;
              //modalimg.style.backgroundSize = "100%";

              document.getElementById('productInfoTitle').innerHTML =
                data.title + finalsaletag + prd_badge_tag;

              let from = '';
              if (data.price_varies) from = 'from ';

              let prdPrice = formatCurrency(+data.price / 100);
              let prdComparePrice = formatCurrency(
                +data.compare_at_price_max / 100
              );

              if (data.compare_at_price_max > 0) {
                let pctDiscount =
                  ((+data.compare_at_price_max / 100 - +data.price / 100) /
                    (+data.compare_at_price_max / 100)) *
                  100;
                //console.log(pctDiscount);
                document.getElementById(
                  'productInfoPrice'
                ).innerHTML = `${pctDiscount.toFixed(
                  0
                )}%<svg class="tag-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" fill="#DF362D" class="bi bi-tag-fill" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></svg><del><span style="color: #DF362D;">${prdComparePrice}</span></del> ${from}${prdPrice}`;
              } else {
                document.getElementById('productInfoPrice').innerHTML =
                  item.getAttribute('product-price');
              }
              document.getElementById('productInfoDescription').innerHTML =
                productDesc;
              document.getElementById('badge').innerHTML = prdBadge;

              // var variantOldOptions = document.querySelectorAll(
              //   '#modalItemID option'
              // );
              // console.log(variantOldOptions.length);
              // variantOldOptions.forEach(e => {
              //   console.log('removing:');
              //   console.log(e);
              //   e.remove();
              // });

              let variants = data.variants;
              let variantSelect = document.getElementById('modalItemID');

              variantSelect.innerHTML = '';

              var available = 0;

              variants.forEach(function (variant, index) {
                //console.log(variant);
                //console.log(prd_variant);
                var varPrice = formatCurrency1(variant.price / 100);
                var varOldPrice = formatCurrency1(
                  variant.compare_at_price / 100
                );
                if (variant.available == true) {
                  available++;
                  if (
                    +variant.compare_at_price / 100 > 0 &&
                    +variant.compare_at_price > +variant.price
                  ) {
                    var itemDesc =
                      variant.title +
                      ' (was ' +
                      varOldPrice +
                      ') - now ' +
                      varPrice;
                  } else {
                    var itemDesc = variant.title + ' : ' + varPrice;
                  }

                  let optionItem = new Option(itemDesc, variant.id);

                  if (
                    variants.length == 1 &&
                    variants[0].title == 'Default Title'
                  ) {
                    //console.log('Only variant');

                    variantSelect.options[variantSelect.options.length] =
                      optionItem;
                    optionItem.selected = true;
                    variantSelect.style.display = 'none';
                  } else {
                    //console.log(prd_variant.toString());
                    //console.log(variant.id.toString());
                    if (prd_variant.toString() === variant.id.toString()) {
                      console.log('Match');

                      variantSelect.options[variantSelect.options.length] =
                        optionItem;

                      optionItem.selected = true;
                      //optionItem.setAttribute('selected', 'selected');
                    } else {
                      variantSelect.options[variantSelect.options.length] =
                        new Option(itemDesc, variant.id);
                    }
                  }
                } else {
                  variantSelect.options[variantSelect.options.length] =
                    new Option(variant.option1, variant.id).setAttribute(
                      'disabled',
                      true
                    );
                }
              });

              if (variants.length > 1) {
                variantSelect.style.display = 'inline';
                //console.log('inline');
              }

              const btnAdd = document.getElementById('btnAddToCart');
              var text = btnAdd.firstChild;

              if (available == 0) {
                btnAdd.disabled = true;
                text.data = 'Sold Out';
              } else {
                btnAdd.disabled = false;
                text.data = 'Add to Cart';
              }

              if (myModalEl.classList.contains('modalfade')) {
                myModalEl.classList.remove('modalfade');
                myModalEl.classList.add('modalfade1');
              } else {
                myModalEl.classList.remove('modalfade1');
                myModalEl.classList.add('modalfade');
              }

              productModal.show();
              checkModalScrollable();
              let element = document.getElementById('btnAddToCart');
              element.scrollIntoView(true);
            });
        });
      });
    } else {
      //console.log('Zero length productInfoAnchors');
    }
  } else {
    //console.log(`No ProductInfoAnchor ${prdId}`);
  }
}

const modalAddToCartForm = document.querySelector('#addToCartForm');

if (modalAddToCartForm != null) {
  //   const myModalEl = document.querySelector('#productInfoModal')
  //   if (myModalEl != null ) {
  //     // Returns a Bootstrap modal instance
  //   var productModal = bootstrap.Modal.getOrCreateInstance(myModalEl)
  //   }

  //console.log(modalAddToCartForm);
  modalAddToCartForm.addEventListener('submit', function (e) {
    e.preventDefault();
    //console.log('ITEM ID ' + document.getElementById('modalItemID').value);
    //console.log('Value ' + document.getElementById('modalItemQuantity').value);
    let formData = {
      items: [
        {
          id: document.getElementById('modalItemID').value,
          quantity: document.getElementById('modalItemQuantity').value,
        },
      ],
    };
    //console.log(formData);

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(resp => resp.json())
      .then(function (data) {
        //console.log(data);

        if (data.status == 422) {
          console.log('Cannot Add this Product : ' + data.description);
          productModal.hide();
          throw AddtoCartErr();
        } else {
          //console.log(data);
          productModal.hide();
          //AddtoCartSuccess(data.items[0].product_title);
          bumpCart();
        }
      })
      .catch(err => {
        console.log('Error:' + err);
        productModal.hide();
        AddtoCartErr();
      })
      .then(() => {
        // productModal.hide();
      })
      .finally(function () {
        update_cart();
      });
  });
}

// for ADD TO CART in Prd Templ
const fmAddToCart = document.querySelector('#addToCartFormTmpl');

if (fmAddToCart != null) {
  //   const myModalEl = document.querySelector('#productInfoModal')
  //   if (myModalEl != null ) {
  //     // Returns a Bootstrap modal instance
  //   var productModal = bootstrap.Modal.getOrCreateInstance(myModalEl)
  //   }

  //console.log(modalAddToCartForm);
  fmAddToCart.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('ITEM ID ' + document.getElementById('productSelect').value);
    console.log('Value ' + document.getElementById('fmItemQuantity').value);
    let formOrderData = {
      items: [
        {
          id: document.getElementById('productSelect').value,
          quantity: document.getElementById('fmItemQuantity').value,
        },
      ],
    };
    //console.log(formData);

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formOrderData),
    })
      .then(fmresp => fmresp.json())
      .then(function (fmdata) {
        //console.log(data);

        if (fmdata.status == 422) {
          console.log('Cannot Add this Product : ' + fmdata.description);
          throw AddtoCartErr();
        } else {
          //console.log(data);
          //AddtoCartSuccess(data.items[0].product_title);
          bumpCart();
        }
      })
      .catch(err => {
        console.log('Error:' + err);
        AddtoCartErr();
      })
      .then(() => {})
      .finally(function () {
        update_cart();
      });
  });
}

const AddtoCartErr = function () {
  //productModal.hide();
  setTimeout(() => {
    backToTop();
  }, 5);

  const toastEl = toastErr();
  document.body.appendChild(toastEl);
  const myToast = new Toast(toastEl);
  myToast.show();
};

const AddtoCartSuccess = function (item) {
  //productModal.hide();
  setTimeout(() => {
    backToTop();
  }, 5);
  const toastEl = toastSuccess(item);
  document.body.appendChild(toastEl);
  const myToast = new Toast(toastEl);
  myToast.show();
};

const { Toast } = bootstrap;

const htmlMarkup = `
  <div aria-atomic="true" aria-live="assertive" class="toast position-absolute end-0 top-0 m-3 bg-light border-0" style="z-index: 9999;" role="alert" id="myAlert">
      <div class="toast-header text-white bg-success">
            <h6 class="me-auto">Success</h6>            
      </div>`;

const htmlMarkupErr = `
  <div aria-atomic="true" aria-live="assertive" class="toast position-absolute end-0 top-0 m-3 bg-light border-0" style="z-index: 9999;" role="alert" id="myAlertErr">
      <div class="toast-header text-white bg-danger">
            <h6 class="me-auto">Attention</h6>            
      </div>
      <div class="toast-body">
          Item was NOT added to Cart. Probably Out of Stock
      </div>
  </div>
`;

function toastSuccess(item) {
  var template = document.createElement('template');
  var html = htmlMarkup.trim();
  html += `
  <div class="toast-body">
  <strong>${item}</strong> : added to Cart
  </div>
  </div>`;
  template.innerHTML = html;
  return template.content.firstChild;
}

// results returns no item data if error, no need parameter
function toastErr() {
  var templateErr = document.createElement('template');
  var html = htmlMarkupErr.trim();
  templateErr.innerHTML = html;
  return templateErr.content.firstChild;
}

function formatCurrency1(amount) {
  var ccyTemp = parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  //remove trailing zeros
  var ccyFormated =
    ccyTemp.slice(-3) === '.00'
      ? ccyTemp.slice(0, -3)
      : ccyTemp.slice(-1) === '0'
      ? ccyTemp.slice(0, -1)
      : ccyTemp;
  return ccyFormated;
}

/* end of checkProductAnchors */
function bumpCart() {
  let carticon = document.getElementById('cart-icon') || false;
  if (carticon) {
    carticon.classList.add('bump');
  }

  setTimeout(() => {
    carticon.classList.remove('bump');
  }, 4000);
}

function update_cart() {
  fetch('/cart.js')
    .then(resp => resp.json())
    .then(data => {
      //console.log(data);
      var numberofItems = document.getElementById('numberOfCartItems') || false;

      if (numberofItems) {
        numberofItems.innerHTML = data.item_count;

        if (data.item_count > 0) {
          numberofItems.classList.remove('bg-light');
          numberofItems.classList.add('bg-danger');
          numberofItems.classList.remove('d-none');
        } else {
          numberofItems.classList.add('bg-light');
          numberofItems.classList.remove('bg-danger');
          numberofItems.classList.add('d-none');
        }
      }
    })
    .catch(err => console.log(err));
}

//
var predictiveSearchInput =
  document.getElementById('searchInputField') || false;
var timer;
var offcanvasSearch = document.getElementById('offcanvasSearchResult') || false;

if (offcanvasSearch) {
  var bsOffcanvas = new bootstrap.Offcanvas(offcanvasSearch);

  offcanvasSearchResult.addEventListener('hidden.bs.offcanvas', function () {
    predictiveSearchInput.value = ``;
  });
}

if (predictiveSearchInput) {
  predictiveSearchInput.addEventListener('input', function (e) {
    //console.log(predictiveSearchInput.value);

    clearTimeout(timer);
    if (predictiveSearchInput.value) {
      timer = setTimeout(fetchPredictiveSearch, 3000);
    }
  });
}

function fetchPredictiveSearch() {
  fetch(
    `/search/suggest.json?q=${predictiveSearchInput.value}&resources[type]=product`
  )
    .then(resp => resp.json())
    .then(data => {
      //console.log(data);

      var products = data.resources.results.products;
      document.getElementById('search_results_body').innerHTML = ``;

      products.forEach(function (product, index) {
        var productPrice = formatCurrency(product.price);
        //console.log(productPrice);

        if (product.image != null) {
          var productImage = product.image;
        } else {
          var productImage = '';
        }

        document.getElementById('search_results_body').innerHTML += `
        <div class="col my-2">
          <div class="card d-flex flex-fill shadow-sm border-0">
            <div class="row d-flex flex-fill">
              <div class="col bg-light"><a href="${product.url}">
                <img src="${productImage}" class="card-img-top d-flex" style="max-height:150px;max-width:150px;"></a>
              </div>
              <div class="col bg-light">
                <div class="row my-0 pt-4 bg-light">                      
                  <div class="card-body py-0 bg-light">
                    <h6 class="card-title">                    
                    <a class="text-product-link" href="${product.url}">${product.title}</a></h6>                    
                  </div>
                </div>  
                <div class="row my-0 py-0 bg-light">
                  <div class="card-body py-0 bg-light">      
                    <p class="card-text">${productPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      });
    });
  bsOffcanvas.show();
}

function formatCurrency(amount) {
  var ccyTemp = parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  //remove trailing zeros
  var ccyFormated =
    ccyTemp.slice(-3) === '.00'
      ? ccyTemp.slice(0, -3)
      : ccyTemp.slice(-1) === '0'
      ? ccyTemp.slice(0, -1)
      : ccyTemp;
  return ccyFormated;
}

function varModalSelectChange(e, data) {
  //in liquid
  //const json_product = {{ product | json }};
  //console.log(json_product);

  //console.log(data);

  const value = e.target.value;
  //const text = SelectElement.options[SelectElement.selectedIndex].text;
  let variantresult = data.variants.find(({ id }) => id === +value);

  if (variantresult) {
    let variant_img_id =
      variantresult.featured_image === null
        ? false
        : variantresult.featured_image.id;

    if (variant_img_id) {
      //console.log(variant_img_id);
      document.getElementById('productInfoImg').src =
        variantresult.featured_image.src;
    }

    if (value) {
      //console.log(variantresult);

      const curr_price = +variantresult.price / 100;
      const variantPrice = formatCurrency(+variantresult.price / 100);
      const compare_price = +variantresult.compare_at_price / 100;
      const variantComparePrice = formatCurrency(
        +variantresult.compare_at_price / 100
      );
      const savings = (
        ((compare_price - curr_price) / compare_price) *
        100
      ).toFixed(0);

      if (
        +variantresult.compare_at_price > 0 &&
        +variantresult.compare_at_price > +variantresult.price
      ) {
        var pricetag = `${savings}% <svg class="tag-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" fill="#DF362D" class="bi bi-tag-fill" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></svg>
      <del><span style="color: #AB0000;">${variantComparePrice}</span></del> ${variantPrice}`;
      } else {
        var pricetag = `${variantPrice}`;
      }

      document.getElementById('productInfoPrice').innerHTML = pricetag;
    }
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/* PRD GALLERY */
const galleryID = document.querySelectorAll('.swiper-gallery');
//console.log(galleryID);

//multiply delay by random number
const galleryFirstSlide = getRandomIntInclusive(1, 4);

galleryID.forEach(el => {
  //console.log(el);
  const uniqID = el.getAttribute('unique-id');
  const autoplay = el.getAttribute('autoplay');
  const playdelay = el.getAttribute('delay');
  let autoplayAttr = {};
  if (autoplay == 'true') {
    autoplayAttr = {
      delay: +playdelay * galleryFirstSlide,
      disableOnInteraction: true,
    };
  } else {
    autoplayAttr = false;
  }

  const slideNavigation = el.getAttribute('slide-navigation');
  //console.log(slideNavigation);
  const swiperName = el.id;
  const swiperTemp = document.querySelector(`#${swiperName}`);
  //console.log(swiperTemp);
  const children = swiperTemp.children;
  //console.log(children);
  if (slideNavigation == 'false') {
    Array.from(children).forEach(item => {
      // item.style.display = "inline-block";
      //console.log(item);
      if (item.classList.contains('swiper-button-prev')) {
        item.classList.add('d-none');
      }
      if (item.classList.contains('swiper-button-next')) {
        item.classList.add('d-none');
      }
    });
  }

  //use stopImmediatepropagation in productinfo modal
  const $swiperName = new Swiper(`#${swiperName}`, {
    loop: true,
    autoplay: autoplayAttr,
    preloadImages: false,
    preventClicksPropagation: true,
    preventClicks: true,
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    mousewheel: {
      invert: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 4,
      },
      1024: {
        slidesPerView: 5,
      },
    },
    spaceBetween: 25,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});

/* HERO SLIDER */
const sliderID = document.querySelectorAll('.heroswiper-gallery');
//console.log(sliderID);

const sliderFirstSlide = getRandomIntInclusive(1, 3);

sliderID.forEach(el => {
  const uniqID = el.getAttribute('unique-id');
  const swiperName = el.id;
  const slideEffect = el.attributes['effect'].value;
  const slideSpeed = el.attributes['speed'].value;
  const slideDelay = el.attributes['delay'].value;

  const $swiperName = new Swiper(`#${swiperName}`, {
    parallax: true,
    speed: +slideSpeed,
    effect: slideEffect,
    initialSlide: sliderFirstSlide,
    autoplay: {
      delay: +slideDelay,
      disableOnInteraction: true,
    },
    pagination: {
      el: `.swiper-pagination-${uniqID}`,
      type: 'custom',
      renderCustom: function (swiper, current, total) {
        return (
          ' <span class="h2">' +
          ('0' + current).slice(-2) +
          '</span> ' +
          ' <span class="swiper-divider">/</span> ' +
          ' <span class="text-muted">' +
          ('0' + total).slice(-2)
        );
        +'</span> ';
      },
    },
  });
});

function checkModalScrollable() {
  const isScrollable = function (ele) {
    // Compare the height to see if the element has scrollable content
    const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

    // It's not enough because the element's `overflow-y` style can be set as
    // * `hidden`
    // * `hidden !important`
    // In those cases, the scrollbar isn't shown
    const overflowYStyle = window.getComputedStyle(ele).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

    return hasScrollableContent && !isOverflowHidden;
  };
  const thePrdModal = document.querySelector('.modal-body');
  const theAtcModal = document.querySelector('#addToCartForm');
  if (isScrollable(thePrdModal)) {
    //console.log("scrollable");
  } else {
    //console.log("Non scrollable, remove touch");
    thePrdModal.classList.add('modal-no-touch');
    theAtcModal.classList.add('modal-no-touch');
  }
}

function disableDocumentScrolling() {
  if (document.documentElement.style.position != 'fixed') {
    // Get the top vertical offset.
    var topVerticalOffset =
      typeof window.pageYOffset != 'undefined'
        ? window.pageYOffset
        : document.documentElement.scrollTop
        ? document.documentElement.scrollTop
        : 0;
    // Set the document to fixed position (this is the only way around IOS' overscroll "feature").
    document.documentElement.style.position = 'fixed';
    // Set back the offset position by user negative margin on the fixed document.
    document.documentElement.style.marginTop = '-' + topVerticalOffset + 'px';
  }
}

function enableDocumentScrolling() {
  if (document.documentElement.style.position == 'fixed') {
    // Remove the fixed position on the document.
    document.documentElement.style.position = null;
    // Calculate back the original position of the non-fixed document.
    var scrollPosition =
      -1 * parseFloat(document.documentElement.style.marginTop);
    // Remove fixed document negative margin.
    document.documentElement.style.marginTop = null;
    // Scroll to the original position of the non-fixed document.
    window.scrollTo(0, scrollPosition);
  }
}
