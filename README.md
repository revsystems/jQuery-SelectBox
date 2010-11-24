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
