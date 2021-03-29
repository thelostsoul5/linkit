chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", message, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      sendResponse(xhr.responseText);
    }
  };
  xhr.send();
  return true; //这是重点，没有return true，上面返回的是undefined
});