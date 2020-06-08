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
     * ------------------------------------------------------ώÿί~ÿÿχχ{ίυςΝÿÿoόώÿ|ΏÿΏÿχÿ?ώÿÿνώµχ~ÿοÿίÿϋςϋ^ώίÿύξηΫ~ÿϊχÿχΏÿÿχÿϊÿÿ―ÿύoÿÿί~ÿÿ»ωχάϊώΏ<ÿÿϋ?λÿώ_zϋsώ}ÿο―ο_§uί}ίKÿοϋ»ÿσχΎίΟoΎ?ύοχχοÿÿοψ›ο»χοούσgχσνλώÿΧΏÿ?ÿÿοώÿώÿίÿw½ÿÿÿÿϋÿÿÿÿχνÿώÿί½ÿÿÿ·ÿή$ΗµίÿΧÿύÿοώούώόχÿ·ώÿ}ÿÿÿΫϋϋ»ύÿÿϋÿεÿύίχÿίÿÿο}ΥÿχάΟΏΏ_ÿÿχσ_ϋοÿÿÿrλζ―ηξ³}ÿςω·σ»ηοyÿϋύÿ³χÿζύήΎώÿώÿΎούύώόÿλÿ‡ÿΏΏÿÿ~ÿφΟοÿÿκώφώχÿς_ίο…ÿϋcÿθϋÿÿώούχΏιϋÿοίώύίΧήΩΊΏωÿÿÿύΫÿΏώόÿύϊÿΫύ7χΟϊÿÿύÿΏÿχoχηΎÿGχϋο;ώώώυ_οÿ®ήÿÿÿΏΣÿÿϋοÿÿoÿοΏÿg>{λϊÿίϋΏÿ}οχψÿÿόώχΩώϊ~ξÿÿηύχÿυÿÿίÿÿ}ÿÿλÿÿΏΟΎΫÿ{·¶ΟÿάÿΧΫόϋΏÿÿύÿÿÿώώώ=μόύΏÿοÿϊϋÿÿλϋύÿÿίέ΄?Ώχίÿ|ωÿ«ύΏαύÿώώίυϋώωοηώÿÿχψmπσÿÿϊνχÿW;―ÿΧÿÿύηtεήÿwξÿΝΏÿουwÿ;ί_οίϋGόίώÿώÿÿί|Ύί_ÿÿοÿϋ»?ϋώίÿÿ·ÿ§ϋw{ÿÿÿχ~ÿÿΆώ―ÿÿÿϋΏΟϋΏίÿϋÿÿΏέÿzÿοÿÿηίοÿΟÿϋύϋÿΌ―χ?ώÿÿÿ?όΏÿmίÿÿÿÿÿÿϋουίίχÿzÿωoWχϋίωχÿÿώÿώλ―ÿÿ—ÿόÿoώJχώήΎίοχÿΏ?gΦχÿÿÿΏgώχÿÿÿχΏÿάÿÿίξρσoώύϋÿÿύϋνÿ{χÿ}ώÿÿώÿο{τÿΞÿύέ·χΫ½ύϋÿÿώήΏώϋΛΏώήÿω½ÿ=οώχΎÿί²ÿΏ?ÿΉώόÿoÿύÿs¦Ξοÿίωύÿ7ϋΟ½ίΝόÿύΏΟÿΏÿύύÿΏϋÿϊÿÿÿώÿϋÿοÿÿÿη=ÿςÿώνίχΎϋΗÿόώ·ÿώούÿϋίυÿϋύΏÿΏίÿÿ…ÿÿώÿψÿϋÿύÿÿÿÿί}ΏχύÿώÿοϋÿÿÿÿΧίηÿούÿχÿ·ÿÿώίχο_χσχώϊ}wVÿÿÿώξώÿϋχÿόσοΫΏÿÿÿίoόÿΏ}ÿÿώΜώηχοοθοÿÿ=ξÿÿϋώϋοηΫÿύoϋÿΏχύύÿÿώϋωχΉÿοWÿώξύόο¶όÿ}ÿώÿλÿÿώΟηφφÿχύ;ÿÿÿ―ÿ~ΧOwύÿΛÿÿξwίÿÿύÿÿώώίΏίÿÿÿΏ?ÿώÿÿ?vϋÿÿώ}χÿϊ―ώύληη^ή{nÿώÿύÿσ·ύnχÿÿ}Οχÿύο7ίÿχÿΫώxίύÿÿώΏουΣώύο―ÿ?Ϋί/Tξσÿώ»σÿϋήγκνω{ίÿoÿÿοÿ_ÿξÿχÿÿοÿÿύÿ5―ίÿοώξÿίÿÿΗχÿÿΦ–kοϋΏώΏχÿχÿ·lΝώÿÿÿÿώÿίÿ<ÿÿύόÿÿχ΄έ~ϋÿώÿoÿζÿξύÿoÿÿÿ~χ~=ÿϋÿÿΏÿΫύϋÿ?Η›^llίυ}ÿί7OÿίοewxΏώÿ?χ½όίίΟύÿοΪίΏ[ϋϋίΏύφύwοNλοÿώΏÿoύÿwÿόÿΏ?Τξώ‹ΏÿηÿήωυχÿÿώÿιφeϋχϋÿÿÿϋÿύοΧΦΏϋÿϋOώΗώΏÿώύχÿÿÿϋÿώÿοΎλ_ÿΏÿέώό?ÿψώύοΧύονύϋοΟÿÿÿόΥήÿοίίηηÿοÿΫ9ÿÿÿOίίÿoÿÿÿσϋοÿΏOΏÿÿÿ?Οwχ»χχÿÿχΏώÿÿÿ^ϋ[ώέÿμÿÿ?ÿÿÿίΟwÿÿλοσÿίÿÿÿÿϋ½ϋ7ÿφύίsÿΑÿήÿÿοÿώώÿΗϋχύοήώÿο}ÿγφÿύχÿίÿώύϋϋÿοΧΫ~ϋÿώοόϋÿύÿίωϋÿΏÿÿλύÿ§ÿύΫÿÿÿοϋώÿÿ}wχσον?Ϊοÿ«ÿÿÿλÿÿÿÿμoÿΏιχÿÿίυτÿÿχϊ{{zϋÿΧÿν½τοÿÿώηÿÿÿÿ£ÿίύίÿηώÿÿÿοχÿΏ·ÿΎ|ώφίύΣ_χϋ{φύÿÿ½οηξΏ®ύωΜÿÿÿΏχÿΏ>ώÿ―ςÿ_έÿοΏχΏ®ÿώ―oώΟΟÿÿÿΫÿÿwηΓÿώφϋÿώύÿΫεώgÿφϋÿÿοχΏώύÿϊÿόρϋ―χÿΏ―χο{BÿÿίÿÿÿÿÿοχÿλΎώύÿώωύόϋ>χfώόΝÿΟÿÿÿ_ύÿÿχωÿÿίϋΛχίηÿχÿ½ÿΧχΏίο»ώώήίύ}ÿΉtέ7ώÿξÿÿΏύÿύΟ½ÿÿάχο§οÿΏώΏÿÿού_Οο½ωÿÿχmzίχ·ϋ'Σώÿή~ΎίÿÿÿχύÿύÿώÿξÿοξίίÿÿÿγÿÿÿνΟÿ?οΣχÿοÿÿÿίÿÿόÿÿÿυί·_Λm-wχÿyÿύÿϋλώχÿÿÿΏµο­­ώύώίέοÿΏ}ΧϋÿÿΫÿ½ΣÿÿÿοόÿϋχτέÿχÿϊÿÿΏ{ÿÿÿnvωÿοoÿώίηÿοÿ½ψÿϋοÿοÿΗχ·τÿÿÿΩÿÿ_ςχνύχÿ®|ώώkήίΏÿÿϋΏnϋÿÿοÿωξÿϊ±ώίÿÿÿϊ›ÿΝ³WÿNÿώÿΎΏοώϋΏÿÿÿÿ―kχφΌ{Ώÿώÿÿύÿÿÿ~υoÿÿχίΏÿÿÿÿÿΏÿÿΫÿούÿοΛΏÿÿ›ϋΟÿo¦ÿίÿώÿÿΏÿυοÿοϋϋÿ}Μίÿ;φ?ÿΧÿΛ?ÿΏ›ÿÿϊϋmÿΏÿχ?ÿρό}ÿΧϋώώWώωÿÿώÿÿÿÿυÿεÿÿώύÿ_ÿΏwÿÿ³Φοÿÿsώ{Γ·ÿϊÿύΖύÿÿΏώÿξ?ÿχώλύÿχΏµϋÿώÿÿχχώοÿÿιÿÿÿίλϋÿÿίλύύÿο~>ΗϋάϋΟίÿοχΞ?ÿΎÿkόÿ'ÿÿούÿίÿÿÿώοΌÿέίοοÿλÿυμγÿύΏÿ_νοÿώÿÿÿÿϋίτÿάέ^ΎύϋώÿÿΏί~UÿsÿÿÿϋÿχλώÿÿύÿÿΧέÿύÿÿΏ?ÿΟÿÿώύÿuÿώÿύξÿÿϋÿχχÿίΏέÿΏηÿΩν³ÿοϋÿÿΦΛϋÿύϋÿχΥΟΏχϋοΏÿ.ϊμ½ÿÿχχ_ÿÿΟÿώÿΥϊÿχÿχϊÿΏύίÿÿÿχOγϋwÿϋύo}υξÿχώÿ§ÿÿΟs~ΫοÿυχÿόÿÿÿÿΩΏϋϋηοτΏÿσΏ―χ―ÿφίÿ‡ÿÿÿÿÿÿΏΎ~ÿÿÿ|ÿÿÿw·χμοοο~ÿύ{ÿοίξχÿίΟÿχύÿÿύ³ώÿÿώÿoηηύώίηύύσοÿÿÿωοΏΨÿÿoώÿχsωηÿÿÿΘÿύΧχjϋΎοηÿ―ήÿÿίύχÿώΟοΘίÿ½ÿoÿχÿÿÿίΏίοÿύÿηÿÿΧΦΏϊÿξφοΟΏ{ÿχύvίÿψοÿοÿÿΟοÿÿ~άώÿÿÿϊÿώ3ÿÿύÿήούγϋÿώχΖξÿΟΎ®ϋοÿÿόÿΗ^τÿÿίÿÿώύϋηΏΏώχΟφΏή½ÿ~ÿοÿξÿχΎλΏύφΚοηΏÿάÿ·ÿύϋΏϋÿοÿψÿϋΎÿÿύΓίÿοÿοΏοÿϊσχ½ώ»λνχÿώÿίÿώόÿÿχÿÿίχÿνδυΟÿÿϋΏξÿ_ϋ_ÿÿ·§ÿίίσώόwOÿÿÿάώoώοΏmύγχϋύÿÿÿÿώÿÿwÿ―οÿΎÿ~χσÿÿ_ÿΏ·ÿÿχÿέÿϊξOίÿÿώ^χÿoÿÿΎÿΟÿϋΫÿίÿΟύώςÿόÿ?ύÿÿΏξΏύοοωÿÿwώοÿούο—ÿÿÿÿÿÿΦ~ώÿώοΖÿίÿÿόοΏÿÿϋϋÿÿξχÿϋΩχ§ÿÿ?ύοεÿώ—ÿ»ÿ½ϋυχ›ÿυÿύΏςίÿÿο_μÿyοΫÿολÿίÿÿ_ήΏΏÿÿ½oξÿϋwχÿÿÿσ—ÿ½ΚΟσϋÿÿΫÿω{ÿώÿÿÿ|χύÿσÿΣÿΏΧΎύÿÿώ\¤ÿ·ώώϋώυΏÿ·χϊΏÿÿ~ÿΏχώÿ;ϋÿοÿχÿxφÿώοÿΏ½οÿWζÿÿÿυώ~ÿÿ?ÿΝÿÿϋ―λÿίÿÿÿÿώÿοÿÿΎ_ÿώΎέϋÿξφζοχχϋΛÿώÿώώ{ότΏχοηΏώÿÿwο_ϋώξÿώÿ~φÿÿφÿÿώ»νgÿn;Ώξ―ÿÿÿήÿÿΏήο{ΏÿÿύÿυοϊοÿύÿόΏΏ_ζÿÿ~ÿÿξ3ÿÿίÿYχΏΟίμπÿυÿϋίΦυώφÿoοώÿ―Ϊ~ÿÿχÿ{ϊύώ―ϋοÿ/ÿÿώί7ÿÿέÿίÿdÿÿίÿÿÿÿΟένΧηϋρ―ÿ}ÿψÿχ{Ώÿÿό;ÿÿΎÿÿÿwώÿϋzÿÿύÿχίέÿ«ώϋχόύχφχώέόÿώύΟ―ϋηίÿϊÿΧσÿ·όύ~ÿόφύÿοό_ÿÿÿοÿύΝÿονÿσηÿÿώÿηÿώνϋύΥ{Ώÿÿο—ÿϋώÿΏχΎÿ¶φÿΫ~ÿÿύϋχώÿÿÿÿ_~οÿρ?ÿόÿΞόνηÿΏÿίΏύφοÿύÿώώνÿWÿσϋοÿώwÿOγ_ο·έÿÿÿÿ½φÿώeέÿoύÿφώόσÿÿÿσÿξ_ϋÿÿΤÿÿ_ÿήΟΟÿίÿÿ―oΣÿΏÿÿÿώΏÿÿΏώίχÿο_ξ[ύΓϋÿ―α?ο;ΧίίwÿÿÒÿηÿÿÿύÿÿοοώσώÿÿÿώήÿΏύgίÿÿÿµÿηΏϋw½xΏÿÿλχΏÿο~φÿÿ>ÿχλχÿίςÿοϋÿwΏύίÿΎωήÿwÿÿ•―ÿΏmÿοÿφÿύk―ηώύ?ÿÿÿ^y_ÿÿύkούαÿÿχύÿÿÿ΄οΎÿώÿώÿoΞϋÿV#ÿÿο{ÿÿ~ϋÿύÿÿχÿÿÿώξσΏκϋÿÿÿÿÿÿώοοÿÿθοÿ?ÿÿÿώξw»9|ÿσÿÿο}νοÿ®ÿcÿίον³ÿχgÿώÿσÿοÿÿÿοuÿΫχΙοÿÿÿÿΏÿέΏÿÿούύÿίwÿÿϋÿοÿÿÿύÿÿχοοÿϋίÿχϋώΏÿΣ΄oÿÿ~όο§ϋέÿώίÿ½ίΟ>οάοÿÿÿwήΟΰVϋÿÿÿÿ_οχÿηÿÿύΏύώ―ÿοÿχψηώΛίίώÿύίύÿÿϋΟύϊϊώ»ύÿώÿv/ÿξύϊχÿείΛÿÿÿϋÿÿÿΟύΎΎύÿίÿοΧ“Ώγ½ή2ÿÿ_oοώÿχίÿ―ΛϊΏχg}½ÿÿÿ{ϋΟϋÿχÿZΏwώ?=ίÿ??uΏÿÿÿÿÿÿÿwΏχφÿÿÿÿίϋÿξΟÿυÿλ½ύÿÿÿωµÿώÿϋÿλλÿύοÿϋÿχχÿΟÿ{οΝÿίÿ}ΦΟΑϊΏ}ώχzΏΟÿϋÿoÿÿνÿχ{ονÿΟÿÿώ{ÿόοÿÿÿÿΏÿίΪÿÿηΩέÿώφί^χÿ&σϋÿÿϋÿΏϋ»ÿοÿύÿÿÿϋÿΧÿοÿόϋÿÿΡ§ÿÿΏϋύÿΏÿÿχήίΪιÿ»½ϊχσ6Κώÿÿÿÿοÿÿÿÿ_ÿÿ<ύξÿÿώÿνÿϋÿϋwϋϋÿζÿοώϋώÿίοΏύÿÿÿίΏξÿÿΏηϋύÿΟβ_ΏΟΏήχύξοωη)ÿÿÿΎίÿχάΟÿWχÿοΏέΏοχ~ηΞΌΏχÿ{ÿΫΨÿÿÿÿϋΎÿλΈίÿÿw_τ_ΘÿÿÿσÿοgÿύϋkÿώÿώοΧηέΫηώÿοχÿύÿÿÿÿÿÿÿÿΉύού}κÿÿύΧÿοÿϋοί|}ώώ?άύÿÿϋÿΏΏÿÿÿξÿίώχÿχοί[ÿÿχÿω¦ÿΟÿέÿύÿÿώoÿχύσοÿÿίηύÿÿώχώωΎÿkÿοξώgϋ£ί—ϊίίύόώΎχϊίΎϋÿϊÿÿΎωÿίoJχÿοούύΏτηίΏyύχÿύÿύΏίÿÿÿ<χÿÿÿÿχÿνίÿΏÿ~=ÿΎ_ίνχΧόίύώΏξÿÿΎÿÿÿÿύ·ύÿΟΧ~ÿύώÿÿÿÿÿÿÿÿίÿΏ·?χχ{ϋύÿυγ{ÿÿϋχÿφΏοÿϋοϋÿΧϋχοÿξξ?ί=ÿόίwύÿÿÿωηÿίÿχΎΧÿÿÿΟϋήξύόÿό;ÿÿÿÿοÿυÿυÿÿχύοίÿώύÿϋÿϋίοÿÿÿΏÿÿώιάφÿίοώοΩΏΧÿϋÿÿΏ'ΪΎÿνώφΘÿχoφΌÿΏÿÿÿοÿό}ÿµίΏοφοÿϊ~ÿÿϋÿίÿκώÿύÿοίÿίύÿÿίήÿÿÿώϋÿώ7ώίÿφÿϊΗÿÿ/ίΟξÿÿ½{Ώχo5ώÿνγÿώϋώÿΏÿνÿοόÿ_ÿÿΧÿΏχϋΏσχνÿÿ~ÿÿώέÿÿίwÿÿό>ώÿσοÿηώ½οÿÿÿϋÿÿÿό?ÿÿÿφÿÿΏ9ϋÿϋÿÿ?ϊwÿρϋΦ?ÿÿÿÿνόώΧώÿϋÿΏÿΏÿοvÿύχχÿ_ΏÿϋύOοÿÿίσύÿύ¶Ώ»+ϋÿώΟ}υηφÿÿ·ώΌÿϋϊÿϋϋ―?ύÿΟνΫoοώέσ™µζιÿÿÿωGÿΞc~ΏχÿÿΒÿÿÿΏοÿύÿÿÿ`χρ{ÿÿϊώίÿÿ}ύώίÿοwϊÿÿ}ώώώÿÿ?/ÿÿÿ|ÿÿÿΧχώÿÿÿχΏοÿοÿÿÿίÿÿÿόίπώ~ÿÿλύώύÿοάύίÿÿΟÿούÿÿϋÿÿοÿώΏÿΏϊ?ÿÿώnύoΟόφεÿΦÿÿÿχÿοσÿγΏύ_ÿÿ§ÿÿÿ?ίÿοÿΗÿΟόwοωόούÿÿόώ>λÿήφ»ώΎ»ηÿϋÿο―ÿÿÿÿϋÿσ―χÿÿϋÿΟΫλ_σώύίόώÿχώίΎσζÿÿÿÿÿΟϋ½σχΟ·ÿÿοϋ>ÿÿύÿo_υÿÿÿϋϋάχÿÿ7Ώφÿϋÿÿϋÿÿÿÿÿοο~wώÿÿχ·ού½ÿϋÿλΟϋÿÿοσÿÿΎχοÿÿ£οΧÿώΏÿÿορώυÿΚέν_?ϊ/ίΌÿÿύάÿÿ{ÿÿΟ§ÿ~ίÿÿςÿÿÿ½Oχ”ϋώÿϊÿξÿγηÿΎÿÿΛφ}λ—ουοÿΏΟÿ?―ησϋνÿϋÿη?~ώοÿÿÿώχÿνΧΏρ›ÿÿόχÿwχ~λύÿÿΏΟί½ÿεώοώµίnmσΏώϋώόήφώgχύλÿχ¶οΏÿÿÿύÿτÿχÿώΏ?ύÿίÿ{Οÿφ{½ÿώχΏ~λÿÿΟχΡ~ύÿ{ϋώύώÿΧχϋοΛϋÿϋÿνÿΧύοÿόÿ?ΏÿÿώÿÿÿύÿϊΏΞgÿΏίÿρÿÿξΫόÿθÿÿϋοσÿίϋύΫωÿ½ϋοÿwÿίÿίÿÿÿÿΏÿÿÿφÿÿ­ίΊώχσΝέοΎήήμg_ÿÿÿώώÿχÿÿÿÿÿÿÿÿύÿσÿ}ΥΗÿχίÿ|όsÿ·»ÿά―ÿÿϋοÿόÿÿwgϋΟÿχÿÿÿÿΏίwÿÿύώϋών³ÿμύÿΧξχχÿχoοÿίώÿχϋ·ÿγωÿχύώÿϋÿώόÿÿνÿ{ÿοÿΧύΟΪχχÿΟÿÿϊÿχÿΏ{ÿύÿίÿÿίχίΏÿϋχΏν®f™ΏÿΗίχÿχ{Ξώ~υοÿÿÿ«ορÿξίίοÿÿοÿσ{ώϊώίζÿÿÿϋέÿύgÿϋφÿξϋύΏÿÿΧί›ÿÿβξÿΝÿυÿÿώχÿΧΟoÿJύ_wϊϋÿÿ'·ύÿώτηÿÿÿÿÿÿÿÿϋϋÿή}οώϋÿόώÿoλώÿ7­wσλ]ώgÿÿυχϋÿίÿίÿύΏχΟÿÿΏÿΗÿΏ_ϋÿχ/ÿÿύΏ―υφ.ΟΏÿϊ€χήÿϋÿχχώÿώώ~ύÿοÿÿÿίϋÿώÿÿή}ώÿÿÿ‹Ώÿχÿύÿίÿ·ζχÿοίώοΦέΎΎβνώ?ÿύÿχÿίÿÿύχΏΏÿ?ί?ÿÿήmίϋ_ÿνÿÿÿ~ÿηύέίÿÿÿώηχοώλÿÿώ>ύΡίwϋÿχίχÿΟώÿÿÿÿοΏϋ}ώύλϋÿÿÿϋ·ÿηÿηύÿ­ώ_›bί»oÿΏ_;ώ?ÿÿwόοÿ―ώχύώ~οÿώÿÿσώώίΧώΏÿώÿ{ÿÿÿÿόÿÿÿΟÿÿί½ÿÿÿώίπÿψoϋύΞώÿώίÿlÿ}ÿχΟΏίÿοοδΏÿξwÿχοÿοÿÿώÿ/όÿÿÿpÿÿίύÿ½ÿϋί[ήÿϋύΏ½ηNοώÿÿώ§χÿÿÿχÿÿΧϋ…ÿÿÿÿBώύϊϋίOÿγζÿcλο~ÿ›kίÿχÿώÿUΏÿΆοOίÿÿφόώΩφιώÿÿΏϋΞόχοÿÿ_ÿοωχZωχÿχÿoÿΟϋόΪύίΫ?½σÿχχξÿοÿÿτφÿÿ»εÿΟÿÿόύωώÿίÿτοΧοώÿΏθγϋÿώη}ώΏύgύίÿχύίÿÿϋÿ{ώΧοÿÿίÿÿÿÿΎÿχÿÿÿÿώχσώίÿÿÿÿχÿÿÿώίυΏτίυÿώΏÿύχχώηχοώÿώΎ―ΧΏώΛ~ώÿϋÿγÿΏÿOύÿ»χώύξoί{ÿoÿοÿ_ÿÿÿοÿχ|}?7ΦύΟίÿÿφÿÿÿχΏÿÿÿÿΌÿ_Ώίφχÿί>»οωÿÿχÿÿώÿÿΞÿÿÿÿÿÿΏΏΊÿώϋόώώχÿύώ?ÿÿÿΞÿΆÿωοÿΟΟΛΟψÿÿÿÿ7ÿχοώύz~ΏÿÿÿÿΎφoµώηηÿόώÿÿ[ÿμoώώ§Χÿÿ{{ΧÿΏώώσώόησΏÿ‘ώ_οÿÿÿίÿÿέmÿÿÿÿσήÿϋÿÿΏλÿÿÿÿ”ÿÿχόÿ/χώwÿ~§χÿύÿΎυχΏÿνοοÿΫÿοήχÿίίwώÿÿÿΣÿχώώΧΧώλ|ΏÿΎχύοϋÿϋ·Ώ?οήΏφέθÿ·ΉÿΏÿ·σοψϋÿοώÿί»ÿ†ούÿοροχουξÿΏÿώΧÿχÿνώίÿϋ§{υwΏώόφÿÿWΟ»ϊÿύÿόÿ»ÿÿϋΝÿΏÿύÿÿÿύΣέÿ{ÿξΏÿΏÿoώχ?ÿÿÿÿΣÿΏÿeÿώÿοÿϋΟΡÿϊώΏ²οξÿΟÿÿÿÿχύÿώο—?ύοÿοίφέ?ÿ}Ώϋÿοÿÿ±χÿίÿsχΫÿ<όÿÿÿ}ÿÿÿÿÿÿÿÿηÿΏώηοÿÿwΥΟχϋόώχÿφί}ÿÿφ~ÿÿÿχϊΎΟÿιÿÿύÿΏÿύ?ÿύÿÿχώÿϊÿ>ϋwλ}οÿÿÿÿϊÿÿÿωÿ¶ÿΏÿÿÿχωςίοώϋχ_kÿÿώ??ÿÿώϋ½Ο·ÿÿ?ÿνέwξόnΫÿÿώϋφtχίΎ^ύΏίwÿοÿÿύΉχϊΛΏϋμΏΏΏχ/φώÿώ‡νύχυϋύμÿÿώÿÿÿÿÿίηΦÿ½wΏλÿÿgό»nίÿύώοΏώÿϊÿχσώÿΫÿοÿίÿÿώξώώÿ[χÿÿέOΏÿώΩÿÿÿϊίÿÿÿύχί;Ώ«ÿn§χύϋ~ίÿάgΫÿΏÿοÿϋyÿΫϋυύÿϋχ_ÿώοÿίoύÿφÿÿÿίÿύίχÿÿηΧυÿούοÿυÿχÿÿϋ?ÿÿ?ÿωίοÿÿξÿϋÿÿ·uÿÿϋσÿύίÿÿϋÿÿÿϊώτΏνÿ_Ζ®_ÿΎώÿÿM}ξ{{wχϋίUχΏÿ*οΗÿϋÿΏσwύύ·ΏώοχÿχύΟÿÿούÿχίÿ_ÿφμΏwÿÿίωvυΎύΏ_ÿϊ®Ώύϋ®ÿÿÿÿσªÿύϋϋÿΟÿ~ÿώu[ώÿΗΎÿwύΏΏÿφÿλÿνÿoÿυÿÿίϋ~OΧÿίυÿΏ½ÿÿοω®ÿχÿmϋÿÿÿÿώΏ·υÿώύξÿησÿÿοώvÿÿÿοϋwώΎύ3ÿ½ί½ελύώÿχοάήÿοÿχµΏΏ½ξϊÿÿζÿΏΟÿϋΏÿίΏÿ_ϊχÿÿύÿϋ_οÿGÿώ¶σ·ύοώχέÿÿÿ“ÿÿÿίχύίÿ~ÿÿÿÿÿύσχύΟ½ÿÿÿίώχΗΎΟώΏζ›ίϋÿÿÿώοοώ{ÿΏϋÿ{?ύ}ΟΏ§ΏΕω?οοχÿχÿÿÿνοσÿΏξwοχ?οTίÿσÿÿÿ=ÿÿΏÿÿΎχÿύΧχÿÿΉοίϋΏÿ§kχύύÿ7}ϋφ_ÿφΏχηύώίMήÿÿ[ÿÿΏίÿφÿοÿÿχύωÿÿ―ίuσÿϋÿΪÿ¥ϋώεοÿÿÿxΏÿΏÿ~ίÿ·©w=οΏÿÿÿξίÿϊωέÿÿuοÿÿ½οÿχΗϋΏΏώίέÿÿίΧÿχÿ~ÿΏ7ÿωϋΦύ§ύÿίώÿχÿÿοoχÿÿ~υηί·χώχσÿÿoÿώέÿώίÿώύώÿίυÿόÿχÿngα~―ÿώώÿ_}ÿÿÿζÿώÿÿύ·ÿÿÿίκίÿÿχΦÿύσχίwÿωίÿÿ½ήÿϊÿίÿw?ÿχΏΏύsίÿÿ®ζΫϋχήϋχνÿώÿzÿ―ωώίΞοώϋÿΏ»ϋέÿΟϋÿÿίοÿÿύχοίώ~ύοχwίώωσ½~ÿΪΗÿÿώϋοηÿÿÿξΏϋÿώ?ÿÿΗοÿÿÿϋÿΟΏϋΏη~ÿΗÿμÿίύΏÿÿÿΟύψÿÿoÿύÿÿύωÿίίοÿÿοοχÿφΏÿÿ—οÿÿÿϋÿÿ|ÿυϋωΏάωÿίÿώύΫÿΏχÿÿοοÿΏÿÿÿύχίύÿÿοÿώ.ςώÿΎύώ>σÿÿχύϋύχΎÿώσϋÿΏϋÿÿΏÿσοÿχÿ¦ίÿ›ÿÿ}ÿώχΕΏ΄?·ÿίÿ~ηÿΟοώÿΊÿQÿÿÿ?ÿuÿΏÿÿίχξ―ÿίϋωÿχοϋªÿύιώχ―ÿÿÿÿÿώίÿÿσ>ώÿϋÿΏχφÿίί~ϋΏϋονώοχώΗÿΧΏÿ2χοήί®οΏώωÿ~ÿΫ;ϋλÿÿ_~Λϋύώ~ύ½?~·οÿÿϋΏÿοχώÿΏΏ―ÿύoÿ{σς«ÿÿυΟÿλÿοχΟÿÿϊΫ;ÿΨϋΏεχÿίÿÿÿÿ½Ϋ»ÿÿÿ~Ξώχώ~|χÿ=ίύ—ÿΎώνώϋÿÿχ?ÿώώί~ÿÿÿÿÿοÿύ_ÿεÿχΩοϋνόχΡσÿχvÿόÿÿÿÿ