# 组件使用说明

## 头像标题组件 (about-header.html)

这是一个可复用的头像和标题组件，包含头像图片和"关于我"标题。

### 使用方法

#### 1. 自动加载（推荐）
在HTML中使用 `data-component` 属性：

```html
<div id="about-header-container" data-component="components/about-header.html">
    <!-- 组件将自动加载到这里 -->
</div>
```

#### 2. 手动加载
使用JavaScript手动加载：

```javascript
// 加载单个组件
ComponentLoader.loadComponent('components/about-header.html', '#target-container');

// 批量加载多个组件
ComponentLoader.loadComponents([
    { path: 'components/about-header.html', target: '#header-container' },
    { path: 'components/other-component.html', target: '#other-container' }
]);
```

### 组件特性

- ✅ 自动加载头像图片
- ✅ 图片加载失败时显示占位符
- ✅ 响应式设计
- ✅ 主题色彩一致
- ✅ 悬停动画效果

### 自定义样式

可以通过CSS选择器自定义组件样式：

```css
/* 调整头像大小 */
.profile-avatar .avatar-image {
    width: 100px;
    height: 100px;
}

/* 隐藏标题（用于作者卡片） */
.author-card .about-header h2 {
    display: none;
}

/* 居中显示 */
.author-card .about-header {
    justify-content: center;
}
```

### 文件结构

```
Web/
├── components/
│   ├── about-header.html    # 头像标题组件
│   └── README.md           # 使用说明
├── js/
│   └── component-loader.js  # 组件加载器
└── imags/
    └── tawy.png            # 头像图片
```

### 事件监听

组件加载完成后会触发自定义事件：

```javascript
document.addEventListener('componentLoaded', (event) => {
    const { componentPath, targetSelector, element } = event.detail;
    console.log(`组件 ${componentPath} 已加载到 ${targetSelector}`);
    
    // 可以在这里执行组件加载后的初始化操作
    if (componentPath.includes('about-header.html')) {
        // 初始化头像相关功能
        initAvatarFeatures(element);
    }
});
```

### 注意事项

1. 确保引入了 `js/component-loader.js` 文件
2. 头像图片路径需要正确设置
3. 组件加载是异步的，如需在加载后执行操作，请监听 `componentLoaded` 事件
4. 支持现代浏览器，使用了 `fetch` API 和 `CustomEvent`
