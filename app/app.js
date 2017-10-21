// Get Elements
var editor = document.getElementById("editor");
var preview = document.getElementById("preview");
var cssEditorTabButton = document.getElementById("css-editor-tab-button");
var jsEditorTabButton = document.getElementById("js-editor-tab-button");
var cssEditorTab = document.getElementById("css-editor-tab");
var jsEditorTab = document.getElementById("js-editor-tab");
var separator = document.getElementById("separator");

// Define helper functions
function openCSSTab() {
  closeJSTab();
  cssEditorTab.classList.add('open');
  cssEditorTabButton.classList.add('selected');
}
function closeCSSTab() {
  cssEditorTab.classList.remove('open');
  cssEditorTabButton.classList.remove('selected');
}

function openJSTab() {
  closeCSSTab();
  jsEditorTab.classList.add('open');
  jsEditorTabButton.classList.add('selected');
}
function closeJSTab() {
  jsEditorTab.classList.remove('open');
  jsEditorTabButton.classList.remove('selected');
}

// Set Event Listeners
cssEditorTabButton.addEventListener('click', function () {
  openCSSTab();
});
jsEditorTabButton.addEventListener('click', function () {
  openJSTab();
});
(function applyResizeListeners() {
  var resize = function (e) {
    editor.style.width = (e.clientX)+"px";
    preview.style.width = (window.innerWidth - e.clientX) + "px";
    separator.style.left = (e.clientX - (0.0025*window.innerWidth)) + "px";
    separator.style.right = (e.clientX + (0.0025*window.innerWidth)) + "px";
  }
  var endResize = function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', endResize);
  }
  separator.addEventListener('mousedown', function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', endResize);
  });
})()



// Initialize
openCSSTab();