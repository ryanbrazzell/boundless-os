# 🚀 How to Start the Application (Simple Guide)

## Step 1: Open Terminal

1. Open **Terminal** on your Mac (you can find it in Applications > Utilities)
2. Navigate to the project folder by typing:
   ```bash
   cd "/Users/ryanbrazzell/Latest Client Success AI/boundless-os-1"
   ```
   (Press Enter after typing)

## Step 2: Start the Application

Type this command and press Enter:
```bash
npm run dev
```

You should see output like:
```
[web] VITE v7.x.x  ready in xxx ms
[worker] ⚡️ Workers dev server listening on http://localhost:8788
```

**Important:** Keep this terminal window open! Don't close it while using the application.

## Step 3: Open Your Browser

Once you see the messages above, open your web browser (Chrome, Safari, or Firefox) and go to:

**http://localhost:5174**

You should see the login page!

## Step 4: Create Your First User

Before you can log in, you need to create a user account. 

### Option A: Using Terminal (Easier)

In a **new terminal window**, type:
```bash
curl -X POST http://localhost:8788/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123","name":"Admin User","role":"SUPER_ADMIN"}'
```

Press Enter. You should see a success message.

### Option B: Using the Browser

1. Try to access: http://localhost:5174/admin/users
2. If you see a login page, you'll need to use Option A first

## Step 5: Log In

1. Go to http://localhost:5174
2. Enter your email: `admin@test.com`
3. Enter your password: `password123`
4. Click "Sign In"

## Troubleshooting

### "Nothing loads" or "Can't connect"
- Make sure Step 2 is running (the terminal should show server messages)
- Wait 10-20 seconds after running `npm run dev` before opening the browser
- Try refreshing the page (Cmd+R)

### "Port already in use"
- Close any other applications that might be using ports 5174 or 8788
- Or let me know and I can change the ports again

### "npm: command not found"
- You need to install Node.js first
- Go to https://nodejs.org and download the LTS version
- Install it, then restart Terminal

### Still having issues?
Let me know what error message you see and I'll help!

