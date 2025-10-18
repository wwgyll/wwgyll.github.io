// 注入轮播组件 DOM；与现有 script.js 的轮播初始化兼容
(function(){
    function createCarouselHTML(){
        return (
            '<div class="carousel-viewport">\n'
          + '  <div class="carousel-track">\n'
          + '    <div class="carousel-slide is-active" data-title="犬夜叉">\n'
          + '      <a class="carousel-link" href="pages/gallery-artasset.html" target="_blank" rel="noopener">\n'
          + '        <img src="https://th.bing.com/th/id/R.9ffa2cc637bee16ab353c78a4a9b5730?rik=tLgedATWSi75lQ&pid=ImgRaw&r=0" alt="美术资产" class="carousel-img">\n'
          + '      </a>\n'
          + '    </div>\n'
          + '    <div class="carousel-slide" data-title="鬼灭之刃">\n'
          + '      <a class="carousel-link" href="pages/gallery-engineditor.html" target="_blank" rel="noopener">\n'
          + '        <img src="https://th.bing.com/th/id/R.6a3984201f8613797ee77b68669f696e?rik=EPxbUmd%2bqjrDWg&riu=http%3a%2f%2fi2.hdslb.com%2fbfs%2farchive%2f446deeb0335d24dc5e9b6365b95bec559583a021.jpg&ehk=y9PPuIEqUfPtb99xzRL%2bZbWcchW%2b%2fHNP29cJui5WQuU%3d&risl=&pid=ImgRaw&r=0g" alt="引擎插件" class="carousel-img">\n'
          + '      </a>\n'
          + '    </div>\n'
          + '    <div class="carousel-slide" data-title="荒野大镖客2">\n'
          + '      <a class="carousel-link" href="pages/gallery-shaders.html" target="_blank" rel="noopener">\n'
          + '        <img src="https://th.bing.com/th/id/R.ed50027b36b16b1f3a2730e8e4b62de4?rik=M9HuZWu3sYzABw&pid=ImgRaw&r=0" alt="着色器示例" class="carousel-img">\n'
          + '      </a>\n'
          + '    </div>\n'

          + '    <div class="carousel-slide" data-title="龙珠">\n'
          + '      <a class="carousel-link" href="pages/gallery-shaders.html" target="_blank" rel="noopener">\n'
          + '        <img src="https://tse2.mm.bing.net/th/id/OIP.TzKJnoHHlyP3BkWjSemO5AHaEo?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3" alt="着色器示例" class="carousel-img">\n'
          + '      </a>\n'
          + '    </div>\n'

          + '  </div>\n'
          + '  <button class="carousel-btn prev" type="button" aria-label="上一张">‹</button>\n'
          + '  <button class="carousel-btn next" type="button" aria-label="下一张">›</button>\n'
          + '  <div class="carousel-dots" role="tablist" aria-label="轮播指示器"></div>\n'
          + '  <div class="carousel-caption" aria-live="polite"></div>\n'
          + '</div>'
        );
    }

    function injectCarousel(){
        var mount = document.getElementById('carousel-mount');
        if(!mount){ return }
        mount.innerHTML = createCarouselHTML();
    }

    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', injectCarousel);
    }else{
        injectCarousel();
    }
})();


