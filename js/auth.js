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
    // Send to Netlify form
    var formData = new FormData();
    formData.append('form-name', 'superspeech-order');
    formData.append('customer-name', orderData.customer.name);
    formData.append('customer-email', orderData.customer.email);
    formData.append('package', orderData.order.package);
    formData.append('tone', orderData.order.tone);
    formData.append('category', orderData.order.category);
    formData.append('specific-occasion', orderData.order.specificOccasion);
    formData.append('full-data', JSON.stringify(orderData, null, 2));
    
    // Add user data if logged in
    if (orderData.userId) {
      formData.append('user-id', orderData.userId);
      formData.append('account-type', 'registered');
    } else {
      formData.append('account-type', 'guest');
    }
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(function() {
      console.log('Order submitted to Netlify Forms');
      
      // Also save to user's metadata if logged in
      if (orderData.userId) {
        saveOrderToUserMetadata(orderData);
      }
      
      // Show success message
      document.getElementById('speechForm').style.display = 'none';
      document.getElementById('successMessage').style.display = 'block';
      document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
      
      // Download JSON backup
      var dataStr = JSON.stringify(orderData, null, 2);
      var dataBlob = new Blob([dataStr], { type: 'application/json' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = 'superspeech_order_' + orderData.timestamp.replace(/[:.]/g, '-') + '.json';
      link.click();
    })
    .catch(function(error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again or contact hello@superspeech.biz');
    });
  }
  
  // ===========================
  // User Dashboard
  // ===========================
  
  function loadUserDashboard(user) {
    // Get user's orders from localStorage
    var allOrders = JSON.parse(localStorage.getItem('superspeech_orders') || '[]');
    var userOrders = allOrders.filter(function(order) {
      return order.userId === user.id || order.customer.email === user.email;
    });
    
    // Update total orders count
    if (document.getElementById('totalOrders')) {
      document.getElementById('totalOrders').textContent = userOrders.length;
    }
    
    // Display orders
    displayOrders(userOrders);
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
