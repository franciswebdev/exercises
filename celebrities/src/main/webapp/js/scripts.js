// JSON is in this variable
// we can't import direct from a json file because of browser script restrictions
// unless we're running a server
var pageData = jsonData;

// Celebrities JS

$(document).ready(function(e) {

  // we could leverage page content with angular
  // but using jQuery for now
  $('.fillable [data-content]').each(function(i, o) {
    var $this = $(this);
    var content = $this.data('content');
    if (content) {
      $this.text(pageData[content]);
      if ($this.is('a')) {
        $this.prop('href', pageData[$this.data('link')]);
      }
    }

  });

});