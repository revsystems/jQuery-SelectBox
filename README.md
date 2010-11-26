# jQuery-SelectBox

  Traditional select elements are very difficult to style by themselves, 
  but they are also very usable and feature rich. This plugin attempts to 
  recreate all selectbox functionality and appearance while adding 
  animation and stylability.
  
  Please feel free to rate this plugin on [plugins.jquery.com](http://plugins.jquery.com/project/jquery-sb).

## Demo

  You can view the selectboxes in action [here](http://dl.dropbox.com/u/124192/websites/selectbox/index.html).

## Features

  * Fully stylable and flexible with standard, valid markup
  * Original select is updated behind-the-scenes
  * Change event handlers on original select still work
  * Allows up/down hotkeys on focus
  * Allows automatic matching of typed strings on focus
  * Javascript animations on close/open
  * Intelligent collision avoidance (the selectbox tries to fit on the screen)
  * Deals effectively with cross-browser z-index issues
  * Handles optgroups
  * Handles disabled selects
  * Handles disabled options
  * Can be reloaded arbitrarily, i.e. when you dynamically add/remove options from the original select
  * Allows custom markup formatting for visible elements

  The css in this plugin also includes an example custom style called "round_sb".
  Its purposes are (a) to give you an example of how to override the default style, 
  and (b) to give you a familiar but slightly more modern version of the selectbox 
  that you can integrate with minimal or no css modification.

## Compatibility

  jQuery-SelectBox has been tested in the following browsers:
  
  * Firefox 3.6.12
  * Google Chrome 7.0.517.44
  * IE7 (via IE9 beta)
  * IE8 (via IE9 beta)
  * IE9 beta
  
  It requires [jQuery version 1.3.x](http://jquery.com) and up.

## Usage

Requires [jQuery](http://jquery.com) and this plugin.

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.sb.js"></script>

There is also css. You can feel free to copy this css to your master file or include it separately.

    <link rel="stylesheet" href="jquery.sb.css" type="text/css" media="all" />

To apply the plugin to select elements:

    $(document).ready(function() {
      $("select").sb();
    });

To apply with options set:

    $(document).ready(function() {
      $("select").sb({
        animDuration: 1000,
        ddCtx: function() { return $(this).closest("form"); },
        fixedWidth: false,
        etc...
      });
    });

If you've used javascript to modify the contents of the original select, and you want the changes to appear in the replacement, triggering "reload" should match them:

    $(document).ready(function() {
      $("select").sb();
      $("select").append("<option>Hey! I'm new!</option>");
      $("select").trigger("reload");
    });

## Options
  
  View defaults and short descriptions for options in jquery.sb.js. This list is meant to be more 
  informative than the js comments.
 
  **acTimeout** (duration)
    
    Short for "Autocomplete Timeout". When a selectbox is highlighted, you can type to select a 
    matching option. This timeout specifies how long the user has after each keystroke to concatenate 
    another letter onto the search string. If there is no keystroke before the timeout is completed, 
    the search string is reset.

  **animDuration** (duration)
  
      Short for "Animation Duration". The time it takes for the closing/opening dropdown animation to play.
  
  **arrowMarkup** (string)
  
      The HTML that is appended to the display. Usually it's an arrow, but it could be whatever you want.
      
  **optionFormat** (function)
      
      Given an option as the context, returns a string that will be displayed in the dropdown. The default
      is simply to use the option's text.
      
  **optgroupFormat** (function)
      
      Given an optgroup as the context, returns a string that will be displayed in the dropdown. The 
      default displays the optgroup's label attribute.
      
  **ddCtx** (selector / DOM Element / function that returns a selector)
  
      Short for "Dropdown Context". When the dropdown is displayed, its markup is appended to the bottom 
      of this context. This helps take care of any z-index issues that IE might have. If you are using 
      popups or overlays on your page, the default of "body" might not be appropriate and you can set 
      something more specific. When not using the default, the ddCtx element should have position:relative 
      or position:absolute in its CSS. Otherwise, the dropdown will not appear in the right place.

  **fixedWidth**  (boolean)

      If set to true, the width of the select will be variable. In other words, the width of the selected 
      value will conform to whatever that value is. The width of the dropdown will conform to the widest 
      dropdown element. By default, this is false, which means the width of the selected value inherits the 
      width of the dropdown element.

  **maxHeight** (false / positive integer)
  
      Allows you to set the maximum pixel height of the dropdown. By default, the maximum height varies 
      based on the position of the dropdown relative to the window.

  **maxWidth** (false / positive integer)

      Allows you to set the maximum pixel width of the selectbox. By default, the width varies based on the 
      widest dropdown element. If white-space:nowrap is set on dropdown elements, then they will be clipped 
      past the maxWidth.

  **noScrollThreshold** (positive integer)

      Rarely necessary. There is a point at which the window is so small that it doesn't make sense to use 
      scrollbars in the dropdown. In this scenario, the height of the document is extended with the dropdown.

  **placement** ("before" / "after")

      Markup preference. Determines whether you want to place the markup before or after the existing select.

  **selectboxClass** (string)

      The class used to identify selectboxes. This is used to kill inactive dropdowns when one is selected.
      
## Troubleshooting

  **jQuery-SelectBox in div with z-index**
  
      If you call $("select").sb() (no special options) on a select in a z-index'ed element, the dropdown 
      may appear UNDERNEATH the element.
      
      You have two options in dealing with this scenario. The first is setting ddCtx to the absolutely 
      positioned element. This will make sure that it always appears on top of it. Or you can modify the 
      css for .items to have a z-index greater than the parent div.