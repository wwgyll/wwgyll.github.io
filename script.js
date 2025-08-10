// 提前自动播放（不依赖 DOMContentLoaded）
(function earlyAutoPlay(){
    try {
        let audio = document.getElementById('bgm');
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'bgm';
            audio.src = 'audio/bgm.mp3';
            audio.preload = 'auto';
            audio.loop = true;
            audio.muted = true; // 先静音，提升自动播放成功率
            audio.autoplay = true;
            audio.setAttribute('autoplay', '');
            audio.setAttribute('playsinline', '');
            document.addEventListener('readystatechange', function onr(){
                if (document.readyState !== 'loading') {
                    document.removeEventListener('readystatechange', onr);
                    document.body.appendChild(audio);
                }
            });
            if (document.readyState !== 'loading') {
                document.body.appendChild(audio);
            }
        }
        const tryPlay = () => { audio.play().catch(()=>{}); };
        tryPlay();
        // 媒体就绪与页面可见时重试
        ['canplay','canplaythrough','loadeddata'].forEach(evt => audio.addEventListener(evt, tryPlay, { once: true }));
        const onVis = () => { if (!document.hidden) { tryPlay(); document.removeEventListener('visibilitychange', onVis); } };
        document.addEventListener('visibilitychange', onVis);
        // 快速多次重试
        let attempts = 0;
        const timer = setInterval(() => {
            if (!audio.paused) { clearInterval(timer); return; }
            tryPlay();
            if (++attempts >= 12) clearInterval(timer);
        }, 250);
    } catch (e) {}
})();

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 移动端导航菜单
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭移动端菜单
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 轮播图功能
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // 显示指定的幻灯片
    function showSlide(index) {
        // 移除所有活动状态
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // 设置当前幻灯片为活动状态
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }

    // 下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
        resetAutoPlay();
    }

    // 上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
        resetAutoPlay();
    }

    // 跳转到指定幻灯片
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
        resetAutoPlay();
    }

    // 自动播放功能
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // 每5秒切换一次
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 绑定事件监听器
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // 绑定指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // 触摸手势支持（移动端）
    let startX = 0;
    let endX = 0;
    const carousel = document.querySelector('.carousel');
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50; // 最小滑动距离
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide(); // 向左滑动，显示下一张
            } else {
                prevSlide(); // 向右滑动，显示上一张
            }
        }
    }

    // 鼠标悬停时暂停自动播放
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // 初始化轮播图
    showSlide(0);
    startAutoPlay();

    // 平滑滚动到锚点
    document.addEventListener('click', function (e) {
        const t = e.target;
        if (!(t instanceof Element)) return;
        const a = t.closest('a[href^="#"]');
        if (!a) return;
        // 让轮播图自己的处理优先
        if (a.classList && a.classList.contains('cta-button')) return;
        e.preventDefault();
        const hash = (a.getAttribute('href') || '').trim();
        if (!hash || hash === '#') return;
        const target = hash ? document.querySelector(hash) : null;
        if (target) {
            const navbar = document.querySelector('.navbar');
            const navH = navbar && navbar.offsetHeight ? navbar.offsetHeight : 80;
            const rect = target.getBoundingClientRect();
            const top = (window.pageYOffset || document.documentElement.scrollTop || 0) + rect.top - navH;
            window.scrollTo({ top, behavior: 'smooth' });
            if (typeof history !== 'undefined' && history.pushState) {
                history.pushState(null, '', hash);
            }
        }
    }, true);

    // 滚动时导航栏效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 向下滚动时稍微透明化导航栏
        if (scrollTop > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // 页面滚动时的动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有卡片元素
    const cards = document.querySelectorAll('.article-card, .project-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // 联系表单处理
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            // 简单的表单验证
            if (!name || !email || !message) {
                alert('请填写所有必填字段！');
                return;
            }
            
            // 模拟发送消息（实际项目中需要连接后端）
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '发送中...';
            submitBtn.disabled = true;
            
            // 模拟网络延迟
            setTimeout(() => {
                alert('消息发送成功！我会尽快回复您。');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // 头像功能现在由 author-data.js 统一管理

    // 背景音乐控制（每页快速续播，无弹窗）
    (function initBgm() {
        ensureBgmDom();
        const audio = document.getElementById('bgm') || createAudio();
        const toggle = document.getElementById('bgm-toggle');
        const statusText = document.getElementById('bgm-status');
        if (!audio || !toggle || !statusText) return;

        const savedEnabled = sessionStorage.getItem('bgm:enabled');
        let enabled = savedEnabled === null ? true : savedEnabled === 'true';
        const savedTime = parseFloat(sessionStorage.getItem('bgm:time') || '0');
        if (!Number.isNaN(savedTime) && isFinite(savedTime)) {
            try { audio.currentTime = Math.max(0, savedTime - 0.15); } catch(e) {}
        }
        try { if (audio.volume == null) audio.volume = 0.6; } catch(e) {}

        updateUI();
        attemptAutoPlay();
        // 异步播放状态变化后再同步一次UI
        setTimeout(updateUI, 300);

        const unlock = () => {
            if (enabled) {
                audio.muted = false;
                audio.play().catch(() => {
                    audio.muted = true;
                    audio.play().catch(() => {});
                });
            }
            ['click','touchstart','pointerdown','mousedown','keydown','wheel'].forEach(evt =>
                document.removeEventListener(evt, unlock, true)
            );
            updateUI();
        };
        ['click','touchstart','pointerdown','mousedown','keydown','wheel'].forEach(evt =>
            document.addEventListener(evt, unlock, { capture: true, once: true })
        );

        toggle.addEventListener('click', function(){
            enabled = !enabled;
            sessionStorage.setItem('bgm:enabled', String(enabled));
            if (enabled) {
                audio.muted = false;
                audio.play().catch(() => {
                    audio.muted = true;
                    audio.play().catch(() => {});
                });
            } else {
                audio.pause();
            }
            updateUI();
        });

        audio.addEventListener('timeupdate', saveTime);
        window.addEventListener('beforeunload', saveTime);
        ;['play','pause','playing','ended','volumechange','loadeddata','canplay','canplaythrough'].forEach(evt => {
            audio.addEventListener(evt, updateUI);
        });

        function saveTime(){
            try { sessionStorage.setItem('bgm:time', String(audio.currentTime || 0)); } catch(e) {}
        }
        function updateUI(){
            const playing = enabled && !audio.paused;
            statusText.textContent = playing ? '关闭音乐' : '开启音乐';
            toggle.setAttribute('aria-pressed', String(playing));
        }
        function attemptAutoPlay(){
            if (!enabled) return;
            // 强制设置为可自动播放的状态
            audio.autoplay = true;
            try { audio.setAttribute('autoplay', ''); } catch(e) {}
            audio.muted = true; // 先静音，保证大多数浏览器允许自动播放

            const tryPlay = () => { audio.play().catch(() => {}); };

            // 立即尝试一次
            tryPlay();
            updateUI();

            // 资源就绪后再尝试
            ['canplay', 'canplaythrough', 'loadeddata'].forEach(evt => {
                audio.addEventListener(evt, tryPlay, { once: true });
            });

            // 标签激活时再尝试
            const onVis = () => {
                if (!document.hidden) { tryPlay(); document.removeEventListener('visibilitychange', onVis); updateUI(); }
            };
            document.addEventListener('visibilitychange', onVis);

            // 页面完全加载后再尝试
            window.addEventListener('load', () => { tryPlay(); updateUI(); }, { once: true });

            // 定时重试，最多重试 10 次，每 500ms 一次
            let attempts = 0;
            const timer = setInterval(() => {
                if (!enabled || !audio.paused) { clearInterval(timer); updateUI(); return; }
                tryPlay(); updateUI();
                if (++attempts >= 10) clearInterval(timer);
            }, 500);
        }

        // 移除了任何提示 UI，不打扰用户
        function ensureBgmDom(){
            if (document.getElementById('bgm-toggle')) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'music-player';
            wrapper.id = 'music-player';
            wrapper.title = '背景音乐';
            wrapper.innerHTML = `
                <button id="bgm-toggle" aria-label="播放/暂停背景音乐">
                    <i class="fas fa-music"></i>
                    <span id="bgm-status">开启音乐</span>
                </button>
            `;
            document.body.appendChild(wrapper);
        }
        function createAudio(){
            let el = document.getElementById('bgm');
            if (el) return el;
            el = document.createElement('audio');
            el.id = 'bgm';
            el.src = 'audio/bgm.mp3';
            el.preload = 'auto';
            el.loop = true;
            el.muted = true; // 默认静音提升自动播成功率
            el.autoplay = true;
            el.setAttribute('autoplay','');
            el.setAttribute('playsinline', '');
            document.body.appendChild(el);
            return el;
        }
    })();
    // CTA按钮点击效果
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建波纹效果
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 添加CSS动画关键帧（如果浏览器支持）
    if (CSS && CSS.supports && CSS.supports('animation', 'ripple 0.6s ease-out')) {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});
