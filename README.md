# HTML5 Cross-Browser Template

Production-ready template with best practices for ALL browsers (including IE11).

## Features

✅ **Cross-browser compatible** - Works in Chrome, Firefox, Safari, Edge, IE11  
✅ **Responsive design** - Mobile-first approach  
✅ **Accessible** - WCAG 2.1 compliant  
✅ **SEO optimized** - Meta tags, semantic HTML  
✅ **Performance optimized** - Critical CSS, deferred scripts  
✅ **Progressive enhancement** - Works without JavaScript  

## File Structure

```
template/
├── index.html          # Main HTML file (production-ready)
├── css/
│   └── styles.css      # Complete stylesheet with IE11 fallbacks
├── js/
│   └── app.js          # Cross-browser JavaScript
├── images/             # Your images go here
└── README.md           # This file
```

## Quick Start

### 1. Copy Template
```bash
cp -r /workspace/template /workspace/your-project
cd /workspace/your-project
```

### 2. Customize Content
Edit `index.html`:
- Replace "Your Site Title" with your actual title
- Update meta descriptions
- Add your content to sections
- Add your logo/images

### 3. Customize Styles
Edit `css/styles.css`:
- Update CSS variables (`:root`) with your brand colors
- Modify layout as needed
- Add custom components

### 4. Test Locally
Open `index.html` in different browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on Mac)

### 5. Deploy to Netlify
```bash
# Using Netlify CLI
export NETLIFY_AUTH_TOKEN=$(cat /workspace/.netlify-token)
netlify deploy --prod --dir=.
```

## Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome  | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari  | 14+ | Full support |
| Edge    | 90+ (Chromium) | Full support |
| IE      | 11 | Requires polyfills (included) |
| Mobile Safari | 12+ | Full support |
| Chrome Android | 80+ | Full support |

## Polyfills Included

The template automatically loads polyfills for:
- Promise
- fetch API
- Array.prototype.includes
- HTML5 elements (for IE11)

These are loaded conditionally - only if the browser needs them.

## CSS Features

### CSS Variables (with IE11 fallbacks)
```css
:root {
  --primary-color: #007bff;
}

/* Used with fallback */
background: #007bff;           /* IE11 fallback */
background: var(--primary-color); /* Modern browsers */
```

### Flexbox (IE11 compatible)
The grid system works in IE11 with `-ms-` prefixes.

### Responsive Grid
```html
<div class="row">
  <div class="col-half">50% width</div>
  <div class="col-half">50% width</div>
</div>
```

## JavaScript Features

### Smooth Scrolling
Works automatically for anchor links with fallback for IE11/Safari.

### Form Handling
HTML5 validation with optional AJAX submission (fetch API with polyfill).

### Lazy Loading
Images with `loading="lazy"` use IntersectionObserver (with fallback).

### Local Storage Helpers
```javascript
// Use the storage API
App.storage.set('key', {data: 'value'});
var data = App.storage.get('key');
App.storage.remove('key');
```

## Optimization Checklist

Before deploying:

- [ ] Compress images (use TinyPNG, Squoosh, etc.)
- [ ] Update all meta tags (title, description, OG tags)
- [ ] Add favicon files
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Validate HTML (https://validator.w3.org/)
- [ ] Check accessibility (WAVE, axe DevTools)

## Advanced: Build Process

For production sites, consider adding:

### Autoprefixer (CSS vendor prefixes)
```bash
npm install -g postcss-cli autoprefixer
postcss css/styles.css --use autoprefixer -o css/styles.min.css
```

### Minification
```bash
npm install -g clean-css-cli uglify-js html-minifier
cleancss -o css/styles.min.css css/styles.css
uglifyjs js/app.js -o js/app.min.js -c -m
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

### Image Optimization
```bash
npm install -g imagemin-cli
imagemin images/* --out-dir=images/optimized
```

## Deploying to Netlify

### Method 1: Drag & Drop
1. Go to https://app.netlify.com/drop
2. Drag the entire folder
3. Done!

### Method 2: Netlify CLI (Automated)
```bash
# Install CLI
npm install -g netlify-cli

# Login (one-time)
export NETLIFY_AUTH_TOKEN=$(cat /workspace/.netlify-token)

# Deploy
netlify deploy --prod --dir=.

# Or create a new site
netlify init
```

### Method 3: Git + Continuous Deployment
1. Push to GitHub/GitLab
2. Connect repository in Netlify
3. Auto-deploys on every push

## Troubleshooting

### IE11 Issues
- **Check console**: IE11 DevTools (F12)
- **Polyfills not loading?** Check `<script>` tag in `<head>`
- **Flexbox issues?** IE11 has flexbox bugs - use fallback layouts

### Mobile Issues
- **Viewport not working?** Check `<meta name="viewport">` tag
- **Touch not working?** Add `touch-action: manipulation` to CSS

### Performance Issues
- **Slow loading?** Compress images, minify CSS/JS
- **Layout shift?** Add width/height to images
- **Blocking resources?** Check scripts are `defer` or `async`

## Need Help?

See `/workspace/CROSS_BROWSER_GUIDE.md` for detailed browser compatibility information.
