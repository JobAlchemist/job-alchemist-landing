# JobAlchemist Landing Page - GitHub Pages Version

This is a static HTML/CSS/JavaScript version of the JobAlchemist landing page, designed to be easily hosted on GitHub Pages.

## Overview

This landing page is designed for the JobAlchemist AI Career Assistant waitlist. It includes all the same sections as the React version:

- Responsive navigation
- Hero section with email signup
- Introduction section
- Features section
- Testimonials
- Final CTA with additional FAQ information
- Expanded FAQ section with accordion
- Professional footer

## Features

- **Pure HTML/CSS/JavaScript**: No build tools or frameworks required
- **Mobile-Responsive**: Fully responsive design works on all device sizes
- **Optimized for GitHub Pages**: Ready to deploy directly to GitHub Pages
- **Interactive Elements**: Working mobile menu, smooth scrolling, and accordion
- **Form Validation**: Client-side email validation with error messages
- **Success States**: Simulated form submission with success messages
- **Modern Design**: Clean, professional aesthetic consistent with the React version

## Deployment to GitHub Pages

### Using this repository

1. Fork this repository to your GitHub account
2. Go to your repository settings
3. Scroll down to the GitHub Pages section
4. Select the main branch and the `/docs` folder as the source
5. Click Save
6. Your site will be published at `https://[your-username].github.io/job-alchemist/`

### Manually deploying to GitHub Pages

If you want to deploy this to your own GitHub Pages site:

1. Create a new repository on GitHub
2. Clone the repository to your local machine
3. Copy all files from this `github-pages-version` folder to your repository
4. Push your changes to GitHub
5. Go to the repository settings and enable GitHub Pages

## Local Development

To run this project locally:

1. Clone this repository
2. Open the `index.html` file in your browser

Alternatively, you can use a local server:

```bash
# Using Python
python -m http.server

# Using Node.js
npx serve
```

## Customization

### Colors and Styling

The main color scheme is defined in the `:root` section of `styles.css`. You can modify these variables to change the color scheme:

```css
:root {
  --primary: hsl(217, 91%, 60%);
  --primary-light: hsl(217, 91%, 70%);
  --primary-dark: hsl(217, 91%, 50%);
  --secondary: hsl(217, 91%, 45%);
  /* other variables */
}
```

### Content

All content is contained directly in the HTML file. You can edit the text, images, and structure by modifying `index.html`.

### Form Handling

This version simulates form submissions locally. To connect to a real backend:

1. Modify the form submission logic in `script.js`
2. Update the form action in `index.html` 

## Browser Support

This landing page works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is licensed under the MIT License.