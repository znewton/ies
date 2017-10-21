// Get Elements
var editor = document.getElementById("editor");
var preview = document.getElementById("preview");
var cssEditorTabButton = document.getElementById("css-editor-tab-button");
var jsEditorTabButton = document.getElementById("js-editor-tab-button");
var cssEditorTab = document.getElementById("css-editor-tab");
var jsEditorTab = document.getElementById("js-editor-tab");
var jsTextArea = document.getElementById("js-text-area");
var cssTextArea = document.getElementById("css-text-area");
var separator = document.getElementById("separator");

// Codemirror
var cmDefaults = {
  lineNumbers: true,
  theme: "base16-dark",
  styleActiveLine: true,
  tabSize: 2,
  matchBrackets: true
};
for (key in cmDefaults) {
  if(!CodeMirror.defaults.hasOwnProperty(key)) continue;
  CodeMirror.defaults[key] = cmDefaults[key];
}
var jsEditor = CodeMirror(jsTextArea, {
  value: "// your js here",
  mode: "javascript"
});
var cssEditor = CodeMirror(cssTextArea, {
  value: "/* your css here */",
  mode: "css"
});
setTimeout(function() {
  jsEditor.refresh();
  cssEditor.refresh();
},1);

// Define helper functions
function openCSSTab() {
  closeJSTab();
  cssEditorTab.classList.add('open');
  cssEditorTabButton.classList.add('selected');
  cssEditor.refresh();
}
function closeCSSTab() {
  cssEditorTab.classList.remove('open');
  cssEditorTabButton.classList.remove('selected');
}

function openJSTab() {
  closeCSSTab();
  jsEditorTab.classList.add('open');
  jsEditorTabButton.classList.add('selected');
  jsEditor.refresh();
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