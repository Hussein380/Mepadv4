# Setting Up Email for Meeting Invitations

This guide explains how to set up email for sending meeting invitations to participants.

## Option 1: Using Mailtrap for Testing (Recommended for Development)

[Mailtrap](https://mailtrap.io/) is a testing tool that lets you test email sending without actually delivering emails to real recipients. This is perfect for development and testing.

### Step 1: Create a Mailtrap Account

1. Go to [Mailtrap.io](https://mailtrap.io/) and sign up for a free account
2. Create a new inbox or use the default one

### Step 2: Get SMTP Credentials

1. In your inbox, click on "SMTP Settings"
2. Select "Nodemailer" from the integrations dropdown
3. You'll see something like:
   ```
   const transport = nodemailer.createTransport({
     host: "sandbox.smtp.mailtrap.io",
     port: 2525,
     auth: {
       user: "your-username",
       pass: "your-password"
     }
   });
   ```

### Step 3: Update Your .env File

1. Open your Backend `.env` file
2. Update the email configuration with your Mailtrap credentials:
   ```
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_EMAIL=your-username
   SMTP_PASSWORD=your-password
   FROM_NAME=MePad
   FROM_EMAIL=noreply@mepad.com
   ```

### Step 4: Test Sending Invitations

1. Restart your backend server
2. Send an invitation to a participant
3. Check your Mailtrap inbox to see the email

## Option 2: Using a Real Email Service (For Production)

For production, you'll want to use a real email service like SendGrid, Mailgun, or even Gmail.

### Using Gmail (Example)

1. Update your `.env` file:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your-gmail@gmail.com
   SMTP_PASSWORD=your-app-password
   FROM_NAME=MePad
   FROM_EMAIL=your-gmail@gmail.com
   ```

2. For Gmail, you'll need to:
   - Enable 2-Step Verification on your Google account
   - Generate an "App Password" (not your regular password)
   - Use this App Password in your .env file

## Troubleshooting

- If emails aren't being sent, check your console for error messages
- Verify your SMTP credentials are correct
- Make sure your email service isn't blocking the connection
- For Gmail, ensure you're using an App Password, not your regular password
