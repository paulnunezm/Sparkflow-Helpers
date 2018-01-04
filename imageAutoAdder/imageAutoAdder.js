// Change if the images are too big or your internet is slow
var addNewImageFrecuency = 1500

var imgCount = 0,
    intervalCounter = 0
var addImageInterval = setInterval(function () {
    $('#add-button').trigger('mouseenter')
    $('[data-action="picture"]').click()
    setTimeout(function () {
        if (imgCount === 0) {
            imgCount = $(".modal-body .asset-list .asset-name").length - 1
        }
        $(".modal-body .asset-list .asset-name")[intervalCounter].click()
        $(".modal-body .asset-list .asset-name")[intervalCounter].click()
        if (intervalCounter >= imgCount) {
            clearInterval(addImageInterval)
        } else {
            intervalCounter++
        }
    }, 1000)
}, addNewImageFrecuency)
