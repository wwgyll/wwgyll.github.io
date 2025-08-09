// 轮播图组件配置
const CarouselConfig = {
    // 轮播图数据
    slides: [
        {
            id: 1,
            title: "欢迎来到Tawy的博客",
            description: "分享技术知识，记录成长历程",
            buttonText: "了解更多",
            buttonLink: "#about",
            image: "imags/bg01.png", // 图片路径
            fallbackIcon: "fas fa-code", // 备用图标
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        },
        {
            id: 2,
            title: "技术分享",
            description: "游戏美术、技术美术、游戏开发",
            buttonText: "查看文章",
            buttonLink: "#articles",
            image: "imags/bg02.png",
            fallbackIcon: "fas fa-laptop-code",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        },
        {
            id: 3,
            title: "个人作品",
            description: "展示我的开源项目和作品集",
            buttonText: "查看作品",
            buttonLink: "#projects",
            image: "imags/bg03.png",
            fallbackIcon: "fas fa-rocket",
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        }
    ],
    
    // 轮播图设置
    settings: {
        autoPlay: true,
        autoPlayInterval: 5000, // 5秒
        enableTouch: true,
        enableKeyboard: true,
        enableIndicators: true,
        enableButtons: true
    }
};

// 轮播图组件类
class CarouselComponent {
    constructor(containerId, config = CarouselConfig) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.currentSlide = 0;
        this.totalSlides = config.slides.length;
        this.autoPlayInterval = null;
        this.isInitialized = false;
        
        if (!this.container) {
            console.error(`❌ 未找到轮播图容器: ${containerId}`);
            return;
        }
        
        this.init();
        
