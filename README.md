# 个人网站

这是一个不依赖构建工具的静态个人网站模板，直接打开 `index.html` 就能查看，也可以用本地服务器预览。

## 文件说明

- `index.html`：页面内容结构
- `styles.css`：视觉样式与响应式布局
- `script.js`：滚动显现、导航高亮、卡片倾斜等交互
- `favicon.svg`：站点图标

## 本地预览

```bash
cd /Users/dh/Desktop/个人网站
python3 -m http.server 8000
```

然后打开 `http://localhost:8000`。

## 建议你先改的内容

1. `index.html` 里的名字、标题和联系方式
2. 作品区的项目名称和描述
3. 写作区与社交链接
4. 页面的中文文案，改成你的真实定位
