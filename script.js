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


