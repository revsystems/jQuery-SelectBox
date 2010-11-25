$(document).ready(function() {
  $("select").sb({ ddCtx: function() { return $(this).closest("form"); } });
  $("select[name=example]").append("<option value='8'>New Option</option>").trigger("reload");
});