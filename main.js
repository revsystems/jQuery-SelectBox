$(document).ready(function() {
  $("select").not("[name=example5]").sb({ ddCtx: function() { return $(this).closest("form"); } });
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
});