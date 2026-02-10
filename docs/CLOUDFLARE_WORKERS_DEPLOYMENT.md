# Cloudflare Workers 部署指南

## ✅ 前置条件

1. 已安装 `pnpm` 和 `wrangler`
2. 已登录 Cloudflare 账号：`npx wrangler login`
3. 已完成本地构建测试

---

## 🚀 部署步骤

### 步骤 1：构建 Workers 版本

```bash
pnpm run build:worker
```

这会生成 `.open-next/` 目录，包含：
- `worker.js` - Workers 入口文件
- `assets/` - 静态资源
- `server-functions/` - 服务器函数

### 步骤 2：配置 Secrets（敏感环境变量）

使用 wrangler 命令添加敏感信息（**不要直接写在 wrangler.jsonc 中！**）：

```bash
# 添加数据库连接字符串
npx wrangler secret put DATABASE_URL
# 粘贴: postgresql://neondb_owner:npg_bIdOlsSe2K5E@ep-proud-frost-ahbfb663-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# 添加应用 URL（生产环境）
npx wrangler secret put NEXT_PUBLIC_APP_URL
# 输入: https://mermaid-better.workers.dev （或你的自定义域名）
```

### 步骤 3：部署到 Cloudflare Workers

```bash
# 部署到生产环境（默认）
pnpm run deploy:worker

# 或使用 wrangler 直接部署
npx wrangler deploy
```

### 步骤 4：查看部署信息

部署成功后，会显示：
```
Published mermaid-better (X.XX sec)
  https://mermaid-better.<your-subdomain>.workers.dev
```

访问这个 URL 即可查看你的应用！

---

## 🔐 环境变量说明

### 在 wrangler.jsonc 中配置的变量（公开）

```jsonc
"vars": {
  "NEXT_PUBLIC_NEON_AUTH_URL": "...",
  "NEXT_PUBLIC_NEON_DATA_API_URL": "...",
  "NODE_VERSION": "22"
}
```

### 使用 Secrets 配置的变量（敏感）

- `DATABASE_URL` - 数据库连接字符串（包含密码）
- `NEXT_PUBLIC_APP_URL` - 应用访问 URL

---

## 🌐 配置自定义域名

1. 进入 Cloudflare Dashboard
2. 选择你的 Workers 项目：**mermaid-better**
3. 点击 **Settings** → **Triggers** → **Custom Domains**
4. 点击 **Add Custom Domain**
5. 输入你的域名（如：`app.yourdomain.com`）
6. Cloudflare 会自动配置 DNS 记录

---

## 🔄 更新部署

每次代码更新后：

```bash
# 1. 重新构建
pnpm run build:worker

# 2. 重新部署
pnpm run deploy:worker
```

---

## 🧪 本地预览

在部署前，可以本地预览 Workers 版本：

```bash
# 启动本地 Workers 预览
pnpm run preview:worker
```

这会在 `http://localhost:8771` 启动本地 Workers 环境，使用 `.dev.vars` 中的环境变量。

---

## 📊 查看 Worker 状态和日志

### 查看实时日志
```bash
npx wrangler tail
```

### 查看 Worker 列表
```bash
npx wrangler deployments list
```

### 查看 Secrets 列表
```bash
npx wrangler secret list
```

---

## ⚠️ 注意事项

1. **DATABASE_URL 必须使用 pooler 连接**
   - ✅ 正确：`@ep-proud-frost-ahbfb663-pooler.c-3.us-east-1.aws.neon.tech`
   - ❌ 错误：`@ep-proud-frost-ahbfb663.c-3.us-east-1.aws.neon.tech`（无 pooler）

2. **Secrets 和 Vars 的区别**
   - Secrets：加密存储，不可读取，用于敏感信息（DATABASE_URL）
   - Vars：明文存储，可在配置文件中查看，用于公开信息（NEXT_PUBLIC_*）

3. **`.dev.vars` 文件**
   - 仅用于本地开发
   - 已添加到 `.gitignore`，不会被提交
   - 生产环境不使用此文件

4. **NEXT_PUBLIC_APP_URL**
   - 本地开发：`http://localhost:8771`
   - 生产环境：你的 Workers 域名或自定义域名

---

## 🐛 常见问题

### Q: 部署后访问报 DATABASE_URL 错误
A: 检查是否使用 `wrangler secret put` 添加了 DATABASE_URL

### Q: 如何更新 SECRET？
A: 重新运行 `npx wrangler secret put <SECRET_NAME>`，会覆盖旧值

### Q: Workers vs Pages 有什么区别？
A:
- **Workers**: 更底层，更灵活，适合需要精细控制的场景
- **Pages**: 专为前端优化，自动 CI/CD，配置更简单
- 性能和功能基本相同

### Q: 部署失败怎么办？
A:
1. 检查 `pnpm run build:worker` 是否成功
2. 检查 `npx wrangler login` 是否已登录
3. 查看详细错误日志：`npx wrangler deploy --verbose`

---

## 📚 相关命令速查

```bash
# 构建
pnpm run build:worker

# 本地开发
pnpm run dev:worker

# 本地预览（生产模式）
pnpm run preview:worker

# 部署
pnpm run deploy:worker

# 查看日志
npx wrangler tail

# 管理 Secrets
npx wrangler secret put <NAME>
npx wrangler secret list
npx wrangler secret delete <NAME>

# 登录/登出
npx wrangler login
npx wrangler logout
```
