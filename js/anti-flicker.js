// anti-flicker 占位脚本（防止控制台 404 报错）
// 如需添加实际防闪烁逻辑，可在此扩展。
(function(){
  try {
    document.documentElement.classList.add('js-enabled');
  } catch(e) {}
})();


