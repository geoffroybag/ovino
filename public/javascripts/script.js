document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

// setTimeout(function(){
//     window.location = window.location.protocol + '//' + window.location.host + "/index";
// }, 3000);


var cart = []

$(".appelation").click(function () {

  var wine = $(event.target);
  wine.toggleClass("selected");
  $(function() {
    $(".section-reco .selected").each(function() {
      cart.push($(this).attr('name'));
    });
  });

});






// function with each 
// = $(".section-reco").find('.selected').attr('name');

