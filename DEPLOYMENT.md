# 🚀 Deployment Checklist

Use this checklist before deploying Pulse Web to production.

---

## ✅ Pre-Deployment Checklist

### 🔐 Security
- [ ] All environment variables set in production
- [ ] Supabase RLS policies enabled and tested
- [ ] API keys are not exposed in client code
- [ ] CORS settings configured correctly
- [ ] Rate limiting enabled on API routes
- [ ] File upload size limits enforced (5MB)
- [ ] Sensitive routes protected with auth middleware

### 🗄️ Database
- [ ] `setup-database.sql` executed in production database
- [ ] All tables created successfully
- [ ] Indexes created for performance
- [ ] RLS policies active
- [ ] Test queries working
- [ ] Backup strategy in place

### 💾 Storage
- [ ] `avatars` bucket created
- [ ] Bucket set to public
- [ ] Storage policies configured
- [ ] File upload tested
- [ ] Public URLs accessible
- [ ] Storage limits set

### 🔑 Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (server-side only)
- [ ] `OPENAI_API_KEY` set
- [ ] All variables verified working

### 🧪 Testing
- [ ] Sign up flow working
- [ ] Login flow working
- [ ] Password reset working
- [ ] Google OAuth working (if enabled)
- [ ] Voice recording working
- [ ] Transcription working
- [ ] Mood analysis working
- [ ] Journal save working
- [ ] Profile picture upload working
- [ ] Banner upload working
- [ ] Journal history loading
- [ ] All protected routes require auth

### 📱 Performance
- [ ] Images optimized
- [ ] Fonts loaded correctly
- [ ] Page load times acceptable
- [ ] Mobile responsive
- [ ] No console errors
- [ ] API responses fast
- [ ] Database queries optimized

### 🎨 UI/UX
- [ ] All pages render correctly
- [ ] Navigation works
- [ ] Buttons and links functional
- [ ] Forms validate properly
- [ ] Error messages display
- [ ] Loading states show
- [ ] Animations smooth
- [ ] Responsive on mobile/tablet/desktop

---

## 🌐 Deployment Steps

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all `.env.local` variables
   - Make sure to add them to Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live URL!

5. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records

### Option 2: Other Platforms

#### Netlify
```bash
npm run build
# Deploy dist folder
```

#### Railway
```bash
railway login
railway init
railway up
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Post-Deployment

### Verify Everything Works
- [ ] Visit production URL
- [ ] Test user signup
- [ ] Test login
- [ ] Record a voice journal
- [ ] Upload profile picture
- [ ] Check journal history
- [ ] Test on mobile device
- [ ] Check browser console for errors
- [ ] Verify database writes
- [ ] Check storage uploads

### Monitor
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Monitor API usage
- [ ] Check Supabase dashboard for activity
- [ ] Monitor OpenAI API usage/costs
- [ ] Set up uptime monitoring

### Analytics (Optional)
- [ ] Google Analytics
- [ ] Vercel Analytics
- [ ] Mixpanel/Amplitude
- [ ] User feedback tool

---

## 🆘 Troubleshooting

### Common Issues

**Build fails**
- Check Node.js version (18+)
- Run `npm install` again
- Clear `.next` folder
- Check for TypeScript errors

**Environment variables not working**
- Prefix client-side vars with `NEXT_PUBLIC_`
- Restart dev server after changes
- Check Vercel dashboard settings
- Verify no typos in variable names

**Database connection fails**
- Check Supabase URL is correct
- Verify API keys are valid
- Check RLS policies aren't too restrictive
- Ensure database tables exist

**Images not uploading**
- Verify `avatars` bucket exists
- Check bucket is public
- Verify file size limits
- Check storage policies

**Transcription fails**
- Verify OpenAI API key
- Check API quota/billing
- Test with smaller audio file
- Check network requests in console

---

## 📊 Performance Optimization

After deployment, consider:

- [ ] Enable Vercel Analytics
- [ ] Add Next.js Image optimization
- [ ] Implement caching strategy
- [ ] Add CDN for assets
- [ ] Optimize database queries
- [ ] Add database connection pooling
- [ ] Lazy load components
- [ ] Code splitting
- [ ] Compress images
- [ ] Minify CSS/JS

---

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor error logs weekly
- Check API usage/costs monthly
- Review user feedback
- Update dependencies quarterly
- Database backups weekly
- Test new features in staging first

### Updating
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run database migrations if needed
# Execute any new SQL scripts

# Deploy
git push origin main  # Auto-deploys on Vercel
```

---

## ✅ Deployment Complete!

Once all items are checked:

🎉 **Your Pulse app is live!**

Share the URL and start collecting user feedback.

---

## 📝 Notes

- Keep this checklist updated as you add features
- Document any custom deployment steps
- Share with your team
- Update after each major release

**Last updated:** [Date]
**Deployed by:** [Your Name]
**Production URL:** [Your URL]
