'use strict';

(function () {
  var HousingTypeToPrice = {
    FLAT: '1000',
    BUNGALO: '0',
    HOUSE: '5000',
    PALACE: '10000'
  };
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var submitBtn = window.map.newOfferForm.querySelector('.ad-form__submit');
  var roomInput = window.map.newOfferForm.querySelector('#room_number');
  var guestsInput = window.map.newOfferForm.querySelector('#capacity');
  var timein = window.map.newOfferForm.querySelector('#timein');
  var timeout = window.map.newOfferForm.querySelector('#timeout');
  var appartmentType = window.map.newOfferForm.querySelector('#type');
  var appartmentPrice = window.map.newOfferForm.querySelector('#price');
  var avatarInput = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview');
  var apartmentInput = document.querySelector('.ad-form__input');
  var apartmentPhotoPreview = document.querySelector('.ad-form__photo');

  var validateGuestsAndRooms = function () {
    var rooms = roomInput.value;
    var guests = guestsInput.value;

    switch (rooms) {
      case '1':
        if (guests === '1') {
          return '';
        }
        return '1 комната только для 1 гостя';
      case '2':
        if (guests === '1' || guests === '2') {
          return '';
        }
        return '2 комнаты только для 1 или 2 гостей';
      case '3':
        if (guests === '1' || guests === '2' || guests === '3') {
          return '';
        }
        return '3 комнаты только для 1, 2 или 3 гостей';
      case '100':
        if (guests === '0') {
          return '';
        }
        return '100 комнат не для гостей';
    }
    return '';
  };

  var syncTimeIn = function () {
    timein.value = timeout.value;
  };

  var syncTimeOut = function () {
    timeout.value = timein.value;
  };

  var onRoomsOrGuestsInput = function () {
    roomInput.setCustomValidity(validateGuestsAndRooms());
  };

  var getPriceForAppartment = function () {
    appartmentPrice.placeholder = HousingTypeToPrice[appartmentType.value.toUpperCase()];
    appartmentPrice.min = parseInt(HousingTypeToPrice[appartmentType.value.toUpperCase()], 10);
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === window.card.KeyCodes.ESC) {
      closeMsg();
    }
  };

  var closeMsg = function () {
    document.querySelector('.success').remove();
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', closeMsg);
  };

  var showSuccessMsg = function () {
    var successTemplate = document.querySelector('#success')
      .content;
    var success = successTemplate.cloneNode(true);
    var successBody = success.querySelector('.success');
    document.body.insertAdjacentElement('afterbegin', successBody);
    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', closeMsg);
  };

  var removeImages = function () {
    avatarPreview.querySelector('img').src = 'img/muffin-grey.svg';
    apartmentPhotoPreview.textContent = '';
  };

  var appendImage = function (reader, preview) {
    var img = document.createElement('img');
    img.src = reader.result;
    img.height = 100;
    preview.appendChild(img);
  };

  var onFileUpload = function (input, preview, appendItems) {
    return function () {
      var file = input.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (item) {
        return fileName.endsWith(item);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          if (appendItems && preview.querySelector('img')) {
            appendImage(reader, preview);
          } else if (!preview.querySelector('img')) {
            appendImage(reader, preview);
          } else {
            preview.querySelector('img').src = reader.result;
          }
        });

        reader.readAsDataURL(file);
      }
    };
  };

  roomInput.addEventListener('change', onRoomsOrGuestsInput);
  guestsInput.addEventListener('change', onRoomsOrGuestsInput);
  timein.addEventListener('change', syncTimeOut);
  timeout.addEventListener('change', syncTimeIn);
  appartmentType.addEventListener('change', getPriceForAppartment);
  submitBtn.addEventListener('click', function () {
    onRoomsOrGuestsInput();
  });

  window.map.newOfferForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(window.map.Url.SAVE, new FormData(window.map.newOfferForm), function () {
      window.map.deactivatePage();
      showSuccessMsg();
    }, window.backend.onError);
  });

  window.map.newOfferForm.addEventListener('reset', function () {
    removeImages();
  });

  apartmentInput.addEventListener('change', onFileUpload(apartmentInput, apartmentPhotoPreview, true));
  avatarInput.addEventListener('change', onFileUpload(avatarInput, avatarPreview, false));

  window.form = {
    removeImages: removeImages
  };
})();
