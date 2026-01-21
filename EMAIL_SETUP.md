# Email Production Setup Guide (Resend)

To send emails to **every user** (not just your own test email), you must verify a custom domain in your Resend dashboard.

## Why is this required?
Resend (and most email services) prevents "spoofing" and spam by only allowing you to send from a domain you own. By default, with an unverified account, you are in **Onboarding Mode**, which only allows sending to the email used to create the account.

---

## Step 1: Verify Your Domain in Resend

1. **Log in to Resend**: Go to [https://resend.com/domains](https://resend.com/domains).
2. **Add Domain**: Click **Add Domain** and enter your domain (e.g., `scriptgo.app` or `yourdomain.com`).
3. **Configure DNS**:
   - Resend will provide 3-4 DNS records (MX, SPF, DKIM).
   - Go to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains).
   - Add these records to your DNS settings.
4. **Wait for Verification**: Once you add them, click **Verify** in Resend. It usually takes 5-30 minutes to propagate.

---

## Step 2: Update Your "From" Email in the Code

Once your domain is verified (e.g., `scriptgo.app`), you need to update the `from` address in the following file:

### File: `app/actions/email.ts`

Change the `from` address from `onboarding@resend.dev` to your verified email:

```typescript
// Example for sendWelcomeEmail
const { data, error } = await resend.emails.send({
    from: 'Script GO <hello@scriptgo.app>', // Use your verified domain here!
    to: [email],
    subject: 'Welcome to ScriptGo!',
    react: WelcomeEmail({ name }),
})
```

**Files to update:**
1. `app/actions/email.ts` (Update `sendWelcomeEmail`, `sendScriptReadyEmail`, and `sendPasswordResetEmail`)

---

## Step 3: Deployment

1. **GitHub Push**:
   ```bash
   git add .
   git commit -m "Update from email to verified domain"
   git push origin main
   ```
2. **Vercel**: Vercel will auto-deploy.

---

## Troubleshooting

### Emails still not sending?
1. **Check Resend Logs**: Go to [https://resend.com/emails](https://resend.com/emails) to see if emails are "Sent", "Delivered", or "Bounced".
2. **Check Recipient Inbox**: Check the Spam folder.
3. **Check API Key**: Ensure `RESEND_API_KEY` in Vercel matches your production key.

---

## Summary
You have the code ready; you just need to "unlock" the Resend service by proving you own the domain! 🚀
