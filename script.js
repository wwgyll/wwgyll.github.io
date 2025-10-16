// 年份
document.getElementById('year').textContent = new Date().getFullYear();

// 低带宽 / 用户偏好处理
(function(){
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType === '2g');
    const video = document.getElementById('bg-video');

    if(!video){return}

    if(prefersReducedMotion || saveData){
        // 尽量减少自动播放，保留海报
        video.removeAttribute('autoplay');
        video.pause();
        video.currentTime = 0;
        video.style.display = 'none';
        document.querySelector('.video-background').style.background = "#0b0f14 url('assets/poster.svg') center/cover no-repeat fixed";
        return;
    }

    // 自动播放失败时的回退
    const onPlayError = (err) => {
        video.style.display = 'none';
        document.querySelector('.video-background').style.background = "#0b0f14 url('assets/poster.svg') center/cover no-repeat fixed";
        if(window.console && err){console.warn('视频播放失败，已回退到静态背景。', err)}
    };

    if(video.paused){
        video.play().catch(onPlayError);
    }
})();

// 背景音乐播放/暂停切换
(function(){
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-audio');
    if(!btn || !audio){return}

    let isPlaying = false;
    let triedAuto = false;

    // WebAudio 兼容：在首次交互时创建音频上下文并连接音源
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let sourceNode = null;
    let gainNode = null;

    function ensureAudioGraph(){
        // 在本地 file:// 预览时跳过 WebAudio 连接，避免潜在策略/跨域限制
        if(typeof location !== 'undefined' && location.protocol === 'file:'){ return }
        if(!AudioCtx){return}
        if(audioCtx){return}
        try{
            audioCtx = new AudioCtx();
            sourceNode = audioCtx.createMediaElementSource(audio);
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.6;
            sourceNode.connect(gainNode).connect(audioCtx.destination);
        }catch(e){
            if(window.console){ console.warn('创建AudioContext失败', e); }
        }
    }

    function updateButton(){
        btn.setAttribute('aria-pressed', String(isPlaying));
        if(isPlaying){
            btn.textContent = '音乐';
        }else{
            btn.textContent = '音乐';
        }
    }

    function onPlay(){ isPlaying = true; updateButton(); }
    function onPause(){ isPlaying = false; updateButton(); }
    function onError(e){
        isPlaying = false;
        updateButton();
        // 保持按钮可点，允许用户继续重试
        btn.disabled = false;
        btn.style.opacity = 1;
        btn.title = '播放被策略限制或失败，请点击页面或再次点音乐按钮';
        if(window.console){ console.warn('音频播放失败', e && e.message ? e.message : e); }
    }

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    updateButton();

    // 首次加载尝试自动播放（多数浏览器会阻止，捕获错误不打断）
    function tryAutoPlay(){
        if(triedAuto){return}
        triedAuto = true;
        audio.muted = true; // 静音以便更可能通过策略
        audio.volume = 0.6;
        audio.load();
        const p = audio.play();
        if(p && typeof p.catch === 'function'){
            p.catch(()=>{/* 静默失败，等待用户交互解锁 */});
        }
    }
    tryAutoPlay();

    // 首屏自动播放增强：在资源就绪/标签可见时多次重试（静音）
    let autoRetryAttempts = 0;
    function autoRetryAutoplay(){
        if(!audio.paused || !audio.muted){ return }
        if(autoRetryAttempts >= 5){ return }
        autoRetryAttempts++;
        const attempt = audio.play();
        if(attempt && typeof attempt.catch === 'function'){
            attempt.catch(()=>{
                // 线性退避重试
                setTimeout(autoRetryAutoplay, autoRetryAttempts * 400);
            });
        }
    }
    // 资源就绪、页面可见、窗口加载后触发尝试
    audio.addEventListener('loadedmetadata', autoRetryAutoplay);
    audio.addEventListener('canplaythrough', autoRetryAutoplay);
    document.addEventListener('visibilitychange', function(){
        if(document.visibilityState === 'visible'){ autoRetryAutoplay(); }
    });
    window.addEventListener('load', function(){ setTimeout(autoRetryAutoplay, 200); }, { once:true });

    // 用户首次交互时解锁播放
    function unlockOnFirstGesture(e){
        // 若此次交互是点击音乐按钮，则交由按钮处理，避免竞态
        if(e && (e.target === btn || (btn.contains && btn.contains(e.target)))){
            cleanupUnlock();
            return;
        }
        if(!audio.paused){
            // 若已在播放，则只需解除静音
            ensureAudioGraph();
            if(audioCtx && audioCtx.state === 'suspended'){ audioCtx.resume().catch(()=>{}); }
            audio.muted = false;
            audio.removeAttribute('muted');
            cleanupUnlock();
            return;
        }
        ensureAudioGraph();
        if(audioCtx && audioCtx.state === 'suspended'){ audioCtx.resume().catch(()=>{}); }
        audio.muted = false;
        audio.removeAttribute('muted');
        audio.volume = 0.6;
        const ensureReady = new Promise(resolve=>{
            if(audio.readyState >= 3){ resolve(); return; }
            const onReady = ()=>{ audio.removeEventListener('canplaythrough', onReady); resolve(); };
            audio.addEventListener('canplaythrough', onReady, {once:true});
            // 超时兜底
            setTimeout(resolve, 1200);
        });
        ensureReady.then(()=>{
            audio.play().finally(cleanupUnlock);
        });
    }
    function cleanupUnlock(){
        window.removeEventListener('pointerdown', unlockOnFirstGesture);
        window.removeEventListener('keydown', unlockOnFirstGesture);
        window.removeEventListener('touchstart', unlockOnFirstGesture, {passive:true});
    }
    window.addEventListener('pointerdown', unlockOnFirstGesture, {once:true});
    window.addEventListener('keydown', unlockOnFirstGesture, {once:true});
    window.addEventListener('touchstart', unlockOnFirstGesture, {once:true, passive:true});

    btn.addEventListener('click', function(){
        // 点击按钮时，主动撤销全局解锁监听，避免两边同时处理
        cleanupUnlock();
        // 解除静音并尝试播放/暂停
        ensureAudioGraph();
        if(audioCtx && audioCtx.state === 'suspended'){ audioCtx.resume().catch(()=>{}); }
        audio.muted = false;
        audio.removeAttribute('muted');
        audio.volume = 0.6;
        if(audio.paused){
            audio.play().catch(onError);
        }else{
            audio.pause();
        }
    });
})();


