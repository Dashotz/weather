# Deployment Guide

## 🚀 Making Your App Live on GitHub

Your weather app is already connected to GitHub at: `https://github.com/Dashotz/weather`

## Step 1: Push Your Code to GitHub

1. **Add all changes:**
   ```bash
   git add .
   ```

2. **Commit the changes:**
   ```bash
   git commit -m "Add GitHub Pages deployment configuration"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin main
   ```

## Step 2: Enable GitHub Pages

After pushing, follow these steps to enable GitHub Pages:

1. Go to your repository: https://github.com/Dashotz/weather
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Source**: `GitHub Actions`
5. Save the settings

## Step 3: Wait for Deployment

- GitHub Actions will automatically build and deploy your app
- You can watch the progress in the **Actions** tab
- Deployment usually takes 2-3 minutes

## Step 4: Access Your Live App

Once deployed, your app will be live at:
**https://dashotz.github.io/weather/**

## 🔄 Automatic Updates

Every time you push changes to the `main` branch, GitHub Actions will automatically rebuild and redeploy your app!

## 📝 Alternative: Manual Deployment

If you prefer to deploy manually:

1. Build the app:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` folder

3. You can then deploy the `dist` folder to any hosting service:
   - **Vercel**: Drag and drop the `dist` folder
   - **Netlify**: Drag and drop the `dist` folder
   - **GitHub Pages**: Use the gh-pages branch method

## ✅ Troubleshooting

- If the app doesn't load, check the Actions tab for errors
- Make sure the base path in `vite.config.js` matches your repository name
- Clear your browser cache if you see old versions

