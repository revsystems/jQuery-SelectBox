# jQuery-SelectBox

Traditional <select> elements are very difficult to style by themselves, 
but they are also very usable and feature rich. This plugin attempts to 
recreate all selectbox functionality and appearance while adding 
animation and stylability.

## Features

  * Fully stylable and flexible with standard, valid markup
  * Original <select> is updated behind-the-scenes
  * Change event handlers on original <select> still work
  * Allows up/down hotkeys on focus
  * Allows automatic matching of typed strings on focus
  * Javascript animations on close/open
  * Intelligent collision avoidance (the selectbox tries to fit on the screen)
  * Deals effectively with cross-browser z-index issues
  * Handles optgroups
  * Handles disabled selects
  * Handles disabled options
  * Can be reloaded arbitrarily, i.e. when you dynamically add/remove options from the original <select>

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

Or to set specific options:

    $(document).ready(function() {
      $("select").sb({ ... });
    });

## Options
 
  **acTimeout**
  
    Short for "Autocomplete Timeout". When a selectbox is highlighted, you can type to select a 
    matching option. This timeout specifies how long the user has after each keystroke to concatenate 
    another letter onto the search string. If there is no keystroke before the timeout is completed, 
    the search string is reset.

  **animDuration**
  
      Short for "Animation Duration". The time it takes for the closing/opening dropdown animation to play.

  **ddCtx**
  
      Short for "Dropdown Context". When the dropdown is displayed, its markup is append to the bottom 
      of this context. This helps take care of any z-index issues that IE might have. If you are using 
      popups or overlays on your page, the default of "body" might not be appropriate and you can set 
      something more specific. The ddCtx element should explicitly set the position css attribute to 
      relative or absolute. Otherwise, the dropdown will not appear in the right place.

  **fixedWidth**

      If set to true, the width of the select will be variable. In other words, the width of the selected 
      value will conform to whatever that value is. The width of the dropdown will conform to the widest 
      dropdown element. By default, this is false, which means the width of the selected value inherits the 
      width of the dropdown element.

  **maxHeight**
  
      Allows you to set the maximum pixel height of the dropdown. By default, the maximum height varies 
      based on the position of the dropdown relative to the window.

  **maxWidth**

      Allows you to set the maximum pixel width of the selectbox. By default, the width varies based on the 
      widest dropdown element. If white-space:nowrap is set on dropdown elements, then they will be clipped 
      past the maxWidth.

  **noScrollThreshold**

      Rarely necessary. There is a point at which the window is so small that it doesn't make sense to use 
      scrollbars in the dropdown. In this scenario, the height of the document is extended with the dropdown.

  **selectboxClass**

      The class used to identify selectboxes. This is used to kill inactive dropdowns when one is selected.

  **placement**

      Markup preference. Determines whether you want to place the markup before or after the existing select.