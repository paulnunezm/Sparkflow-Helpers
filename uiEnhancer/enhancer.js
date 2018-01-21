/*!
 * Sparkflow UI Enhancer
 * DATE: 2018-01-19
 *
 * @author: Abrahan Silverio
 **/
(function (window, $) {
  if (window.enhacedUI !== undefined) {
    console.warn('Already installed, or check if you are in the right console execution context.')
    return
  }

  var hoverTimeout
  window.enhacedUI = true
  var $document = $(document)
  var layersContainer = $('#layers-container')
  var hideAllBtn = $('<div></div>', { title: 'Toggle displayed layers', class: 'hide-all', 'data-icon': 'n' })
  var lockAllBtn = $('<div></div>', { class: 'lock-all', title: 'Toggle locked Layers', 'data-icon': '1' })

  // CSS Styles for buttons
  $document.find('head').append(
    $('<style>' +
      '.hide-all, .lock-all  {color: #eee; padding:5px; width: 20px; height: 20px; position: absolute; top: 2px }' +
      '.hide-all { right: 40px }' + '.lock-all {right: 20px}' +
      '.img-tooltip { display:none; position:absolute; border:1px solid #333; max-width:350px; background-color:#333; border-radius:5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); padding:10px; z-index:99999 }' +
      '.img-tooltip img { width:100%; max-width:350px; max-heigh:350px; }' +
      '.hide-all.active, .lock-all.active  {color: #f60;}' +
      '[data-type="hitarea"].ui-selected { background-color: rgba(74, 255, 255, 0.34) !important; }' +
      '[data-type="image"].ui-selected { background-color: rgba(0, 194, 255, 0.16) !important; }' +
      '#csseditor-panel .CodeMirror-sizer { background-color: #000 }' +
      '/*ends*/' +
    '</style>'))

  // Insert custom buttons
  $document.find('#layer-panel .title.ui-draggable-handle').append([ hideAllBtn, lockAllBtn ])

  // Increase elments id field on inspector panel
  $document.find('#element-id-ref').width('92%')

  // Add event for buttons
  hideAllBtn.on('click', function () {
    setActiveBtn('q', $(this))
  })

  lockAllBtn.on('click', function () {
    setActiveBtn('1', $(this))
  })

  function setActiveBtn (iconType, iconElement) {
    layersContainer.find('[data-icon="' + iconType + '"]').trigger('click')
    iconElement.toggleClass('active')
  }

  // Add event delegation for hovering layers
  layersContainer.on('mouseenter', '.item:contains("image")', function (e) {
    clearTimeout(hoverTimeout)
    var currentLayer = this
    hoverTimeout = setTimeout(function () {
      $('<div class="img-tooltip"></div>')
        .html($('<img />', { src: $('#device-screen #' + currentLayer.getAttribute('data-id') + ' img').attr('src') }))
        .css({ top: e.pageY + 10, left: e.pageX + 20 })
        .appendTo('body')
        .fadeIn(300)
    }, 1000)
  })
  .on('mouseleave', '.item:contains("image")', function (e) {
    clearTimeout(hoverTimeout)
    $('.img-tooltip').fadeOut(200, function () {
      $('.img-tooltip').remove()
    })
  })
  .on('mousemove', '.item:contains("image")', function (e) {
    $('.img-tooltip').css({ top: e.pageY, left: e.pageX })
  })
})(window, jQuery)
