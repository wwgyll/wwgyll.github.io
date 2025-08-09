// 网站通用配置
const SiteConfig = {
    // 网站基本信息
    site: {
        name: "Tawy 2025",
        description: "个人技术博客 - 分享技术知识，记录成长历程",
        author: "Tawy",
        year: "2025"
    },
    
    // 页面标题配置
    titles: {
        // 主页标题
        home: "Tawy 2025",
        
        // 文章页面标题模板
        article: {
            // 默认文章标题格式
            default: "{title} - {siteName}",
            
            // 具体文章标题
            "modern-frontend": "现代前端开发最佳实践 - Tawy 2025",
            "javascript-async": "JavaScript异步编程深度解析 - Tawy 2025", 
            "react-performance": "React性能优化完整指南 - Tawy 2025",
            "responsive-design": "响应式设计完整指南 - Tawy 2025"
        },
        
        // 其他页面标题
        about: "关于我 - Tawy 2025",
        projects: "项目展示 - Tawy 2025",
        contact: "联系我 - Tawy 2025"
    },
    
    // 导航栏配置
    navigation: {
        logo: "Tawy 2025",
        items: [
            { name: "首页", href: "#home", icon: "fas fa-home" },
            { name: "关于我", href: "#about", icon: "fas fa-user" },
            { name: "文章", href: "#articles", icon: "fas fa-newspaper" },
            { name: "项目", href: "#projects", icon: "fas fa-project-diagram" },
            { name: "联系我", href: "#contact", icon: "fas fa-envelope" }
        ]
    },
    
    // 页面元数据
    meta: {
        keywords: "技术博客, 前端开发, 游戏开发, Unity, Shader, 技术分享",
        author: "Tawy",
        viewport: "width=device-width, initial-scale=1.0",
        charset: "UTF-8"
    }
};

// 标题生成器
class TitleGenerator {
    /**
     * 获取页面标题
     * @param {string} pageType - 页面类型 ('home', 'article', 'about', 'projects', 'contact')
     * @param {string} articleSlug - 文章标识符 (仅用于文章页面)
     * @returns {string} 页面标题
     */
    static getPageTitle(pageType = 'home', articleSlug = '') {
        switch(pageType) {
            case 'home':
                return SiteConfig.titles.home;
                
            case 'article':
                if (articleSlug && SiteConfig.titles.article[articleSlug]) {
                    return SiteConfig.titles.article[articleSlug];
                }
                // 如果没有找到具体配置，使用默认格式
                return SiteConfig.titles.article.default
                    .replace('{title}', articleSlug || '文章')
                    .replace('{siteName}', SiteConfig.site.name);
                    
            case 'about':
                return SiteConfig.titles.about;
                
            case 'projects':
                return SiteConfig.titles.projects;
                
            case 'contact':
                return SiteConfig.titles.contact;
                
            default:
                return SiteConfig.titles.home;
        }
    }
    
    /**
     * 设置页面标题
     * @param {string} pageType - 页面类型
     * @param {string} articleSlug - 文章标识符
     */
    static setPageTitle(pageType = 'home', articleSlug = '') {
        const title = this.getPageTitle(pageType, articleSlug);
        document.title = title;
        console.log(`📝 页面标题已设置: ${title}`);
        return title;
    }
    
    /**
     * 根据当前页面URL自动设置标题
     */
    static autoSetTitle() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop().replace('.html', '');
        
        console.log(`🔍 检测到页面: ${pageName}`);
        
        if (pageName === 'index' || pageName === '') {
            this.setPageTitle('home');
        } else if (pageName.includes('javascript-async')) {
            this.setPageTitle('article', 'javascript-async');
        } else if (pageName.includes('react-performance')) {
            this.setPageTitle('article', 'react-performance');
        } else if (pageName.includes('responsive-design')) {
            this.setPageTitle('article', 'responsive-design');
        } else if (pageName.includes('modern-frontend') || pageName === 'article') {
            this.setPageTitle('article', 'modern-frontend');
        } else {
            this.setPageTitle('home');
        }
    }
}

// 导航栏生成器
class NavigationGenerator {
    /**
     * 生成导航栏HTML
     * @param {boolean} isHomePage - 是否为主页
     * @returns {string} 导航栏HTML
     */
    static generateNavigation(isHomePage = true) {
        const logo = SiteConfig.navigation.logo;
        const items = SiteConfig.navigation.items;
        
        const navItems = items.map(item => {
            const href = isHomePage ? item.href : `index.html${item.href}`;
            return `<li class="nav-item">
                <a href="${href}" class="nav-link">${item.name}</a>
            </li>`;
        }).join('');
        
        return `
            <nav class="navbar">
                <div class="nav-container">
                    <div class="nav-logo">
                        <a href="${isHomePage ? '#home' : 'index.html'}">${logo}</a>
                    </div>
                    <ul class="nav-menu">
                        ${navItems}
                    </ul>
                    <div class="nav-toggle" id="mobile-menu">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div>
                </div>
            </nav>
        `;
    }
    
    /**
     * 设置导航栏标题
     * @param {boolean} isHomePage - 是否为主页
     */
    static setNavigationTitle(isHomePage = true) {
        const logoElement = document.querySelector('.nav-logo a');
        if (logoElement) {
            logoElement.textContent = SiteConfig.navigation.logo;
            console.log(`🎯 导航栏标题已设置: ${SiteConfig.navigation.logo}`);
        } else {
            console.warn('⚠️ 未找到导航栏标题元素');
        }
    }
}

// 页面初始化器
class PageInitializer {
    /**
     * 初始化页面标题和导航
     * @param {string} pageType - 页面类型
     * @param {string} articleSlug - 文章标识符
     */
    static init(pageType = 'home', articleSlug = '') {
        // 设置页面标题
        TitleGenerator.setPageTitle(pageType, articleSlug);
        
        // 生成并插入导航栏（如果需要）
        this.initNavigation(pageType === 'home');
        
        // 设置导航栏标题
        NavigationGenerator.setNavigationTitle(pageType === 'home');
    }
    
    /**
     * 初始化导航栏
     * @param {boolean} isHomePage - 是否为主页
     */
    static initNavigation(isHomePage = true) {
        const existingNav = document.querySelector('.navbar');
        if (!existingNav) {
            const navHTML = NavigationGenerator.generateNavigation(isHomePage);
            document.body.insertAdjacentHTML('afterbegin', navHTML);
        }
        NavigationGenerator.setNavigationTitle(isHomePage);
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TitleGenerator.autoSetTitle();
    });
} else {
    TitleGenerator.autoSetTitle();
}

// 导出供其他脚本使用
window.SiteConfig = SiteConfig;
window.TitleGenerator = TitleGenerator;
window.NavigationGenerator = NavigationGenerator;
window.PageInitializer = PageInitializer;
