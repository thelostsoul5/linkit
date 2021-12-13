// 读取数据，第一个参数是指定要读取的key以及设置默认值
chrome.storage.sync.get({search_engine: "https://www.baidu.com/s?ie=UTF-8&wd=%s"}, function(items) {
  document.getElementById("search_engine").value = items.search_engine;
});

document.getElementById("search_engine").onblur = function() {
  // 保存数据
  chrome.storage.sync.set({search_engine: this.value}, function() {
    console.log('保存成功！');
  });
}