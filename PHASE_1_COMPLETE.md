# 🎉 Mermaid Better - 一期 MVP 完成

## ✅ 已完成功能

### 1. 数据库设计
- ✅ 创建 `diagrams` 表用于存储用户图表
- ✅ 实现行级安全策略（RLS），确保用户只能访问自己的数据
- ✅ 支持字段：标题、内容、类型、描述、创建时间、更新时间

### 2. Mermaid 在线编辑器
- ✅ 集成 Monaco Editor 提供代码编辑功能
- ✅ 语法高亮
- ✅ 左右分屏布局（编辑器 + 预览）
- ✅ 实时预览 Mermaid 图表
- ✅ 错误提示和语法检查
- ✅ 支持所有 Mermaid 图表类型（流程图、时序图、类图、ER图、甘特图等）

### 3. 图表管理
- ✅ 创建新图表
- ✅ 保存图表到数据库
- ✅ 加载已有图表
- ✅ 更新图表内容
- ✅ 删除图表
- ✅ 自动检测图表类型

### 4. 用户图表库
- ✅ 图表列表展示（卡片式网格布局）
- ✅ 显示图表标题、类型、更新时间
- ✅ 快速编辑和删除操作
- ✅ 空状态提示
- ✅ 创建新图表入口

### 5. 导出功能
- ✅ 导出为 PNG 图片
- ✅ 导出为 SVG 矢量图
- ✅ 复制 Mermaid 代码到剪贴板
- ✅ 一键下载功能

### 6. UI/UX 优化
- ✅ 美观的落地页（Hero section + 特性介绍）
- ✅ 响应式设计
- ✅ 加载状态提示
- ✅ 错误处理和用户反馈
- ✅ 统一的设计风格

## 🎯 技术栈

- **前端框架**: Next.js 15 (App Router)
- **编辑器**: Monaco Editor
- **图表渲染**: Mermaid.js
- **数据库**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **样式**: Tailwind CSS
- **认证**: Neon Auth (Better Auth)
- **类型安全**: TypeScript

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx              # 落地页
│   ├── editor/
│   │   └── page.tsx          # 编辑器页面
│   ├── dashboard/
│   │   └── page.tsx          # 图表列表
│   ├── login/page.tsx        # 登录页
│   ├── register/page.tsx     # 注册页
│   └── api/
│       └── diagrams/
│           ├── route.ts      # 图表 CRUD API
│           └── [id]/route.ts # 单个图表操作
├── components/
│   ├── mermaid-editor.tsx    # Mermaid 编辑器组件
│   └── ui/                   # UI 基础组件
└── lib/
    └── neon/
        ├── client.ts         # Neon 客户端配置
        └── schema.ts         # 数据库模式定义
```

## 🚀 如何运行

### 1. 安装依赖
```bash
npm install --legacy-peer-deps
```

### 2. 配置环境变量
编辑 `.env` 文件，配置 Neon 数据库连接：
```env
NEXT_PUBLIC_NEON_AUTH_URL=...
NEXT_PUBLIC_NEON_DATA_API_URL=...
DATABASE_URL=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 推送数据库模式
```bash
npm run db:push
# 或使用迁移
npm run db:generate
npm run db:migrate
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

## 🎨 功能演示

### 落地页
- 访问首页查看产品介绍
- 点击 "Get Started Free" 注册账号
- 或点击 "Try Editor" 直接尝试编辑器

### 创建图表
1. 注册/登录账号
2. 进入 Dashboard
3. 点击 "New Diagram" 创建新图表
4. 在编辑器中输入 Mermaid 代码
5. 实时预览图表效果
6. 输入标题并保存

### 管理图表
1. 在 Dashboard 查看所有图表
2. 点击 "Edit" 编辑图表
3. 点击 "Delete" 删除图表
4. 支持按更新时间排序

### 导出图表
1. 在编辑器中打开图表
2. 点击预览区域的导出按钮
3. 选择 PNG、SVG 或复制代码

## 📝 API 接口

### GET /api/diagrams
获取当前用户的所有图表

### POST /api/diagrams
创建新图表
```json
{
  "title": "My Diagram",
  "content": "graph TD\nA-->B",
  "type": "flowchart",
  "description": "Optional description"
}
```

### GET /api/diagrams/[id]
获取特定图表

### PATCH /api/diagrams/[id]
更新图表
```json
{
  "title": "Updated Title",
  "content": "graph TD\nA-->B-->C"
}
```

### DELETE /api/diagrams/[id]
删除图表

## 🎯 下一步计划（二期功能）

### 编辑器增强
- [ ] 代码自动补全
- [ ] 快捷键支持
- [ ] 多标签编辑
- [ ] 代码片段库
- [ ] 全屏模式

### 模板系统
- [ ] 预置常用模板
- [ ] 模板分类浏览
- [ ] 从模板创建
- [ ] 保存自定义模板

### 图表组织
- [ ] 创建文件夹/集合
- [ ] 标签系统
- [ ] 搜索和筛选
- [ ] 收藏功能

### 分享功能
- [ ] 生成分享链接
- [ ] 公开/私有设置
- [ ] 嵌入代码
- [ ] 分享统计

### 版本历史
- [ ] 自动保存版本
- [ ] 查看历史
- [ ] 版本对比
- [ ] 恢复功能

## 💡 已知问题

1. 编辑器在首次加载时可能需要等待 Monaco Editor 初始化
2. 导出 PNG 功能依赖浏览器环境，某些复杂图表可能需要优化
3. 目前没有图表搜索功能，二期会添加

## 🙏 致谢

- Mermaid.js - 强大的图表渲染库
- Monaco Editor - VSCode 同款编辑器
- Neon - 优秀的 serverless PostgreSQL
- Next.js - 现代化的 React 框架

---

**状态**: ✅ 一期 MVP 完成
**开发时间**: 2026-01-27
**版本**: 1.0.0