// 底部悬浮二维码：移动端点击展开/外部点击关闭
function initFloatingDock(){
    const dock = document.querySelector('.floating-dock');
    if(!dock){return}
    const items = Array.from(dock.querySelectorAll('[data-popover]'));
    const supportsHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    function closeAll(){ items.forEach(i=>{ i.classList.remove('open'); const btn=i.querySelector('.dock-btn'); if(btn){ btn.setAttribute('aria-expanded','false'); } }); }
    if(!supportsHover){
        items.forEach(item=>{
            const btn = item.querySelector('.dock-btn');
            const pop = item.querySelector('.dock-popover');
            if(!btn || !pop){return}
            btn.addEventListener('click', function(e){
                const isOpen = item.classList.toggle('open');
                btn.setAttribute('aria-expanded', String(isOpen));
                if(isOpen){ items.forEach(other=>{ if(other!==item){ other.classList.remove('open'); const ob=other.querySelector('.dock-btn'); if(ob){ ob.setAttribute('aria-expanded','false'); } }}); }
                e.stopPropagation();
            });
        });
        document.addEventListener('click', function(){ closeAll(); });
    }
}

// 片段加载器逻辑已移除，统一由 /components/floating-dock.js 注入 DOM
window.addEventListener('DOMContentLoaded', function(){ initFloatingDock(); });

