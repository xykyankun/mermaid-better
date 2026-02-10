# Mermaid Better - Cloudflare Pages 部署指南

## ✅ 生产构建成功!

项目已成功通过 Next.js 生产构建,准备部署到 Cloudflare Pages。

---

## 📦 构建产物

```
Route (app)                                 Size     First Load JS
┌ ○ /                                    4.88 kB         203 kB
├ ○ /dashboard                           7.79 kB         206 kB
├ ○ /editor                              14.4 kB         362 kB
├ ○ /login                               4.01 kB         206 kB
├ ○ /register                            4.49 kB         206 kB
└ ○ /templates                           3.68 kB         259 kB

Total First Load JS shared by all           103 kB
```

---

## 🚀 Cloudflare Pages 部署步骤

### 方式 1: 通过 Cloudflare Dashboard (推荐)

1. **准备 Git 仓库**
   ```bash
   cd /home/wukong/project/mermaid-better
   git init
   git add .
   git commit -m "Initial commit - Mermaid Better with Phase 7 features

Generated with [Claude Code](https://claude.ai/code)
via [Happy](https://happy.engineering)

Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>"

   # 推送到 GitHub/GitLab
   git remote add origin YOUR_GIT_REPO_URL
   git branch -M main
   git push -u origin main
   ```

2. **在 Cloudflare Pages 创建项目**
   - 访问: https://dash.cloudflare.com/pages
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 授权并选择你的仓库

3. **配置构建设置**
   ```
   Build command:     npm run build
   Build output directory:  .next
   Root directory:    (留空)
   Node.js version:   22.x
   ```

4. **设置环境变量**
   在 Cloudflare Pages 项目设置中添加:
   ```
   NEXT_PUBLIC_NEON_AUTH_URL=https://ep-proud-frost-ahbfb663.neonauth.c-3.us-east-1.aws.neon.tech/neondb/auth
   NEXT_PUBLIC_NEON_DATA_API_URL=https://ep-proud-frost-ahbfb663.apirest.c-3.us-east-1.aws.neon.tech/neondb/rest/v1
   DATABASE_URL=postgresql://neondb_owner:npg_bIdOlsSe2K5E@ep-proud-frost-ahbfb663-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   NEXT_PUBLIC_APP_URL=https://your-project.pages.dev
   ```

5. **部署**
   - 点击 "Save and Deploy"
   - 等待构建完成 (~2-3 分钟)
   - 访问提供的 URL

---

### 方式 2: 使用 Wrangler CLI

```bash
# 1. 安装 Wrangler (如果还没有)
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 构建项目
npm run build

# 4. 部署
wrangler pages deploy .next --project-name=mermaid-better

# 或使用配置文件
npm run deploy:worker
```

---

## ⚙️ 已修复的类型问题

在构建过程中修复了以下TypeScript类型错误:

1. ✅ `scripts/check-templates.ts` - DATABASE_URL 类型断言
2. ✅ `scripts/seed-templates.ts` - DATABASE_URL 类型断言
3. ✅ `src/app/dashboard/page.tsx` - Date 转 string
4. ✅ `src/lib/neon/schema.ts` - RLS policy SQL 包装
5. ✅ `src/utils/export-utils.ts` - SVGGraphicsElement 类型转换
6. ✅ `src/app/editor/page.tsx` - useSearchParams Suspense 包装

---

## 🔧 配置文件

### `wrangler.jsonc`
```json
{
  "name": "mermaid-better",
  "main": ".open-next/worker.js",
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"]
}
```

### `open-next.config.ts`
```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

---

## 📊 部署后检查清单

- [ ] 网站可访问
- [ ] 登录/注册功能正常
- [ ] 编辑器加载正常
- [ ] Mermaid 图表渲染正常
- [ ] 导出功能 (SVG/PNG/PDF) 工作
- [ ] 键盘快捷键响应
- [ ] 撤销/重做功能正常
- [ ] Dashboard 搜索/过滤工作
- [ ] 模板库加载
- [ ] 分享功能正常

---

## 🌐 Cloudflare Pages 优势

✅ **全球 CDN** - 自动在全球边缘节点分发
✅ **免费 SSL** - 自动 HTTPS 证书
✅ **无限带宽** - 免费计划无带宽限制
✅ **Git 集成** - 推送即部署
✅ **预览部署** - 每个 PR 都有预览环境
✅ **快速构建** - 平均构建时间 2-3 分钟

---

## 🔗 有用的链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [OpenNext Cloudflare](https://github.com/opennextjs/opennextjs-cloudflare)
- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)

---

## 🆘 故障排除

### 构建失败
```bash
# 清理并重建
rm -rf .next node_modules
npm install
npm run build
```

### 环境变量问题
确保在 Cloudflare Pages 设置中添加了所有必需的环境变量

### 数据库连接问题
确保 DATABASE_URL 使用 pooler 连接字符串 (包含 `-pooler`)

---

## 📝 注意事项

1. **首次部署**可能需要 5-10 分钟完成 DNS 传播
2. **自定义域名**需要在 Cloudflare Pages 设置中配置
3. **环境变量更改**后需要重新部署
4. **数据库迁移**需要在部署前完成:
   ```bash
   npm run db:push
   npx tsx scripts/seed-templates.ts
   ```

---

Generated with [Claude Code](https://claude.ai/code)
via [Happy](https://happy.engineering)

Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>
