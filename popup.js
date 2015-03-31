$( document ).ready(function() {

function onPageDetailsReceived(pageDetails)  { 
    document.getElementById('name').value = pageDetails.name; 
    document.getElementById('link').value = pageDetails.link; 
} 

$.getJSON('http://webbookshelf.herokuapp.com/chrome_shelves/1', function(data) {
    console.log("running templater")
    var template = $('#template').html();
    var rendered = Mustache.render(template, data)
    $("select[name='shelf-list']").html(rendered)
    
    var logged = $('select').val().length
    if (logged > 1) {
        $('#addbookmark').show();
        $('.notLoggedIn').hide();
        $('.loggedIn').show();
    } 
})


// Global reference to the status display SPAN
var statusDisplay = null;

function addBookmark() {

    event.preventDefault();

    var postUrl = 'http://webbookshelf.herokuapp.com/books/add_book_extension';

    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    
    var name = document.getElementById('name').value;
    if (name.length > 20) {
        name = name.slice(0,17)+"...";
    }

    var link = document.getElementById('link').value;
      
    var note = document.getElementById('note').value;
    if (note.length > 150) {
        note = note.slice(0,147)+"...";
    }

    var shelf_id = $('select :selected').val();
    var read = $('input[name="read"]:checked').val();
  
    var params = {
        book: {
            name: name,
            link: link,
            note: note, 
            read: read
        }, 
        commit: 'save',
        shelf_id: shelf_id 
    };

    // $.ajax({
    //   url: 'http://localhost:3000/books/add_book_extension',
    //   data: $.param(params),
    //   dataType: 'script',
    //   method: 'POST', 
    //   async:true 
    // }).done(function() {
    //     statusDisplay.innerHTML = 'Saved!';
    //     window.setTimeout(window.close, 1000);
    // }).fail(function(){
    //     statusDisplay.innerHTML = 'Error saving!';
    // });

    // Set correct header for form data 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() { 
        
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            if (xhr.status == 200) {
                statusDisplay.innerHTML = 'Saved!';
                window.setTimeout(window.close, 1000);
            } else {
                statusDisplay.innerHTML = 'Error saving!';
            }
        }
    };

    // Send the request and set status
    xhr.send($.param(params));
    statusDisplay.innerHTML = 'Saving...';
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    statusDisplay = document.getElementById('status-display');
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.getPageDetails(onPageDetailsReceived);
    });

});

});