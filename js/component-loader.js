// 组件加载器
class ComponentLoader {
    /**
     * 加载HTML组件
     * @param {string} componentPath - 组件文件路径
     * @param {string} targetSelector - 目标容器选择器
     * @returns {Promise<void>}
     */
    static async loadComponent(componentPath, targetSelector) {
        console.log(`🔄 开始加载组件: ${componentPath} -> ${targetSelector}`);
        
        try {
            const response = await fetch(componentPath);
            console.log(`📡 请求状态: ${response.status} ${response.statusText}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            console.log(`📄 组件内容长度: ${html.length} 字符`);
            
            const targetElement = document.querySelector(targetSelector);
            
            if (targetElement) {
                targetElement.innerHTML = html;
                console.log(`✅ 组件加载成功: ${componentPath}`);
                
                // 触发自定义事件，表示组件已加载
                const event = new CustomEvent('componentLoaded', {
                    detail: { 
                        componentPath, 
                        targetSelector,
                        element: targetElement 
                    }
                });
                document.dispatchEvent(event);
            } else {
                console.warn(`⚠️ 目标元素未找到: ${targetSelector}`);
            }
        } catch (error) {
            console.error(`❌ 组件加载失败: ${componentPath}`, error);
            
            // 加载失败时的降级处理
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.innerHTML = `
                    <div class="component-error" style="
                        padding: 1rem; 
                        background: #fee; 
                        border: 1px solid #fcc; 
                        border-radius: 4px; 
                        color: #c66;
                        text-align: center;
                    ">
                        <p>⚠️ 组件加载失败: ${componentPath}</p>
                        <p>错误: ${error.message}</p>
                        <button onclick="location.reload()" style="
                            margin-top: 0.5rem;
                            padding: 0.5rem 1rem;
                            background: #667eea;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        ">刷新页面</button>
                    </div>
                `;
            }
        }
    }

    /**
     * 批量加载多个组件
     * @param {Array<{path: string, target: string}>} components - 组件配置数组
     * @returns {Promise<void>}
     */
    static async loadComponents(components) {
        const loadPromises = components.map(({ path, target }) => 
            this.loadComponent(path, target)
        );
        
        await Promise.all(loadPromises);
    }

    /**
     * 初始化页面组件
     * 自动扫描页面中的 data-component 属性并加载对应组件
     */
    static async initPageComponents() {
        const componentElements = document.querySelectorAll('[data-component]');
        const components = [];
        
        componentElements.forEach(element => {
            const componentPath = element.getAttribute('data-component');
            const targetId = element.id || element.className;
            
            if (componentPath && targetId) {
                components.push({
                    path: componentPath,
                    target: `#${element.id}` || `.${element.className.split(' ')[0]}`
                });
            }
        });
        
        if (components.length > 0) {
            await this.loadComponents(components);
        }
    }
}

// 页面加载完成后自动初始化组件
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.initPageComponents();
});

// 导出供其他脚本使用
window.ComponentLoader = ComponentLoader;
