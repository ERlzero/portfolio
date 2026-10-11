# 流离之梦 · Portfolio

个人作品集网站 —— 纯 HTML/CSS/JS 手写，零框架、零构建。

## 特性

- **数据驱动**：项目列表由 `projects.js` 配置，自动按年份分组渲染
- **无障碍**：跳过链接、`:focus-visible` 焦点、弹窗焦点陷阱、`prefers-reduced-motion` 全量降级
- **响应式**：桌面双列 / 移动端单列，单断点
- **性能**：字体 preconnect、图片懒加载、`transform/opacity` 合成动画

## 本地预览

直接打开 `index.html`，或用任意静态服务器：

```bash
python -m http.server 8000
```

## 新增项目

编辑 `projects.js`，在 `window.PROJECTS` 数组末尾添加一条对象：

```js
{
  id: 'slug-name',
  year: 2026,
  title: '项目名',
  tagline: '一句话简介',
  cover: 'assets/cover-xxx.png',
  description: '详细描述',
  stack: ['技术1', '技术2'],
  links: { demo: 'https://…', github: 'https://github.com/ERlzero/…' }
}
```

封面图放入 `assets/`（横向图即可，卡片 4:3、弹窗 16:9 会自动裁切）。
