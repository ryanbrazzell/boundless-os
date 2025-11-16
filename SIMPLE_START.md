# 🚀 Simple Start Guide

## The servers aren't running yet - here's how to start them:

### Method 1: Double-Click the Script (Easiest!)

1. In Finder, navigate to: `/Users/ryanbrazzell/Latest Client Success AI/boundless-os-1`
2. Find the file called `START_APP.sh`
3. Double-click it
4. A Terminal window will open and start the servers
5. **Keep that Terminal window open!**
6. Wait about 10 seconds, then open your browser to: **http://localhost:5174**

### Method 2: Use Terminal

1. Open **Terminal** (Applications > Utilities > Terminal)
2. Copy and paste this entire command, then press Enter:

```bash
cd "/Users/ryanbrazzell/Latest Client Success AI/boundless-os-1" && npm run dev
```

3. You'll see messages like:
   ```
   [web] VITE ready
   [worker] Workers dev server listening
   ```

4. **Keep this Terminal window open!**
5. Wait 10 seconds, then open your browser to: **http://localhost:5174**

## What You Should See

Once the servers are running, when you go to **http://localhost:5174**, you should see:
- A login page with "Sign In" at the top
- Email and Password fields
- A "Sign In" button

## If You Still See "Nothing"

1. **Check the Terminal** - Do you see any error messages in red?
2. **Wait longer** - Sometimes it takes 20-30 seconds to start
3. **Try refreshing** - Press Cmd+R in your browser
4. **Check the URL** - Make sure it's exactly: `http://localhost:5174`

## Create Your First User

Before you can log in, create a user account:

1. Open a **NEW Terminal window** (keep the first one running!)
2. Copy and paste this command:

```bash
curl -X POST http://localhost:8788/api/users -H "Content-Type: application/json" -d '{"email":"admin@test.com","password":"password123","name":"Admin","role":"SUPER_ADMIN"}'
```

3. Press Enter
4. You should see a success message
5. Now go back to http://localhost:5174 and log in with:
   - Email: `admin@test.com`
   - Password: `password123`

## Need Help?

If you see any error messages, copy them and let me know!

