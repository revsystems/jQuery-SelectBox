(function($) {
    
    // Utility Plugins ---------------------------
    
    $.fn.shrinkWrap = function( funcName ) {
        var result = [];
        $(this).each(function() {
            var $e = $(this),
                $shrink = $.browser.msie && $.browser.msie < 8
                    ? $("<div style='display:inline;zoom;1'></div>")
                    : $("<div style='display:inline-block;'></div>");
            if($e.children().size() > 0) {
                $e.children().wrapAll($shrink);
                result.push($shrink[funcName]());
                $e.append($shrink.children());
                $shrink.remove();
            } else {
                var html = $e.html();
                $e.html($shrink.append(html));
                result.push($shrink[funcName]());
                $e.html(html);
            }
        });
        return result.length == 1 ? result[0] : result;
    };
    
    $.fn.offsetFrom = function($e) { 
      return {
        left: $(this).offset().left - $e.offset().left,
        top: $(this).offset().top - $e.offset().top
      };
    };
    
    Array.max = function( array ){
        return Math.max.apply( Math, array );
    };
    
    Array.min = function( array ){
        return Math.min.apply( Math, array );
    };
    
    // For managing all the selectboxes at once -----------------------
    var SelectBoxes = Class.extend({
        
        init: function() {
            if($(window).data("selectboxes") === undefined) {
                $(window).data("selectboxes", {});
            }
        },
        
        add: function( id, selectbox ) {
            $(window).data("selectboxes")[id] = selectbox;
        },
        
        remove: function( id ) {
            delete $(window).data("selectboxes")[id];
        },
        
        collect: function( fn ) {
            var result = [],
                selectboxes = $(window).data("selectboxes");
            if(selectboxes.length > 0) {
                $.each(selectboxes, function(key, val) {
                    if(!fn || fn.call(val)) {
                        result.push(val);
                    }
                });
            }
            return result;
        },
        
        killAll: function() {
            $.each(this.collect(), function(i, sb) {
                sb.close();
            });
        },
        
        killAllExcept: function( selectbox ) {
            $.each(this.collect(), function(i, sb) {
                if(sb !== selectbox) {
                    sb.close();
                }
            });
        }
    });
    
    new SelectBoxes();
    var sbp = SelectBoxes.prototype;
    
    // SelectBox Class ---------------------------
    var SelectBox = Class.extend({
        
        _o: {
            context: "body",
            dropupThreshold: 150,
            fixedWidth: false
        },
        _display: null,
        _dropdown: null,
        $orig: null,
        $sb: null,
        $dd: null,
        $items: $([]),
        $enabled: $([]),
        $disabled: $([]),
        $optgroups: $([]),
        isDisabled: false,
        isOpen: false,
        
        // Initialize SelectBox ----------------------------------------
        init: function( options ) {
        
            // initialize vars
            var self = this;
            sbp.add(self);
            self.$orig = $(self.elem);
            self.isDisabled = self.$orig.is(":disabled");
            self._o = $.extend(self._o, options);
            console.log(self._o.context);
            if($.isFunction(self._o.context)) {
                self._o.context = self._o.context.call(self.elem);
            } else {
                self._o.context = $(self._o.context);
            }
            
            // create the new selectbox
            self.$sb = $("<div class='sb'></div>")
                .data("sb", self)
                .addClass(self.$orig.attr("class"));
            $("body").append(self.$sb);
            
            // create the display
            self._display = new Display( self.$orig );
            self.$display = self._display.newElem;
            self._display.sb = self;
            self.$sb.append(self.$display);
            
            // create the dropdown
            self._dropdown = new Dropdown( self.$orig );
            self._dropdown.sb = self;
            self.$dd = self._dropdown.newElem;
            self.$sb.append(self.$dd);
            
            // cache all/enabled/disabled options and all optgroups
            self._dropdown._root.each(function( option ) {
                if(!self.disabled && !option.disabled) {
                    self.$enabled = self.$enabled.add(option.newElem);
                }
                if(self.disabled || option.disabled) {
                    self.$disabled = self.$disabled.add(option.newElem);
                }
                self.$items = self.$items.add(option.newElem);
            });
            self.$optgroups = self.$dd.find("li.optgroup");
            
            // hide original
            self.$orig.hide();
            
            // for styling
            self.$items.filter(":first").addClass("first");
            self.$items.filter(":last").addClass("last");
            
            // for dynamic sized SBs, adjust the display size to the dropdown's largest element
            if(!self._o.fixedWidth) {
                var $targets = self.$items.add(self.$optgroups.children(".label")),
                    widths = $targets.shrinkWrap("outerWidth");
                self.$sb.width(Array.max(widths));
            }
            
            // place the sb now that the size is initialized, and hide the dropdown
            self.$orig.after(self.$sb);
            self.$dd.hide();
            
            if(!self.isDisabled) {
                self.$display.bind("blur", self.blurDisplay).bind("focus", self.focusDisplay);
                self.$display.bind("mousedown", self.open);
            }
        },
        
        // Open Selectbox -------------------------------------------------
        open: function() {
            var dir,
                self = $(this).closest(".sb").data("sb");
                
            // close any open dropdowns
            sbp.killAll();
            
            // mark this as open
            self.isOpen = true;
            self.$sb.addClass("open");
            
            // figure out positioning and show the dropdown
            dir = self.repositionDropdown();
            self._o.context.append(self.$dd);
            if(dir == "down") {
                self.$dd.slideDown(self._o.animDuration, self.centerOnSelected);
            } else {
                self.$dd.fadeIn(self._o.animDuration, self.centerOnSelected);
            }
            
            // focus the display
            self.$display.focus();
        },
        
        // Close Selectbox -------------------------------------------------
        close: function() {
            
        },
        
        blurDisplay: function( event ) {
            $(this).removeClass("focused");
        },
        
        focusDisplay: function( event ) {
            $(this).addClass("focused");
        },
        
        clickDisplay: function( event ) {
            if(this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },
        
        repositionDropdown: function() {
            var self = this,
                $ddCtx = self._o.context,
                $display = self.$display,
                $dd = self.$dd,
                ddMaxHeight = 0,
                ddX = $display.offsetFrom($ddCtx).left,
                ddY = 0,
                dir = "",
                bottomSpace, topSpace,
                bottomOffset, spaceDiff,
                bodyX, bodyY;
            
            // modify dropdown css for getting values
            $dd.removeClass("above");
            $dd.css({
                display: "block",
                maxHeight: "none",
                position: "relative",
                visibility: "hidden" 
            });
            
            // figure out if we should show above/below the display box
            bottomSpace = $(window).scrollTop() + $(window).height() - $display.offset().top - $display.outerHeight();
            topSpace = $display.offset().top - $(window).scrollTop();
            bottomOffset = $display.offsetFrom($ddCtx).top + $display.outerHeight();
            spaceDiff = bottomSpace - topSpace + self._o.dropupThreshold;
            if($dd.outerHeight() < bottomSpace) {
                ddMaxHeight = bottomSpace;
                ddY = bottomOffset;
                dir = "down";
            }
            else if($dd.outerHeight() < topSpace) {
                ddMaxHeight = topSpace;
                ddY = $display.offsetFrom($ddCtx).top - Math.min(ddMaxHeight, $dd.outerHeight());
                dir = "up";
            }
            else if(spaceDiff >= 0) {
                ddMaxHeight = bottomSpace;
                ddY = bottomOffset;
                dir = "down";
            }
            else if(spaceDiff < 0) {
                ddMaxHeight = topSpace;
                ddY = $display.offsetFrom($ddCtx).top - Math.min(ddMaxHeight, $dd.outerHeight());
                dir = "up";
            }
            else {
                ddMaxHeight = "none";
                ddY = bottomOffset;
                dir = "down";
            }
            
            // modify dropdown css for display
            bodyX = $().jquery < "1.4.2" ? $("body").offset().left : parseInt($("body").css("margin-left"));
            bodyY = $().jquery < "1.4.2" ? $("body").offset().top : parseInt($("body").css("margin-top"));
            $dd.css({
                display: "none",
                left: ddX + ($ddCtx[0].tagName.toLowerCase() == "body" ? bodyX : 0),
                maxHeight: ddMaxHeight,
                position: "absolute",
                top: ddY + ($ddCtx[0].tagName.toLowerCase() == "body" ? bodyY : 0),
                visibility: "visible"
            });
            if(dir == "up") {
                $dd.addClass("above");
            }
            return dir;
        }
        
    });
    
    // Display Class ---------------------------------
    var Display = Class.extend({
        
        arrowMarkup: "<div class='arrow_btn'><span class='arrow_icon'></span></div>",
        newElem: null,
        text: "",
        
        init: function( $orig ) {
            var self = this;
            self.text = self.format($orig.find(":selected"));
            self.newElem = self.toDOM();
        },
        
        toDOM: function() {
            var self = this,
                $display = $("<div class='display'>" + self.text + "</div>"),
                $focusDummy = $("<a href='#' class='focus_dummy'>&nbsp;</a>")
                    .bind("focus", function() { $display.focus(); })
                    .bind("blur", function() { $display.blur(); });
            return $display
                .append($focusDummy)
                .append($(self.arrowMarkup));
        },
        
        format: function( option ) {
            return $(option).html();
        }
    });
    
    // Dropdown Class --------------------------------
    var Dropdown = Class.extend({
        
        elem: null,
        $orig: null,
        $dd: null,
        _root: null,
        newElem: null,
        
        init: function( $orig ) {
            var self = this;
            self.$orig = $orig;
            self._root = self.build( $orig );
            self._root.newElem = self._root.toDOM();
            self.newElem = self.toDOM();
        },
        
        // build optgroup/option object tree from original <select>
        build: function( $orig ) {
            var emptyOption,
                self = this,
                og = new Optgroup();
                
            // create a root optgroup and append all children to it
            og.addChildren($orig.children());
            
            // if there are no children in the <select>, append an empty option
            if($orig.children().size() == 0) {
                emptyOption = new Option();
                emptyOption.text = "&nbsp;";
                emptyOption.selected = true;
                og.children.push(emptyOption);
            }
            
            return og;
        },

        // create a DOM element for the dropdown
        toDOM: function() {
            return this._root.newElem.addClass("dropdown");
        }
    });
    
    // Optgroup Class -----------------------------------
    var Optgroup = Class.extend({
        
        elem: null,
        label : undefined,
        disabled: false,
        children : undefined,
        newElem: null,
        
        // initialize an Optgroup based on an Optgroup element and its children
        init: function( elem ) {
            var self = this;
            self.elem = elem;
            self.children = [];
            self.label = null;
            if(elem) {
                var $e = $(elem);
                self.disabled = $(elem).is(":disabled");
                self.label = $e.attr("label");
                self.addChildren($e.children());
                self.newElem = self.toDOM();
            }
            return self;
        },
        
        /*
         * Optgroup format is:
         *
         *    <li class="optgroup">
         *        <div class="label">{Formatted Label HTML}</div>
         *        <ul>
         *            <li class="{selected} {disabled}">{Formatted Option HTML}</li>
         *            <li>etc...</li>
         *        </ul>
         *    </li>
         */
        toDOM: function() {
            var i, child, self = this,
                $optgroup,
                $label = $("<div class='label'></div>").html(this.format(this.elem)),
                $list = $("<ul></ul>");
            $.each(this.children, function(index, child) {
                if(child instanceof Optgroup) {
                    $optgroup = $("<li class='optgroup'></li>").data("class", self);
                    $list.append($optgroup.append(child.newElem));
                } else {
                    $list.append(child.newElem);
                }
            });
            if(this.label) {
              return $label.add($list);
            }
            return $list;
        },
        
        // add optgroups/options in $children to this Optgroup
        addChildren: function( $children ) {
            var self = this;
            $children.each(function() {
                var $child = $(this);
                if($child.is("optgroup")) {
                    self.children.push(new Optgroup($child[0]));
                } else {
                    self.children.push(new Option($child[0]));
                }
            });
        },
        
        // iterate over each Option element with fn
        // "this" context is always the current Optgroup
        each: function( fn ) {
            for(var i=0; i < this.children.length; i++) {
                var child = this.children[i];
                if(child instanceof Optgroup) {
                    child.each.call(child, fn);
                } else {
                    fn.call(this, child);
                }
            }
        },
        
        // generate markup based on an <optgroup> tag
        format: function( og ) {
            return $(og).attr("label");
        }
        
    });
    
    // Option Class --------------------------------------
    var Option = Class.extend({
    
        elem: null,
        value: "",
        text: "",
        selected: false,
        disabled: false,
        newElem: null,
        
        // initialize an Option based on option element
        init: function( elem, index ) {
            if(elem) {
                var self = this;
                var $e = $(elem);
                self.elem = elem;
                self.value = $e.attr("value") || "";
                self.text = $e.text() || "";
                self.disabled = $e.is(":disabled");
                self.selected = $e.is(":selected");
                self.newElem = this.toDOM();
            }
        },
        
        // create a DOM object for this Option
        toDOM: function() {
            return $("<li></li>")
                .data("class", this)
                .html(this.format(this.elem))
                .addClass(this.selected ? "selected" : "")
                .addClass(this.disabled ? "disabled" : "");
        },
        
        // generate markup from an <option> tag
        format: function( option ) {
            return $(option).html();
        }
        
    });
    
    // call proto
    $.proto("sb", SelectBox);
    
}(jQuery));