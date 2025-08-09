// 作者信息数据配置
const AuthorData = {
    // 基本信息
    name: "关于我",
    avatar: {
        // 主头像路径
        main: "imags/tawy.png",
        // 备用头像路径（如果主头像加载失败）
        fallback: "imags/default-avatar.png",
        // 头像描述
        alt: "我的头像"
    },
    profession: "游戏开发工程师",
    description: "我是一名热爱游戏的开发者，专注于游戏美术、技术美术、游戏开发。在这个博客中，我会分享我的学习心得、技术经验和项目作品。",
    motto: "欢迎与我交流技术话题，共同学习进步！",
    
    // 技能标签
    skills: [
        "3D美术",
        "Unity Shader", 
        "C#",
        "Python"
    ],
    
    // 社交链接
    social: {
        github: "#",
        twitter: "#", 
        linkedin: "#"
    },
    
    // 专业描述（用于不同页面的个性化描述）
    descriptions: {
        default: "游戏开发工程师，专注于游戏美术、技术美术、游戏开发。热爱分享技术知识和最佳实践。",
        javascript: "游戏开发工程师，专注于游戏美术、技术美术、游戏开发。喜欢分享技术心得和最佳实践。",
        react: "游戏开发工程师，专注于游戏美术、技术美术、游戏开发和性能优化。",
        responsive: "游戏开发工程师，专注于游戏美术、技术美术、游戏开发和响应式设计。"
    }
};

// 头像路径处理器
class AvatarPathHelper {
    /**
     * 获取头像路径
     * @param {string} context - 上下文 ('home' 为主页, 'article' 为文章页面)
     * @param {boolean} isFallback - 是否为备用头像
     */
    static getAvatarPath(context = 'home', isFallback = false) {
        const avatarFile = isFallback ? AuthorData.avatar.fallback : AuthorData.avatar.main;
        
        switch(context) {
            case 'home':
                return avatarFile;
            case 'article':
                return `../${avatarFile}`;
            default:
                return avatarFile;
        }
    }
    
    /**
     * 获取头像描述文字
     */
    static getAvatarAlt() {
        return AuthorData.avatar.alt;
    }
    
    /**
     * 创建头像HTML结构（防闪烁版本）
     * @param {string} context - 上下文
     */
    static createAvatarHTML(context = 'home') {
        const mainPath = this.getAvatarPath(context, false);
        const altText = this.getAvatarAlt();
        
        return `
            <div class="profile-avatar">
                <img src="${mainPath}" 
                     alt="${altText}" 
                     class="avatar-image"
                     style="opacity: 1 !important; visibility: visible !important;">
                <div class="avatar-placeholder" style="opacity: 0 !important; visibility: hidden !important;">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        `;
    }
    
    /**
     * 处理图片加载错误（禁用闪烁）
     * @param {HTMLImageElement} imgElement - 图片元素
     */
    static handleImageError(imgElement) {
        // 完全禁用错误处理，避免闪烁
        console.log('🚫 头像错误处理已禁用，防止闪烁');
        
        // 强制保持头像可见，不进行任何opacity变化
        imgElement.style.opacity = '1';
        imgElement.style.visibility = 'visible';
        
        const placeholder = imgElement.nextElementSibling;
        if (placeholder) {
            placeholder.style.opacity = '0';
            placeholder.style.visibility = 'hidden';
        }
    }
}

// 作者组件生成器
class AuthorComponent {
    /**
     * 生成头像和标题组件 (用于主页)
     */
    static getHeaderComponent() {
        const avatarHTML = AvatarPathHelper.createAvatarHTML('home');
        return `
            <div class="about-header">
                ${avatarHTML}
                <h2>${AuthorData.name}</h2>
            </div>
        `;
    }
    
    /**
     * 生成作者卡片组件 (用于文章页面)
     * @param {string} pageType - 页面类型，用于获取对应的描述
     */
    static getAuthorCardComponent(pageType = 'default') {
        const description = AuthorData.descriptions[pageType] || AuthorData.descriptions.default;
        const avatarHTML = AvatarPathHelper.createAvatarHTML('article');
        
        return `
            <div class="about-header">
                ${avatarHTML}
            </div>
            <div class="author-info">
                <h3>作者</h3>
                <p>${description}</p>
                <div class="author-social">
                    <a href="${AuthorData.social.github}"><i class="fab fa-github"></i></a>
                    <a href="${AuthorData.social.twitter}"><i class="fab fa-twitter"></i></a>
                    <a href="${AuthorData.social.linkedin}"><i class="fab fa-linkedin"></i></a>
                </div>
            </div>
        `;
    }
    
