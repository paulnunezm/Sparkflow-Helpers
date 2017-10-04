/*Screenshift scale hack:
 * This line fixes the scaling issue in mobile in which the container is not
 * scaled correctly and the anchors do not work properly.*/
// window.scalableSelector = $("");

/**
 * A dependenciy for both _SparkflowHelper and _SparkflowVideoHelper.
 *
 * A debounce function is essential to ensuring a given task doesn't fire so
 * often that it hurts performance. Often used on events like "resize" and other
 * events that get fired repeatedly.*/
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

var _SparkflowHelper = function () {
    var ROTATE_MESSAGE_DEBOUNCE_TIME = 80;
    var hasRotateMessage = false;
    var canShowRotateMessage = true,
        undertoneLogoColor = "black", // OR white
        $undertoneLogo = null,
        whenAdIsReadyFunction = null,
        rotateMessageProperties = {
            parentElementSelector: "#widthFixer", // #container or #widthFixer, depends of the unit type.
            closeButton: 'close.jpg',
            logoPath: 'logo.png',
            logoSize: '80', // in pixels
            backgroundColor: 'black', // or white.
            mobileCloseSparkflowElementId: "CLOSE_M"
        };

    var _this = this;

    var checkIfPathsAreCorrectThenPreload = function (assetsPathsArray) {
        if (checkIfAllElementsAreString(assetsPathsArray)) {
            ad.preload(assetsPathsArray);
        } else {
            throw ("->SparkFlowHelper: All elements in the assetsPathsArray must be a String.")
        }
    };

    var checkIfAllElementsAreString = function (array) {
        var areAllElementsString = true;
        array.forEach(function (currentValue, index, array) {
            if (typeof currentValue !== "string")
                areAllElementsString = false;
        });
        return areAllElementsString;
    };

    var onResizeRotateMessageHandler = debounce(function () {
        if (canShowRotateMessage) {
            if (device.mobile() && device.landscape()) {
                showRotateMessage();
            } else {
                hideRotateMessage();
            }
        }
    }, ROTATE_MESSAGE_DEBOUNCE_TIME);

    var showRotateMessage = function () {
        setCorrectUndertoneLogoColorWhenRotating();
        $('#msg_landscape').css({display: 'block'});
    };

    var hideRotateMessage = function () {
        $('#msg_landscape').css({display: 'none'});
        resetUnderToneLogoColor();
    };

    var checkIfRotateMessageCanBeShowHideIfNot = function (sparkFlowEvent) {
        switch (sparkFlowEvent) {
            case 'clo':
                canShowRotateMessage = false;
                hideRotateMessage(); // TODO: check the code without it
                break;
            case 'rsz': // if the unit is open
                canShowRotateMessage = true;
                break;
        }
    };

    var setCorrectUndertoneLogoColorWhenRotating = function () {
        if (rotateMessageProperties.backgroundColor === "black") {
            setUndertoneLogoForRotateMessageToWhite();
        } else {
            setUndertoneLogoForRotateMessageToBlack();
        }
    };

    var resetUnderToneLogoColor = function () {
        if ($undertoneLogo !== null) {
            $undertoneLogo.removeClass("black");
            $undertoneLogo.removeClass("white");
            $undertoneLogo.addClass(undertoneLogoColor);
        }
    };

    var setUndertoneLogoForRotateMessageToWhite = function () {
        if ($undertoneLogo !== null) {
            $undertoneLogo.addClass("white");
            $undertoneLogo.removeClass("black");
        }
    };

    var setUndertoneLogoForRotateMessageToBlack = function () {
        if ($undertoneLogo !== null) {
            $undertoneLogo.addClass("black");
            $undertoneLogo.removeClass("white");
        }
    };

    var syncScenes = function () {
        /** Sync portrait and landscape scene views */
        var _lastSection;
        var _condition = $('.landscape').length == $('.portrait').length && $('.landscape').length > 1;

        $(document).on('adSceneChange adResize', function () {
            var _currentSection = $('section:visible');
            var _switchScene = function (view) {
                var _currentIndex = _currentSection.data('index');
                var _section = $('section.' + view + '[data-index=' + _currentIndex + ']');
                ad.switchToScene(_section.attr('class'), _currentIndex, _section.data('canvas'));
            };
            if (_condition && _currentSection[0].id != _lastSection) {
                _lastSection = _currentSection[0].id;
                if (_currentSection.hasClass('landscape')) _switchScene('portrait');
                else if (_currentSection.hasClass('portrait')) _switchScene('landscape');
            }
        });
    };

    var setupIcons = function () {
        setupAdChoicesIcon();
        setupUndertoneIcon();
    };

    var setupAdChoicesIcon = function () {
        $.ajax({
            url: '/sparkflow/adchoices.min.js',
            dataType: 'script', cache: true,
            success: function () {
                AdChoices.init({
                    corner: 'br',
                    url: 'http://www.undertone.com/opt-out-tool?utm_source=AdChoiceIcon&utm_medium=IAAdChoicesIcon&utm_campaign=Privacy'
                    //to set it as always an icon set -> icon: true,
                });
            }
        });
    };

    var setupUndertoneIcon = function () {
        $.ajax({
            url: '/sparkflow/formats/latest/utmark.min.js',
            dataType: 'script', cache: true,
            success: function () {
                UndertoneMark.init({
                    corner: 'bl', opacity: 0.5, color: undertoneLogoColor
                });
                $undertoneLogo = $('.undertone-marker');
            }
        });
    };

    var bindEvents = function () {
        $(document).on('adReady', function () {
            ad.setLoading("SCENE");
            setupIcons();
            _this.setAutoClose();
            whenAdIsReadyFunction();
        });
        $(document).on('adInteraction', _this.setAutoClose);
        $(document).on('adClick', _this.setAutoClose);
    };

    var addRotateMessage = function () {
        var isBgndBlack = (rotateMessageProperties.backgroundColor === "black");
        var backgroundColor = isBgndBlack ? "#000" : "#FFF";
        var textColor = isBgndBlack ? "#fff" : "#000";

        addTheRotateMessageStyleTotheDom(backgroundColor, textColor);
        addTheRotateMessageElementsToTheDom();
        addRotateMessageCloseButtonClickListener();
    };

    var addTheRotateMessageStyleTotheDom = function (backgroundColor, textColor) {
        var style = document.createElement('style');
        var css = " \n#msg_landscape {\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 22;\n    display: none;\n    width: 100%;\n    height: 100%;\n    background: black;\n\n    -webkit-backface-visibility: hidden;\n    -moz-backface-visibility: hidden;\n    backface-visibility: hidden;\n}\n\n#msg_landscape.white {\n    background: " + backgroundColor + ";\n}\n\n@media screen and (orientation: landscape) {\n\n    .fpf .plzrotate {\n        position: relative;\n        display: block;\n        margin: 10px auto;\n        font-family: Helvetica, Arial, sans-serif;\n        color: " + backgroundColor + ";\n        text-align: center;\n        text-transform: none;\n    }\n\n    .fpf.white .plzrotate {\n        color: " + textColor + ";\n    }\n\n    .fpf .plzrotate img {\n        margin-bottom: 20px;\n  margin-top: 20px;\n    }\n\n    .closed.fpf .plzrotate {\n        display: none;\n    }\n\n    .fpf .spinner {\n        position: relative;\n        display: block;\n        width: 48px;\n        height: 24px;\n        margin: 20px auto 20px;\n        background: " + textColor + ";\n        background-size: 48px 48px;\n        -webkit-border-radius: 3px;\n        -moz-border-radius: 3px;\n        border-radius: 3px;\n        -webkit-animation: rotating 2s cubic-bezier(.785, .135, .15, .86) infinite;\n        -moz-animation: rotating 2s cubic-bezier(.785, .135, .15, .86) infinite;\n        -ms-animation: rotating 2s cubic-bezier(.785, .135, .15, .86) infinite;\n        -o-animation: rotating 2s cubic-bezier(.785, .135, .15, .86) infinite;\n        animation: rotating 2s cubic-bezier(.785, .135, .15, .86) infinite;\n        -webkit-animation-delay: 1s;\n        -moz-animation-delay: 1s;\n        -ms-animation-delay: 1s;\n        -o-animation-delay: 1s;\n        animation-delay: 1s;\n        -webkit-animation-direction: alternate;\n        -moz-animation-direction: alternate;\n        -ms-animation-direction: alternate;\n        -o-animation-direction: alternate;\n        animation-direction: alternate;\n\n        -ms-border-radius: 3px;\n        -o-border-radius: 3px;\n    }\n\n    .fpf.white .spinner {\n        background: " + textColor + ";\n    }\n\n    .fpf .dot {\n        position: absolute;\n        right: 2px;\n        bottom: 8px;\n        width: 6px;\n        height: 6px;\n        background: " + textColor + ";\n        -webkit-border-radius: 100%;\n        -moz-border-radius: 100%;\n        border-radius: 100%;\n\n        -ms-border-radius: 100%;\n        -o-border-radius: 100%;\n    }\n\n    .fpf.white .dot {\n        background: " + backgroundColor + ";\n    }\n\n    .fpf .box {\n        position: absolute;\n        right: 10px;\n        bottom: 3px;\n        width: 34px;\n        height: 18px;\n        background:" + textColor + ";\n        -webkit-border-radius: 2px;\n        -moz-border-radius: 2px;\n        border-radius: 2px;\n\n        -ms-border-radius: 2px;\n        -o-border-radius: 2px;\n    }\n\n    .fpf.white .box {\n        background: " + backgroundColor + ";\n    }\n}\n\n@-webkit-keyframes rotating {\n    0% {\n        -webkit-transform: rotate(0deg);\n    }\n    50% {\n        -webkit-transform: rotate(90deg);\n    }\n    100% {\n        -webkit-transform: rotate(90deg);\n    }\n}\n@-moz-keyframes rotating {\n    0% {\n        -moz-transform: rotate(0deg);\n    }\n    50% {\n        -moz-transform: rotate(90deg);\n    }\n    100% {\n        -moz-transform: rotate(90deg);\n    }\n}\n@-o-keyframes rotating {\n    0% {\n        -o-transform: rotate(0deg);\n    }\n    50% {\n        -o-transform: rotate(90deg);\n    }\n    100% {\n        -o-transform: rotate(90deg);\n    }\n}\n@keyframes rotating {\n    0% {\n        transform: rotate(0deg);\n    }\n    50% {\n        transform: rotate(90deg);\n    }\n    100% {\n        transform: rotate(90deg);\n    }\n}\n\n#custom-close-button {\n    position: absolute;\n    top: 10px;\n    right: 10px;\n    width: 60px;\n    height: 60px;\n    cursor: pointer;\n\n \n    background-image: url(" + rotateMessageProperties.closeButton + ");\n    background-position: right top;\n    background-repeat: no-repeat;\n    background-size: 15px auto;\n}";
        style.appendChild(document.createTextNode(css));
        document.querySelector('head').appendChild(style);
    };

    var addTheRotateMessageElementsToTheDom = function () {
        var rotateMessageDom = '<div id="msg_landscape" class="fpf white"> <div class="plzrotate"><img src=' + rotateMessageProperties.logoPath + ' width="' + rotateMessageProperties.logoSize + '"> <div class="spinner"> <div class="box"></div><div class="dot"></div></div>Please rotate your device.</div><div id="custom-close-button"></div></div>';
        $(rotateMessageDom).prependTo(rotateMessageProperties.parentElementSelector);
    };

    var addRotateMessageCloseButtonClickListener = function () {
        $('#custom-close-button').click(function () {
            $("#" + rotateMessageProperties.mobileCloseSparkflowElementId).trigger("click");
        });
    };

    var addDeviceJS = function () {
        (function () {
            var a, b, c, d, e, f, g, h, i, j;
            b = window.device, a = {}, window.device = a, d = window.document.documentElement, j = window.navigator.userAgent.toLowerCase(), a.ios = function () {
                return a.iphone() || a.ipod() || a.ipad()
            }, a.iphone = function () {
                return !a.windows() && e("iphone")
            }, a.ipod = function () {
                return e("ipod")
            }, a.ipad = function () {
                return e("ipad")
            }, a.android = function () {
                return !a.windows() && e("android")
            }, a.androidPhone = function () {
                return a.android() && e("mobile")
            }, a.androidTablet = function () {
                return a.android() && !e("mobile")
            }, a.blackberry = function () {
                return e("blackberry") || e("bb10") || e("rim")
            }, a.blackberryPhone = function () {
                return a.blackberry() && !e("tablet")
            }, a.blackberryTablet = function () {
                return a.blackberry() && e("tablet")
            }, a.windows = function () {
                return e("windows")
            }, a.windowsPhone = function () {
                return a.windows() && e("phone")
            }, a.windowsTablet = function () {
                return a.windows() && e("touch") && !a.windowsPhone()
            }, a.fxos = function () {
                return (e("(mobile;") || e("(tablet;")) && e("; rv:")
            }, a.fxosPhone = function () {
                return a.fxos() && e("mobile")
            }, a.fxosTablet = function () {
                return a.fxos() && e("tablet")
            }, a.meego = function () {
                return e("meego")
            }, a.cordova = function () {
                return window.cordova && "file:" === location.protocol
            }, a.nodeWebkit = function () {
                return "object" == typeof window.process
            }, a.mobile = function () {
                return a.androidPhone() || a.iphone() || a.ipod() || a.windowsPhone() || a.blackberryPhone() || a.fxosPhone() || a.meego()
            }, a.tablet = function () {
                return a.ipad() || a.androidTablet() || a.blackberryTablet() || a.windowsTablet() || a.fxosTablet()
            }, a.desktop = function () {
                return !a.tablet() && !a.mobile()
            }, a.television = function () {
                var a;
                for (television = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "roku", "pov_tv", "hbbtv", "ce-html"], a = 0; a < television.length;) {
                    if (e(television[a]))return !0;
                    a++
                }
                return !1
            }, a.portrait = function () {
                return window.innerHeight / window.innerWidth > 1
            }, a.landscape = function () {
                return window.innerHeight / window.innerWidth < 1
            }, a.noConflict = function () {
                return window.device = b, this
            }, e = function (a) {
                return -1 !== j.indexOf(a)
            }, g = function (a) {
                var b;
                return b = new RegExp(a, "i"), d.className.match(b)
            }, c = function (a) {
                var b = null;
                g(a) || (b = d.className.replace(/^\s+|\s+$/g, ""), d.className = b + " " + a)
            }, i = function (a) {
                g(a) && (d.className = d.className.replace(" " + a, ""))
            }, a.ios() ? a.ipad() ? c("ios ipad tablet") : a.iphone() ? c("ios iphone mobile") : a.ipod() && c("ios ipod mobile") : a.android() ? c(a.androidTablet() ? "android tablet" : "android mobile") : a.blackberry() ? c(a.blackberryTablet() ? "blackberry tablet" : "blackberry mobile") : a.windows() ? c(a.windowsTablet() ? "windows tablet" : a.windowsPhone() ? "windows mobile" : "desktop") : a.fxos() ? c(a.fxosTablet() ? "fxos tablet" : "fxos mobile") : a.meego() ? c("meego mobile") : a.nodeWebkit() ? c("node-webkit") : a.television() ? c("television") : a.desktop() && c("desktop"), a.cordova() && c("cordova"), f = function () {
                a.landscape() ? (i("portrait"), c("landscape")) : (i("landscape"), c("portrait"))
            }, h = Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? "orientationchange" : "resize", window.addEventListener ? window.addEventListener(h, f, !1) : window.attachEvent ? window.attachEvent(h, f) : window[h] = f, f(), "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () {
                return a
            }) : "undefined" != typeof module && module.exports ? module.exports = a : window.device = a
        }).call(this);
    };

    var initWithRotateMessage = function () {
        addRotateMessage();

        $(document).on('adEvent', function (e, data) {
            checkIfRotateMessageCanBeShowHideIfNot(data.type);
        });

        $(window).on("resize", onResizeRotateMessageHandler);
    };

    var checkIfRotateMessageIsNeededThenAddIt = function () {
        if (hasRotateMessage)
            initWithRotateMessage();
    };

    var checkIfHasValidCallbackFunction = function (whenAdIsReadyFunction) {
        if (whenAdIsReadyFunction === null || typeof whenAdIsReadyFunction !== "function")
            throw ("->SparkFlowHelper: A callback function must be passed to be called when the unit is ready");
    };

    this.setUndertoneLogoColor = function (color) {
        if (color === "black" || color === "white") {
            undertoneLogoColor = color;
        } else {
            throw ("->SparkFlowHelper: Undertone logo color must be set to 'black' or 'white'");
        }
    };

    this.preload = function (assetsPathsArray) {
        if (Array.isArray(assetsPathsArray)) {
            checkIfPathsAreCorrectThenPreload(assetsPathsArray);
        } else {
            throw ("->SparkFlowHelper: Parameter must be an array.");
        }
    };

    this.switchToScene = function (sceneName) {
        if(sceneName === null )
            throw ("->SparkFlowHelper: a scene name must be provided");

        if(sceneName)
        // typeof sceneName !== "string")

        var _viewClass = $('section:visible').attr('class'),
            _section = $('section[data-name^="' + sceneName + ' - "][class="' + _viewClass + '"]');
        ad.switchToScene(_section.attr('class'), _section.data('index'), _section.data('canvas'));
    };

    this.setAutoClose = function () {
        mraid.setAutoClose(15 * 1000);
    };

    this.cancelAutoClose = function () {
        mraid.cancelAutoClose();
    };

    this.hasRotateMessage = function(){
        return hasRotateMessage;
    };

    this.enableRotateMessage = function (properties) {
        hasRotateMessage = true;
        if(properties !== null){
            if(typeof properties !== "object"){
                throw ("->SparkFlowHelper: Properties must be an object.")
            }else{
                rotateMessageProperties = properties;
            }
        }
    };

    this.init = function (whenAdIsReadyCallback) {
        checkIfHasValidCallbackFunction(whenAdIsReadyCallback);
        whenAdIsReadyFunction = whenAdIsReadyCallback;
        _this.preload(['https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js']);
        checkIfRotateMessageIsNeededThenAddIt();
        addDeviceJS();
        syncScenes();
        bindEvents();
    }
};
