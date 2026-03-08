# 个人网站

这是一个不依赖构建工具的静态个人简历网站，当前版本采用三栏信息流布局，风格参考了知识社区主页：左侧是身份与研究方向，中间是经历 / 项目 / 文章流，右侧是个人名片与关键指标。

## 文件说明

- `index.html`：页面内容结构
- `styles.css`：视觉样式、三栏布局与移动端适配
- `script.js`：内容筛选、滚动显现、侧边导航高亮
- `favicon.svg`：站点图标

## 本地预览

```bash
cd /Users/dh/Desktop/个人网站
python3 -m http.server 8000 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:8000`。

## 当前内容来源

- 桌面上的公众号文章库
- 桌面上的小报童内容整理
- 你当前已经公开表达过的经历、项目和方法论

## 以后怎么改

1. 直接修改 `index.html` 里的文案和链接
2. 需要改风格时，主要改 `styles.css`
3. 需要改筛选或交互时，改 `script.js`
4. 改完如果要同步到 GitHub Pages，执行：

```bash
cd /Users/dh/Desktop/个人网站
git add .
git commit -m "update site"
git push
```