// 使联系方式中的二维码图片可点击，打开原图新标签
(function(){
    function initClickableQrImages(){
        const imgs = document.querySelectorAll('.qr-img');
        imgs.forEach(img=>{
            if(img.dataset.clickBound){ return }
            // 若已包裹在链接中，尊重原有跳转
            if(img.closest && img.closest('a')){ img.dataset.clickBound = '1'; return }
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(){
                try{
                    const href = img.dataset.href || img.getAttribute('data-href') || img.currentSrc || img.src;
                    const target = img.dataset.target || '_blank';
                    window.open(href, target, 'noopener');
                }catch(_e){ /* 忽略 */ }
            });
            img.dataset.clickBound = '1';
        });
    }
    window.addEventListener('DOMContentLoaded', initClickableQrImages);
})();

// 图片模态：打开后页面其余区域半透且不可点，右侧提供退出按钮
(function(){
    function initImageModal(){
        const openBtn = document.getElementById('open-image-modal');
        const modal = document.getElementById('image-modal');
        const closeBtn = document.getElementById('image-modal-close');
        if(!openBtn || !modal || !closeBtn){ return }

        function openModal(){
            modal.setAttribute('aria-hidden', 'false');
            // 禁止页面滚动
            document.body.style.overflow = 'hidden';
        }

        function closeModal(){
            modal.setAttribute('aria-hidden', 'true');
            // 恢复页面滚动
            document.body.style.overflow = '';
        }

        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);

        // 按下 ESC 关闭
        document.addEventListener('keydown', function(e){
            if(e.key === 'Escape'){ closeModal(); }
        });

        // 防止点击图片冒泡关闭（我们只允许通过按钮或 ESC 退出）
        modal.addEventListener('click', function(e){
            // 点击遮罩不关闭，维持“只能点右侧退出按钮”
            e.stopPropagation();
        });
    }
    window.addEventListener('DOMContentLoaded', initImageModal);
})();

// 全屏下雨特效
(function(){
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReducedMotion){ return } // 尊重减少动态

    let canvas, ctx, drops = [], rafId = null;
    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxDrops = 10; // 上限
    const baseDensity = 0.00012; // 密度（每像素）
    let wind = 0.6; // 风偏移（px/帧，基于 60fps）

    function createCanvas(){
        canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
        resize();
        initRain();
        start();
    }

    function resize(){
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        if(ctx){ ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    }

    function initRain(){
        const targetCount = Math.min(maxDrops, Math.max(80, Math.floor(width * height * baseDensity)));
        drops = new Array(targetCount).fill(0).map(()=>spawnDrop(Math.random() * width, Math.random() * height));
    }

    function spawnDrop(x, y){
        const speed = 1 + Math.random() * 2; // 垂直速度
        const len = 2 + Math.random() * 6; // 雨滴长度
        const sway = wind + (Math.random() - 0.5) * 0.4; // 轻微风摆
        const thickness = Math.random() * 0.6 + 0.6; // 线条粗细
        const alpha = 0.05 + Math.random() * 0.2; // 透明度
        return { x, y, speed, len, sway, thickness, alpha };
    }

    function step(){
        // 透明淡出旧帧，避免给视频加一层黑色
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // 数值越大，拖影越短
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';

        ctx.lineCap = 'round';
        for(let d of drops){
            d.x += d.sway; // 风偏移
            d.y += d.speed; // 下落

            // 超出边界则重生
            if(d.y - d.len > height || d.x < -50 || d.x > width + 50){
                const startX = Math.random() * width;
                const startY = -Math.random() * 80; // 顶部上方一点生成
                Object.assign(d, spawnDrop(startX, startY));
            }

            // 绘制雨滴（线段）
            ctx.strokeStyle = `rgba(160, 190, 220, ${d.alpha})`;
            ctx.lineWidth = d.thickness;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y - d.len);
            ctx.lineTo(d.x, d.y);
            ctx.stroke();
        }
        rafId = requestAnimationFrame(step);
    }

    function start(){ if(!rafId){ rafId = requestAnimationFrame(step); } }
    function stop(){ if(rafId){ cancelAnimationFrame(rafId); rafId = null; } }

    // 可见性与窗口变化
    window.addEventListener('resize', function(){ resize(); initRain(); });
    document.addEventListener('visibilitychange', function(){
        if(document.visibilityState === 'hidden'){ stop(); }
        else { start(); }
    });

    // 若后台低性能网络/设备，可根据连接类型降低密度（可扩展）
    createCanvas();
})();

