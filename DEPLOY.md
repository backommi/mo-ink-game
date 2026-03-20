# 墨染 - GitHub Pages 部署指南

## 🚀 快速部署

### 1. 创建 GitHub 仓库

```bash
# 1. 在 GitHub 创建新仓库：mo-ink-game
# 2. 复制仓库 SSH 地址：git@github.com:your-username/mo-ink-game.git

# 3. 在本地项目中设置远程仓库（替换 your-username）
git remote set-url origin git@github.com:your-username/mo-ink-game.git

# 4. 推送代码
git push -u origin gh-pages
```

### 2. GitHub Pages 配置

1. 进入仓库 → Settings → Pages
2. Branch → `gh-pages` → Save

### 3. 访问游戏

部署完成后，访问：
```
https://your-username.github.io/mo-ink-game/
```

---

## 🎮 开发命令

```bash
# 本地开发
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

---

## 📝 部署后检查清单

- [ ] 仓库已创建：`mo-ink-game`
- [ ] 分支已切换：`gh-pages`
- [ ] 代码已推送：`git push -u origin gh-pages`
- [ ] GitHub Pages 已启用
- [ ] 访问地址可打开
- [ ] 游戏功能正常运行

---

## 🐛 常见问题

**Q: 页面空白/404**
- A: 检查 Vercel/GitHub Pages 是否启用，分支是否为 `gh-pages`

**Q: 资源加载失败**
- A: 检查 `vite.config.js` 中的 `base` 配置是否为 `/mo-ink-game/`

**Q: 游戏无法启动**
- A: 检查浏览器控制台是否有报错，可能是 Phaser.js 加载问题

---

**Deploy Now! 🚀**