        // 保存到全局变量供图片加载失败时使用
        window.carouselInstance = this;
    }
    
    /**
     * 初始化轮播图
     */
    init() {
        this.render();
        this.bindEvents();
        this.showSlide(0);
        
        if (this.config.settings.autoPlay) {
            this.startAutoPlay();
        }
        
        this.isInitialized = true;
        console.log(`🎠 轮播图组件初始化完成: ${this.totalSlides} 张幻灯片`);
    }
    
    /**
     * 渲染轮播图HTML
     */
    render() {
        const slidesHTML = this.config.slides.map((slide, index) => {
            return this.generateSlideHTML(slide, index);
        }).join('');
        
        const indicatorsHTML = this.config.settings.enableIndicators ? 
            this.generateIndicatorsHTML() : '';
        
        const buttonsHTML = this.config.settings.enableButtons ? 
            this.generateButtonsHTML() : '';
        
        const carouselHTML = `
            <section id="home" class="carousel-section">
                <div class="carousel-container">
                    <div class="carousel">
                        ${slidesHTML}
                    </div>
                    
                    ${buttonsHTML}
                    
                    ${indicatorsHTML}
                </div>
            </section>
        `;
        
        this.container.innerHTML = carouselHTML;
    }
    
    /**
     * 生成单个幻灯片的HTML
     */
    generateSlideHTML(slide, index) {
        const isActive = index === 0 ? 'active' : '';
        const imageHTML = this.generateImageHTML(slide);
        
        return `
            <div class="slide ${isActive}" data-slide-id="${slide.id}" style="background: ${slide.background}">
                <div class="slide-content">
                    <h1>${slide.title}</h1>
                    <p>${slide.description}</p>
                    <button class="cta-button" data-link="${slide.buttonLink}">${slide.buttonText}</button>
                </div>
                <div class="slide-image">
                    ${imageHTML}
                </div>
            </div>
        `;
    }
    
    /**
     * 生成图片HTML
     */
    generateImageHTML(slide) {
        if (slide.image) {
            return `
                <div class="slide-image-container">
                    <img src="${slide.image}" 
                         alt="${slide.title}" 
                         class="slide-image-file"
                         onerror="console.log('图片加载失败:', '${slide.image}'); this.style.display='none'; this.nextElementSibling.style.display='flex'; this.nextElementSibling.classList.add('placeholder-image'); window.setTimeout(() => { if(window.carouselInstance) window.carouselInstance.addHoverEffects(); }, 100);">
                    <div class="placeholder-image" style="display: none;">
                        <i class="${slide.fallbackIcon}"></i>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="placeholder-image">
                    <i class="${slide.fallbackIcon}"></i>
                </div>
            `;
        }
    }
    
    /**
     * 生成指示器HTML
     */
    generateIndicatorsHTML() {
        const indicators = this.config.slides.map((_, index) => {
            const isActive = index === 0 ? 'active' : '';
            return `<span class="indicator ${isActive}" data-slide="${index}"></span>`;
        }).join('');
        
        return `<div class="carousel-indicators">${indicators}</div>`;
    }
    
    /**
     * 生成控制按钮HTML
     */
    generateButtonsHTML() {
        return `
            <button class="carousel-btn prev-btn" id="prevBtn">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="carousel-btn next-btn" id="nextBtn">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 控制按钮事件
        if (this.config.settings.enableButtons) {
            const prevBtn = this.container.querySelector('#prevBtn');
            const nextBtn = this.container.querySelector('#nextBtn');
            
            if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // 指示器事件
        if (this.config.settings.enableIndicators) {
            const indicators = this.container.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
        }
        
        // 键盘导航
        if (this.config.settings.enableKeyboard) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            });
        }
        
        // 触摸手势支持
        if (this.config.settings.enableTouch) {
            this.bindTouchEvents();
        }
        
        // 鼠标悬停暂停自动播放
        const carouselContainer = this.container.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // CTA按钮事件
        const ctaButtons = this.container.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const link = button.getAttribute('data-link');
                if (link && link.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(link);
                }
            });
        });
        
        // 悬停效果已移除
    }
    
    /**
     * 添加悬停效果
     */
    addHoverEffects() {
        // 获取所有幻灯片
        const slides = this.container.querySelectorAll('.slide');
        
        slides.forEach((slide, slideIndex) => {
            // 在每个幻灯片中查找图片容器
            const imageContainers = slide.querySelectorAll('.slide-image-container');
            const placeholderImages = slide.querySelectorAll('.placeholder-image');
            
            // 处理图片容器
            imageContainers.forEach(container => {
                this.setupHoverEffect(container, slideIndex);
            });
            
            // 处理占位符图片（包括隐藏的）
            placeholderImages.forEach(container => {
                this.setupHoverEffect(container, slideIndex);
            });
        });
    }
    
    /**
     * 设置单个容器的悬停效果
     */
    setupHoverEffect(container, slideIndex) {
        // 强制设置样式
        container.style.cursor = 'pointer !important';
        container.style.transition = 'all 0.3s ease !important';
        
        // 强制设置基础样式
        container.style.position = 'relative';
        container.style.display = container.style.display || 'flex';
        
        // 移除旧的事件监听器
        container.onmouseenter = null;
        container.onmouseleave = null;
        
        // 添加新的事件监听器 - 使用更强的样式设置
        container.onmouseenter = function() {
            console.log(`悬停进入: 幻灯片${slideIndex + 1}`);
            this.style.setProperty('transform', 'scale(1.1)', 'important');
            this.style.setProperty('box-shadow', '0 15px 35px rgba(0, 0, 0, 0.3)', 'important');
            this.style.setProperty('z-index', '9999', 'important');
        };
        
        container.onmouseleave = function() {
            console.log(`悬停离开: 幻灯片${slideIndex + 1}`);
            this.style.setProperty('transform', 'scale(1)', 'important');
            this.style.setProperty('box-shadow', 'none', 'important');
            this.style.setProperty('z-index', '', 'important');
        };
        
        // 特殊处理前两张图片
        if (slideIndex === 0 || slideIndex === 1) {
            console.log(`特殊处理幻灯片 ${slideIndex + 1}`);
            // 强制添加类名
            container.classList.add('force-hover-effect');
            // 设置特殊标记
            container.setAttribute('data-slide-index', slideIndex);
        }
    }
    
    /**
     * 绑定触摸事件
     */
    bindTouchEvents() {
        const carousel = this.container.querySelector('.carousel');
        if (!carousel) return;
        
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    /**
     * 处理滑动手势
     */
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    /**
     * 显示指定幻灯片
     */
    showSlide(index) {
        const slides = this.container.querySelectorAll('.slide');
        const indicators = this.container.querySelectorAll('.indicator');
        
        // 移除所有活动状态
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // 设置当前幻灯片为活动状态
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        this.currentSlide = index;
        
        // 悬停效果已移除
    }
    
    /**
     * 下一张幻灯片
     */
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
        this.resetAutoPlay();
    }
    
    /**
     * 上一张幻灯片
     */
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
        this.resetAutoPlay();
    }
    
    /**
     * 跳转到指定幻灯片
     */
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
            this.resetAutoPlay();
        }
    }
    
    /**
     * 开始自动播放
     */
    startAutoPlay() {
        if (!this.config.settings.autoPlay) return;
        
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.config.settings.autoPlayInterval);
    }
    
    /**
     * 停止自动播放
     */
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    /**
     * 重置自动播放
     */
    resetAutoPlay() {
        if (this.config.settings.autoPlay) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }
    
    /**
     * 滚动到指定区域
     */
    scrollToSection(selector) {
        const target = document.querySelector(selector);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * 更新轮播图配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.totalSlides = this.config.slides.length;
        this.render();
        this.bindEvents();
        this.showSlide(0);
    }
    
    /**
     * 销毁轮播图
     */
    destroy() {
        this.stopAutoPlay();
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.isInitialized = false;
    }
}

// 导出供其他脚本使用
window.CarouselConfig = CarouselConfig;
window.CarouselComponent = CarouselComponent;
