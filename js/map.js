'use strict';

(function () {
  var PIN_TIP_HEIGHT = 19;
  var URL = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    SAVE: 'https://js.dump.academy/keksobooking'
  };
  var map = document.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var mapSection = document.querySelector('.map');
  var newOfferForm = document.querySelector('.ad-form');
  var addressInput = newOfferForm.querySelector('#address');
  var mapFilterContainer = document.querySelector('.map__filters-container');

  var isPageActive = false;
  var MAIN_PIN_DEFAULT = 'left: 570px;' + 'top: 375px;';

  var activatePage = function () {
    mapSection.classList.remove('map--faded');
    newOfferForm.classList.remove('ad-form--disabled');
    newOfferForm.querySelectorAll('fieldset, input, select').forEach(function (elem) {
      elem.disabled = false;
    });
    mapFilterContainer.querySelectorAll('fieldset, input, select').forEach(function (elem) {
      elem.disabled = false;
    });
    if (!isPageActive) {
      appendPins();
    }

    isPageActive = true;
  };

  var deactivatePage = function () {
    mapSection.classList.add('map--faded');
    newOfferForm.classList.add('ad-form--disabled');
    newOfferForm.querySelectorAll('fieldset, input, select').forEach(function (elem) {
      elem.disabled = true;
    });
    mapFilterContainer.querySelectorAll('fieldset, input, select').forEach(function (elem) {
      elem.disabled = true;
    });
    if (document.querySelectorAll('.map__pin:not(.map__pin--main)')) {
      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (elem) {
        elem.remove();
      });
    }
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').remove();
    }
    document.querySelector('.map__pin--main').style.cssText = MAIN_PIN_DEFAULT;
    newOfferForm.reset();
    getAddress();
    isPageActive = false;
  };

  var onMouseMove = function (moveEvt) {
    var coordsLimits = {
      x: {
        min: map.getBoundingClientRect().left,
        max: map.getBoundingClientRect().right
      },
      y: {
        min: map.getBoundingClientRect().top,
        max: map.getBoundingClientRect().bottom
      }
    };

    moveEvt.preventDefault();

    var currentX = Math.max(coordsLimits.x.min + mainPin.offsetWidth / 2, Math.min(coordsLimits.x.max - mainPin.offsetWidth / 2, moveEvt.pageX));
    var currentY = Math.max(coordsLimits.y.min + mainPin.offsetHeight, Math.min(coordsLimits.y.max - mainPin.offsetHeight, moveEvt.pageY));
    mainPin.style.left = currentX - coordsLimits.x.min - mainPin.offsetWidth / 2 + 'px';
    mainPin.style.top = currentY - mainPin.offsetHeight / 2 + 'px';
    getAddress();
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    getAddress();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  var dragHandler = function (evt) {
    evt.preventDefault();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var getAddress = function () {
    var yPointer = isPageActive ? mainPin.offsetHeight + PIN_TIP_HEIGHT : mainPin.offsetHeight / 2;
    var xCoord = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
    var yCoord = Math.round(mainPin.offsetTop + yPointer);
    addressInput.value = xCoord + ', ' + yCoord;
  };

  var appendPins = function () {
    window.backend.load(URL.LOAD, function (data) {
      var fragment = document.createDocumentFragment();
      var pins = window.pin.renderPins(data);

      for (var i = 0; i < pins.length; i++) {
        fragment.appendChild(pins[i]);
      }
      map.appendChild(fragment);
    }, window.backend.onError);
  };

  var initPage = function () {
    deactivatePage();
    getAddress();
  };

  mainPin.addEventListener('mousedown', function (evt) {
    activatePage();
    dragHandler(evt);
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.card.KeyCodes.ENTER) {
      activatePage();
      dragHandler(evt);
    }
  });

  initPage();

  window.map = {
    newOfferForm: newOfferForm,
    mapFilterContainer: mapFilterContainer,
    deactivatePage: deactivatePage,
    URL: URL
  };
})();
