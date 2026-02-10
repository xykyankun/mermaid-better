/**
 * System template seeds for Mermaid Better
 * These templates will be inserted into the database as system templates
 */

export const systemTemplates = [
  // Flowchart Templates
  {
    title: 'Simple Flowchart',
    type: 'flowchart',
    category: 'basic',
    description: 'A basic flowchart template with common decision points',
    content: `flowchart TD
    Start([Start]) --> Input[/Input Data/]
    Input --> Process[Process Data]
    Process --> Decision{Is Valid?}
    Decision -->|Yes| Success[Success]
    Decision -->|No| Error[Error]
    Success --> End([End])
    Error --> End`,
    isSystem: true,
  },
  {
    title: 'Complex Process Flow',
    type: 'flowchart',
    category: 'advanced',
    description: 'A detailed process flow with multiple decision points and loops',
    content: `flowchart TD
    Start([Start]) --> Init[Initialize System]
    Init --> LoadConfig[Load Configuration]
    LoadConfig --> ValidateConfig{Config Valid?}
    ValidateConfig -->|No| ConfigError[Configuration Error]
    ValidateConfig -->|Yes| ConnectDB[Connect to Database]
    ConnectDB --> DBCheck{Connection OK?}
    DBCheck -->|No| Retry{Retry < 3?}
    Retry -->|Yes| ConnectDB
    Retry -->|No| DBError[Database Error]
    DBCheck -->|Yes| ProcessData[Process Data]
    ProcessData --> SaveData[Save Results]
    SaveData --> Cleanup[Cleanup Resources]
    Cleanup --> End([End])
    ConfigError --> End
    DBError --> End`,
    isSystem: true,
  },

  // Sequence Diagram Templates
  {
    title: 'User Login Flow',
    type: 'sequence',
    category: 'basic',
    description: 'A typical user authentication sequence diagram',
    content: `sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /login
    Backend->>Database: Verify credentials
    Database-->>Backend: User data
    Backend-->>Frontend: JWT token
    Frontend-->>User: Show dashboard`,
    isSystem: true,
  },
  {
    title: 'API Request Flow',
    type: 'sequence',
    category: 'technical',
    description: 'Complete API request lifecycle with authentication',
    content: `sequenceDiagram
    participant Client
    participant API Gateway
    participant Auth Service
    participant Backend API
    participant Database
    participant Cache

    Client->>API Gateway: HTTP Request + Token
    API Gateway->>Auth Service: Validate Token
    Auth Service-->>API Gateway: Token Valid
    API Gateway->>Backend API: Forward Request
    Backend API->>Cache: Check Cache
    alt Cache Hit
        Cache-->>Backend API: Cached Data
    else Cache Miss
        Backend API->>Database: Query Data
        Database-->>Backend API: Data
        Backend API->>Cache: Update Cache
    end
    Backend API-->>API Gateway: Response
    API Gateway-->>Client: HTTP Response`,
    isSystem: true,
  },

  // Class Diagram Templates
  {
    title: 'Basic Class Structure',
    type: 'class',
    category: 'basic',
    description: 'Simple class diagram showing inheritance and composition',
    content: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
        +move()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }

    Animal <|-- Dog
    Animal <|-- Cat`,
    isSystem: true,
  },
  {
    title: 'E-commerce System',
    type: 'class',
    category: 'business',
    description: 'Class diagram for a typical e-commerce application',
    content: `classDiagram
    class User {
        +String email
        +String name
        +login()
        +logout()
    }
    class Product {
        +String name
        +float price
        +int stock
        +updateStock()
    }
    class Order {
        +String orderId
        +Date orderDate
        +float total
        +calculateTotal()
    }
    class OrderItem {
        +int quantity
        +float price
    }
    class Payment {
        +String paymentId
        +String method
        +processPayment()
    }

    User "1" --> "*" Order
    Order "1" --> "*" OrderItem
    OrderItem "*" --> "1" Product
    Order "1" --> "1" Payment`,
    isSystem: true,
  },

  // ER Diagram Templates
  {
    title: 'Blog Database Schema',
    type: 'er',
    category: 'basic',
    description: 'Entity-relationship diagram for a blog system',
    content: `erDiagram
    USER ||--o{ POST : writes
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : has
    POST }o--o{ TAG : tagged_with

    USER {
        int id PK
        string email
        string name
        datetime created_at
    }
    POST {
        int id PK
        int user_id FK
        string title
        text content
        datetime published_at
    }
    COMMENT {
        int id PK
        int user_id FK
        int post_id FK
        text content
        datetime created_at
    }
    TAG {
        int id PK
        string name
    }`,
    isSystem: true,
  },

  // Gantt Chart Templates
  {
    title: 'Project Timeline',
    type: 'gantt',
    category: 'business',
    description: 'Project management Gantt chart template',
    content: `gantt
    title Project Development Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements Gathering   :a1, 2024-01-01, 14d
    Design Phase             :a2, after a1, 21d
    section Development
    Frontend Development     :b1, after a2, 30d
    Backend Development      :b2, after a2, 30d
    Integration              :b3, after b1, 14d
    section Testing
    Unit Testing             :c1, after b2, 7d
    Integration Testing      :c2, after b3, 7d
    User Acceptance Testing  :c3, after c2, 7d
    section Deployment
    Production Deployment    :d1, after c3, 3d`,
    isSystem: true,
  },

  // Git Graph Templates
  {
    title: 'Git Workflow',
    type: 'git',
    category: 'technical',
    description: 'Common Git branching and merging workflow',
    content: `gitGraph
    commit id: "Initial commit"
    branch develop
    checkout develop
    commit id: "Add authentication"
    branch feature/user-profile
    checkout feature/user-profile
    commit id: "Create profile page"
    commit id: "Add profile edit"
    checkout develop
    merge feature/user-profile
    checkout main
    merge develop tag: "v1.0.0"`,
    isSystem: true,
  },

  // Pie Chart Templates
  {
    title: 'Market Share',
    type: 'pie',
    category: 'business',
    description: 'Simple pie chart for displaying proportions',
    content: `pie title Market Share Analysis
    "Product A" : 35
    "Product B" : 28
    "Product C" : 22
    "Product D" : 15`,
    isSystem: true,
  },

  // User Journey Templates
  {
    title: 'Customer Journey',
    type: 'journey',
    category: 'business',
    description: 'User journey map showing experience touchpoints',
    content: `journey
    title Customer Purchase Journey
    section Discovery
      Search for product: 5: Customer
      View product page: 4: Customer
      Read reviews: 3: Customer
    section Consideration
      Compare prices: 4: Customer
      Check availability: 5: Customer
      Add to cart: 5: Customer
    section Purchase
      Enter payment info: 3: Customer
      Apply discount code: 5: Customer
      Complete order: 4: Customer
    section Post-Purchase
      Receive confirmation: 5: Customer
      Track shipment: 4: Customer
      Receive product: 5: Customer`,
    isSystem: true,
  },

  // State Diagram Templates
  {
    title: 'Order State Machine',
    type: 'state',
    category: 'technical',
    description: 'State diagram for order processing workflow',
    content: `stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: Submit
    Pending --> Processing: Approve
    Pending --> Cancelled: Cancel
    Processing --> Shipped: Ship
    Processing --> Cancelled: Cancel
    Shipped --> Delivered: Deliver
    Delivered --> [*]
    Cancelled --> [*]`,
    isSystem: true,
  },
];

export type SystemTemplate = typeof systemTemplates[0];
