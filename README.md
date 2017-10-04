# Sparkflow helpers

Helpers to abstract Sparkflow functionality and ease ad production,
removing the need of constantly writing code for repeating actions 
and custom features. 

### Features
- SparkflowHelper:
  - Creates a rotate message only setting a few parameters to style it (background, logo, size,...). No more copy/pasting css for this. :D
  - Handles the rotate message background and UndertoneLogo color on mobile rotation.
  - Rotates message works as a charm on galaxies :P
  - 'setUndertoneLogoColor()' to change it on the expanded, the rotate message will track this and set correct on portrait and landscape, regardless how many times you change it.
  - Adds device js and TweenMax
  - Sync scenes 
  - 
- SparkflowVideoHelper:
  - Configures the placeholder only passing the imagePath.
  - Handles video visibility with units that has the rotateMessage (hide and pause when rotating to landscape).
  - Helpers to show, hide and animate the video.
  - Default exit and enter animations can be easily overwritten through a public method.
  
  ## Setting up the unit.
 1. Copy the content from ```SparflowHelper.js``` and paste it on the editor.
 2. Instantiate the helper:
````javascript
var sparkflow = new _SparkflowHelper();
````
 3. Initialize it:
 ````javascript
sparkflow.init(startAd);
function  startAd() {
  // yout code here
}
````
or if you prefer anonymous classes:
 ````javascript
sparkflow.init(function() {
    // yout code here
});
````

And that's all.

### Setting custom features

- Change undertone logo color:
```javascript
sparkflow.setUndertoneLogoColor("white"); // or black
```
- Enable rotate message:
```javascript
sparkflow.enableRotateMessage({ // Default values
    parentElementSelector: "#widthFixer", // #container, body, any element selector, depends of the unit type.
    closeButton: 'close.jpg',
    logoPath: 'logo.png',
    logoSize: '80', // in pixels
    backgroundColor: 'black', // or white.
    mobileCloseSparkflowElementId: "CLOSE_M" // to trigger when the rotate close is clicked.
});
```
### Public methods
- Preloading assets:
```javascript
var preloadArray = ["img_1.jgp, img_2.png"];
sparkflow.preload(preloadArray);
```

- Handling autoclose:
```javascript
 sparkflow.setAutoClose(); // 15s

 sparkflow.cancelAutoClose();
```
- Switching scenes:
```javascript
sparkflow.switchToScene("scene_name");
```

### Adding videos
Right now ```SparkflowVideoHelper.js``` can only handle one video. Feel free 
to contribute on this :D.

- Adding the video:
First copy the ```SparkflowVideoHelper.js``` content to your editor, then while you
are initializing your _SparkflowHelper object:

````javascript
// _SparkflowHelper.js and _SparkflowVideoHelper.js pasted above

var sparkflow = new _SparkflowHelper();

// Preload your placeholder
var placeholderPath = "myPlaceholderPath.jpg";
sparkflow.preload([placeholderPath]);

var video = new _SparkflowVideoHelper(sparkflow); // Pass your _SparkflowHelper object.

sparkflow.init(function() {
  video.init(placeholderPath); 
});
````

- Showing/hiding the video:
<br> The video always starts hidden with opacity:0 and x:-500, to show it or hide it just use:
```javascript
video.runEnterAnimation(); // Default animation is fade in
video.runExitAnimation(); // Default animation is fade out
```
This will be aware if the user rotates the device and if a rotate message is set
it will pause it self and hide from being visible.

- Play/Pausing the video:
```javascript
video.play();
video.pause();
```
- Custom enter/exit animations:
<br> We can override the default animations as shown the following example.
```javascript
 video.runEnterAnimation(function (videoContainer, onAnimationStart) {
        onAnimationStart(); // MUST BE CALLED when the animation starts to let the videoObject to be aware of itself!
        TweenMax.set(videoContainer,{x:0}); // The video if hidden is by default on x:'-3000'
        TweenMax.to(videoContainer, 3, {y: 0, opacity: 1
        });
    });
```
If you override the ```runExitAnimation()``` remember to keep the video out of the
screen when it finished.

## Contributing
Just create a new branch, add your code and make a pull request!
