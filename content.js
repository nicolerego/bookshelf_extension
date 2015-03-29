chrome.runtime.sendMessage({
    'name': document.title,
    'link': window.location.href.replace('http://', '').replace('https://', '')
});