chrome.runtime.sendMessage({
    'name': document.title,
    'link': window.location.href,
    'note': window.getSelection().toString()
});