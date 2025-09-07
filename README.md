# TaskManager 📝

A modern, secure task management application built with Next.js, Firebase, and Tailwind CSS. Features Google authentication, real-time database operations, and a beautiful responsive UI.

## ✨ Features

- 🔐 **Google Authentication** - Secure sign-in with Google accounts
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Instant task synchronization
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS
- 🔒 **Secure Operations** - Server-side authentication verification
- 📊 **Task Organization** - Organize tasks by status (To Do, In Progress, Completed)
- 👤 **User Isolation** - Each user sees only their own tasks
- 🌙 **Dark/Light Mode Ready** - Extensible theme system

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js Server Actions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google provider)
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Google account for Firebase setup
- Windows Security access (for performance optimization)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd TaskManager
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Enable required services:

#### Enable Authentication
1. Go to **Authentication** > **Get started**
2. Go to **Sign-in method** tab
3. Enable **Google** provider
4. Configure with your project details

#### Enable Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode**
4. Select location (asia-southeast1 recommended)

#### Get Service Account Key
1. Go to **Project Settings** > **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file

### 3. Environment Configuration

Create `.env.local` file in the root directory:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin Configuration
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
```

### 4. Performance Optimization (Windows)

To improve compilation speed:

1. Open **Windows Security** > **Virus & threat protection**
2. Click **Manage settings**
3. Scroll to **Exclusions** > **Add or remove exclusions**
4. Add your project folder: `D:\CODE\TaskManager`

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

## 📁 Project Structure

```
TaskManager/
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server actions for CRUD operations
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Main dashboard page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── header.tsx          # App header with auth
│   │   ├── task-card.tsx       # Individual task component
│   │   ├── task-form-dialog.tsx # Task creation/editing form
│   │   └── share-dialog.tsx    # Task sharing functionality
│   ├── hooks/
│   │   ├── use-auth.tsx        # Authentication hook
│   │   └── use-toast.ts        # Toast notifications
│   ├── lib/
│   │   ├── firebase.ts         # Client Firebase config
│   │   ├── firebase-admin.ts   # Server Firebase config
│   │   ├── types.ts            # TypeScript type definitions
│   │   └── utils.ts            # Utility functions
│   └── ai/                     # AI-powered features
├── public/                     # Static assets
├── .env.local                  # Environment variables (gitignored)
└── package.json
```

## 🎯 Usage

### Authentication
1. Click **"Sign In with Google"** button
2. Complete Google authentication flow
3. Access your personal task dashboard

### Managing Tasks
- **Create**: Click the "+" button or use the task form
- **Edit**: Click the edit icon on any task card
- **Delete**: Click the delete icon and confirm
- **Status**: Drag or click to change task status
- **Due Dates**: Set deadlines for tasks

### Task Statuses
- **To Do**: New tasks awaiting action
- **In Progress**: Currently working on
- **Completed**: Finished tasks

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## 🔒 Security Features

- **Server-side Authentication**: All operations verified with Firebase Admin SDK
- **User Isolation**: Database queries filtered by authenticated user ID
- **Secure Tokens**: ID tokens validated on every request
- **Environment Variables**: Sensitive data stored securely

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Slow compilation on Windows:**
- Add project folder to Windows Security exclusions
- Close resource-intensive applications

**Firebase permission errors:**
- Ensure Firestore Database is enabled
- Check Authentication is configured
- Verify environment variables are correct

**Authentication not working:**
- Confirm Google provider is enabled in Firebase
- Check client configuration in `.env.local`
- Verify service account credentials

**Database connection issues:**
- Ensure Firestore is in test mode initially
- Check network connectivity
- Verify project ID matches Firebase project

## 📞 Support

For support, please:
1. Check the troubleshooting section above
2. Review Firebase console for error logs
3. Ensure all environment variables are set correctly

---

Built with ❤️ using Next.js, Firebase, and modern web technologies.
![alt text](<ScreenShots/Screenshot 2025-09-07 215018.png>)

![alt text](<ScreenShots/Screenshot 2025-09-07 224412.png>)