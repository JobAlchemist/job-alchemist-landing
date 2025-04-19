# Deploying to GitHub Pages

This document provides step-by-step instructions for deploying the JobAlchemist landing page to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your local machine (optional if using GitHub web interface)

## Method 1: Create a New Repository

### Step 1: Create a Repository on GitHub

1. Go to [GitHub](https://github.com/) and log in to your account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., `job-alchemist-landing`)
4. Add a description (optional)
5. Choose "Public" visibility
6. Click "Create repository"

### Step 2: Upload Files

#### Option A: Upload via GitHub Web Interface

1. In your new repository, click on "Add file" and then "Upload files"
2. Drag and drop all files and folders from the `github-pages-version` directory
3. Add a commit message (e.g., "Initial commit")
4. Click "Commit changes"

#### Option B: Upload via Git Command Line

1. Initialize a new Git repository in the `github-pages-version` directory:
   ```bash
   cd github-pages-version
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Add the remote repository and push your code:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/job-alchemist-landing.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. After a few minutes, your site will be published at `https://[your-username].github.io/[repo-name]/`

## Method 2: Use an Existing Repository

If you want to add this landing page to an existing repository:

### Step 1: Create a Subdirectory

1. In your existing repository, create a subdirectory (e.g., `landing-page` or `docs`)
2. Copy all files from the `github-pages-version` directory to this subdirectory

### Step 2: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "main" branch and the directory where you placed the files (e.g., `/docs`)
5. Click "Save"

## Customizing Your Domain

### Using a Custom Domain

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Custom domain", enter your domain name (e.g., `jobalchemist.yourdomain.com`)
5. Click "Save"
6. Configure your DNS settings with your domain provider:
   - For a subdomain (e.g., `jobalchemist.yourdomain.com`), create a CNAME record pointing to `[your-username].github.io`
   - For an apex domain (e.g., `yourdomain.com`), create A records pointing to GitHub Pages IP addresses

### Enforcing HTTPS

1. After setting up your custom domain, wait for the SSL certificate to be provisioned
2. Check the "Enforce HTTPS" box in the GitHub Pages settings

## Testing Your Deployment

- Make sure your site is accessible at the GitHub Pages URL
- Test all interactive elements like the navigation, accordion, and forms
- Verify that the site is responsive by testing on different device sizes

## Troubleshooting

- If your site is not publishing, check the GitHub Pages settings to ensure it's enabled
- If styles or scripts aren't loading, check that all paths in the HTML file are correct
- If custom domain isn't working, verify your DNS settings have propagated

## Making Updates

To update your deployed site:

1. Make your changes to the files
2. Commit and push the changes to the same repository and branch
3. GitHub Pages will automatically rebuild and deploy your site