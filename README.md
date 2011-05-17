# jQuery-SelectBox

  Traditional select elements are very difficult to style by themselves, 
  but they are also very usable and feature rich. This plugin attempts to 
  recreate all selectbox functionality and appearance while adding 
  animation and stylability.
  
  Please feel free to rate this plugin on [plugins.jquery.com](http://plugins.jquery.com/project/jquery-sb).

# Demo

  You can view the selectboxes in action [here](http://dl.dropbox.com/u/124192/websites/selectbox/index.html).
  
# TODO

  * Test ARIA markup
  * Create optional skins

# Features

  * Recreates and extends all functionality of the browser's built-in `<select>` element
  * Fully stylable and flexible with standard, valid markup
  * Compliant with ARIA guidelines and best practices
  * Original select is updated behind-the-scenes
  * Change event handlers on original `<select>` still work
  * Keyboard Accessible: Manages tab focus, supports up/down/home/end hotkeys and automatic matching of typed strings
  * Javascript animations on close/open
  * Intelligent collision avoidance (the selectbox tries to fit on the screen)
  * Deals effectively with cross-browser z-index issues
  * Handles optgroups
  * Handles disabled selects
  * Handles disabled optgroups
  * Handles disabled options
  * Can be refreshed arbitrarily, i.e. when you dynamically add/remove options from the original select
  * Options for a specific `<select>` can be changed on the fly
  * Can be set to refresh automatically, using [jquery.tie](https://github.com/revsystems/jQuery-Tie), when the underlying `<select>` changes
  * Allows custom markup formatting for visible elements

  The css in this plugin also includes an example custom style called "round_sb".
  Its purposes are (a) to give you an example of how to override the default style, 
  and (b) to give you a familiar but slightly more modern version of the selectbox 
  that you can integrate with minimal or no css modification.

# Compatibility

  jQuery-SelectBox has been tested and confirmed working in the following browsers:
  
  * Firefox 3.6.12
  * Google Chrome 7.0.517.44
  * Opera 11.00 build 1156
  * IE9 beta
  * IE8 (via IE9 beta)
  * IE7 (via IE9 beta)
  
  It requires [jQuery version 1.3.x](http://jquery.com) and up.
  
  IE6 and below are ignored by jQuery-SelectBox.

# Usage

Requires [jQuery](http://jquery.com) and this plugin.

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.sb.js"></script>
    
If you want to use dynamic selects with [jquery.tie](https://github.com/revsystems/jQuery-Tie), you need to include it before jquery.sb:

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.tie.js"></script>
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
        fixedWidth: true,
        etc...
      });
    });

If you've used javascript to modify the contents of the original select, and you want the changes to appear in the replacement, calling "refresh" should match them:

    $(document).ready(function() {
      $("select").sb();
      $("select").append("<option>Hey! I'm new!</option>");
      $("select").sb("refresh");
    });
    
Alternatively, if you don't have control over the function that triggers the reload--for example, if you're using an AJAX framework--you can use 
[jquery.tie](https://github.com/revsystems/jQuery-Tie) to monitor the contents of the original select and update when necessary:

    $(document).ready(function() {
      $("select").sb({ useTie: true });
      $("select").append("<option>Hey! I'm new!</option>");
    });
    
Refreshing can be done at any time, even while the SelectBox is open.

You can also change the options for a SelectBox on the fly:

    // this initializes all s
    $("select").sb()
    
    // and this sets a specific set to use fixedWidth styling:
    $("select.fixed_width").sb("options", { fixedWidth: true });

# Custom Styling

## Making a fixed width selectbox

Say you want to make your selectboxes a fixed width so they line up with the rest of your inputs. Try something like this.

When you initialize jQuery-sb, use the fixedWidth flag:

    $(document).ready(function() {
      $("select.fixed_width").sb({ fixedWidth: true });
    });
    
In your css, you can add the following to make a selectbox with visual width = 100px:

    .selectbox.fixed_width .display{
      width:73px;
      padding:0 24px 0 3px; /* remember padding contributes to the overall width. padding-right is large enough here for the arrow graphic. */
    }
    .selectbox.fixed_width.items{
      width:100px; /* width of display text plus the padding (73 + 27) = 100, so they line up */
    }

# Options
  
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
      
      Given an option as the context, returns a string or DOM/jQuery object that will be displayed in the dropdown.
      The default is simply to use the option's text.
      
  **displayFormat** (function)
      
      Given an option as the context, returns a string or DOM/jQuery object that will be displayed in 
      the "display"--the portion of the selectbox that is always visible. If not specified, it will default to 
      the value of optionFormat.
      
  **optgroupFormat** (function)
      
      Given an optgroup as the context, returns a string that will be displayed in the dropdown. The 
      default displays the optgroup's label attribute.
      
  **ddCtx** (selector / DOM Element / function that returns a selector)
  
      Short for "Dropdown Context". When the dropdown is displayed, its markup is appended to the bottom 
      of this context. This helps take care of any z-index issues that IE might have. If you are using 
      popups or overlays on your page, the default of "body" might not be appropriate and you can set 
      something more specific. When not using the default, the ddCtx element should have position:relative 
      or position:absolute in its CSS. Otherwise, the dropdown will not appear in the right place.
      
  **dropupThreshold** (integer)
      
      When determining whether to display a dropdown or a dropup, this value is used to weight the comparison.
      The space above is compared to the space below the selectbox. If the dropupThreshold is positive, then 
      the space above must be that many more pixels than the space below to show above. If the dropupThreshold 
      is negative, then the space below must be that many more pixels than the space above to show below.

  **fixedWidth**  (boolean)

      False by default.
      If set to FALSE, the width of the select will be variable, conforming to the longest dropdown value.
      If set to TRUE, the width should be specified from the site's css.

  **maxHeight** (false / positive integer)
  
      Allows you to set the maximum pixel height of the dropdown. By default, the maximum height varies 
      based on the position of the dropdown relative to the window.

  **maxWidth** (false / positive integer)

      Allows you to set the maximum pixel width of the selectbox. By default, the width varies based on the 
      widest dropdown element. If white-space:nowrap is set on dropdown elements, then they will be clipped 
      past the maxWidth.

  **selectboxClass** (string)

      The class used to identify selectboxes. This is used to kill inactive dropdowns when one is selected.
      
  **useTie** (boolean)
      
      Default is false. When set to true and jquery.tie is 
      included on the page, this will automatically monitor changes in the underlying select and update 
      jquery-sb accordingly.

      
# Troubleshooting

## jQuery-SelectBox in div with z-index
  
If you call $("select").sb() (no special options) on a select in a z-index'ed element, the dropdown 
may appear UNDERNEATH the element.

You have two options in dealing with this scenario. The first is setting ddCtx to the absolutely 
positioned element. This will make sure that it always appears on top of it. Or you can modify the 
css for .items to have a z-index greater than the parent div.

For newer versions, I set the default z-index of .items to 99999, so you probably won't see this issue 
unless you're using huge z-index values.


## margin:auto on body

Across different browsers and jQuery versions, it is very difficult to get a stanard margin value for the 
body when it is set to "auto".

If you have margin-left set to auto for your body element, jQuery-SelectBox will completely break in IE7. 
In other browsers, it may or may not position incorrectly.

If you need to center your page, I highly recommend not doing it with the `body` tag. The implementation 
is too finicky. Instead, I often use the following pattern.

In your css file:

    body{margin:0;}
    .outer_container{
      text-align:center; /* text-align centers the child div in old versions of IE */
    } 
    .inner_container{
      margin:0 auto; /* margin:auto centers in newer browsers */
      text-align:left; /* text-align:left resets the sub-elements */
      width:960px; /* the width of your page */
    } 

In your HTML:

    <div class="outer_container">
      <div class="inner_container">
        Everything in here will be centered
      </div>
    </div>
    
If you use this pattern, you should have no issues with margin:auto on `body`.


## I need to keep margin:auto on my body tag. How do I get jQuery-SelectBox to behave?

If you're stuck with margin:auto on the `body` element, then I suggest specifying the ddCtx option.
The ddCtx (dropdown context) option lets you change which element the dropdown is appended to, thereby 
avoiding dependence on the body tag's margin.

For example, you might have this fragment in your markup:

    <body>
      <div id="an_arbitrary_container">
        <select>
          <option>An Option</option>
        </select>
      </div>
    </body>

In which case, you'd want the following CSS:

    #an_arbitrary_container{position:relative;}

And to specify ddCtx when you initialize jQuery-SelectBox:

    $("select").sb({ ddCtx: "#an_arbitrary_container" });
    
The downside to this method is that, if z-index comes into play, the dropdown might appear BEHIND siblings of 
`#an_arbitrary_container`--due to the buggy z-index handling in IE7. Consider yourself warned. You can manipulate 
the z-indexes in CSS so it works, but it's advanced.
  

## IE7/IE8: Javascript error is thrown when clicking to open the selectbox
    
See "margin:auto on body" above. If that is not the problem, please let me know on the
[Issues Page](https://github.com/revsystems/jQuery-SelectBox/issues).


# Bug Reports

  Before you report a bug, I highly suggest making sure you have the most up-to-date version of 
  jQuery-SelectBox. I update the code very frequently and may introduce/squash bugs in rapid succession. This 
  will continue until an official release is announced, at which point a stable download will be created and a new 
  development branch will be started.
  
  If you spot a bug that's lingering, please let me know on the
  [jQuery-SelectBox Github Issues page](https://github.com/revsystems/jQuery-SelectBox/issues).