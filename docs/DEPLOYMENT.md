# Mermaid Better 部署指南

本指南提供 Cloudflare Workers 和 Cloudflare Pages 两种部署方式。

---

## 🚀 方式 1: Cloudflare Workers (推荐)

适合需要更多控制和灵活性的场景。

### 前置条件

- 已安装 pnpm
- Cloudflare 账号
- 已配置 `.env` 文件

### 步骤 1: 登录 Cloudflare

```bash
npx wrangler login
```

### 步骤 2: 构建 Workers 版本

```bash
pnpm run build:worker
```

这会生成 `.open-next/` 目录，包含 Worker 运行所需的所有文件。

### 步骤 3: 配置环境变量

使用 wrangler secrets 添加敏感信息：

```bash
# 数据库连接字符串
npx wrangler secret put DATABASE_URL
# 粘贴你的 DATABASE_URL (必须使用 pooler 连接)

# 应用 URL
npx wrangler secret put NEXT_PUBLIC_APP_URL
# 输入: https://mermaid-better.<your-subdomain>.workers.dev
```

**注意**: 公开的环境变量（`NEXT_PUBLIC_NEON_AUTH_URL` 等）已在 `wrangler.jsonc` 中配置。

### 步骤 4: 部署

```bash
pnpm run deploy:worker
```

部署成功后会显示你的 Workers URL。

### 本地预览

部署前可以本地测试：

```bash
pnpm run preview:worker
```

访问 http://localhost:8771

### 自定义域名

1. 进入 Cloudflare Dashboard
2. 选择 Workers 项目 → Settings → Triggers → Custom Domains
3. 添加你的域名（如 `app.yourdomain.com`）
4. Cloudflare 自动配置 DNS

### 查看日志

```bash
# 实时日志
npx wrangler tail

# 部署列表
npx wrangler deployments list

# Secrets 列表
npx wrangler secret list
```

---

## 📄 方式 2: Cloudflare Pages

适合简单部署和自动 CI/CD 的场景。

### 步骤 1: 推送代码到 GitHub

```bash
git push origin main
```

### 步骤 2: 连接到 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create application** → **Pages**
3. 连接你的 GitHub 仓库

### 步骤 3: 配置构建设置

```
Framework preset: Next.js
Build command: pnpm run build
Build output directory: .next
Root directory: /
```

### 步骤 4: 添加环境变量

在 **Settings** → **Environment variables** 中添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...@...-pooler.neon.tech/...` | Production, Preview |
| `NEXT_PUBLIC_NEON_AUTH_URL` | `https://...neonauth...` | Production, Preview |
| `NEXT_PUBLIC_NEON_DATA_API_URL` | `https://...apirest...` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://mermaid-better.pages.dev` | Production |
| `NODE_VERSION` | `22` | Production, Preview |

### 步骤 5: 部署

保存配置后，Cloudflare Pages 会自动触发构建和部署。

每次推送到 GitHub，都会自动重新部署。

---

## 🔄 更新部署

### Workers 更新

```bash
pnpm run build:worker
pnpm run deploy:worker
```

### Pages 更新

```bash
git push origin main
# Cloudflare Pages 自动部署
```

---

## ⚠️ 重要提示

### 数据库连接

**必须使用 Neon Pooler 连接字符串：**

✅ 正确: `postgresql://...@ep-xxx-pooler.c-3.us-east-1.aws.neon.tech/...`

❌ 错误: `postgresql://...@ep-xxx.c-3.us-east-1.aws.neon.tech/...` (缺少 `-pooler`)

### 环境变量区别

**Workers:**
- Secrets: 敏感信息（DATABASE_URL），加密存储
- Vars: 公开信息（NEXT_PUBLIC_*），在 wrangler.jsonc 中配置

**Pages:**
- 所有环境变量在 Dashboard 中统一配置

### `.dev.vars` 文件

- 仅用于本地 Workers 开发
- 已加入 `.gitignore`，不会提交
- 生产环境不使用

---

## 🐛 故障排查

### 问题: DATABASE_URL 错误

**Workers:**
- 检查是否使用 `npx wrangler secret put DATABASE_URL` 添加
- 运行 `npx wrangler secret list` 查看已有 secrets

**Pages:**
- 检查 Settings → Environment variables 中是否正确配置
- 确保环境选择了 Production 和 Preview

### 问题: 构建失败

1. 检查 Node 版本（需要 22+）
2. 本地测试构建：
   ```bash
   pnpm run build:worker  # Workers
   pnpm run build         # Pages
   ```
3. 查看详细日志：
   ```bash
   npx wrangler deploy --verbose  # Workers
   # Pages: 在 Dashboard 查看 Build logs
   ```

### 问题: 如何更新环境变量？

**Workers:**
```bash
npx wrangler secret put <SECRET_NAME>  # 覆盖旧值
```

**Pages:**
在 Dashboard → Settings → Environment variables 中修改

---

## 📚 命令速查

### Workers 命令

```bash
# 开发
pnpm run dev:worker          # 开发模式
pnpm run preview:worker      # 预览模式

# 构建和部署
pnpm run build:worker        # 构建
pnpm run deploy:worker       # 部署

# Wrangler 工具
npx wrangler login           # 登录
npx wrangler logout          # 登出
npx wrangler tail            # 查看日志
npx wrangler secret put      # 添加 secret
npx wrangler secret list     # 列出 secrets
```

### Pages 命令

```bash
# 标准 Next.js 构建
pnpm run build               # 构建
pnpm run start               # 本地启动生产版本

# 部署
git push origin main         # 推送触发自动部署
```

---

## 🔗 相关资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Neon PostgreSQL 文档](https://neon.tech/docs/)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)

---

## 💡 选择建议

**选择 Workers 如果:**
- 需要更精细的控制
- 需要使用 Workers 特有功能
- 希望手动控制部署时机

**选择 Pages 如果:**
- 喜欢自动 CI/CD
- 配置更简单
- 与 Git 工作流集成更好

两种方式性能相同，都运行在 Cloudflare 边缘网络上。
