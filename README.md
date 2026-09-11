# majiayi0526.github.io

马佳艺的个人学术网站 · <https://majiayi0526.github.io>

纯静态站点，**没有构建步骤**。改完文件推送到 `main`，GitHub Pages 会自动发布（约一分钟生效）。

## 目录结构

```
index.html        首页（简介 / 关键数字 / 研究方向 / 教育背景）
research.html     科研成果（在研课题 / 会议论文 / 应用项目 / 技术技能）
fencing.html      体育专业经历（执教 / 执裁 / 竞赛 / 志愿服务）
awards.html       荣誉与证书
cv.html           简历概览 + PDF 下载

styles/
  tokens.css      设计变量：颜色、字号、间距、动效曲线。改配色只动这里
  base.css        基础排版、氛围层（辉光 + 噪点）、双语切换、滚动揭示
  layout.css      导航、首屏、章节、页脚
  components.css  按钮、条目、卡片、标签、奖牌、横幅

js/
  lang.js         中英切换（记住选择；支持 ?lang=cn / ?lang=en 链接）
  nav.js          移动端菜单
  reveal.js       滚动入场动画

photo.jpg         证件照        epee-coach.png   Épée Coach 项目截图
JiayiMa_CV.pdf    简历 PDF
```

## 常见修改

**改文字** — 直接编辑对应 `.html`。每段文字都是中英成对出现：

```html
<span class="lang-en">English text</span><span class="lang-cn">中文文字</span>
```

两个都要改，否则切换语言时会出现一边是旧内容。

**换照片** — 用同名文件覆盖 `photo.jpg`，然后更新 HTML 里 `<img>` 的 `width` 和 `height`
为新图的真实像素尺寸（防止加载时页面跳动）。

**换简历 PDF** — 覆盖 `JiayiMa_CV.pdf` 即可，文件名保持不变。

**改主色** — 打开 `styles/tokens.css`，改 `--accent`（大字/线条/标记用）和
`--accent-text`（小号文字用，对比度更高）。两个都要改。

**加一个新页面** — 复制一个现有 `.html`，改标题和正文；然后在**全部五个页面**的
`<nav>` 里加上新链接（本站刻意不用模板引擎，代价就是导航要手动同步五处）。

## 注意事项

- 页面用了严格的 CSP（内容安全策略），**不允许任何内联 `style="..."` 属性和内联
  `<script>`**。样式写进 `styles/`，脚本写进 `js/`，否则浏览器会静默拦截。
- 字体全部使用系统字体，不加载 Google Fonts —— 国内访问不会被墙，也不阻塞渲染。
- 所有动画只使用 `transform` 和 `opacity`，并且尊重系统的「减弱动态效果」设置。
- 即使 JavaScript 加载失败，所有内容依然可见（入场动画是渐进增强，不是显示前提）。

## 本地预览

```bash
python3 -m http.server 4321
```

然后打开 <http://localhost:4321>。直接双击 HTML 用 `file://` 打开会被 CSP 拦住，必须走
本地服务器。
