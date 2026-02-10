# Cloudflare Workers 部署指南

使用 Cloudflare Workers 部署 Mermaid Better 应用。

---

## 🚀 部署步骤

### 前置条件

- 已安装 pnpm
- Cloudflare 账号
- 已配置本地 `.env` 文件

### 步骤 1: 登录 Cloudflare

```bash
npx wrangler login
```

浏览器会打开，完成授权登录。

### 步骤 2: 构建 Workers 版本

```bash
pnpm run build:worker
```

这会生成 `.open-next/` 目录，包含：
- `worker.js` - Workers 入口文件
- `assets/` - 静态资源
- `server-functions/` - 服务器函数

### 步骤 3: 配置环境变量

使用 wrangler secrets 添加敏感信息：

```bash
# 数据库连接字符串（必须使用 pooler）
npx wrangler secret put DATABASE_URL
# 粘贴: postgresql://user:pass@host-pooler.region.aws.neon.tech/db?sslmode=require

# 应用 URL
npx wrangler secret put NEXT_PUBLIC_APP_URL
# 输入: https://mermaid-better.<your-subdomain>.workers.dev
```

**注意**: 公开的环境变量（`NEXT_PUBLIC_NEON_AUTH_URL`、`NEXT_PUBLIC_NEON_DATA_API_URL`）已在 `wrangler.jsonc` 中配置。

### 步骤 4: 部署到 Cloudflare

```bash
pnpm run deploy:worker
```

部署成功后会显示：
```
Published mermaid-better (X.XX sec)
  https://mermaid-better.<your-subdomain>.workers.dev
```

访问这个 URL 即可使用你的应用！

---

## 🔄 更新部署

每次代码更新后：

```bash
# 1. 重新构建
pnpm run build:worker

# 2. 重新部署
pnpm run deploy:worker
```

或者合并为一条命令：
```bash
pnpm run build:worker && pnpm run deploy:worker
```

---

## 🧪 本地测试

### 开发模式

```bash
pnpm run dev:worker
```

启动本地 Workers 开发服务器，支持热重载。访问 http://localhost:8771

### 预览模式

```bash
pnpm run preview:worker
```

使用生产构建在本地预览，测试部署效果。

---

## 🌐 自定义域名

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → 选择你的 Worker
3. 点击 **Settings** → **Triggers** → **Custom Domains**
4. 点击 **Add Custom Domain**
5. 输入你的域名（如 `app.yourdomain.com`）
6. Cloudflare 自动配置 DNS 记录

---

## 📊 监控和日志

### 查看实时日志

```bash
npx wrangler tail
```

### 查看部署历史

```bash
npx wrangler deployments list
```

### 查看已配置的 Secrets

```bash
npx wrangler secret list
```

### 删除 Secret

```bash
npx wrangler secret delete <SECRET_NAME>
```

---

## ⚠️ 重要提示

### 数据库连接

**必须使用 Neon Pooler 连接字符串：**

✅ 正确:
```
postgresql://user@ep-xxx-pooler.c-3.us-east-1.aws.neon.tech/db
```

❌ 错误（缺少 `-pooler`）:
```
postgresql://user@ep-xxx.c-3.us-east-1.aws.neon.tech/db
```

Workers 运行在边缘环境，必须使用连接池来管理数据库连接。

### 环境变量类型

**Secrets（加密存储）:**
- `DATABASE_URL` - 数据库连接字符串（包含密码）
- `NEXT_PUBLIC_APP_URL` - 应用访问 URL
- 使用 `wrangler secret put` 添加
- 无法读取，只能覆盖

**Vars（明文存储）:**
- `NEXT_PUBLIC_NEON_AUTH_URL` - Neon Auth URL
- `NEXT_PUBLIC_NEON_DATA_API_URL` - Neon Data API URL
- `NODE_VERSION` - Node 版本
- 在 `wrangler.jsonc` 中配置

### `.dev.vars` 文件

本地开发环境变量文件：
- 仅用于 `pnpm run dev:worker` 和 `pnpm run preview:worker`
- 已添加到 `.gitignore`，不会提交到 Git
- 生产环境使用 wrangler secrets，不使用此文件

---

## 🐛 故障排查

### 问题: DATABASE_URL 未定义

**检查步骤:**
1. 运行 `npx wrangler secret list` 查看是否已添加
2. 确认使用了 pooler 连接字符串（包含 `-pooler`）
3. 重新添加 secret: `npx wrangler secret put DATABASE_URL`

### 问题: 构建失败

**解决方法:**
1. 检查 Node 版本（需要 22+）
   ```bash
   node -v
   ```
2. 清理并重新安装依赖
   ```bash
   rm -rf node_modules .open-next
   pnpm install
   pnpm run build:worker
   ```
3. 查看详细错误日志
   ```bash
   pnpm run build:worker --verbose
   ```

### 问题: 部署后运行时错误

**检查步骤:**
1. 查看实时日志
   ```bash
   npx wrangler tail
   ```
2. 检查所有 secrets 是否已配置
   ```bash
   npx wrangler secret list
   ```
3. 确认 `wrangler.jsonc` 中的 vars 配置正确

### 问题: 如何更新环境变量？

**更新 Secret:**
```bash
npx wrangler secret put <SECRET_NAME>
# 输入新值，会覆盖旧值
```

**更新 Var:**
修改 `wrangler.jsonc` 文件中的 `vars` 对象，然后重新部署。

---

## 📚 命令速查

```bash
# 登录/登出
npx wrangler login
npx wrangler logout

# 开发
pnpm run dev:worker          # 开发模式（热重载）
pnpm run preview:worker      # 预览模式（生产构建）

# 构建和部署
pnpm run build:worker        # 构建 Workers 版本
pnpm run deploy:worker       # 部署到 Cloudflare

# 监控和管理
npx wrangler tail            # 实时日志
npx wrangler deployments list    # 部署历史
npx wrangler secret list     # 列出 secrets
npx wrangler secret put <NAME>   # 添加/更新 secret
npx wrangler secret delete <NAME> # 删除 secret

# 调试
npx wrangler deploy --verbose    # 详细部署日志
npx wrangler whoami          # 查看当前登录账号
```

---

## 🔗 相关资源

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [Neon PostgreSQL 文档](https://neon.tech/docs/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

---

## 💡 最佳实践

1. **环境隔离**: 使用 `wrangler.jsonc` 中的 `env` 配置多个环境（dev、staging、prod）
2. **定期备份**: 记录所有 secrets 的值（存储在安全的地方）
3. **监控日志**: 定期查看 `wrangler tail` 输出，及时发现问题
4. **版本控制**: 每次重大更新前，在 Dashboard 查看部署历史，便于回滚
5. **测试先行**: 使用 `pnpm run preview:worker` 在本地充分测试后再部署
