/**  Created by paulnunezm  */

/**
 * Needs an initialized sparkflow object. To handle the set and unset
 * of the autoclose and to be able to use Device.js.
 */
var _SparkflowVideoHelper = function (sparkflow) {
    var video = null,
        videoContainer = null,
        added = false,
        visible = false,
        playButton = null;

    var _this = this;

    var prepareVideo = function (placeholderPath) {
        added = true;
        addPlaceholder(placeholderPath);
        addListeners();
        hideVideo(); // because Sparkflow always start showing the video
    };

    var addPlaceholder = function (placeholderPath) {
        if (placeholderPath === null) throw ("->_SparkflowVideoHelper: A path must be defined.");
        if (typeof placeholderPath !== "string") throw ("->_SparkflowVideoHelper: Path should be a String.");

        var replayImageBtn1 = document.createElement('div');
        replayImageBtn1.id = "PLAY_BUTTON";

        var vid = document.getElementsByClassName('videoplayer')[0];
        vid.appendChild(replayImageBtn1);

        var videoPlayer = $(".videoplayer");
        videoPlayer.css("cursor","pointer");
        video = videoPlayer.get(0);
        videoContainer = $('.videoplayer, [data-type="video"]');
        playButton = $('#PLAY_BUTTON');
        playButton.css({
            'cursor': 'pointer',
            'display': 'block',
            'width': '100%',
            'height': '100%',
            'z-index': '9999',
            'left': '0',
            'top': '0',
            'background-image': "url('" + placeholderPath + "')",
            'background-size': 'cover'
        });
    };

    var addListeners = function () {
        playButton.click(playButtonOnClickListener);

        if (sparkflow.hasRotateMessage) setVideoOnRotateListener();

        $(document).on('adEvent', function (e, data) {
            if (data.type === "vpa") sparkflow.setAutoClose();
        });

        $("video").on("ended", function () {
            playButton.css('display', 'block');
        });
    };

    var playButtonOnClickListener = function () {
        $(this).css('display', 'none');
        _this.play();
    };

    var setVideoOnRotateListener = function () {
        var rotateListener = debounce(function () {
            manageVideoVisibilityOnRotate();
        }, 24);

        $(window).on('resize', rotateListener);
    };

    var manageVideoVisibilityOnRotate = function () {
        if (device.mobile() && device.landscape()) {
            hideVideoWhenMobileRotates();
        } else {
            showVideoWhenMobileRotates();
        }
    };

    var hideVideoWhenMobileRotates = function () {
        if (visible) _this.pause();
        hideVideo();
    };

    var showVideoWhenMobileRotates = function () {
        if (visible) _this.runEnterAnimation();
    };

    var hideVideo = function () {
        TweenMax.set(videoContainer, {
            x: -5000, opacity: 0,
            onStart: function () {
                setNotVisible();
            }
        });
    };

    var runDefaulVideoEnterAnimation = function () {
        setVisible();
        TweenMax.set(videoContainer, {x: 0});
        TweenMax.to(videoContainer, 0.5, {x: 0, opacity: 1});
    };

    var runDefaulVideoExitAnimation = function () {
        TweenMax.to(videoContainer, 0.5, {x: 0, opacity: 1,
            onComplete: function () {
                hideVideo();
            }
        });
    };

    var runCustomEnterAnimation = function (customAnimationCallback) {
        var onAnimationStart = function () {
            setVisible();
        };
        customAnimationCallback(videoContainer, onAnimationStart);
    };

    var runCustomExitAnimation = function (customAnimationCallback) {
        var onAnimationStart = function () {
            setNotVisible();
        };
        customAnimationCallback(videoContainer, onAnimationStart);
    };

    var setVisible = function () {
        visible = true;
    };

    var setNotVisible = function () {
        visible = false;
    };

    this.runEnterAnimation = function (customAnimationCallback) {
        if (videoContainer === null) throw ("->_SparkflowVideoHelper: Video is not initialized.");
        if (typeof customAnimationCallback === "function") {
            runCustomEnterAnimation(customAnimationCallback)
        } else {
            runDefaulVideoEnterAnimation();
        }
    };

    this.runExitAnimation = function (customAnimationCallback) {
        if (videoContainer === null) throw ("->_SparkflowVideoHelper: Video is not initialized.");

        if (typeof customAnimationCallback === "function") {
            runCustomExitAnimation(customAnimationCallback);
        } else {
            runDefaulVideoExitAnimation();
        }
    };

    this.play = function () {
        playButton.parent().find('video').get(0).play();
    };

    this.pause = function () {
        playButton.parent().find('video').get(0).pause();
    };

    this.init = function (placeholderPath) {
        if (typeof placeholderPath === "string") {
            prepareVideo(placeholderPath);
        } else {
            throw ("->_SparkflowVideoHelper: Placeholder path must be a string.");
        }
    };
};