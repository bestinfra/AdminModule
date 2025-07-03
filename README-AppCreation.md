# App Creation System

This system allows you to create new React applications directly in the `generated-apps` folder with all necessary files and configurations.

## How It Works

1. **Frontend**: React application with a multi-step form for app configuration
2. **Backend**: Express server that handles app creation requests
3. **Generator**: Node.js script that creates the actual app files

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Environment

You have two options:

**Option A: Run both frontend and backend together**
```bash
npm run dev:full
```

**Option B: Run them separately**
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:5173 (or the port shown in terminal)
- Backend API: http://localhost:3001

## Creating a New App

1. Navigate to the App Management page in the frontend
2. Fill out the multi-step form:
   - **App Basics**: App name, subdomain, categories, etc.
   - **Admin Access**: Administrator account details
   - **Branding**: Company info, colors, logo
   - **Modules**: Select feature modules
   - **Complete**: Review and create

3. Click "Create App" to generate the application

## Generated App Structure

Each generated app will be created in the `generated-apps` folder with the following structure:

```
generated-apps/
└── your-app-name/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── README.md
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── App.css
        ├── index.css
        ├── components/
        │   ├── Header.tsx
        │   └── Sidebar.tsx
        └── pages/
            └── Dashboard.tsx
```

## Running a Generated App

After creating an app, you can run it:

```bash
cd generated-apps/your-app-name
npm install
npm run dev
```

The app will be available at http://localhost:3000 (or the next available port).

## API Endpoints

- `GET /api/health` - Check server health
- `POST /api/create-app` - Create a new app
- `GET /api/generated-apps` - List all generated apps

## Example: Creating "dhaya" App

1. Start the development environment
2. Go to App Management
3. Fill out the form:
   - App Name: "dhaya"
   - Subdomain: "dhaya"
   - Company: "Dhaya Company"
   - Admin: Your details
   - Modules: Select desired modules
4. Click "Create App"

The app will be created at `generated-apps/dhaya/` with all necessary files, similar to the existing "kiran" folder structure.

## Troubleshooting

### Server Not Running
If you get an error about the server not running:
```bash
npm run server
```

### Port Conflicts
If port 3001 is in use, change the PORT environment variable:
```bash
PORT=3002 npm run server
```

### File Permissions
Make sure the `generated-apps` folder has write permissions.

## Features

- ✅ Multi-step form validation
- ✅ Real-time app creation
- ✅ Generated apps listing
- ✅ Custom branding and modules
- ✅ Complete React + TypeScript setup
- ✅ Tailwind CSS configuration
- ✅ Vite build system
- ✅ ESLint configuration 