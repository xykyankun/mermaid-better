# Mermaid Better

> 🎨 The easiest way to create, manage, and share Mermaid diagrams

A full-featured web application for creating and managing Mermaid diagrams with real-time preview, cloud storage, and powerful export options.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-green)](https://neon.tech/)
[![Mermaid](https://img.shields.io/badge/Mermaid-11-ff3670)](https://mermaid.js.org/)

## ✨ Features

### 🎯 Current Features (Phase 1 - MVP)

- ✅ **Real-time Mermaid Editor** with Monaco Editor integration
- ✅ **Live Preview** - See your diagrams update as you type
- ✅ **Cloud Storage** - Save diagrams securely with Neon PostgreSQL
- ✅ **Export** - Download as PNG, SVG, or copy code
- ✅ **User Authentication** - Secure login with Neon Auth
- ✅ **Diagram Management** - Create, edit, delete, and organize diagrams
- ✅ **All Diagram Types** - Flowcharts, sequence, class, ER, Gantt, and more
- ✅ **Responsive Design** - Works on desktop and mobile

### 🎨 Supported Diagram Types

- Flowcharts
- Sequence Diagrams
- Class Diagrams
- ER Diagrams
- Gantt Charts
- Pie Charts
- User Journey Maps
- Mind Maps
- Git Graphs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Neon Database account ([Get one free](https://neon.tech))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mermaid-better
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your Neon credentials:
   ```bash
   cp .env.example .env
   ```

   Get your Neon credentials from the [Neon Console](https://console.neon.tech):
   ```env
   NEXT_PUBLIC_NEON_AUTH_URL=https://your-project.neonauth.region.aws.neon.tech/database/auth
   NEXT_PUBLIC_NEON_DATA_API_URL=https://your-project.apirest.region.aws.neon.tech/database/rest/v1
   DATABASE_URL=postgresql://user:password@your-project-pooler.region.aws.neon.tech/database?sslmode=require
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating Your First Diagram

1. **Sign up** for an account on the homepage
2. Click **"New Diagram"** in your dashboard
3. **Write Mermaid code** in the left editor panel
4. **See live preview** in the right panel
5. **Save** your diagram with a title

### Example Mermaid Code

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
```

### Exporting Diagrams

From the editor, you can:
- **Export as PNG** - Perfect for documentation
- **Export as SVG** - Scalable vector graphics
- **Copy Code** - Use in your markdown files

## 🏗️ Project Structure

```
mermaid-better/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── editor/            # Editor page
│   │   ├── dashboard/         # User diagrams list
│   │   ├── login/             # Auth pages
│   │   └── api/diagrams/      # REST API
│   ├── components/
│   │   ├── mermaid-editor.tsx # Main editor component
│   │   └── ui/                # Reusable UI components
│   └── lib/
│       └── neon/              # Database client & schema
├── drizzle/                   # Database migrations
└── public/                    # Static assets
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.5 |
| **Database** | Neon PostgreSQL |
| **ORM** | Drizzle ORM |
| **Auth** | Neon Auth (Better Auth) |
| **Editor** | Monaco Editor |
| **Diagrams** | Mermaid.js |
| **Styling** | Tailwind CSS |
| **Deployment** | Cloudflare Workers (OpenNext) |

## 📚 API Reference

### Diagrams API

#### `GET /api/diagrams`
Get all diagrams for the authenticated user

#### `POST /api/diagrams`
Create a new diagram
```json
{
  "title": "My Flowchart",
  "content": "graph TD\nA-->B",
  "type": "flowchart",
  "description": "Optional description"
}
```

#### `GET /api/diagrams/:id`
Get a specific diagram by ID

#### `PATCH /api/diagrams/:id`
Update a diagram
```json
{
  "title": "Updated Title",
  "content": "graph TD\nA-->B-->C"
}
```

#### `DELETE /api/diagrams/:id`
Delete a diagram

## 🗺️ Roadmap

### Phase 2 - Enhanced Experience (In Planning)
- [ ] Code auto-completion
- [ ] Keyboard shortcuts
- [ ] Multi-tab editing
- [ ] Code snippets library
- [ ] Template marketplace
- [ ] Folders and tags
- [ ] Search and filtering

### Phase 3 - AI Features
- [ ] AI diagram generation from text
- [ ] Smart layout optimization
- [ ] Code-to-diagram conversion

### Phase 4 - Collaboration
- [ ] Real-time collaboration
- [ ] Diagram sharing
- [ ] Comments and feedback
- [ ] Team workspaces

### Phase 5 - Enterprise
- [ ] API access
- [ ] Integrations (GitHub, Notion, Confluence)
- [ ] Custom themes
- [ ] SSO support

See [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md) for detailed feature list.

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Database
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run db:push      # Push schema directly
npm run db:studio    # Open Drizzle Studio

# Cloudflare Workers
npm run build:worker   # Build for Cloudflare
npm run deploy:worker  # Deploy to Cloudflare
```

### Database Schema

```typescript
// diagrams table
{
  id: uuid (primary key)
  userId: text (foreign key)
  title: varchar(255)
  content: text (Mermaid code)
  type: varchar(50) (flowchart, sequence, etc.)
  description: text (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) - Powerful diagramming library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code's editor
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Next.js](https://nextjs.org/) - The React Framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Mermaid.js, and Neon**