    /**
     * 生成关于我内容组件 (用于主页)
     */
    static getAboutContentComponent() {
        const skillTags = AuthorData.skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('\n                        ');
        
        return `
            <div class="about-content">
                <div class="about-text">
                    <p>${AuthorData.description}</p>
                    <p>${AuthorData.motto}</p>
                </div>
                <div class="skills">
                    <h3>技能专长</h3>
                    <div class="skill-tags">
                        ${skillTags}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * 渲染组件到指定容器
     * @param {string} componentType - 组件类型: 'header', 'author-card', 'about-content'
     * @param {string} targetSelector - 目标选择器
     * @param {string} pageType - 页面类型 (可选)
     */
    static render(componentType, targetSelector, pageType = 'default') {
        const targetElement = document.querySelector(targetSelector);
        if (!targetElement) {
            console.warn(`⚠️ 目标元素未找到: ${targetSelector}`);
            return;
        }
        
        let html = '';
        switch(componentType) {
            case 'header':
                html = this.getHeaderComponent();
                break;
            case 'author-card':
                html = this.getAuthorCardComponent(pageType);
                break;
            case 'about-content':
                html = this.getAboutContentComponent();
                break;
            default:
                console.error(`❌ 未知的组件类型: ${componentType}`);
                return;
        }
        
        targetElement.innerHTML = html;
        
        // 添加渲染完成的类，触发CSS显示动画
        setTimeout(() => {
            targetElement.classList.add('component-loaded');
        }, 10);
        
        console.log(`✅ 作者组件渲染成功: ${componentType} -> ${targetSelector}`);
        
        // 初始化头像功能
        this.initAvatarFeatures(targetElement);
    }
    
    /**
     * 初始化头像相关功能（防闪烁版本）
     */
    static initAvatarFeatures(container) {
        const avatarImage = container.querySelector('.avatar-image');
        const avatarPlaceholder = container.querySelector('.avatar-placeholder');
        
        if (avatarImage && avatarPlaceholder) {
            // 强制稳定头像状态，禁用任何opacity变化
            avatarImage.style.opacity = '1';
            avatarImage.style.visibility = 'visible';
            avatarPlaceholder.style.opacity = '0';
            avatarPlaceholder.style.visibility = 'hidden';
            
            // 禁用load事件处理，避免闪烁
            console.log('🛡️ 头像已强制稳定，禁用动态变化');
            
            // 添加头像点击效果
            avatarImage.addEventListener('click', function() {
                console.log('🖱️ 头像被点击了');
            });
        }
    }
    
    /**
     * 自动扫描并渲染页面中的作者组件
     */
    static autoRender() {
        console.log('🔍 开始扫描作者组件...');
        
        // 主页头像标题
        const headerContainer = document.querySelector('.about-header-container, #about-header-container');
        if (headerContainer) {
            console.log('📍 找到主页头像容器');
            this.render('header', '.about-header-container, #about-header-container');
        }
        
        // 主页关于我内容
        const aboutContainer = document.querySelector('.about-content-container, #about-content-container');
        if (aboutContainer) {
            console.log('📍 找到主页关于我内容容器');
            this.render('about-content', '.about-content-container, #about-content-container');
        }
        
        // 文章页面作者卡片
        const authorContainers = document.querySelectorAll('#author-avatar-container');
        authorContainers.forEach((container, index) => {
            console.log(`📍 找到文章页面作者容器 ${index + 1}`);
            
            // 根据页面URL确定页面类型
            const pageType = this.getPageType();
            this.render('author-card', `#author-avatar-container`, pageType);
        });
    }
    
    /**
     * 根据当前页面URL确定页面类型
     */
    static getPageType() {
        const path = window.location.pathname;
        if (path.includes('javascript-async')) return 'javascript';
        if (path.includes('react-performance')) return 'react';
        if (path.includes('responsive-design')) return 'responsive';
        return 'default';
    }
}

// 立即渲染，避免闪烁
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AuthorComponent.autoRender();
    });
} else {
    // 如果DOM已经加载完成，立即渲染
    AuthorComponent.autoRender();
}

// 导出供其他脚本使用
window.AvatarPathHelper = AvatarPathHelper;
window.AuthorComponent = AuthorComponent;
window.AuthorData = AuthorData;
