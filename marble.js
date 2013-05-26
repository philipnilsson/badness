Bacon.logMarble = function(elem, stream) {
  stream.onValue(function(x) {
    var time = window.sc.now()
    var parent = $(elem).parent()
    var mn = parent.attr('x-time-min')
    var min = Math.min(time, typeof mn === 'undefined' ? 9007199254740992 : parseInt(mn))
    var max = Math.max(time, parseInt(parent.attr('x-time-max')) || 0)
    parent.attr('x-time-min', min);
    parent.attr('x-time-max', max);
    var content = typeof x.describe === 'undefined' ? x : x.describe;
    $(elem).append(
      $('<span style="position: absolute" x-time="'+time+'"/>').html(content))
  })
}

$('.bacon-marble').each(function() {
 var inputs = $(this).find('.bacon-input').map(function() {
   var stream = eval(this.attributes['x-bacon-input'].value)
   $(this).append('<div style="display: inline">&nbsp;</div>')
   Bacon.logMarble(this, stream)
   return stream
 }).toArray()
 $(this).find('.bacon-output').each(function() {
   var stream = eval('(' + this.attributes['x-bacon-output'].value + ')').apply(null, inputs)
   var elem = this;
   $(this).append('<div style="display: inline">&nbsp;</div>')
   Bacon.logMarble(this, stream)
   stream.onEnd(function() {
     var parent = elem.parentNode;
     var elems = $(parent).children('div').children('span').toArray()
     var max = parent.attributes['x-time-max'].value
     var min = parent.attributes['x-time-min'].value
     var delta = max - min
     for (var i in elems) {
       $(elems[i]).css('left', Math.floor(100 * (elems[i].attributes['x-time'].value - min) / delta / 1.1)*1 + 2 + '%')
    }
   })
 })
 
})
