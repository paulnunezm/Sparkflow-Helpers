/*!
 * Sparkflow UI Enhancer
 * DATE: 2018-01-19
 *
 * @author: Abrahan Silverio
 **/
(function (window, $) {
  if (window.enhacedUI !== undefined) {
    console.warn('Already exits, or check if you are in the wrong console execution context.')
    return
  }

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
      '.img-tooltip { display:none; position:absolute; border:1px solid #333; max-width:350px; background-color:#333; border-radius:5px; padding:10px; z-index:99999 }' +
      '.img-tooltip img { width:100%; max-width:350px; max-heigh:350px; }' +
      '.hide-all.active, .lock-all.active  {color: #f60;}' +
      '/*ends*/' +
    '</style>'))

  // Insert custom buttons
  $document.find('#layer-panel .title.ui-draggable-handle').append([ hideAllBtn, lockAllBtn ])

  // Increase elments id field on inspector panel
  $document.find('#element-id-ref').width('92%')

  // Add event delegation for buttons
  hideAllBtn.on('click', function () {
    layersContainer.find('[data-icon="q"]').not('span').trigger('click')
    layersContainer.find('[data-icon="q"].controller').not('.disabled').length
      ? $(this).addClass('active')
      : $(this).removeClass('active')
  })

  lockAllBtn.on('click', function () {
    layersContainer.find('[data-icon="1"]').trigger('click')
    layersContainer.find('[data-icon="1"].controller').not('.disabled').length
      ? $(this).addClass('active')
      : $(this).removeClass('active')
  })
})(window, jQuery)
