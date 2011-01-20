$(document).ready(function() {
  $("[name=example], [name=example2], [name=example3], [name=example4], [name=example5], [name=example6], [name=os0], [name=example7]").sb({ ddCtx: function() { return $(this).closest("form"); } });
  $("select[name=example]").append("<option value='8'>New Option</option>").triggerHandler("reload");
  
  // dynamic examples
  $("[name=example5]").sb({ useTie: true });
  $("[name=example5]").append("<option>dynamically added</option>");
  $("[name=example5]").append("<option>and this one</option>");
  setTimeout(function() {
    $("[name=example5]").append("<option>this one is appended 5 seconds after load</option>");
  }, 5000);
  setTimeout(function() {
    $("[name=example5]").empty().append("<option>10 seconds later, we remove stuff and add this one.</option><option>5 seconds later, the one above will be disabled</option>");
  }, 10000);
  setTimeout(function() {
    $("[name=example5] option:first").attr("disabled", "disabled");
  }, 15000);
  
  
  $("select[name=example6]").sb({
    displayFormat: function() {
      if($(this).attr("label")) {
        return $("<div>").append($($(this).attr("label")).filter("strong")).html();
      }
      return $(this).text();
    }
  });
  $("[name=example8], [name=example9]").sb({
    fixedWidth: true
  });
});