/* 项目数据 —— 新增项目：在此数组按同结构添加一条，并把封面图放入 assets/ */
window.PROJECTS = [
  {
    id: 'pulse-design-system',
    year: 2026,
    title: 'Pulse Design System',
    tagline: '覆盖 40+ 组件的设计系统与令牌流水线',
    cover: 'assets/cover-pulse.png',
    description:
      '为中型 SaaS 团队从零搭建的设计系统。设计令牌从 Figma 自动同步到代码，无头组件架构支持任意品牌皮肤，内置可访问性审计，让设计与开发的偏差从像素级争论变成一次合并请求。',
    stack: ['React', 'TypeScript', 'Style Dictionary', 'Storybook'],
    links: { demo: 'https://example.com/pulse', github: 'https://github.com/ERlzero/pulse' }
  },
  {
    id: 'meridian-analytics',
    year: 2025,
    title: 'Meridian Analytics',
    tagline: '十万级数据点实时可视化的渲染优化实验',
    cover: 'assets/cover-meridian.png',
    description:
      '实时数据可视化仪表盘。用 Canvas 分层渲染与 Web Worker 聚合，把十万级数据点的首屏渲染从 4 秒压到 300 毫秒，交互缩放保持 60fps。',
    stack: ['Canvas API', 'Web Worker', 'D3.js', 'Vite'],
    links: { demo: 'https://example.com/meridian', github: 'https://github.com/ERlzero/meridian' }
  },
  {
    id: 'field-notes-webgl',
    year: 2025,
    title: 'Field Notes',
    tagline: '一组关于粒子、噪声与诗意的 WebGL 小品',
    cover: 'assets/cover-field.png',
    description:
      '持续更新的 WebGL 实验合集：GPU 粒子系统、Simplex 噪声流场、基于鼠标速度的墨迹着色器。每个实验附源码与思路笔记，累计被 12 个创意站点收录。',
    stack: ['WebGL', 'GLSL', 'Three.js'],
    links: { demo: 'https://example.com/field', github: 'https://github.com/ERlzero/field-notes' }
  },
  {
    id: 'sprout-cli',
    year: 2024,
    title: 'Sprout CLI',
    tagline: '为前端脚手架瘦身的命令行工具',
    cover: 'assets/cover-sprout.png',
    description:
      '开源命令行工具，把团队脚手架从 800MB 依赖瘦身到 12MB：按需模板、离线缓存、可组合的预设系统。周下载量 3000+，被两家公司内部前端平台采用。',
    stack: ['Node.js', 'Commander.js', 'esbuild'],
    links: { demo: 'https://example.com/sprout', github: 'https://github.com/ERlzero/sprout' }
  }
];
