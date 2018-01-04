// Change if the images are too big or your internet is slow
var addNewImageFrecuency = 1500

var imgCount = 0,
    currentImageToAdd = 0,
    sparkFlowImageDialogOpenAnimationTime = 1000,
    addImageInterval = setInterval(function () {
        openImageAdderDialog()
        setTimeout(addImage, sparkFlowImageDialogOpenAnimationTime)
    }, addNewImageFrecuency)

function openImageAdderDialog() {
    $('#add-button').trigger('mouseenter')
    $('[data-action="picture"]').click()
}

function addImage() {
    getFilteredImageCount()
    addImageToTheCanvas()
    stopIntervalIfAllImagesAreAdded()
    incrementCounter()
}

function getFilteredImageCount() {
    // initialize only once
    if (imgCount === 0) {
        imgCount = $(".modal-body .asset-list .asset-name").length - 1
    }
}

function addImageToTheCanvas() {
    // If we save the jQuery object in a variable it stops working
    $(".modal-body .asset-list .asset-name")[currentImageToAdd].click()
    $(".modal-body .asset-list .asset-name")[currentImageToAdd].click()
}

function stopIntervalIfAllImagesAreAdded() {
    if (currentImageToAdd >= imgCount) {
        clearInterval(addImageInterval)
    }
}

function incrementCounter() {
    currentImageToAdd++
}
