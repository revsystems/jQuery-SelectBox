/*
jQuery-Proto

Tired of polluting the jQuery namespace with multiple functions for 
the same plugin? Sick of excessive trigger handling? You want a 
slicker API for your work, so use jQuery-Proto. It allows you to 
link a class to a jQuery object, and access its methods with sugary
jQuery syntax.

This product includes software developed 
by RevSystems, Inc (http://www.revsystems.com/) and its contributors

Please see the accompanying LICENSE.txt for licensing information.
  
  
    Define a new class with an init function, e.g.:
    function SelectBox() {
      
      // private variable
      var $sb;
      
      // the constructor
      this.init = function(param1, param2) {
        var $original = $(this.elem);
        $sb = $("<div>...</div>");
        $sb.click(myUtility)
        etc...
      }
      
      // a function that can be called whenever the classes is accessed via jQuery
      this.access = function(funcName, param) {
        console.log(funcName + " is being executed with a param value of " + param);
        console.log("Now actually execute " + funcName);
      };
      
      // private internal function
      function myUtility() {
        ...
      }
      
      // object oriented function
      this.publicFunction = function() {
        ...
      };
    }



    Use jQuery-Proto to associate your class to a jQuery function:
    -------------------------
    $.proto("sb", SelectBox);
    -------------------------


    Create your object, associate it with elements:
    $(".targets").sb();
    
    
    Access the object's functions through an interface
    $("#element").sb("reload");
    
    
    Do jQuery chaining with setters
    $("#element").sb("reload").doSomethingElseForElement();
    
    
    Get data using a getter
    var usesTie = $("#element").sb("options", "useTie");
    
    
    Return the object itself
    $("#element").sb();
    
    
*/

(function(jQuery) {
    var aps = Array.prototype.slice;
    $.proto = function() {
        var name = arguments[0],                                                    // The name of the jQuery function that will be called
            clazz = arguments[1],                                                   // A reference to the class that you are associating
            klazz = clazz.extend({ init: function(){} }),                           // A version of clazz with a delayed constructor
            dataId = name + "-" + Math.abs(Math.round(Math.random() * 999999999));  // A random ID to prevent collisions in the data object
            
        $.fn[name] = function() {
            
            var result, args = arguments;
                
            $(this).each(function() {
                var res,
                    $e = $(this),
                    obj = $e.data(dataId);
                
                // if the object is not defined for this element
                if(obj === undefined) {
                    
                    // create the new object and restore init
                    obj = new klazz();
                    obj.init = clazz.prototype.init;
                    
                    // set the elem property and initialize the object
                    obj.id = dataId;
                    obj.elem = $e[0];
                    if(obj.init) {
                        obj.init.apply(obj, aps.call(args, 0));
                    }
                    
                    // associate it with the element
                    $e.data(dataId, obj);
                    
                } else {
                  
                    // call the _access function if it exists (allows lazy loading)
                    if(obj.access) {
                        obj.access.apply(obj, aps.call(args, 0));
                    }
                    
                    // do something with the object
                    if(args.length > 0) {
                    
                        if($.isFunction(obj[args[0]])) {
                        
                            // use the method access interface
                            res = obj[args[0]].apply(obj, aps.call(args, 1));
                            result = res;
                        } else if(args.length == 1) {
                          
                            // just retrieve the property (leverage deep access with getObject if we can)
                            if($.getObject) {
                              result = $.getObject(args[0], obj);
                            } else {
                              result = obj[args[0]];
                            }
                        } else {
                          
                            // set the property (leverage deep access with setObject if we can)
                            if($.setObject) {
                              $.setObject(args[0], args[1], obj);
                            } else {
                              obj[args[0]] = args[1];
                            }
                        }
                        
                    } else if(result === undefined) {
                    
                        // return the first object if there are no args
                        result = $e.data(dataId);
                        
                    }
                }
            });
            
            // chain if no results were returned from the clazz's method (it's a setter)
            if(!result) { return $(this); }
            
            // return the first result
            return result;
        };
    };

}($));