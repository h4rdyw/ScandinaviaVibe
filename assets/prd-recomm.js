function getPrdRecommendations(prd) {
  //var productRecommendationBody = document.getElementById('product_recommendation_body');
  fetch(`/recommendations/products.json?product_id=${prd}`)
    .then(resp => resp.json())
    .then(({ products }) => {
      var arrProducts = Array.from(products);
      //console.log(arrProducts);
      //add eventlistener, later to be dispatched when new element build (product recommendation) completed
      arrProducts.forEach(function (el) {
        //console.log(el);
        document.addEventListener('dispatchPrd', function (event) {
          //console.log(`registering productInfoAnchor ${el.id}`);
          getProductAnchors(`productInfoAnchor-${el.id}`);
        });
      });

      //console.log(products);
      if (products.length > 0) {
        /* element 
                  <div class="container">
                      <section id="product_recommendation" class="row content-justify-center my-5">
                          <div class="text-center"><h1>Also in store</h1></div>
                          <div class="row d-flex g-3 row-cols-lg-6 row-cols-md-4 row-cols-sm-3 row-cols-2 py-2" id="product_recommendation_body"></div>
                      </section>
                  </div>
              */

        const htmlMarkup = `
                   <section id="product_recommendation" class="content-justify-center my-5">
                      <div class="text-center"><h1>Also in store</h1></div>
                      <div class="d-flex flex-wrap g-3 row row-cols row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-3 row-cols-2 py-2" id="product_recommendation_body">
              `;

        html = htmlMarkup.trim();
        var productRecomm = document.createElement('div');
        productRecomm.className = 'container';

        products.forEach(function (item, index) {
          //console.log(item);
          arrProducts[item] = `productInfoAnchor-${item.id}`;

          if (
            +item.compare_at_price > 0 &&
            +item.compare_at_price > +item.price
          ) {
            const itemsavings = (
              ((+item.compare_at_price - item.price) / item.compare_at_price) *
              100
            ).toFixed(0);
            //console.log("Item Saving :" + itemsavings);

            var savingspct = `${itemsavings}%`;
          } else {
            var savingspct = ``;
          }

          let prdPrice = formatCcy(+item.price / 100);
          let prdPriceMin = formatCcy(+item.price_min / 100);
          let prdComparePrice = formatCcy(+item.compare_at_price_max / 100);
          let from = '';
          let finalsaletag = '';

          if (item.price_varies) from = `from `;

          if (item.tags.includes('Final Sale')) finalsaletag = 'FINAL SALE*';

          var cardRecomm, iconstyle;

          cardRecomm = `<div class="col d-flex">`;
          cardRecomm += `<div class="img-wrapper d-flex">`;
          cardRecomm += `<div class="card d-flex flex-fill border-0 shadow-sm">`;

          if (item.images.length > 0) {
            cardRecomm += `<div class="inner-img">`;
            cardRecomm += `<a href="javascript:;"   id="productInfoAnchor-${item.id}" product-handle="${item.handle}" 
                          product-price="${from} ${prdPrice}"><img class="card-img-top" width="240" height="240" src="${item.images[0]}" loading="lazy" alt="${item.title}"></a>`;

            if (item.available) {
              cardRecomm += `<div class="text-hover"><svg class="heart-badge" alt="quick shop">{% render 'icon-bag' %}</svg></br>QUICK SHOP</div></div>`;
            } else {
              cardRecomm += `<div class="text-hover">SOLD OUT</div></div>`;
            }
          }
          cardRecomm += `<div class="card-body d-flex flex-column justify-content-end text-center bg-light pb-1">`;
          cardRecomm += `<p class="text-product-title"><a class="text-product-link" href="${item.url}">${item.title}</a></p>`;
          cardRecomm += `<p span class="text-line"></p>`;

          if (item.compare_at_price_max > 0) {
            cardRecomm += `<p>${finalsaletag} ${savingspct} <svg class="tag-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" fill="#DF362D" class="bi bi-tag-fill" viewBox="0 0 16 16"><path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></svg><del><span style="color: #AB0000;">${prdComparePrice}</span></del> ${from} ${prdPrice}</p>`;
          } else {
            cardRecomm += `<p>${from} ${prdPriceMin}</p>`;
          }

          cardRecomm += `<button type="button" aria-label="Add to wishlist" class="wishlist-badgeleft" button-wishlist btn-from-js data-product-handle="${item.handle}"><svg class="icon"><svg xmlns="http://www.w3.org/2000/svg" id="heart-badge" height="24" width="24"  class="bi bi-heart-fill" viewBox="0 -2 
            16 24">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg></svg></button>`;

          if (item.tags.includes('Special')) {
            cardRecomm += `<div><svg class="star-badge" style="top:18px; left:18px!important;"><svg xmlns="http://www.w3.org/2000/svg" id="star-badge"  height="30" width="24" fill="#D1B000" class="bi bi-star-fill" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg></svg></div>`;
            iconstyle = `style="top:18px;left:50px!important;"`;
          } else {
            iconstyle = `style="top:18px;left:50px!important;transform: translateX(-35px);"`;
          }

          if (item.tags.includes('Award')) {
            cardRecomm += `<div><svg class="award-badge" ${iconstyle}><svg xmlns="http://www.w3.org/2000/svg" id="award-badge" height="30" width="24" fill="#005BEA" class="bi bi-award-fill" viewBox="0 0 16 16">
              <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/>
              <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
            </svg></svg></div>`;
          }

          cardRecomm += `</div></div></div></div>`;

          html += cardRecomm;
        });

        html += `</div></section>`;

        productRecomm.innerHTML = html;

        //insert element after "product_details"
        const reference = document.getElementById('prd_recomm');
        reference.after(productRecomm);
        //document.body.appendChild(productRecomm);

        // var wishlistSnippet = document.createElement('div');
        // wishlistSnippet.className = 'snippet-wishlist';

        // wishlistcard = `<button type="button" aria-label="Add to wishlist" class="wishlist-badge" button-wishlist data-product-handle="{{product.handle}}"><svg class="icon"><svg xmlns="http://www.w3.org/2000/svg" id="heart-badge" height="24" width="24"  class="bi bi-heart-fill" viewBox="0 -2
        // 16 24"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg></svg></button>`;

        // wishlistSnippet.innerHTML = wishlistcard;

        // const referenceTitle = document.getElementById('qty-part');
        // referenceTitle.after(wishlistSnippet);

        // Create a custom event and dispatch to setup PopUp Modal
        let myEvent = new CustomEvent('dispatchPrd', {
          bubbles: true,
          cancelable: true,
        });

        setTimeout(() => {
          const body = document.body;
          document.dispatchEvent(myEvent);
          initButtons();
        }, 2);

        clearTimeout();
      }
    });
}
