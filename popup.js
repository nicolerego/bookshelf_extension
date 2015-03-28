$( document ).ready(function() {
    console.log('working')

// This callback function is called when the content script has been 
// injected and returned its results
function onPageDetailsReceived(pageDetails)  { 
    document.getElementById('name').value = pageDetails.name; 
    document.getElementById('link').value = pageDetails.link; 
    document.getElementById('note').innerText = pageDetails.note; 
} 

// var shelves_url = 'http://localhost:3000/chrome_shelves/1';
$.getJSON('http://localhost:3000/chrome_shelves/1', function(data) {
    console.log("running templater")
    var template = $('#template').html();
    var rendered = Mustache.render(template, data)
    $("select[name='shelf-list']").html(rendered)
})

// Global reference to the status display SPAN
var statusDisplay = null;

// POST the data to the server using XMLHttpRequest
function addBookmark() {
    // Cancel the form submit
    event.preventDefault();

    // The URL to POST our data to
    var postUrl = 'http://localhost:3000/books/add_book_extension';

    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    
    // Prepare the data to be POSTed by URLEncoding each field's contents
    var name = document.getElementById('name').value;
    if (name.length > 20) {
        name = name.slice(0,17)+"...";
    }
    var link = encodeURIComponent(document.getElementById('link').value);
    var note = document.getElementById('note').value;
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
                // If it was a success, close the popup after a short delay
                statusDisplay.innerHTML = 'Saved!';
                window.setTimeout(window.close, 1000);
            } else {
                // Show what went wrong
                statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
            }
        }
    };

    // Send the request and set status
    xhr.send($.param(params));

    statusDisplay.innerHTML = 'Saving...';
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    // Get the event page
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in 
        // our onPageDetailsReceived function as the callback. This injects 
        // content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});

});