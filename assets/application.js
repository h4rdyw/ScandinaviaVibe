// Put your application javascript here
'use strict';

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

/* adjust annoucement bar position */
var navBarCollapse = document.getElementById('navbarNav');
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

var myproductModal = document.getElementById('productInfoModal');
if (myproductModal != null) {
  myproductModal.addEventListener('hidden.bs.modal', function (event) {
    checkLocaleBtn();
  });

  myproductModal.addEventListener('shown.bs.modal', function (event) {
    checkLocaleBtn();
  });
}

function adjustAnnouncementBar() {
  var headerEl = document.getElementById('navBar');
  var headerHeight = headerEl.offsetHeight;
  /*var headerBoxShadow = window.getComputedStyle(headerEl).boxShadow;*/
  /*var headerBoxShadowY = +headerBoxShadow.split("px")[2].trim();    ;*/
  /*console.log('HeaderHeight:'+headerHeight);*/

  /*var x = document.getElementsByTagName("BODY")[0];
      console.log(x);*/
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

let mybutton = document.getElementById('btn-back-to-top');

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 1400 ||
    document.documentElement.scrollTop > 1400
  ) {
    mybutton.style.display = 'block';
  } else {
    mybutton.style.display = 'none';
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener('click', backToTop);

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

// Product POP UP MODAL
function getProductAnchors(prdId) {
  //console.log(prdId);

  /*
  var productModal = new bootstrap.Modal(
    document.getElementById('productInfoModal'),
    {}
  );   */

  if (document.getElementById(`${prdId}`) != null) {
    //console.log(`Found ${prdId}`);
    var productInfoAnchors = document.querySelectorAll(`#${prdId}`);

    if (productInfoAnchors.length > 0) {
      //console.log(`Length ${prdId} ${productInfoAnchors.length}`);

      productInfoAnchors.forEach(item => {
        //console.log(item);
        item.addEventListener('click', event => {
          //console.log('Clicked');
          var url = '/products/' + item.getAttribute('product-handle') + '.js';

          fetch(url)
            .then(resp => resp.json())
            .then(function (data) {
              //console.log(data);

              const modalSelectElement = document.getElementById('modalItemID');              

              modalSelectElement.addEventListener('click', e => varModalSelectChange(e,data));
              modalSelectElement.addEventListener('change', e => varModalSelectChange(e, data));

              
              const productDescArr = data.description.split('$$$$$$');

              // if (productDescArr.length > 1) {
              //   var productDesc = productDescArr[1];
              // } else {
              var productDesc = productDescArr[0];
              // }
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

              document.getElementById('productInfoImg').src = data.images[0];
              document.getElementById('productInfoTitle').innerHTML =
                data.title+finalsaletag;

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
                ).innerHTML = `<p>${pctDiscount.toFixed(
                  0
                )}%<svg class="tag-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" fill="#DF362D" class="bi bi-tag-fill" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></svg><del><span style="color: #DF362D;">${prdComparePrice}</span></del> ${from}${prdPrice}</p>`;
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

              var variants = data.variants;
              var variantSelect = document.getElementById('modalItemID');

              variantSelect.innerHTML = '';

              var available = 0;
              variants.forEach(function (variant, index) {
                //console.log(variant);
                var varPrice = formatCurrency1(variant.price / 100);
                var varOldPrice = formatCurrency1(
                  variant.compare_at_price / 100
                );
                if (variant.available == true) {
                  available++;
                  if (+variant.compare_at_price / 100 > 0 && (+variant.compare_at_price > +variant.price)  ) {
                    var itemDesc =
                      variant.title +
                      ' (was ' +
                      varOldPrice +
                      ') - now ' +
                      varPrice;
                  } else {
                    var itemDesc = variant.title + ' : ' + varPrice;
                  }

                  variantSelect.options[variantSelect.options.length] =
                    new Option(itemDesc, variant.id);
                } else {
                  variantSelect.options[variantSelect.options.length] =
                    new Option(variant.option1, variant.id).setAttribute(
                      'disabled',
                      true
                    );
                }
              });
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
            });
        });
      });
    } else {
      console.log('Zero length productInfoAnchors');
    }
  } else {
    console.log(`No ProductInfoAnchor ${prdId}`);
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
      document.getElementById('numberOfCartItems').innerHTML = data.item_count;

      var numberofItems = document.getElementById('numberOfCartItems');
      if (data.item_count > 0) {
        numberofItems.classList.remove('bg-light');
        numberofItems.classList.add('bg-danger');
        numberofItems.classList.remove('d-none');
      } else {
        numberofItems.classList.add('bg-light');
        numberofItems.classList.remove('bg-danger');
        numberofItems.classList.add('d-none');
      }
    })
    .catch(err => console.log(err));
}

//
var predictiveSearchInput = document.getElementById('searchInputField');
var timer;
var offcanvasSearch = document.getElementById('offcanvasSearchResult');
var bsOffcanvas = new bootstrap.Offcanvas(offcanvasSearch);

offcanvasSearchResult.addEventListener('hidden.bs.offcanvas', function () {
  predictiveSearchInput.value = ``;
});

if (predictiveSearchInput != null) {
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
  //const json_product = {{ product | json }};
  //console.log(json_product);

  const value = e.target.value;
  //const text = SelectElement.options[SelectElement.selectedIndex].text;
  let variantresult = data.variants.find(({ id }) => id === +value);

  let variant_img_id =
    variantresult.featured_image === null
      ? false
      : variantresult.featured_image.id;
      if (variant_img_id) {
        //console.log(variant_img_id);
        document.getElementById('productInfoImg').src = variantresult.featured_image.src;
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

    if (+variantresult.compare_at_price > 0 && +variantresult.compare_at_price > +variantresult.price ) {
      var pricetag = `${savings}% <svg class="tag-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" fill="#DF362D" class="bi bi-tag-fill" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></svg>
      <del><span style="color: #AB0000;">${variantComparePrice}</span></del> ${variantPrice}`;
    } else {
      var pricetag = `${variantPrice}`;
    }

    document.getElementById('productInfoPrice').innerHTML = pricetag;   
    
  
  }
}
  