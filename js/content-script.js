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
        onClick(event, this);
      }
    });
    showToast("Ctrl + click", 1000);
  }
};

function onClick(event, that) {
  if (!that) {
    that = this;
  }
  event.preventDefault();
  var url = that.href;
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

function showToast(msg, duration){
  duration=isNaN(duration)?3000:duration;  
  var m = document.createElement('div');  
  m.innerHTML = msg;  
  m.style.cssText="width:60%; min-width:180px; background:#000; opacity:0.6; height:auto;min-height: 30px; color:#fff; line-height:30px; text-align:center; border-radius:4px; position:fixed; top:60%; left:20%; z-index:999999;";  
  document.body.appendChild(m);  
  setTimeout(function() {  
      var d = 0.5;  
      m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';  
      m.style.opacity = '0';  
      setTimeout(function() { document.body.removeChild(m) }, d * 1000);  
  }, duration);  
}