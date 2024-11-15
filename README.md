# Multi-Tenant Application Starter

A production-ready starter template for building secure multi-tenant applications with React, featuring:

- 🔐 Role-based access control (Site Admin, Tenant Admin, User)
- 🏢 Multi-tenant architecture with data isolation
- 📊 Admin dashboard for tenant management
- 👥 User management within tenants
- 🎨 Beautiful UI with Tailwind CSS
- 🛠 Built with React, TypeScript, and Vite

## Features

- **Role-Based Access Control**
  - Site Admin: Manage tenants and tenant administrators
  - Tenant Admin: Manage users within their tenant
  - User: Access tenant-specific features

- **Security**
  - Complete tenant data isolation
  - Secure authentication
  - Protected routes

- **Modern Stack**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Lucide Icons

## Getting Started

1. Clone this template:
   ```bash
   git clone https://github.com/your-username/multi-tenant-starter.git
   cd multi-tenant-starter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Default credentials:
   - Site Admin:
     - Email: admin@gmail.com
     - Password: password

## Project Structure

```
src/
├── components/     # React components
├── lib/           # Database and utilities
├── services/      # Business logic
├── store/         # State management
└── types/         # TypeScript types
```

## License

MIT

## Support

If you find this template helpful, please consider giving it a star ⭐️