# Cyber Samurai Software Solutions - Portfolio Website

A clean, professional, responsive portfolio website built with HTML5, CSS3, Bootstrap 5, and jQuery.

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
   - Simply double-click the file, or
   - Use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
3. Navigate to `http://localhost:8000` in your browser

## 📁 Project Structure

```
/
├── index.html              # Home/Landing page
├── about.html              # About page
├── projects.html           # Projects listing
├── project-detail.html     # Single project details
├── resume.html             # Resume/CV page
├── contact.html            # Contact page with form
├── blog.html               # Blog listing
├── services.html           # Services page
├── certifications.html     # Certifications page
├── testimonials.html       # Testimonials page
├── team.html               # Team members page
├── admin/                  # Admin panel (front-end only)
│   ├── login.html         # Admin login page
│   ├── index.html         # Admin dashboard
│   ├── projects.html      # Manage projects
│   ├── blog.html          # Manage blog posts
│   ├── testimonials.html  # Manage testimonials
│   ├── services.html      # Manage services
│   └── certifications.html # Manage certifications
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   └── main.js         # jQuery interactions
│   ├── images/             # Image assets
│   └── pdfs/               # PDF files (resume.pdf)
└── README.md               # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with dark theme
- **Bootstrap 5.3.3** - Responsive grid and components (CDN)
- **jQuery 3.7.1** - All interactive features (CDN)
- **Font Awesome 6.5.0** - Icons (CDN)
- **Google Fonts (Inter)** - Typography (CDN)

## 📋 CDN Links Used

All external resources are loaded via CDN:

- **Bootstrap CSS & JS**: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/`
- **jQuery**: `https://code.jquery.com/jquery-3.7.1.min.js`
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css`
- **Google Fonts**: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap`

## 🎨 Design Features

- **Dark Theme**: Black (#000000) background with gray accents
- **Responsive**: Mobile-first design using Bootstrap grid
- **Smooth Animations**: jQuery-powered transitions and effects
- **Accessibility**: Semantic HTML, alt text, proper headings
- **Performance**: Lazy loading images, optimized assets

## ✨ Key Features

### Interactive Elements (jQuery):
- Smooth scroll to anchor links
- Back to top button
- Project filtering by category
- Contact form validation
- Blog search and category filtering
- Timeline expand/collapse
- Gallery lightbox with navigation
- Certificate modal viewer
- Testimonials carousel
- Load more projects pagination

### Pages:
1. **Home** - Hero section, stats, featured projects, services summary
2. **About** - Mission, values, tech stack, experience timeline
3. **Projects** - Filterable project grid with categories
4. **Project Detail** - Detailed project information with gallery
5. **Resume** - Professional resume/CV with download link
6. **Contact** - Contact form with jQuery validation
7. **Blog** - Blog posts with search and category filters
8. **Services** - Detailed service descriptions
9. **Certifications** - Certification cards with modal viewer
10. **Testimonials** - Client testimonials carousel
11. **Team** - Team members grid with hover effects and bio modals

### Admin Panel (Front-End Only):
1. **Login** - Secure admin login page with validation and success animation
2. **Dashboard** - Stats cards and recent activity
3. **Projects** - Add/edit/delete projects with image previews
4. **Blog Posts** - Manage blog posts with word count and preview
5. **Testimonials** - Manage testimonials with star rating widget
6. **Services** - Manage services with icon selection
7. **Certifications** - Manage certifications with image upload

**Note:** Admin panel uses browser localStorage to store data. All data is client-side only. The login page is for UI purposes only - no actual authentication is performed.

## 📝 Setup Notes

### Images
Placeholder images are referenced but not included. You'll need to add:
- Project screenshots (project1.jpg - project9.jpg)
- Blog images (blog1.jpg - blog6.jpg)
- Certification images (cert1.jpg - cert6.jpg)
- Profile photo (profile.jpg)
- Team member photos (team1.jpg - team6.jpg)

See `assets/images/README.md` for details.

### PDF Resume
Create a PDF version of the resume and place it in `assets/pdfs/resume.pdf`.
See `assets/pdfs/README.md` for details.

## 🔧 Customization

### Colors
Edit CSS variables in `assets/css/styles.css`:
```css
:root {
  --bg-primary: #000000;
  --bg-dark: #0f0f0f;
  --accent-highlight: #00bfa6;
  /* ... */
}
```

### Content
- Edit HTML files directly to update content
- All pages use consistent navigation and footer
- Update contact information in footer sections

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 992px
- Desktop: > 992px

## 🚨 Important Notes

1. **No Backend Required**: This is a static website. The contact form shows a success message but doesn't actually send emails. For production, integrate with a backend service or email API.

2. **Images**: Replace placeholder image references with actual images for best results.

3. **PDF Resume**: Generate and add the resume PDF file.

4. **jQuery Only**: All custom JavaScript uses jQuery. No vanilla JavaScript is used for custom interactions (Bootstrap's own JS is allowed for components).

## 📄 License

This project is created for Cyber Samurai Software Solutions portfolio.

## 🤝 Support

For questions or issues, contact: contact@cybersamurai.dev

---

Built with ❤️ by Cyber Samurai Software Solutions

