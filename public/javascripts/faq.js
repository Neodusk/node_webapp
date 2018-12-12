
faqQuestions();

function faqQuestions() {
  $('#faqdiv').hide();
  $('#supportdiv').hide();
  
  $('#faq').on('click', function() {
    $('#faqdiv').toggle();
  })
  $('#support').on('click', function() {
    $('#supportdiv').toggle();
  })
}
