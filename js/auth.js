/**
 * SuperSpeech - Authentication & User Dashboard
 * Handles Netlify Identity integration and user data
 */

(function() {
  'use strict';
  
  // ===========================
  // Global State
  // ===========================
  
  var currentUser = null;
  var pendingOrderData = null;
  
  // ===========================
  // DOM Elements
  // ===========================
  
  var loginButton = document.getElementById('loginButton');
  var logoutButton = document.getElementById('logoutButton');
  var userMenu = document.getElementById('userMenu');
  var userName = document.getElementById('userName');
  var dashboardLink = document.getElementById('dashboardLink');
  var dashboardSection = document.getElementById('dashboard');
  var authModal = document.getElementById('authModal');
  var continueAsGuestBtn = document.getElementById('continueAsGuest');
  var createAccountBtn = document.getElementById('createAccount');
  var loginLink = document.getElementById('loginLink');
  var modalClose = document.querySelector('.modal-close');
  
  // ===========================
  // Netlify Identity Initialization
  // ===========================
  
  // Initialize on page load
  if (window.netlifyIdentity) {
    netlifyIdentity.on('init', function(user) {
      if (user) {
        handleUserLogin(user);
      }
    });
    
    netlifyIdentity.on('login', function(user) {
      handleUserLogin(user);
      netlifyIdentity.close();
      
      // If there was a pending order, submit it now
      if (pendingOrderData) {
        submitOrderWithUser(pendingOrderData);
        pendingOrderData = null;
        authModal.style.display = 'none';
      }
    });
    
    netlifyIdentity.on('logout', function() {
      handleUserLogout();
    });
    
    netlifyIdentity.on('error', function(err) {
      console.error('Identity error:', err);
    });
    
    netlifyIdentity.on('close', function() {
      // Widget closed
    });
  }
  
  // ===========================
  // Event Listeners
  // ===========================
  
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      netlifyIdentity.open('login');
    });
  }
  
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      netlifyIdentity.logout();
    });
  }
  
  if (createAccountBtn) {
    createAccountBtn.addEventListener('click', function() {
      authModal.style.display = 'none';
      netlifyIdentity.open('signup');
    });
  }
  
  if (continueAsGuestBtn) {
    continueAsGuestBtn.addEventListener('click', function() {
      authModal.style.display = 'none';
      if (pendingOrderData) {
        submitOrderAsGuest(pendingOrderData);
        pendingOrderData = null;
      }
    });
  }
  
  if (loginLink) {
    loginLink.addEventListener('click', function(e) {
      e.preventDefault();
      authModal.style.display = 'none';
      netlifyIdentity.open('login');
    });
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', function() {
      authModal.style.display = 'none';
      pendingOrderData = null;
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === authModal) {
      authModal.style.display = 'none';
      pendingOrderData = null;
    }
  });
  
  // ===========================
  // User Login/Logout Handlers
  // ===========================
  
  function handleUserLogin(user) {
    currentUser = user;
    
    // Update UI to show logged-in state
    if (loginButton) loginButton.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (dashboardLink) dashboardLink.style.display = 'block';
    
    // Set user name
    var displayName = user.user_metadata.full_name || user.email.split('@')[0];
    if (userName) userName.textContent = displayName;
    
    // Update dashboard
    if (document.getElementById('dashboardUserName')) {
      document.getElementById('dashboardUserName').textContent = displayName;
    }
    if (document.getElementById('userEmail')) {
      document.getElementById('userEmail').textContent = user.email;
    }
    if (document.getElementById('memberSince')) {
      var memberDate = new Date(user.created_at).toLocaleDateString();
      document.getElementById('memberSince').textContent = memberDate;
    }
    
    // Load user's orders and speeches
    loadUserDashboard(user);
  }
  
  function handleUserLogout() {
    currentUser = null;
    
    // Update UI to show logged-out state
    if (loginButton) loginButton.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
    if (dashboardLink) dashboardLink.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'none';
    
    // Clear dashboard data
    clearDashboard();
    
    // Redirect to home
    window.location.hash = '';
  }
  
  // ===========================
  // Order Submission with Auth
  // ===========================
  
  window.submitOrderWithAuth = function(orderData) {
    // Check if user is logged in
    var user = netlifyIdentity.currentUser();
    
    if (user) {
      // User is logged in, submit directly
      submitOrderWithUser(orderData);
    } else {
      // User not logged in, show modal
      pendingOrderData = orderData;
      authModal.style.display = 'flex';
    }
  };
  
  function submitOrderWithUser(orderData) {
    // Add user ID to order data
    orderData.userId = currentUser.id;
    orderData.userEmail = currentUser.email;
    orderData.accountType = 'registered';
    
    // Submit to Netlify Forms with user data
    submitOrder(orderData);
  }
  
  function submitOrderAsGuest(orderData) {
    // Mark as guest order
    orderData.accountType = 'guest';
    
    // Submit to Netlify Forms
    submitOrder(orderData);
  }
  
  function submitOrder(orderData) {
    // N8N Webhook URL - Points to questionnaire workflow on Render
    var n8nWebhookUrl = 'https://n8n-service-4kze.onrender.com/webhook/questionnaire-completed';
    
    console.log('📤 Sending order to n8n:', n8nWebhookUrl);
    
    // Send to n8n
    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    .then(function(response) {
      console.log('✓ n8n responded with status:', response.status);
      if (!response.ok) {
        console.warn('n8n returned error:', response.status);
      }
      return response.json().catch(function() {
        console.log('⚠ No JSON response from n8n, treating as success');
        return { success: true };
      });
    })
    .then(function(data) {
      console.log('✅ Order submitted to n8n:', data);
      
      // Save to user's metadata if logged in
      if (orderData.userId) {
        saveOrderToUserMetadata(orderData);
      }
      
      // Show success message - call window function if available
      if (window.showSuccessMessage) {
        console.log('📊 Calling showSuccessMessage');
        window.showSuccessMessage();
      } else {
        // Fallback
        var successMsg = document.getElementById('successMessage');
        var form = document.getElementById('speechForm');
        if (form && successMsg) {
          form.style.display = 'none';
          successMsg.style.display = 'block';
          successMsg.scrollIntoView({ behavior: 'smooth' });
          console.log('✓ Success message shown (fallback)');
        }
      }
      
      // Download JSON backup
      var dataStr = JSON.stringify(orderData, null, 2);
      var dataBlob = new Blob([dataStr], { type: 'application/json' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = 'superspeech_order_' + orderData.timestamp.replace(/[:.]/g, '-') + '.json';
      link.click();
      console.log('📥 JSON backup downloaded');
    })
    .catch(function(error) {
      console.error('❌ Error submitting order:', error);
      alert('Error submitting order. Please try again or contact hello@superspeech.biz');
    });
  }
  
  // ===========================
  // User Dashboard
  // ===========================
  
  function loadUserDashboard(user) {
    // Try to load from Firebase via backend (with timeout)
    var fetchPromise = fetch('https://superspeech-backend.onrender.com/api/dashboard/' + encodeURIComponent(user.email), {
      timeout: 5000
    })
      .then(function(response) {
        if (!response.ok) throw new Error('API error');
        return response.json();
      });
    
    // Set a timeout for the fetch
    var timeoutPromise = new Promise(function(resolve) {
      setTimeout(function() {
        resolve(null);
      }, 5000);
    });
    
    Promise.race([fetchPromise, timeoutPromise])
      .then(function(data) {
        if (data) {
          displayDashboardData(data, user);
        } else {
          // Fallback to localStorage
          var allOrders = JSON.parse(localStorage.getItem('superspeech_orders') || '[]');
          var userOrders = allOrders.filter(function(order) {
            return order.userId === user.id || order.customer.email === user.email;
          });
          displayOrders(userOrders);
        }
      })
      .catch(function(error) {
        console.warn('Dashboard API error, using fallback:', error);
        // Fallback to localStorage
        var allOrders = JSON.parse(localStorage.getItem('superspeech_orders') || '[]');
        var userOrders = allOrders.filter(function(order) {
          return order.userId === user.id || order.customer.email === user.email;
        });
        displayOrders(userOrders);
      });
  }
  
  function displayDashboardData(data, user) {
    var orderHistory = document.getElementById('orderHistory');
    var speechesInProgress = document.getElementById('speechesInProgress');
    var completedSpeeches = document.getElementById('completedSpeeches');
    
    // Get orders and speeches from data
    var orders = data.orders || [];
    var speeches = data.speeches || [];
    var messages = data.messages || [];
    
    // Update total orders count
    if (document.getElementById('totalOrders')) {
      document.getElementById('totalOrders').textContent = orders.length;
    }
    
    // Display all orders in order history
    if (orders.length === 0) {
      orderHistory.innerHTML = '<p class="no-data">No orders yet. <a href="#order">Place your first order!</a></p>';
    } else {
      var orderHTML = '';
      orders.sort(function(a, b) {
        return new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp);
      });
      
      orders.forEach(function(order) {
        var date = new Date(order.createdAt || order.timestamp).toLocaleDateString();
        var packageName = order.package || order.order?.package || 'Unknown';
        var occasion = order.occasion || order.order?.specificOccasion || 'Custom';
        
        orderHTML += '<div class="order-item">';
        orderHTML += '  <div class="order-header">';
        orderHTML += '    <span class="order-date">' + date + '</span>';
        orderHTML += '  </div>';
        orderHTML += '  <div class="order-details">';
        orderHTML += '    <p><strong>Package:</strong> ' + packageName + '</p>';
        orderHTML += '    <p><strong>Occasion:</strong> ' + occasion + '</p>';
        orderHTML += '  </div>';
        orderHTML += '</div>';
      });
      orderHistory.innerHTML = orderHTML;
    }
    
    // Display speeches in progress
    var inProgress = speeches.filter(function(s) { return s.status === 'in_progress'; });
    if (inProgress.length === 0) {
      speechesInProgress.innerHTML = '<p class="no-data">No speeches currently being written.</p>';
    } else {
      var progressHTML = '';
      inProgress.forEach(function(speech) {
        var date = new Date(speech.createdAt).toLocaleDateString();
        progressHTML += '<div class="order-item">';
        progressHTML += '  <div class="order-header">';
        progressHTML += '    <span class="order-date">' + date + '</span>';
        progressHTML += '    <span class="order-status status-pending">In Progress</span>';
        progressHTML += '  </div>';
        progressHTML += '  <div class="order-details">';
        progressHTML += '    <p><strong>Occasion:</strong> ' + (speech.occasion || 'Custom Speech') + '</p>';
        progressHTML += '    <p style="font-size: 0.875rem; color: #666;">Estimated delivery: within 3 hours</p>';
        progressHTML += '  </div>';
        progressHTML += '</div>';
      });
      speechesInProgress.innerHTML = progressHTML;
    }
    
    // Display completed speeches
    var completed = speeches.filter(function(s) { return s.status === 'completed'; });
    if (completed.length === 0) {
      completedSpeeches.innerHTML = '<p class="no-data">No completed speeches yet.</p>';
    } else {
      var completedHTML = '';
      completed.forEach(function(speech) {
        var date = new Date(speech.completedAt).toLocaleDateString();
        completedHTML += '<div class="order-item">';
        completedHTML += '  <div class="order-header">';
        completedHTML += '    <span class="order-date">' + date + '</span>';
        completedHTML += '    <span class="order-status status-completed">✓ Completed</span>';
        completedHTML += '  </div>';
        completedHTML += '  <div class="order-details">';
        completedHTML += '    <p><strong>Occasion:</strong> ' + (speech.occasion || 'Custom Speech') + '</p>';
        if (speech.downloadUrl) {
          completedHTML += '    <p><a href="' + speech.downloadUrl + '" class="download-link">📥 Download Speech</a></p>';
        }
        completedHTML += '  </div>';
        completedHTML += '</div>';
      });
      completedSpeeches.innerHTML = completedHTML;
    }
    
    // Display messages if there's a messages section
    var messagesSection = document.getElementById('messagesSection');
    if (messagesSection) {
      if (messages.length === 0) {
        messagesSection.innerHTML = '<p class="no-data">No messages yet.</p>';
      } else {
        var messagesHTML = '';
        messages.sort(function(a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        messages.forEach(function(msg) {
          var date = new Date(msg.createdAt).toLocaleDateString();
          messagesHTML += '<div class="message-item">';
          messagesHTML += '  <div class="message-header">';
          messagesHTML += '    <span class="message-from"><strong>From:</strong> ' + msg.from + '</span>';
          messagesHTML += '    <span class="message-date">' + date + '</span>';
          messagesHTML += '  </div>';
          messagesHTML += '  <div class="message-body">';
          messagesHTML += '    <p>' + msg.body + '</p>';
          messagesHTML += '  </div>';
          messagesHTML += '</div>';
        });
        messagesSection.innerHTML = messagesHTML;
      }
    }
  }
  
  function displayOrders(orders) {
    var orderHistory = document.getElementById('orderHistory');
    var speechesInProgress = document.getElementById('speechesInProgress');
    var completedSpeeches = document.getElementById('completedSpeeches');
    
    if (!orders || orders.length === 0) {
      orderHistory.innerHTML = '<p class="no-data">No orders yet. <a href="#order">Place your first order!</a></p>';
      speechesInProgress.innerHTML = '<p class="no-data">No speeches in progress.</p>';
      completedSpeeches.innerHTML = '<p class="no-data">No completed speeches yet.</p>';
      return;
    }
    
    // Sort orders by date (newest first)
    orders.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // Render order history
    var orderHTML = '';
    orders.forEach(function(order) {
      var date = new Date(order.timestamp).toLocaleDateString();
      var packageName = order.order.package.charAt(0).toUpperCase() + order.order.package.slice(1);
      var tone = order.order.tone.charAt(0).toUpperCase() + order.order.tone.slice(1);
      
      orderHTML += '<div class="order-item">';
      orderHTML += '  <div class="order-header">';
      orderHTML += '    <span class="order-date">' + date + '</span>';
      orderHTML += '    <span class="order-status status-pending">In Progress</span>';
      orderHTML += '  </div>';
      orderHTML += '  <div class="order-details">';
      orderHTML += '    <p><strong>Package:</strong> The ' + packageName + '</p>';
      orderHTML += '    <p><strong>Tone:</strong> ' + tone + '</p>';
      orderHTML += '    <p><strong>Occasion:</strong> ' + order.order.category + ' - ' + order.order.specificOccasion + '</p>';
      orderHTML += '  </div>';
      orderHTML += '</div>';
    });
    
    orderHistory.innerHTML = orderHTML;
    speechesInProgress.innerHTML = '<p class="no-data">Your speeches will appear here once we start working on them!</p>';
    completedSpeeches.innerHTML = '<p class="no-data">Completed speeches will be available for download here.</p>';
  }
  
  function clearDashboard() {
    if (document.getElementById('orderHistory')) {
      document.getElementById('orderHistory').innerHTML = '<p class="loading">Loading your orders...</p>';
    }
    if (document.getElementById('speechesInProgress')) {
      document.getElementById('speechesInProgress').innerHTML = '<p class="loading">Loading your speeches...</p>';
    }
    if (document.getElementById('completedSpeeches')) {
      document.getElementById('completedSpeeches').innerHTML = '<p class="loading">Loading completed speeches...</p>';
    }
  }
  
  function saveOrderToUserMetadata(orderData) {
    // Save order to localStorage linked to user
    var orders = JSON.parse(localStorage.getItem('superspeech_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('superspeech_orders', JSON.stringify(orders));
  }
  
  // ===========================
  // Handle Dashboard Navigation
  // ===========================
  
  window.addEventListener('hashchange', function() {
    var hash = window.location.hash;
    
    if (hash === '#dashboard') {
      var user = netlifyIdentity.currentUser();
      if (user) {
        // Show dashboard
        dashboardSection.style.display = 'block';
        dashboardSection.scrollIntoView({ behavior: 'smooth' });
        loadUserDashboard(user);
      } else {
        // Not logged in, redirect to login
        netlifyIdentity.open('login');
        window.location.hash = '';
      }
    } else {
      // Hide dashboard when navigating away
      if (dashboardSection) {
        dashboardSection.style.display = 'none';
      }
    }
  });
  
  // ===========================
  // Initialize on Page Load
  // ===========================
  
  document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    var user = netlifyIdentity.currentUser();
    if (user) {
      handleUserLogin(user);
    }
    
    // Check if we're on dashboard page
    if (window.location.hash === '#dashboard') {
      if (user) {
        dashboardSection.style.display = 'block';
        loadUserDashboard(user);
      } else {
        window.location.hash = '';
      }
    }
  });
  
})();
