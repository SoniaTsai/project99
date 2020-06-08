/*!
  * Bootstrap v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
  (global = global || self, factory(global.bootstrap = {}, global.jQuery));
}(this, function (exports, $) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  var TRANSITION_END = 'transitionend';
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        var hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }

      try {
        return document.querySelector(selector) ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = $(element).css('transition-duration');
      var transitionDelay = $(element).css('transition-delay');
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    },
    // TODO: Remove in v5
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    },
    findShadowRoot: function findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document


      if (typeof element.getRootNode === 'function') {
        var root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root


      if (!element.parentNode) {
        return null;
      }

      return Util.findShadowRoot(element.parentNode);
    }
  };
  setTransitionEndSupport();

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'alert';
  var VERSION = '4.3.1';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };
  var Event = {
    CLOSE: "close" + EVENT_KEY,
    CLOSED: "closed" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
    /**
     * ------------------------------------------------------���~����{������o���|������?�������~��������^�������~����������������o���~���������<���?���_z�s�}���_�u�}�K����������o�?����������������g������׿�?���������w���������������߽������$ǵ�����������������}����������������������}����Ͽ�_����_�����r����}�������y���������޾�������������������~�������������_����c��������������������ٺ�����������������7�����������o���G���;����_����������������o�����g>{�������}�����������~�������������}������Ͼ��{��������������������=�����������������ݴ?����|����������������������m��������W;�������t���w��Ϳ���w�;�_���G��������|��_������?���������w{�����~����������������������z�����������������?����?���m��������������z��oW�����������������o�J��޾�����?g������g���������������o���������{��}������{�����ݷ��������޿��˿������=�����߲��?�����o����s��������7�Ͻ�����������������������������=����������������������������������������������}����������������������������_�����}wV�������������ۿ����o���}�������������=�����������o���������������W��������}��������������;�����~�Ow������w��������߿�����?����?v����}���������^�{n�������n���}�����7������x�������������?��/T�������������{��o����_�����������5��������������֖k����������l����������<���������~����o������o���~�~=����������?Ǜ^ll��}��7O���ewx���?���ߏ������߿[��߿���w�N������o��w����?������������������e�����������ֿ���O�����������������_������?�����������������������������9���O���o��������O����?�w������������^�[�������?�����w���������������7����s��������������������}�����������������~�������������������������������}w����?�������������o�������������{{z���������������������������������|�����_��{�����������������>�����_���������o���������w��������������g�����������������������{B��������������������>�f��������_�����������������������������}��t�7���������Ͻ��������������_������mz����'����~�����������������������������?����������������߷_�m-w��y������������ﭭ��������}�������������������������{���nv���o�������������������������_�������|��k�߿����n������������������ͳW�N���������������k���{���������~�o���߿��������������˿������o����������������}���;�?����?�������m�����?���}�������W�����������������_��w�������s�{÷������������?�����������������������������������~>����������?���k��'��������������������������_��������������^��������~U�s��������������������?�������u������������߿����������������������Ͽ����.������_����������������������O��w���o}����������s~�����������ٿ�����������������������~���|���w������~��{��������������������o������������������o���s����������j���������������������o�����߿���������ֿ�����Ͽ{���v������������~��������3���������������Ͼ��������^���������翿�����޽�~���������������������������������������������������������������������������_�_����������wO�����o��m������������w������~����_�����������O����^��o������������ώ������?������������w�������������~��������������������������?�������������������������_��y���������_޿����o���w����������������{�����|��������׾����\�����������������~�����;������x���������W������~��?�������������������_�������������������{����������w�_�������~���������g�n;�����������{����������������_���~���3����Y�����������������o������~����{�������/����7������d���������������}����{����;�������w���z�����������������������ϯ������������~�������_�������������������������{����������������~����������_~���?�����������߿����������W������w�O��_����������e��o������������_������_����������o����������������_�[������?�;���w������������������������g��������w�x��������~���>�����������w��������w������m������k����?���^y_���k�����������������o���V#���{��~������������������������������?�����w�9|�����}�����c������g����������u������������ݿ�������w�����������������������Ӵo��~�����������>������w���V�����_���������������������������������������v/�������������������������ד���2��_o�����������g}����{������Z�w�?=��??u��������w�����������������������������������������{�����}�����}��z�����o�����{�������{��������������������^��&����������������������������ѧ��������������������6�����������_��<�����������w����������������߿����������_�Ͽ�������)����������W���ݿ��~�μ���{��������������w_�_�������g���k����������������������������}������������|}��?��������������������[����������������o������������������k����g��ߗ���������߾����������oJ���������߿y�����������<������������~=��_�����������������������~���������������?��{�����{��������������������?�=���w�����������������������;���������������������������������������ٿ�������'ھ�������o����������}��߿�����~���������������������������7���������/������{��o5����������������_�������������~�������w���>�����������������?�������9�����?�w����?�����������������v�����_����O�����������+����}���������������?������o����������G��c~���������������`��{�������}�����w���}�����?/���|�������������������������~�����������������������������?���n�o����������������_�������?��������w���������>�������������������������ϟ��_���������߾������������Ϸ����>����o_����������7��������������~w���������������������������������������ݞ�_?�/߼������{��ϧ�~��������O�����������������}��������?���������?~����������׿������w�~������߽�������nm��������g������������������?����{����{�����~������~��{����������������������?������������g����������������������������w����������������ߺ���������g_�������������������}�������|�s����ܯ���������wg����������w�����������������o������������������������{�������������������{��������߿������f��������{��~�������������������{������������g�����������ߛ���������������o�J�_w����'������������������}�������o���7�w��]�g���������������������_���/�������.Ͽ���������������~�������������}�����������������������ݾ����?�������������?�?���m��_�����~�����������������>���w���������������}������������������_�b߻o��_;�?��w��������~����������������{�����������߽��������o��������l�}��Ͽ�������w���������/����p���������[�������N��������������������B�����O����c��~��k������U����O��������������������_�����Z�����o��������?����������������������������������������}���g����������{������������������������������������������������������׿��~��������O�������o�{�o���_������|}?7�������������������_������>�������������������������������?�������������Ϗ������7�����z~�������o���������[��o������{{�������������_��������m����������������������/��w�~����������������������w�������������|�����������?�޿������������������߻��������������������������{�w�������Wϻ����������������������{�����o��?��������e��������������������������?��������?�}�����������s���<����}�����������������w�����������}���~����������������?����������>�w��}��������������������������_k���??�����Ϸ��?���w��n������t�߾^���w��������˿�쿿���/�������������������������w����g��n���������������������������[����O���������������;���n����~���g�������y��������_�����o���������������������������?��?������������u��������������������_Ʈ_�����M}�{{w����U���*�������w�������������������_���w����v�����_�������������������~��u[��Ǿ�w�����������o������~O���������������m��������������������v�����w���3��߽�����������������������������߿�_�������_��G����������������������~����������Ͻ������Ǿ�������������{����{?�}Ͽ����?��������������w��?�T������=��������������������k����7}��_��������M���[�����������������u���������������x����~����w=�����������u���������������������~��7���������������o���~��߷������o��������������������ng�~�����_}��������������������������w������������w?�����s���������������z����������������������������~���w����~����������������?���������Ͽ���~����������������o����������������������������|�����������������������������������.������>�������������������������������}���ſ�?����~��������Q���?�u��������������������������������>����������~�����������׿�2���߮����~��;����_~����~��?~����������������o�{����������������;�������������ۻ���~����~|��=������������?����~���������_��������������v������