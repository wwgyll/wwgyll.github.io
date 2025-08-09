/**
 * 相关文章区域防闪烁专用脚本
 * 立即执行，确保相关文章区域稳定显示
 */

(function() {
    'use strict';
    
    // 立即创建样式，确保相关文章区域不闪烁
    const relatedArticlesStyle = document.createElement('style');
    relatedArticlesStyle.textContent = `
        /* 相关文章区域强制稳定显示 */
        .related-articles {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
            transition: none !important;
        }
        
        .related-articles * {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
            transition: none !important;
        }
        
        .related-list {
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        .related-item {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
        }
        
        .related-item h4,
        .related-item a,
        .related-date {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
        }
    `;
    
    // 立即插入到head的最前面，优先级最高
    if (document.head) {
        document.head.insertBefore(relatedArticlesStyle, document.head.firstChild);
    } else {
        // 如果head还没有加载，等待DOM加载
        document.addEventListener('DOMContentLoaded', function() {
            document.head.insertBefore(relatedArticlesStyle, document.head.firstChild);
        });
    }
    
    // 页面加载完成后进一步确保稳定性
    function ensureRelatedArticlesStability() {
        const relatedArticles = document.querySelectorAll('.related-articles');
        const relatedItems = document.querySelectorAll('.related-item');
        
        relatedArticles.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.transform = 'none';
            element.style.transition = 'none';
        });
        
        relatedItems.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.transform = 'none';
            element.style.transition = 'none';
        });
        
        console.log('✅ 相关文章区域稳定性已确保');
    }
    
    // 多个时机确保稳定性
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureRelatedArticlesStability);
    } else {
        ensureRelatedArticlesStability();
    }
    
    // 页面完全加载后再次确保
    window.addEventListener('load', ensureRelatedArticlesStability);
    
    // 延迟执行，确保所有其他脚本执行完毕
    setTimeout(ensureRelatedArticlesStability, 100);
    setTimeout(ensureRelatedArticlesStability, 500);
    
    console.log('🛡️ 相关文章防闪烁系统已启动');
})();
