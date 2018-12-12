main();

function main() {
  addTopic();  
}

function addTopic() {
    $('#forumadd').hide();
    $('#addtopicbutton').on('click', function() {
        $('#forumadd').toggle();;
    })
}

function submitTopic() {

    
}