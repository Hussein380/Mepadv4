# Setting Up Public URLs for Invitation Links

To make your invitation links accessible from outside your local network, you need to set up a public URL. This guide explains how to use ngrok to create a temporary public URL that forwards to your local development server.

## Using ngrok for Public URLs

### Step 1: Install ngrok

1. Download ngrok from [https://ngrok.com/download](https://ngrok.com/download)
2. Extract the downloaded file
3. Sign up for a free account and get your authtoken
4. Connect your account by running: `ngrok config add-authtoken YOUR_AUTH_TOKEN`

### Step 2: Start your application

1. Make sure your frontend and backend servers are running:
   ```
   # Start backend (in one terminal)
   cd Backend
   npm run dev
   
   # Start frontend (in another terminal)
   cd frontend
   npm run dev
   ```

### Step 3: Start ngrok to expose your frontend

1. Open a new terminal
2. Run ngrok pointing to your frontend port (default is 5173):
   ```
   ngrok http 5173
   ```
3. You'll see output like this:
   ```
   Session Status                online
   Account                       Your Account
   Version                       3.x.x
   Region                        United States (us)
   Forwarding                    https://a1b2c3d4.ngrok.io -> http://localhost:5173
   ```

### Step 4: Update your environment variables

1. Open your Backend `.env` file
2. Add or update the PUBLIC_URL variable with your ngrok URL:
   ```
   PUBLIC_URL=https://a1b2c3d4.ngrok.io
   ```
3. Restart your backend server

### Step 5: Test your invitation links

1. Generate new invitation links
2. The links will now use the ngrok URL and will be accessible from any device with internet access
3. You can also share the QR codes for easy access

## Important Notes

- The free version of ngrok will assign a new URL each time you restart it
- The URL is temporary and will expire after a few hours
- For a permanent solution, consider deploying your application to a hosting service

## Troubleshooting

- If links don't work, make sure both your frontend and backend servers are running
- Check that the PUBLIC_URL in your .env file matches the ngrok URL exactly
- Ensure your backend can access the internet to communicate with the ngrok service
