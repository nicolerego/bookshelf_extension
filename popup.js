$( document ).ready(function() {
// This callback function is called when the content script has been 
// injected and returned its results
function onPageDetailsReceived(pageDetails)  { 
    document.getElementById('name').value = pageDetails.name; 
    document.getElementById('link').value = pageDetails.link; 
} 

// var shelves_url = 'http://localhost:3000/chrome_shelves/1';
$.getJSON('http://localhost:3000/chrome_shelves/1', function(data) {
    console.log("running templater")
    var template = $('#template').html();
    var rendered = Mustache.render(template, data)
    $("select[name='shelf-list']").html(rendered)
    
    var logged = $('select').val().length
    console.log(logged)
    if (logged > 1) {
        $('#addbookmark').show();
        $('.notLoggedIn').hide();
        $('.loggedIn').show();
    } 
})


// Global reference to the status display SPAN
var statusDisplay = null;

// POST the data to the server using XMLHttpRequest
function addBookmark() {

    event.preventDefault();

    var postUrl = 'http://localhost:3000/books/add_book_extension';

    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    
    // Prepare the data to be POSTed by URLEncoding each field's contents
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
  
    var params = {
        book: {
            name: name,
            link: link,
            note: note
        }, 
        commit: 'save',
        shelf_id: shelf_id 
    };

    // Replace any instances of the URLEncoded space char with +
    // params = params.replace(/%20/g, '/');

    // Set correct header for form data 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Handle request state change events
    xhr.onreadystatechange = function() { 
        // If the request completed
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