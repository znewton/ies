var renderedViewOpen = true;
var rawHtmlViewOpen = false;

// Get Elements
var viewToggle = document.getElementById("view-toggle");
var renderedViewTab = document.getElementById("rendered-view-tab");
var rawHtmlViewTab = document.getElementById("raw-html-view-tab");
var urlInput = document.getElementById("url-input");
var renderedViewIframe = document.getElementById("rendered-view-frame");
var rawHtmlViewBlock = document.getElementById("raw-html-view-block");

// Set Helper Functions
function openRenderedViewTab() {
  renderedViewOpen = true;
  renderedViewTab.classList.add('open');
  closeRawHtmlViewTab();
}
function closeRenderedViewTab() {
  renderedViewOpen = false;
  renderedViewTab.classList.remove('open');
}
function openRawHtmlViewTab() {
  rawHtmlViewOpen = true;
  rawHtmlViewTab.classList.add('open');
  closeRenderedViewTab();
}
function closeRawHtmlViewTab() {
  rawHtmlViewOpen = false;
  rawHtmlViewTab.classList.remove('open');
}
openRenderedViewTab();

// Add Event Listeners
viewToggle.addEventListener('change', function(e) {
  if (renderedViewOpen) {
    openRawHtmlViewTab();
  } else if (rawHtmlViewOpen) {
    openRenderedViewTab();
  }
})
urlInput.addEventListener('keypress', function (e) {
  if (e.keyCode == 13) {
    sendSiteToEdit();
  }
});

// others
function setPreviewUrl(url, html) {
  urlInput.setAttribute('value', url);
  if (url && html) {
    rawHtmlViewBlock.innerText = html;
    renderedViewIframe.src = endpoint + "/temp/" + sessionId + "/temp.html";
  } else {
    rawHtmlViewBlock.innerText = '';
  }
}

function sendSiteToEdit() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', endpoint + '/session?session=' + sessionId);
  xhr.setRequestHeader('content-type', 'application/json');
  console.log(urlInput.value)
  xhr.send(JSON.stringify({
    site: urlInput.value
  }));
  xhr.onreadystatechange = function () {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK)  {
        rawHtmlViewBlock.innerText = xhr.responseText;
        PR.prettyPrint();
        renderedViewIframe.src = endpoint + "/temp/" + sessionId + "/temp.html";
      }
    };
  }
}