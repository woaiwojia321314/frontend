/*########################

  Controls
  
##########################*/

var clock = $.extend($('#time')[0], {
  time: 0,
  customAnimate: true,
  updated: true
});
// replace jQuery.fx.step._default
var $_fx_step_default = $.fx.step._default;
$.fx.step._default = function (fx) {
  if (!fx.elem.customAnimate) return $_fx_step_default(fx);
  fx.elem[fx.prop] = fx.now;
  fx.elem.updated = true;
};


$('#time')
  .on('input', function(){
    paperfolds[0].open( parseInt($(this).val())/100 );
    $('#showTime').text( $(this).val() );
  })
  .on(inputDown, function(event){
    event.stopPropagation();
    paperfolds[0].element.addClass('no-transition'); // stop animation while moving manually
  })
  .on(inputUp, function(event){
    paperfolds[0].element.removeClass('no-transition');
  });

$('#foldHeight')
  .on(inputDown, function(event){
    event.stopPropagation();
  })
  .on('input', function(){
    paperfolds[0].update( $(this).val() );
    $('#showFoldHeight').text( $(this).val() );
  });
  
$('#perspective')
  .bind(inputDown, function(event){
    event.stopPropagation();
  })
  .on('input', function(){
    $('.hidden .fold').add($('body')).css(Modernizr.prefixed('perspective'),  $(this).val() + 'px');
    $('#showPerspective').text( $(this).val() );
  });
  
$('#showHelpers').change(function(){
  $('body').toggleClass('showHelpers');
})

/*########################

  Global 3D

##########################*/
 
var mouse = { startX: 0, startY: 0 };
var innerElement = $('.buddycloud .stream');

function normalizedX(event){
	return Modernizr.touch ? event.originalEvent.touches[0].pageX : event.pageX;
}	

function normalizedY(event){
	return Modernizr.touch ? event.originalEvent.touches[0].pageY : event.pageY;
}
 
$('.playground').bind(inputDown, function(event){
  event.preventDefault();
  if(event.button === 2) return true; // right-click
  mouse.startX = normalizedX(event);
  mouse.startY = normalizedY(event);
  // store the transform state
  // globalMatrix.setMatrixValue($inner.css('-webkit-transform'));
  $(document)
   .bind(inputMove, move)
   .one(inputUp, function(){ $(document).unbind(inputMove); });
});

function move(event){
  event.preventDefault();
  var offsetX = normalizedX(event) - mouse.startX;
  var offsetY = normalizedY(event) - mouse.startY;
  if(event.shiftKey){
   offsetX = roundToMultiple(offsetX, 15);
   offsetY = roundToMultiple(offsetY, 15);
  }
  innerElement.css(transformString, 'rotateY('+offsetX+'deg) rotateX('+-offsetY+'deg)');
  /* move relative to the initial position
  $inner.css('-webkit-transform', globalMatrix.rotate(-offsetY, offsetX, 0));//*/
}

function roundToMultiple(number, multiple){
  var value = number/multiple
  ,   integer = Math.floor(value)
  ,   rest = value - integer;
  return rest > 0.5 ? (integer+1)*multiple : integer*multiple;
}
 
/* ###

  new topic animation

  ### */

// works for both new topic field and all the small answer fields
var newTopic = $('.answer');

function openArea(event){
  // prevent bubbling!
  event.stopPropagation();
  if(!$(this).hasClass('write')){
    $(this).addClass('write');
    $(document).one(inputDown, {self: this}, closeArea);
  }
}

function closeArea(event){
  var self = event.data.self;
  var textarea = $(self).find('textarea');
  // minimize the textarea only if the textarea is empty
  if(textarea.val() === ""){
    $(self).removeClass('write');
  }
}

newTopic.bind(inputDown, openArea);