(function () {
  document.querySelectorAll("a").forEach(function (item) {
    item.onclick = function (event) {
      if (event.ctrlKey) {
        event.preventDefault();
        console.log(item.href);
      }
    };
  });
})();
