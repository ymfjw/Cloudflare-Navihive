<div align="center">

<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M60 10L105 35V85L60 110L15 85V35L60 10Z" fill="url(#paint0_linear)" stroke="#2D6CDF" stroke-width="2"/>
  <path d="M60 30L80 40V75L60 85L40 75V40L60 30Z" fill="white" stroke="#2D6CDF" stroke-width="2"/>
  <circle cx="60" cy="57" r="10" fill="#2D6CDF"/>
  <path d="M60 43V57L68 65" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <defs>
    <linearGradient id="paint0_linear" x1="15" y1="60" x2="105" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#61DAFB"/>
      <stop offset="1" stop-color="#2D6CDF"/>
    </linearGradient>
  </defs>
</svg>

# NaviHive - 现代化个人导航站

![NaviHive 导航站](https://img.shields.io/badge/NaviHive-导航站-blue)
![React](https://img.shields.io/badge/React-19.0.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6)
![Material UI](https://img.shields.io/badge/Material_UI-7.0-0081cb)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-f38020)
![License](https://img.shields.io/badge/License-MIT-green)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thusbs/Cloudflare-Navihive)

**一个优雅、现代化的网站导航管理系统**
基于 Cloudflare Workers 构建 • 零成本部署 • 全球 CDN 加速 • 企业级安全

[📖 完整文档](https://zqq-nuli.github.io/Cloudflare-Navihive/) • [🎮 在线演示](https://navihive.chatbot.cab/) • [🚀 快速开始](https://zqq-nuli.github.io/Cloudflare-Navihive/deployment/) • [💬 问题反馈](https://github.com/zqq-nuli/Cloudflare-Navihive/issues)

</div>

> 部署过程中遇到问题，暂时可参阅 V1.1.0版本[部署教程](https://github.com/zqq-nuli/Cloudflare-Navihive/tree/v1.1.0)暂时我可能没有那么多时间来修正文档的问题，实在抱歉。

## 🎯 快速开始

### 在线演示

访问演示站点体验所有功能：[navihive.chatbot.cab](https://navihive.chatbot.cab/)

```
👤 演示账号：admin
🔑 演示密码：NaviHive2025!
```

### 立即部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thusbs/Cloudflare-Navihive)

按钮适合快速创建初始项目，但 D1 数据库、认证变量和首次数仓初始化仍然需要手动补齐。

#### 一键部署的文字版完整流程

1. 准备仓库  
   直接使用现有仓库 `thusbs/Cloudflare-Navihive`，或者先 Fork 到你自己的 GitHub 账号。  
   如果你不想让 Cloudflare 新建 GitHub 仓库，在 Cloudflare 向导里直接选择现有仓库即可。

2. 点击部署按钮  
   点击上面的 `Deploy to Cloudflare Workers` 按钮，登录 Cloudflare，授权 GitHub，然后选择要连接的仓库和生产分支 `main`。

3. 创建 Cloudflare Worker 项目  
   在部署向导中填写项目名称，通常保持 `navihive` 即可。  
   完成后 Cloudflare 会先跑一次初始部署，这一步主要是把项目创建出来。

4. 创建 D1 数据库  
   在 Cloudflare Dashboard 打开 `Workers & Pages > D1`，创建一个数据库，例如 `navigation-db`。  
   也可以本地执行：

   ```bash
   npx wrangler d1 create navigation-db
   ```

5. 绑定 D1 到项目  
   编辑仓库根目录的 `wrangler.jsonc`，把 `d1_databases` 中的 `database_name` 和 `database_id` 换成你自己的值，并保持 `binding` 为 `DB`：

   ```jsonc
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "navigation-db",
       "database_id": "你的-database-id"
     }
   ]
   ```

6. 配置认证变量  
   `AUTH_PASSWORD` 不能写明文，必须先生成 bcrypt 哈希。  
   先执行：

   ```bash
   pnpm hash-password YourStrongPassword123
   ```

   再把输出结果填进 `wrangler.jsonc` 的 `vars`：

   ```jsonc
   "vars": {
     "AUTH_ENABLED": "true",
     "AUTH_REQUIRED_FOR_READ": "false",
     "AUTH_USERNAME": "admin",
     "AUTH_PASSWORD": "$2b$10$...",
     "AUTH_SECRET": "至少32位随机字符串"
   }
   ```

7. 初始化数据库表  
   新库直接执行：

   ```bash
   npx wrangler d1 execute DB --remote --file=./init_table.sql --yes
   ```

   如果你是旧库升级，再额外执行：

   ```bash
   npx wrangler d1 execute DB --remote --file=./migrations/002_add_is_public.sql --yes
   ```

8. 重新触发部署  
   如果项目已经连接到 GitHub，直接把配置提交到 `main`，Cloudflare 会自动重新部署。  
   如果你想本地手动部署，也可以执行：

   ```bash
   npm run build
   npx wrangler deploy
   ```

9. 验证是否成功  
   打开 Cloudflare 分配的 `*.workers.dev` 地址，确认首页可以访问、登录可用、站点和分组可以正常读写。  
   首次登录时使用你在 `AUTH_USERNAME` 中设置的用户名，以及生成哈希前的原始密码。

> 详细说明见[完整部署指南](https://zqq-nuli.github.io/Cloudflare-Navihive/deployment/)

---

## 📖 完整文档

### 📚 用户指南
- [**项目介绍**](https://zqq-nuli.github.io/Cloudflare-Navihive/introduction) - 了解 NaviHive 的特点和优势
- [**为什么选择 NaviHive**](https://zqq-nuli.github.io/Cloudflare-Navihive/guide/why-navihive) - 与其他方案的对比
- [**功能截图**](https://zqq-nuli.github.io/Cloudflare-Navihive/guide/screenshots) - 11 张精美功能截图展示
- [**常见问题**](https://zqq-nuli.github.io/Cloudflare-Navihive/guide/faq) - FAQ 和故障排除
- [**更新日志**](https://zqq-nuli.github.io/Cloudflare-Navihive/guide/changelog) - 版本历史和变更记录

### 🔧 开发者文档
- [**部署指南**](https://zqq-nuli.github.io/Cloudflare-Navihive/deployment/) - 详细的部署步骤
- [**架构设计**](https://zqq-nuli.github.io/Cloudflare-Navihive/architecture/) - 技术栈和系统架构
- [**API 文档**](https://zqq-nuli.github.io/Cloudflare-Navihive/api/) - RESTful API 参考
- [**安全指南**](https://zqq-nuli.github.io/Cloudflare-Navihive/security/) - 14+ 安全加固说明
- [**贡献指南**](https://zqq-nuli.github.io/Cloudflare-Navihive/contributing/) - 如何参与项目

### 🎯 功能特性
- [**功能概览**](https://zqq-nuli.github.io/Cloudflare-Navihive/features/) - 完整功能列表和说明

> 📝 访问 [NaviHive 文档站点](https://zqq-nuli.github.io/Cloudflare-Navihive/) 查看完整文档

---

## 🛠️ 技术栈

**前端**: React 19 • TypeScript 5.7 • Material UI 7.0 • Tailwind CSS 4.1 • DND Kit • Vite 6

**后端**: Cloudflare Workers • Cloudflare D1 (SQLite) • JWT + bcrypt • TypeScript Strict Mode

**开发**: pnpm • Wrangler CLI • ESLint + Prettier

## 🤝 贡献

欢迎所有形式的贡献！查看 [贡献指南](https://zqq-nuli.github.io/Cloudflare-Navihive/contributing/) 了解如何参与项目。

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议发布。

---

## 🙏 致谢

感谢以下开源项目和服务：

- [React](https://reactjs.org/) • [TypeScript](https://www.typescriptlang.org/) • [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/) • [DND Kit](https://dndkit.com/) • [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/) • [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Claude Code](https://claude.ai/code) • [Cursor](https://www.cursor.com)

感谢所有提交 Issue、PR 和 Star 的开发者们！🌟

---


### 🤝 其他支持方式
- 💬 提交有价值的 Issue 和 Feature Request
- 📝 改进文档和教程
- 🐛 报告 Bug 并提供复现步骤
- 💻 贡献代码（欢迎提交 PR）

---

## 📈 Star History

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=zqq-nuli/Cloudflare-Navihive&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=zqq-nuli/Cloudflare-Navihive&type=Date" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=zqq-nuli/Cloudflare-Navihive&type=Date" />
</picture>

<div align="center">

## 🎉 让导航管理更简单

**NaviHive** - 你的专属网络导航中心

[立即部署](https://deploy.workers.cloudflare.com/?url=https://github.com/zqq-nuli/Cloudflare-Navihive) • [在线演示](https://navihive.chatbot.cab/) • [完整文档](https://zqq-nuli.github.io/Cloudflare-Navihive/) • [提交问题](https://github.com/zqq-nuli/Cloudflare-Navihive/issues)

Made with ❤️ by [zqq-nuli](https://github.com/zqq-nuli)

⭐ 如果觉得有用，别忘了点个 Star 哦 ⭐

</div>
