// 文章页面专用JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 目录导航功能
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('section[id]');
    
    // 平滑滚动到目录项
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 滚动时高亮当前目录项
    function updateTOC() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // 返回顶部按钮
    const backToTopBtn = document.getElementById('backToTop');
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 滚动事件监听
    window.addEventListener('scroll', function() {
        updateTOC();
        toggleBackToTop();
    });

    // 分享功能
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const text = encodeURIComponent('分享一篇不错的技术文章');
            
            let shareUrl = '';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'weibo':
                    shareUrl = `https://service.weibo.com/share/share.php?url=${url}&title=${title}`;
                    break;
                case 'copy':
                    // 复制链接到剪贴板
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        // 显示复制成功提示
                        showToast('链接已复制到剪贴板！');
                    }).catch(() => {
                        // 降级方案
                        const textArea = document.createElement('textarea');
                        textArea.value = window.location.href;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showToast('链接已复制到剪贴板！');
                    });
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // 评论功能
    const commentForm = document.querySelector('.comment-form form');
    const replyButtons = document.querySelectorAll('.reply-btn');
    const likeButtons = document.querySelectorAll('.like-btn');
    
    // 评论表单提交
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const comment = this.querySelector('textarea').value;
            
            if (!name || !email || !comment) {
                showToast('请填写所有必填字段！', 'error');
                return;
            }
            
            // 模拟评论提交
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showToast('评论提交成功！审核通过后将显示。', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // 回复按钮功能
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const comment = this.closest('.comment');
            const author = comment.querySelector('.comment-author').textContent;
            const textarea = document.querySelector('.comment-form textarea');
            
            if (textarea) {
                textarea.value = `@${author} `;
                textarea.focus();
                
                // 滚动到评论表单
                document.querySelector('.comment-form').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 点赞功能
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const countElement = this.querySelector('i').nextSibling;
            let count = parseInt(countElement.textContent.trim());
            
            if (this.classList.contains('liked')) {
                count--;
                this.classList.remove('liked');
                this.style.color = '#666';
            } else {
                count++;
                this.classList.add('liked');
                this.style.color = '#e74c3c';
            }
            
            countElement.textContent = ` ${count}`;
        });
    });

    // 阅读进度指示器
    createReadingProgress();
    
    // 代码复制功能
    addCodeCopyButtons();
    
    // 图片懒加载和放大功能
    initImageFeatures();
    
    // 初始化目录
    updateTOC();
});

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // 样式
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 创建阅读进度指示器
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 80px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 为代码块添加复制按钮
function addCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = '复制代码';
        
        copyBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.3);
            color: #e2e8f0;
            border: 1px solid #4a5568;
            padding: 8px 10px;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
        
        pre.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });
        
        pre.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });
        
        copyBtn.addEventListener('click', () => {
            const code = codeBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.style.background = 'rgba(39, 174, 96, 0.8)';
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            });
        });
    });
}

// 初始化图片功能
function initImageFeatures() {
    const images = document.querySelectorAll('.article-content img');
    
    images.forEach(img => {
        // 懒加载
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
        
        // 点击放大
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            createImageModal(this.src, this.alt);
        });
    });
}

// 创建图片放大模态框
function createImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: zoom-out;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    // 点击关闭
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // ESC键关闭
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    
    document.addEventListener('keydown', handleKeydown);
}
