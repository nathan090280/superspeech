/**
 * Cross-Browser JavaScript
 * Works in all modern browsers + IE11 (with polyfills)
 */

(function() {
  'use strict';
  
  // ===========================
  // Feature Detection
  // ===========================
  
  var hasIntersectionObserver = 'IntersectionObserver' in window;
  var hasLocalStorage = (function() {
    try {
      var test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  })();
  
  // ===========================
  // DOM Ready
  // ===========================
  
  function domReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }
  
  // ===========================
  // Smooth Scroll (with fallback)
  // ===========================
  
  function smoothScrollTo(element) {
    if ('scrollBehavior' in document.documentElement.style) {
      // Native smooth scroll
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback for IE11 and Safari
      element.scrollIntoView();
    }
  }
  
  // Handle anchor links
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    
    Array.prototype.forEach.call(links, function(link) {
      link.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        
        // Special case: "Home" link scrolls to top
        if (href === '#home') {
          e.preventDefault();
          if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.scrollTo(0, 0);
          }
          return;
        }
        
        // Special case: Dashboard link - let hash change happen for auth.js to handle
        if (href === '#dashboard') {
          // Don't prevent default - let the hash change naturally
          return;
        }
        
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          smoothScrollTo(target);
        }
      });
    });
  }
  
  // ===========================
  // Form Validation & Submission
  // ===========================
  
  function initForms() {
    var forms = document.querySelectorAll('form');
    
    Array.prototype.forEach.call(forms, function(form) {
      form.addEventListener('submit', function(e) {
        // HTML5 validation works automatically
        // Add custom validation or AJAX submission here
        
        if (!form.checkValidity()) {
          e.preventDefault();
          // Form is invalid - browser will show validation messages
          return false;
        }
        
        // Optional: AJAX submission
        // e.preventDefault();
        // submitFormViaAjax(form);
      });
    });
  }
  
  // AJAX form submission (works with polyfill for IE11)
  function submitFormViaAjax(form) {
    var formData = new FormData(form);
    var url = form.getAttribute('action') || '/submit';
    
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log('Success:', data);
      // Show success message
      alert('Form submitted successfully!');
      form.reset();
    })
    .catch(function(error) {
      console.error('Error:', error);
      alert('Error submitting form. Please try again.');
    });
  }
  
  // ===========================
  // Lazy Loading Images
  // ===========================
  
  function initLazyLoading() {
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (hasIntersectionObserver) {
      // Use modern Intersection Observer
      var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      // Fallback: load all images immediately
      lazyImages.forEach(function(img) {
        img.src = img.dataset.src || img.src;
      });
    }
  }
  
  // ===========================
  // Mobile Menu Toggle
  // ===========================
  
  function initMobileMenu() {
    var menuButton = document.querySelector('.menu-toggle');
    var nav = document.querySelector('nav');
    
    if (!menuButton || !nav) return;
    
    menuButton.addEventListener('click', function() {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('open');
    });
  }
  
  // ===========================
  // Accessibility Enhancements
  // ===========================
  
  function initAccessibility() {
    // Add skip-to-content link for keyboard users
    var main = document.querySelector('main');
    if (main && !main.getAttribute('id')) {
      main.setAttribute('id', 'main-content');
    }
    
    // Trap focus in modals (if you have any)
    var modals = document.querySelectorAll('[role="dialog"]');
    Array.prototype.forEach.call(modals, function(modal) {
      trapFocus(modal);
    });
  }
  
  function trapFocus(element) {
    var focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), ' +
      'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    var firstElement = focusableElements[0];
    var lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
  
  // ===========================
  // Local Storage Helpers
  // ===========================
  
  var storage = {
    set: function(key, value) {
      if (!hasLocalStorage) return false;
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('localStorage error:', e);
        return false;
      }
    },
    
    get: function(key) {
      if (!hasLocalStorage) return null;
      try {
        var value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (e) {
        console.error('localStorage error:', e);
        return null;
      }
    },
    
    remove: function(key) {
      if (!hasLocalStorage) return false;
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error('localStorage error:', e);
        return false;
      }
    }
  };
  
  // ===========================
  // Debounce Helper
  // ===========================
  
  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }
  
  // ===========================
  // Window Resize Handler
  // ===========================
  
  var handleResize = debounce(function() {
    console.log('Window resized:', window.innerWidth, 'x', window.innerHeight);
    // Add your resize logic here
  }, 250);
  
  window.addEventListener('resize', handleResize);
  
  // ===========================
  // Initialize Everything
  // ===========================
  
  domReady(function() {
    console.log('DOM ready - initializing app');
    
    initSmoothScroll();
    initForms();
    initLazyLoading();
    initMobileMenu();
    initAccessibility();
    
    // Add fade-in animation to sections
    var sections = document.querySelectorAll('section');
    Array.prototype.forEach.call(sections, function(section, index) {
      setTimeout(function() {
        section.classList.add('fade-in');
      }, index * 100);
    });
    
    console.log('App initialized successfully');
  });
  
  // ===========================
  // Public API (if needed)
  // ===========================
  
  window.App = {
    storage: storage,
    debounce: debounce,
    smoothScrollTo: smoothScrollTo
  };
  
})();
