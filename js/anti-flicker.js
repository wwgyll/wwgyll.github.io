/**
 * 防闪烁初始化脚本
 * 这个脚本应该在页面最早加载，确保元素在正确的初始状态
 */

(function() {
    'use strict';
    
    // 立即隐藏组件容器，避免空内容闪烁
    const style = document.createElement('style');
    style.textContent = `
        /* 立即生效的防闪烁样式 */
        .about-header-container:empty,
        .about-content-container:empty,
        #author-avatar-container:empty {
            opacity: 0 !important;
            visibility: hidden;
        }
        
        /* 页面加载时的平滑过渡 */
        body {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        body.page-loaded {
            opacity: 1;
        }
        
        /* 确保轮播图第一张立即显示 */
        .slide:first-child {
            opacity: 1 !important;
        }
        
        .slide:not(:first-child) {
            opacity: 0 !important;
        }
        
        /* 组件加载完成后显示 */
        .component-loaded {
            opacity: 1 !important;
            visibility: visible !important;
            transition: opacity 0.3s ease;
        }
        
        /* 确保相关文章区域稳定显示 */
        .related-articles,
        .related-articles *,
        .related-item,
        .related-list {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
        }
    `;
    
    // 立即插入样式，避免延迟
    document.head.insertBefore(style, document.head.firstChild);
    
    // 页面加载完成后移除防闪烁样式
    function pageLoaded() {
        document.body.classList.add('page-loaded');
        
        // 延迟移除强制样式，让组件有时间渲染
        setTimeout(() => {
            style.remove();
        }, 1000);
    }
    
    // 多种方式确保页面加载检测
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', pageLoaded);
    } else {
        pageLoaded();
    }
    
    // 备用检测
    window.addEventListener('load', pageLoaded);
    
    console.log('🛡️ 防闪烁系统已启动');
})();
