var root;
var inner;
var mask;
var pageMax;
var pageMin;
document.onkeydown = function (e) {
  if (!e) {
    e = window.event;
  }
  if (e.altKey && e.key === "l") {
    root = createRoot();
    pageMax = createPageMax();
    pageMin = createPageMin();
    var header = createHeader(root);
    inner = createFrame();
    var linkit = pkgDiv("linkit", inner);
    mask = createMask();

    pageMax.appendChild(header);
    pageMax.appendChild(linkit);
    pageMin.appendChild(mask);

    root.appendChild(pageMax);
    root.appendChild(pageMin);
    var body = document.querySelector("body");
    body.appendChild(root);

    rebaseDocument(document, function (event) {
      if (event.ctrlKey) {
        onClick(event, this);
      }
    });
  }
};

function onClick(event, that) {
  if (!that) {
    that = this;
  }
  event.preventDefault();
  var url = that.href;
  if (url !== null && url !== "") {
    var text = that.innerText;
    getSrcDoc(url, function (response) {
      if (response) {
        inner.srcdoc = dealWithSrcdoc(response, url);
        inner.onload = function (e) {
          rebaseDocument(inner.contentDocument, onClick);
          maxPage();
          mask.innerText = text;
        };
      }
    });
  }
}

function dealWithSrcdoc(srcdoc, url) {
  var base = "<base href='"+ url +"'></base>";
  return srcdoc.replace("<head>", "<head>"+base);
}

function rebaseDocument(doc, callback) {
  doc.querySelectorAll("a").forEach(function (item) {
    item.onclick = callback;
  });
}

function getSrcDoc(url, callback) {
  chrome.runtime.sendMessage(url, callback);
}

function createMask() {
  var mask = pkgDiv("linkit_mask");
  mask.innerText = "ctrl + click";
  mask.onclick = function (event) {
    if (inner.srcdoc) {
      maxPage();
    }
  }
  return mask;
}

function createRoot() {
  var root = pkgDiv("linkit_root");
  root.classList.add("min");
  return root;
}

function createPageMax() {
  var pageMax = pkgDiv("page_max");
  pageMax.style.display = "none";
  return pageMax;
}

function createPageMin() {
  var pageMin = pkgDiv("page_min");
  pageMin.style.display = "flex";
  return pageMin;
}

function createHeader(root) {
  var header = pkgDiv("linkit_header");
  var button = document.createElement("button");
  button.type = "button";
  button.title = "关闭(Esc)";
  button.id = "linkit_close";
  button.onclick = function (e) {
    minPage();
  };

  header.appendChild(button);
  return header;
}

function createFrame() {
  var inner = document.createElement("iframe");
  inner.id = "linkit_inner";
  return inner;
}

function pkgDiv(id, child) {
  var div = document.createElement("div");
  div.id = id;
  div.className = id;
  if (child) {
    div.appendChild(child);
  }
  return div;
}

function maxPage() {
  pageMax.style.display = "block";
  pageMin.style.display = "none";

  root.classList.remove("min");
}

function minPage() {
  pageMax.style.display = "none";
  pageMin.style.display = "flex";

  root.classList.add("min");
}