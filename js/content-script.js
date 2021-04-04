console.log("linkit已加载");
var root;
var inner;
document.onkeydown = function (e) {
  if (!e) {
    e = window.event;
  }
  if (e.altKey && e.key === "l") {
    root = createRoot();
    var header = createHeader(root);
    inner = createFrame();
    var linkit = pkgDiv("linkit", inner);

    root.appendChild(header);
    root.appendChild(linkit);
    document.querySelector("body").appendChild(root);

    rebaseDocument(document, function (event) {
      if (event.ctrlKey) {
        event.preventDefault();
        var url = this.href;
        if (url !== null && url !== "") {
          getSrcDoc(url, function (response) {
            if (response, url) {
              inner.srcdoc = dealWithSrcdoc(response, url);
              inner.onload = function (e) {
                rebaseDocument(inner.contentDocument, onClick);
                root.style.display = "block";
              };
            }
          });
        }
      }
    });
  }
};

function onClick(event) {
  event.preventDefault();
  var url = this.href;
  if (url !== null && url !== "") {
    getSrcDoc(url, function (response) {
      if (response) {
        inner.srcdoc = dealWithSrcdoc(response, url);
        inner.onload = function (e) {
          rebaseDocument(inner.contentDocument, onClick);
          root.style.display = "block";
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

function createRoot() {
  var root = pkgDiv("linkit_root");
  return root;
}

function createHeader(root) {
  var header = pkgDiv("linkit_header");
  var button = document.createElement("button");
  button.type = "button";
  button.title = "关闭(Esc)";
  button.id = "linkit_close";
  button.onclick = function (e) {
    root.style.display = "none";
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
  if (child) {
    div.appendChild(child);
  }
  return div;
}
