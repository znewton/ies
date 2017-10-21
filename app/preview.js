var renderedViewOpen = true;
var rawHtmlViewOpen = false;

// Get Elements
var viewToggle = document.getElementById("view-toggle");
var renderedViewTab = document.getElementById("rendered-view-tab");
var rawHtmlViewTab = document.getElementById("raw-html-view-tab");

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