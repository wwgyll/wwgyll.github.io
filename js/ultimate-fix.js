/**
 * 终极相关文章闪烁修复脚本
 * 这是最后的解决方案，强制停止所有可能的干扰
 */

(function() {
    'use strict';
    
    // 立即执行，不等待任何事件
    function forceStabilizeRelatedArticles() {
        // 查找所有相关文章元素和头像元素
        const selectors = [
            '.related-articles',
            '.related-list', 
            '.related-item',
            '.related-date',
            '.related-articles *',
            '.related-list *',
            '.related-item *',
            // 头像相关元素
            '.avatar-image',
            '.avatar-placeholder',
            '.profile-avatar',
            '.about-header',
            '#author-avatar-container',
            '#about-header-container'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    // 强制设置样式
                    element.style.setProperty('opacity', '1', 'important');
                    element.style.setProperty('visibility', 'visible', 'important');
                    element.style.setProperty('transform', 'none', 'important');
                    element.style.setProperty('transition', 'none', 'important');
                    element.style.setProperty('animation', 'none', 'important');
                    element.style.setProperty('will-change', 'auto', 'important');
                    
                    // 移除可能的类
                    element.classList.remove('animate__animated');
                    element.classList.remove('fade-in');
                    element.classList.remove('fade-out');
                    
                    // 强制显示
                    if (element.style.display === 'none') {
                        element.style.setProperty('display', 'block', 'important');
                    }
                }
            });
        });
        
        // 专门处理头像元素
        const avatarImages = document.querySelectorAll('.avatar-image');
        avatarImages.forEach(img => {
            if (img) {
                // 移除所有事件监听器
                img.onload = null;
                img.onerror = null;
                
                // 强制稳定状态
                img.style.setProperty('opacity', '1', 'important');
                img.style.setProperty('visibility', 'visible', 'important');
                img.style.setProperty('display', 'block', 'important');
            }
        });
        
        const avatarPlaceholders = document.querySelectorAll('.avatar-placeholder');
        avatarPlaceholders.forEach(placeholder => {
            if (placeholder) {
                placeholder.style.setProperty('opacity', '0', 'important');
                placeholder.style.setProperty('visibility', 'hidden', 'important');
            }
        });
        
        console.log('🔧 强制稳定相关文章区域和头像');
    }
    
    // 立即执行
    forceStabilizeRelatedArticles();
    
    // 多个时机重复执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceStabilizeRelatedArticles);
    }
    
    window.addEventListener('load', forceStabilizeRelatedArticles);
    
    // 定时执行，确保持续稳定
    setTimeout(forceStabilizeRelatedArticles, 50);
    setTimeout(forceStabilizeRelatedArticles, 100);
    setTimeout(forceStabilizeRelatedArticles, 200);
    setTimeout(forceStabilizeRelatedArticles, 500);
    setTimeout(forceStabilizeRelatedArticles, 1000);
    
    // 监听任何可能的变化
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            let needsUpdate = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || 
                     mutation.attributeName === 'class')) {
                    const element = mutation.target;
                    if (element.closest && element.closest('.related-articles')) {
                        needsUpdate = true;
                    }
                }
            });
            
            if (needsUpdate) {
                forceStabilizeRelatedArticles();
            }
        });
        
        // 开始观察
        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
        
        console.log('👁️ 启动相关文章变化监听');
    }
    
    // 覆盖可能的动画函数
    const originalAnimate = Element.prototype.animate;
    if (originalAnimate) {
        Element.prototype.animate = function(...args) {
            if (this.closest && this.closest('.related-articles')) {
                console.log('🚫 阻止相关文章区域动画');
                return {
                    cancel: () => {},
                    finish: () => {},
                    play: () => {},
                    pause: () => {},
                    reverse: () => {}
                };
            }
            return originalAnimate.apply(this, args);
        };
    }
    
    // 拦截jQuery动画（如果存在）
    if (typeof $ !== 'undefined' && $.fn.animate) {
        const originalJQueryAnimate = $.fn.animate;
        $.fn.animate = function(...args) {
            if (this.closest('.related-articles').length > 0) {
                console.log('🚫 阻止jQuery相关文章动画');
                return this;
            }
            return originalJQueryAnimate.apply(this, args);
        };
    }
    
    console.log('💪 终极相关文章修复系统已启动');
})();
