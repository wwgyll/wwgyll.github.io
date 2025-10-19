// 复用站点导航：在缺少 .site-header 的页面自动注入
(function(){
  function computePrefix(){
    try{
      var p = location.pathname || '';
      return p.indexOf('/pages/') !== -1 ? '../' : '';
    }catch(_e){ return '' }
  }

  function createHeaderHTML(prefix){
    return (
      '<header class="site-header" role="banner">\n'
    + '  <div class="nav-container">\n'
    + '    <a class="brand" href="' + prefix + 'index.html#start"><img src="' + prefix + 'assets/tawy.png" class="brand-logo" alt="Tawy" aria-hidden="true" width="20" height="20"> TAWY 2025</a>\n'
    + '    <nav class="nav" aria-label="主导航">\n'
    + '      <a href="' + prefix + 'index.html#start">首页</a>\n'
    + '      <a href="' + prefix + 'index.html#features">文章</a>\n'
    + '      <a href="' + prefix + 'index.html#assets">资源</a>\n'
    + '      <a href="' + prefix + 'index.html#introduction">简介</a>\n'
    + '      <a href="' + prefix + 'index.html#contact">联系</a>\n'
    + '      <a href="' + prefix + 'index.html#MiniGame">MiniGame</a>\n'
    + '    </nav>\n'
    + '    <button class="music-btn header-music" id="music-toggle" type="button" aria-pressed="false" title="播放/暂停背景音乐">音乐</button>\n'
    + '  </div>\n'
    + '</header>'
    );
  }

  function injectHeader(){
    if(document.querySelector('.site-header')){ return }
    var prefix = computePrefix();
    var container = document.createElement('div');
    container.innerHTML = createHeaderHTML(prefix);
    var header = container.firstElementChild;
    if(!header){ return }
    document.body.insertBefore(header, document.body.firstChild || null);
    try{
      if(!document.getElementById('bg-audio')){
        var musicBtn = header.querySelector('#music-toggle');
        if(musicBtn){ musicBtn.style.display = 'none'; }
      }
    }catch(_e){ /* ignore */ }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', injectHeader);
  }else{
    injectHeader();
  }
})();


