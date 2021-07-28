// Put your application javascript here
if( document.getElementById('sort_by') != null ) {

document.querySelector('#sort_by').addEventListener('change', function (e) {
  var url = new URL(window.location.href);
  url.searchParams.set('sort_by', e.currentTarget.value);
  window.location = url.href;
});

};

if ( document.getElementById('AddressCountryNew') != null ) {
  document.getElementById('AddressCountryNew').addEventListener('change', function(e) {
    var province = this.options[this.selectedIndex].getAttribute('data-provinces');
    var provinceSelector = document.getElementById('AddressProvinceNew');
    var provinceArray = JSON.parse(province);
    console.log(provinceArray);

    if (provinceArray.length < 1) {
      provinceSelector.setAttribute('disabled', 'disabled');
    } else {
      provinceSelector.removeAttribute('disabled');
    }
    provinceSelector.innerHTML = '';
    var options = '';
    for (var i = 0; i < provinceArray.length; i++) {
      options += '<option value="' + provinceArray[i][0] + '">' + provinceArray[i][0] + '</option>';
    }
    provinceSelector.innerHTML = options;

  });
}

if (document.getElementById('forgotPassword') != null ) {
  document.getElementById('forgotPassword').addEventListener('click', function(e) {
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

var localeItems = document.querySelectorAll("#localeItem");
if (localeItems.length > 0) {
  localeItems.forEach(item=> {
      item.addEventListener('click', event => {
          document.getElementById("localeCode").value = item.getAttribute('lang')
          document.getElementById("localization_form_tag").submit();
      });
  });
}