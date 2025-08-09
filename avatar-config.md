# 头像配置说明

## 📸 统一头像管理系统

现在所有页面的头像都通过 `js/author-data.js` 文件统一管理，实现了真正的"一处修改，全站更新"。

## 🔧 如何更换头像

### 1. 基本头像更换
在 `js/author-data.js` 文件中修改：

```javascript
const AuthorData = {
    avatar: {
        main: "imags/your-new-avatar.jpg",      // 主头像
        fallback: "imags/default-avatar.png",   // 备用头像
        alt: "我的头像"                          // 描述文字
    }
}
```

### 2. 高级配置选项

#### 多格式头像支持
```javascript
avatar: {
    main: "imags/tawy.webp",           // 使用更现代的格式
    fallback: "imags/tawy.jpg",        // 备用格式
    alt: "Tawy - 游戏开发工程师"
}
```

#### 不同尺寸头像
```javascript
avatar: {
    main: "imags/tawy-hd.png",         // 高清版本
    fallback: "imags/tawy-low.png",    // 低分辨率备用
    alt: "我的专业头像"
}
```

## 🎯 自动路径处理

系统会自动处理不同页面的路径：

- **主页** (`index.html`): `imags/tawy.png`
- **文章页面**: `../imags/tawy.png`

无需手动调整路径！

## 🛡️ 错误处理机制

1. **主头像加载失败** → 自动尝试备用头像
2. **备用头像也失败** → 显示图标占位符
3. **完整的错误日志** → 便于调试

## 💡 使用建议

### 头像文件规格
- **格式**: PNG, JPG, WebP
- **尺寸**: 200x200px (推荐)
- **大小**: < 100KB
- **命名**: 使用有意义的名称

### 文件组织
```
imags/
├── tawy.png              # 主头像
├── tawy-hd.png           # 高清版本
├── default-avatar.png    # 默认占位头像
└── avatars/              # 头像变体目录
    ├── casual.jpg        # 休闲风格
    ├── professional.jpg  # 正式风格
    └── creative.png      # 创意风格
```

## 🔄 快速切换头像

想要快速切换不同风格的头像？只需修改一行代码：

```javascript
// 切换到正式风格
main: "imags/avatars/professional.jpg"

// 切换到创意风格  
main: "imags/avatars/creative.png"

// 切换到休闲风格
main: "imags/avatars/casual.jpg"
```

## 🎨 主题化头像

可以根据不同主题使用不同头像：

```javascript
// 在 AuthorData 中添加主题配置
themes: {
    default: "imags/tawy.png",
    dark: "imags/tawy-dark.png", 
    light: "imags/tawy-light.png",
    gaming: "imags/tawy-gaming.png"
}
```

现在您的头像管理变得前所未有的简单和灵活！🎉
