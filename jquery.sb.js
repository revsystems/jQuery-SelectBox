/*
  jQuery-SelectBox
  
  Traditional select elements are very difficult to style by themselves, 
  but they are also very usable and feature rich. This plugin attempts to 
  recreate all selectbox functionality and appearance while adding 
  animation and stylability.
  
  This product includes software developed 
  by RevSystems, Inc (http://www.revsystems.com/) and its contributors
  
  Please see the accompanying LICENSE.txt for licensing information.
*/

(function($) {

jQuery.fn.borderWidth = function() { return $(this).outerWidth() - $(this).innerWidth(); };
jQuery.fn.marginWidth = function() { return $(this).outerWidth(true) - $(this).outerWidth(); };
jQuery.fn.paddingWidth = function() { return $(this).innerWidth() - $(this).width(); };
jQuery.fn.extraWidth = function() { return $(this).outerWidth(true) - $(this).width(); };
jQuery.fn.offsetFrom = function($e) { 
  return {
    left: $(this).offset().left - $e.offset().left,
    top: $(this).offset().top - $e.offset().top
  };
};

jQuery.fn.maxWidth = function() {
  var max = 0;
  $(this).each(function() {
    if($(this).width() > max) max = $(this).width();
  });
  return max;
}

jQuery.fn.sb = function(o) {

  if($.browser.msie && $.browser.version < 7) return $(this);
  
  o = $.extend({
    acTimeout: 800,               // time between each keyup for the user to create a search string
    animDuration: 300,            // time to open/close dropdown in ms
    ddCtx: 'body',                // body | self | any selector | a function that returns a selector (the original select is the context)
    fixedWidth: true,             // if false, dropdown expands to widest and display conforms to whatever is selected
    maxHeight: false,             // if an integer, show scrollbars if the dropdown is too tall
    maxWidth: false,              // if an integer, prevent the display/dropdown from growing past this width; longer items will be clipped
    noScrollThreshold: 100,       // the minimum height of the dropdown before it can show scrollbars--very rarely applied
    placement: 'before' ,         // before | after (does the new markup go before or after the original select?
    selectboxClass: 'selectbox',  // class to apply our markup
    
    // markup appended to the display, typically for styling an arrow
    arrowMarkup: "<span class='arrow_btn'><span class='interior'><span class='arrow'></span></span></span>",
    
    // formatting for the display; note that it will be wrapped with <a href='#'><span class='text'></span></a>
    optionFormat: function(ogIndex, optIndex) {
      return $(this).text();
    },
    
    // the function to produce optgroup markup
    optgroupFormat: function(ogIndex) {
      return "<span class='label'>" + $(this).attr("label") + "</span>";
    }
  }, o);
  
  $(this).each(function() {
    var $orig = $(this);
    var $sb = null;
    var $display = null;
    var $dd = null;
    var $items = null;
    
    function loadSB() {
      // create the new markup from the old
      $sb = $("<div class='" + o.selectboxClass + " " + $orig.attr("class") + "'></div>");
      $("body").append($sb);
      $display = $("<a href='#' class='display " + $orig.attr("class") + "'><span class='value'>" + $orig.val() + "</span> <span class='text'>" + o.optionFormat.call($orig.find("option:selected")[0], 0, 0) + "</span>" + o.arrowMarkup + "</a>");
      $sb.append($display);
      $dd = $("<ul class='items " + $orig.attr("class") + "'></ul>");
      $sb.append($dd);
      if($orig.children("optgroup").size() > 0) {
        $orig.children("optgroup").each(function(i) {
          var $og = $(this);
          var $ogItem = $("<li class='optgroup'>" + o.optgroupFormat.call($og[0], i+1) + "</li>");
          var $ogList = $("<ul class='items'></ul>");
          $ogItem.append($ogList);
          $dd.append($ogItem);
          $og.children("option").each(function(j) {
            $ogList.append("<li class='" + ($(this).attr("selected") ? "selected" : "" ) + " " + ($(this).attr("disabled") ? "disabled" : "" ) + "'><a href='#'><span class='value'>" + $(this).attr("value") + "</span><span class='text'>" + o.optionFormat.call(this, i+1, j+1) + "</span></a></li>");
          });
        });
      }
      $orig.children("option").each(function(i) {
        $dd.append("<li class='" + ($(this).attr("selected") ? "selected" : "" ) + " " + ($(this).attr("disabled") ? "disabled" : "" ) + "'><a href='#'><span class='value'>" + $(this).attr("value") + "</span><span class='text'>" + o.optionFormat.call(this, 0, i+1) + "</span></a></li>");
      });
      $items = $dd.find("li").not(".optgroup");
      $dd.children(":first").addClass("first");
      $dd.children(":last").addClass("last");
      $orig.hide();
    
      if(o.fixedWidth) {
        // match display size to largest element
        var largestWidth = $sb.find(".text").maxWidth() + $display.extraWidth() + 1;
        $sb.width(o.maxWidth ? Math.min(o.maxWidth, largestWidth) : largestWidth);
        if($.browser.msie && $.browser.version <= 7) {
          $items.find("a").each(function() {
            $(this).css("width", "100%").width($(this).width() - $(this).paddingWidth() - $(this).borderWidth());
          });
        }
      }
      else if(o.maxWidth && $sb.width() > o.maxWidth) {
        $sb.width(o.maxWidth);
      }
      
      if(o.placement == 'before') {
        $orig.before($sb);
      }
      else if(o.placement == 'after') {
        $orig.after($sb);
      }
      // initialize dd and bindings
      $dd.hide();
      if(!$orig.is(":disabled")) {
        $display.click(clickSB).focus(focusSB).blur(blurSB).hover(addHoverState, removeHoverState);
        $items.not(".disabled").find("a").click(clickSBItem);
        $items.filter(".disabled").find("a").click(function() { return false; });
        $items.not(".disabled").hover(addHoverState, removeHoverState);
        $dd.find(".optgroup").hover(addHoverState, removeHoverState);
      }
      else {
        $sb.addClass("disabled");
        $display.click(function(e) { e.preventDefault(); });
      }
      $sb.bind("close", closeSB);
      $sb.bind("destroy", destroySB);
      $orig.bind("reload", function() { destroySB(); loadSB(); });
      $orig.focus(focusOrig);
    }
    
    function focusOrig() { $display.focus(); return false; }
    
    function reloadSB() { destroySB(); loadSB(); }
    
    // unbind and remove
    function destroySB() {
      $sb.unbind().find("*").unbind();
      $sb.remove();
      $orig.unbind("reload", reloadSB).unbind("focus", focusOrig).show();
    }
    
    // when the user clicks outside the sb
    function killAndUnbind() {
      killAll();
      $(document).unbind("click", killAndUnbind);
    }
    
    // trigger all sbs to close
    function killAll() {
      $("." + o.selectboxClass).trigger("close");
    }
    
    // to prevent multiple selects open at once
    function killAllButMe() {
      $("." + o.selectboxClass).not($sb[0]).trigger("close");
    }
    
    // hide and reset dropdown markup
    function closeSB() {
      $sb.removeClass("open");
      $items.removeClass("hover");
      $dd.fadeOut(o.animDuration, function() {
        $sb.append($dd);
      });
      $(document).unbind("keyup", keyupSB);
      $(document).unbind("keydown", stopPageHotkeys);
    }
    
    function getDDCtx() {
      var $ddCtx = null;
      if(o.ddCtx == "self") {
        $ddCtx = $sb;
      }
      else if($.isFunction(o.ddCtx)) {
        $ddCtx = $(o.ddCtx.call($orig[0]));
      }
      else {
        $ddCtx = $(o.ddCtx);
      }
      return $ddCtx;
    }
    
    // show, reposition, and reset dropdown markup
    function openSB() {
      var $ddCtx = getDDCtx();
      killAll();
      $sb.addClass("open");
      var dir = positionSB();
      $ddCtx.append($dd);
      function setScrollFunc() {
        $dd.scrollTop($items.filter(".selected").offsetFrom($dd).top - $dd.height() / 2 + $items.filter(".selected").outerHeight(true) / 2);
      }
      if(dir == "up") $dd.fadeIn(o.animDuration, setScrollFunc);
      else if(dir == "down") $dd.slideDown(o.animDuration, setScrollFunc);
      else $dd.fadeIn(o.animDuration, setScrollFunc);
      $(document).unbind("keyup", keyupSB).keyup(keyupSB);
      $(document).unbind("keydown", stopPageHotkeys).keydown(stopPageHotkeys);
      $(document).click(killAndUnbind);
    }
    
    // position dropdown based on collision detection
    function positionSB() {
      var $ddCtx = getDDCtx();
      var ddMaxHeight = 0;
      var ddY = 0;
      var dir = "";
      
      // modify dropdown css for getting values
      $dd.removeClass("above");
      $dd.css({
        display: "block",
        maxHeight: "none",
        position: "relative",
        visibility: "hidden" 
      });
      if(o.fixedWidth) $dd.width($display.outerWidth() - $dd.extraWidth() + 1);
      
      // figure out if we should show above/below the display box
      var bottomSpace = $(window).scrollTop() + $(window).height() - $display.offset().top - $display.outerHeight();
      var topSpace = $display.offset().top - $(window).scrollTop();
      var bottomOffset = $display.offsetFrom($ddCtx).top + $display.outerHeight();
      if($dd.outerHeight() <= bottomSpace) {
        ddMaxHeight = o.maxHeight ? o.maxHeight : bottomSpace;
        ddY = bottomOffset;
        dir = "down";
      }
      else if($dd.outerHeight() <= topSpace) {
        ddMaxHeight = o.maxHeight ? o.maxHeight : topSpace;
        ddY = $display.offsetFrom($ddCtx).top - Math.min(ddMaxHeight, $dd.outerHeight());
        dir = "up"
      }
      else if(bottomSpace > o.noScrollThreshold && bottomSpace > topSpace) {
        ddMaxHeight = o.maxHeight ? o.maxHeight : bottomSpace;
        ddY = bottomOffset;
        dir = "down";
      }
      else if(topSpace > o.noScrollThreshold) {
        ddMaxHeight = o.maxHeight ? o.maxHeight : topSpace;
        ddY = $display.offsetFrom($ddCtx).top - Math.min(ddMaxHeight, $dd.outerHeight());
      }
      else {
        ddMaxHeight = o.maxHeight ? o.maxHeight : "none";
        ddY = bottomOffset;
        dir = "down";
      }
      
      
      // modify dropdown css for display
      $dd.css({
        display: "none",
        left: $display.offsetFrom($ddCtx).left + ($ddCtx[0].tagName.toLowerCase() == "body" ? parseInt($("body").css("margin-left")) : 0),
        maxHeight: ddMaxHeight,
        position: "absolute",
        top: ddY + ($ddCtx[0].tagName.toLowerCase() == "body" ? parseInt($("body").css("margin-top")) : 0),
        visibility: "visible"
      });
      if(dir == "up") $dd.addClass("above");
      return dir;
    }
    
    // when the user explicitly clicks the display
    function clickSB(e) {
      var $sb = $(this).closest("." + o.selectboxClass);
      if($sb.is(".open")) {
        closeSB();
        $display.focus();
      }
      else {
        $display.focus();
        openSB();
      }
      return false;
    }
    
    // when the user selects an item in any manner
    function selectItem() {
      var $item = $(this);
      $display.find(".value").html($item.find(".value").html());
      $display.find(".text").html($item.find(".text").html());
      $display.find(".text").attr("title", $item.find(".text").html());
      $dd.find("li").removeClass("selected");
      $item.closest("li").addClass("selected");
      $orig.val($display.find(".value").html()).change();
    }
    
    // when the user explicitly clicks an item
    function clickSBItem(e) {
      selectItem.call(this);
      killAndUnbind();
      $display.focus();
      return false;
    }
    
    // helper functions for matching on keyup
    var searchTerm = "";
    var cstTimeout = null;
    function clearSearchTerm() {
      searchTerm = "";
    }
    function findMatchingItem(term) {
      var ts = "";
      var $available = $items.not(".disabled");
      for(var i=0; i < $available.size(); i++) {
        var t = $available.eq(i).find(".text").text();
        ts += t + " ";
        if(t.toLowerCase().match("^" + term.toLowerCase()) == term.toLowerCase()) {
          return $available.eq(i);
        }
      }
      return null;
    }
    function selectMatchingItem(text) {
      var $matchingItem = findMatchingItem(text);
      if($matchingItem != null) {
        selectItem.call($matchingItem[0]);
        return true;
      }
      return false;
    }
    function stopPageHotkeys(e) {
      // Stop up/down/backspace/space from moving the page
      if(e.which == 38 || e.which == 40 || e.which == 8 || e.which == 32) {
        e.preventDefault();
      }
    }
    
    // go up/down using arrows or attempt to autocomplete based on string
    function keyupSB(e) {
      if(e.altKey || e.ctrlKey) return false;
      var $selected = $items.filter(".selected");
      switch(e.which) {
      case 38: // up
        if($selected.size() > 0) {
          if($items.not(".disabled").filter(":first")[0] != $selected[0]) {
            selectItem.call($items.not(".disabled").eq($items.not(".disabled").index($selected)-1)[0]);
          }
        }
        break;
      case 40: // down
        if($selected.size() > 0) {
          if($items.not(".disabled").filter(":last")[0] != $selected[0]) {
            selectItem.call($items.not(".disabled").eq($items.not(".disabled").index($selected)+1)[0]);
          }
        }
        else if($items.size() > 1) {
          selectItem.call($items.eq(0)[0]);
        }
        break;
      default:
        searchTerm += String.fromCharCode(e.keyCode);
        if(!selectMatchingItem(searchTerm)) {
          clearTimeout(cstTimeout);
          clearSearchTerm();
        }
        else {
          clearTimeout(cstTimeout);
          cstTimeout = setTimeout(clearSearchTerm, o.acTimeout);
        }
        break;
      }
      return false;
    }
    
    // when the sb is focused (by tab or click), allow hotkey selection and kill all other selectboxes
    function focusSB() {
      killAllButMe();
      $sb.addClass("focused");
      if(!$sb.is(".open")) {
        $(document).unbind("keyup", keyupSB).keyup(keyupSB);
        $(document).unbind("keydown", stopPageHotkeys).keydown(stopPageHotkeys);
      }
    }
    
    // when the sb is blurred (by tab or click), disable hotkey selection
    function blurSB() {
      $sb.removeClass("focused");
      $(document).unbind("keyup", keyupSB);
      $(document).unbind("keydown", stopPageHotkeys);
    }
    
    function addHoverState() { $(this).addClass("hover"); }
    function removeHoverState() { $(this).removeClass("hover"); }
    
    loadSB();
  });
};

})(jQuery);