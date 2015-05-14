// JSON is in this variable
// we can't import direct from a json file because of browser script restrictions
// unless we're running a server
var pageData = jsonData;

// Celebrities JS

$(document).ready(function(e) {

  // we could use angularjs here instead
  // but using jQuery for now
  
  // populate header content
  Page.fillContent($('#header'), pageData);

  // event for birthplace field
  // use underscore to get values to populate this field
  var countries = _.uniq(_.pluck(pageData.celebrityList, 'country'));
  var $birthplace = $('#birthplace');
  Page.fillList($birthplace, _.sortBy(countries, function (s) { return s; }));
  $birthplace.change(function(e) {
    var $this = $(this);
    var value = $this.val().toLowerCase();

    var $entries = $celebrities.find('article');
    if (value == "") {
      $entries.removeClass('filtered-country');
    } else {
      $entries.addClass('filtered-country').filter('[data-value-country="' + value + '"]').removeClass('filtered-country');
    }
  });

  // Currency converter field
  var $converter = $('#converter');
  Page.fillContent($converter, pageData);
  $converter.change(function(e) {
    var $this = $(this);
    var conversion = parseFloat($this.val());
    
    $entries = $celebrities.find('article');
    $entries.each(function(i, o) {
      var $o = $(o);
      $o.find('span.currency').text($this.find('> option:selected').data('currency-label'));
      var $money = $o.find('span[data-content=netWorth]')
      $money.text(parseFloat($o.attr('data-value-networth') * conversion));
      $money.digits();
    })
  })

  // Search field
  var $search = $('#search');
  $search.keyup(function(e) {
    var $this = $(this);
    var value = $this.val();

    var $entries = $celebrities.find('article');
    if (value == "") {
      $entries.removeClass('filtered-name-age');
    } else {
      $entries.addClass('filtered-name-age').filter('[data-value-name*="' + value + '"], [data-value-age*="' + value + '"]')
        .removeClass('filtered-name-age');
    }

  });

  // Sort field
  var $sortBy = $('#sort-by');
  $sortBy.change(function(e) {
    var $this = $(this);
    var value = $this.val();

    var $entries = $celebrities.find('article');
    $entries.sort(function(a, b){
      var an = $(a).data('value-' + value),
        bn = $(b).data('value-' + value);
      return an > bn ? 1 : an < bn ? -1 : 0;
    });

    $entries.detach().appendTo($celebrities);

  });

  // fill in content 
  var $celebrities = $('#celebrities');
  Page.fillList($celebrities);

});


var Page = {
  // function to fill in content
  fillContent: function($article, data, includeValue) {

    $article.find('[data-content],[data-content-value]').each(function(i, o) {
      var $this = $(this);

      // put in content
      var content = $this.data('content');
      if (content) {
        $this.text(data[content]);

        // any special formatting?
        var format = $this.data('format');
        if (format == 'currency') {
          $this.digits()
        }
      }

      // if this a link, just populate href
      if ($this.is('a')) {
        $this.prop('href', data[$this.data('link')]);
        $this.removeAttr('data-link');
      }

      // if it has a value content
      var value = $this.data('content-value')
      if (value) {
        $this.attr('value', data[value]);
        $this.removeAttr('data-content-value');
      }

      // if includeValue has a value, store data as an attribute to $this
      // this is to make it easier for jQuery selectors to find this item during sorting and filtering
      if (includeValue) {
        $article.attr('data-value-' + content, (new String(data[content]).toLowerCase()));
      }

      
    });
  },
  fillList: function($this, list) {

    list = list || pageData[$this.data('each')]; // if no list is supplied, reference in the data-each attribute
    var $template = $this.find($this.data('on')).detach();

    // we're expecting an array
    var item;
    var $article;
    for (var i = 0, j = list.length; i < j; i++) {
      item = list[i];
      $article = $template.clone();
      $this.append($article);

      // populate each article content
      var includeValue = $this.data('includeValue');
      if ($.isPlainObject(item)) {
        Page.fillContent($article, item, includeValue);
      } else {
        $article.text(item);
      }
      
    }
  }
}

// Some StackOverflow plugin that looks useful for formatting
$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}