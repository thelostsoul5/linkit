(function () {
  document.onmousedown = function (e) {
    if (!e) {
      e = window.event;
    }
    if (e.ctrlKey) {
      whichElement(e);
    }
  };
})();

function whichElement(e) {
  var targ;
  if (!e) {
    var e = window.event;
  }
  if (e.target) {
    targ = e.target;
  } else if (e.srcElement) {
    targ = e.srcElement;
  }
  if (targ.nodeType == 3) {
    // defeat Safari bug
    targ = targ.parentNode;
  }
  var tname = targ.tagName;
  if ("A" == tname) {
    alert(targ.href);
  }
}
