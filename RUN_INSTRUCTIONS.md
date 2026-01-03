# 🚀 How to Run the PM Internship AI Application with Chatbot

This guide will help you set up and run the application with the new Gemini-powered chatbot.

## 📋 Prerequisites

Before you start, make sure you have installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** (Free tier works) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)
- **Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)

---

## ⚙️ Step 1: Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` folder with the following variables:

```bash
cd backend
nano .env
```

Add these variables:
```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret (generate any random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional, defaults to 8080)
PORT=8080
```

**Replace the values:**
- `MONGO_URI`: Get this from MongoDB Atlas → Connect → Connect your application
- `JWT_SECRET`: Generate any random string (e.g., `openssl rand -base64 32`)
- `GEMINI_API_KEY`: Get from Google AI Studio

---

## 🔧 Step 2: Install Dependencies

### Backend Dependencies

```bash
cd backend
npm install
```

### Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 🗄️ Step 3: Set Up MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Add it to your `.env` file

---

## 🚀 Step 4: Run the Application

### Terminal 1 - Start Backend Server

```bash
cd backend
npm start

# Or for development with auto-reload:
npm run dev
```

You should see:
```
✅ Gemini API Key Loaded: AIza...
✅ MongoDB connected successfully!
✅ Server running on http://localhost:8080
```

### Terminal 2 - Start Frontend Server

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## 🎉 Step 5: Access the Application

1. Open your browser and go to: **http://localhost:5173**
2. You should see the chatbot icon in the bottom-right corner
3. Click on it to open the chat interface

---

## 🤖 Using the Chatbot

### Features:
- **Quick Reply Buttons**: Click on any suggestion to start chatting
- **Type Your Own**: Type any question about internships or career advice
- **Personalized**: The bot uses your profile info if you're logged in
- **Minimize/Maximize**: Click the minimize button to reduce the chat window
- **Clear Chat**: Click "Clear Chat" to start a new conversation

### Example Questions:
- "Find internships matching my skills"
- "Help me prepare for interviews"
- "What skills should I learn?"
- "How do I apply for internships?"
- "Tell me about career opportunities in software development"

---

## 🧪 Testing the Setup

### Test Backend Health:
```bash
curl http://localhost:8080/
```

Should return: `✅ Backend server is running!`

### Test Frontend:
1. Navigate to http://localhost:5173
2. Look for the blue chat button in the bottom-right
3. Click it and try a quick reply button

### Test Authentication:
1. Go to http://localhost:5173/register
2. Create a test account
3. Login at http://localhost:5173/login
4. The chatbot will now use your profile information

---

## 🐛 Troubleshooting

### Backend Issues:

**Error: "MongoDB connection error"**
- Check your MONGO_URI in `.env`
- Make sure you whitelisted your IP in MongoDB Atlas
- Verify your database user has proper permissions

**Error: "Gemini API Key Loaded: undefined"**
- Make sure GEMINI_API_KEY is set in `.env`
- Restart the backend server after adding it

**Port 8080 already in use:**
- Change PORT in `.env` to another number (e.g., 3001)
- Or kill the process using port 8080

### Frontend Issues:

**Error connecting to backend:**
- Make sure backend is running on port 8080
- Check `frontend/src/components/Chatbot.jsx` line 52 for the API URL
- Ensure CORS is enabled in the backend (it is by default)

**Module not found:**
- Run `npm install` in the frontend folder
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

## 📁 Project Structure

```
pm-internship-ai-main/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   ├── gemini-integration.js    # AI recommendations
│   │   └── gemini-pdf.js           # Resume parsing
│   ├── routes/
│   │   └── geminiChat.js           # ✨ NEW: Chatbot API
│   ├── server.js                    # Backend entry point
│   └── .env                         # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Chatbot.jsx          # ✨ NEW: Chat UI
│   │   ├── App.jsx                  # Main app with routes
│   │   └── index.css                # Custom scrollbar styles
│   └── package.json
│
└── RUN_INSTRUCTIONS.md              # This file
```

---

## 🎯 Quick Start Summary

```bash
# 1. Set up environment
cd backend
echo "MONGO_URI=your_mongo_uri" > .env
echo "JWT_SECRET=your_secret" >> .env
echo "GEMINI_API_KEY=your_key" >> .env

# 2. Install and run backend
cd backend
npm install
npm start

# 3. Install and run frontend (new terminal)
cd frontend
npm install
npm run dev

# 4. Open browser
# Go to http://localhost:5173
```

---

## ✨ What's New?

- **Floating Chatbot Widget** - Always accessible, minimizes to header
- **Quick Reply Buttons** - Start conversations instantly
- **Message History** - Maintains conversation context
- **Personalized Responses** - Uses your profile when logged in
- **Modern UI** - Tailwind CSS styling with smooth animations
- **Auto-scroll** - Automatically scrolls to latest messages
- **Loading Indicators** - Shows typing animations

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at the browser console for frontend errors
3. Check the backend terminal for server errors
4. Verify all environment variables are set correctly

Happy coding! 🚀

