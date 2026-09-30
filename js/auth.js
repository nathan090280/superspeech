/**
 * SuperSpeech - Authentication & User Dashboard
 * Handles Netlify Identity integration and user data
 */

(function() {
  'use strict';
  var SUPERSPEECH_API_KEY = '0QG4ts2iQ2puMMIVdOF6flHAojWd9cupsIyqGKV9lZc='; // Shared key for backend webhooks
  
  // ===========================
  // Global State
  // ===========================
  
  var currentUser = null;
  var currentMessages = [];
  var pendingOrderData = null;
  var currentOrders = [];
  
  // ===========================
  // DOM Elements
  // ===========================
  
  var loginButton = document.getElementById('loginButton');
  var logoutButton = document.getElementById('logoutButton');
  var userMenu = document.getElementById('userMenu');
  var userName = document.getElementById('userName');
  var dashboardLink = document.getElementById('dashboardLink');
  var dashboardModal = document.getElementById('dashboardModal');
  var dashboardClose = document.getElementById('dashboardClose');
  var authModal = document.getElementById('authModal');
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
    if (e.target === dashboardModal) {
      dashboardModal.style.display = 'none';
    }
  });
  
  // Dashboard close button
  if (dashboardClose) {
    dashboardClose.addEventListener('click', function() {
      dashboardModal.style.display = 'none';
      window.location.hash = '';
    });
  }
  
  // Handle support links in dashboard modal
  document.addEventListener('click', function(e) {
    if (e.target.matches('.support-link[href^="#"]')) {
      var href = e.target.getAttribute('href');
      if (href && href.startsWith('#') && dashboardModal && dashboardModal.style.display !== 'none') {
        // Close dashboard modal when clicking internal links
        dashboardModal.style.display = 'none';
      }
    }
  });
  
  // Direct click handler for dashboard link (backup for hashchange)
  document.addEventListener('click', function(e) {
    if (e.target.matches('a[href="#dashboard"]')) {
      e.preventDefault();
      console.log('Dashboard link clicked');
      
      var user = netlifyIdentity ? netlifyIdentity.currentUser() : null;
      console.log('Current user:', user);
      
      if (user) {
        console.log('User logged in, opening dashboard modal');
        dashboardModal.style.display = 'block';
        loadUserDashboard(user);
      } else {
        console.log('No user, opening login');
        if (netlifyIdentity) {
          netlifyIdentity.open('login');
        } else {
          alert('Please wait for the page to fully load, then try again.');
        }
      }
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
    if (dashboardModal) dashboardModal.style.display = 'none';
    
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
  
  function submitOrder(orderData) {
    // Backend API URL - Direct to backend (n8n workflow not yet activated)
    var backendUrl = 'https://superspeech-backend.onrender.com/api/webhooks/questionnaire-completed';
    
    console.log('📤 Sending order to backend:', backendUrl);
    
    // Send to backend and WAIT for response
    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SUPERSPEECH_API_KEY
      },
      body: JSON.stringify(orderData)
    })
    .then(function(response) {
      console.log('✓ Backend responded with status:', response.status);
      
      // Check if response is OK (200-299)
      if (!response.ok) {
        throw new Error('Backend returned error status: ' + response.status);
      }
      
      // Try to parse JSON, but don't fail if there's no JSON
      return response.text().then(function(text) {
        try {
          return text ? JSON.parse(text) : { success: true };
        } catch (e) {
          // If not JSON, just return success if status was OK
          return { success: true };
        }
      });
    })
    .then(function(data) {
      console.log('✅ Order submitted to backend successfully:', data);
      
      // Save to user's metadata if logged in
      if (orderData.userId) {
        saveOrderToUserMetadata(orderData);
      } else {
        var orders = JSON.parse(localStorage.getItem('superspeech_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('superspeech_orders', JSON.stringify(orders));
      }
      
      // NOW show success message (only after n8n confirms)
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
    })
    .catch(function(error) {
      console.error('❌ Error submitting to backend:', error);
      
      // Hide submitting message and show form again
      var submittingMsg = document.getElementById('submittingMessage');
      var form = document.getElementById('speechForm');
      if (submittingMsg) {
        submittingMsg.style.display = 'none';
      }
      if (form) {
        form.style.display = 'block';
      }
      
      // Re-enable submit button on error
      var submitButton = form ? form.querySelector('button[type="submit"]') : null;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Order';
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
      }
      
      // Reset submitting flag (in superspeech.js)
      if (window.resetSubmitFlag) {
        window.resetSubmitFlag();
      }
      
      alert('Error submitting order. Please try again or contact hello@superspeech.biz\n\nError: ' + error.message);
    });
  }
  
  // ===========================
  // User Dashboard
  // ===========================
  
  function loadUserDashboard(user) {
    // Try to load from Firebase via backend (with timeout).
    // Sends the Netlify Identity JWT so the backend can verify this user
    // owns the email being requested - no extra login needed.
    var fetchPromise = Promise.resolve(user && user.jwt ? user.jwt() : null)
      .then(function(token) {
        var headers = {};
        if (token) {
          headers['Authorization'] = 'Bearer ' + token;
        }
        return fetch('https://superspeech-backend.onrender.com/api/dashboard/' + encodeURIComponent(user.email), {
          headers: headers
        });
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
    currentOrders = orders;
    
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
    
    // Display completed speeches (most recently edited/completed first)
    var completed = speeches.filter(function(s) { return s.status === 'completed'; });
    completed.sort(function(a, b) {
      var aTime = new Date(a.updatedAt || a.completedAt || a.createdAt);
      var bTime = new Date(b.updatedAt || b.completedAt || b.createdAt);
      return bTime - aTime;
    });
    if (completed.length === 0) {
      completedSpeeches.innerHTML = '<p class="no-data">No completed speeches yet.</p>';
    } else {
      var completedHTML = '';
      completed.forEach(function(speech) {
        var date = new Date(speech.completedAt || speech.createdAt).toLocaleDateString();
        var occasionType = speech.occasionType || speech.occasion || 'Custom Speech';
        var editBadge = speech.editCount ? '<span class="order-status status-edited">✏️ Edit ' + speech.editCount + '</span>' : '';
        var editedNote = speech.updatedAt ? '<p style="font-size: 0.8rem; color: #7c3aed;">Last edited: ' + new Date(speech.updatedAt).toLocaleString() + '</p>' : '';
        completedHTML += '<div class="order-item">';
        completedHTML += '  <div class="order-header">';
        completedHTML += '    <span class="order-date">' + date + '</span>';
        completedHTML += '    ' + editBadge;
        completedHTML += '    <span class="order-status status-completed">✓ Completed</span>';
        completedHTML += '  </div>';
        completedHTML += '  <div class="order-details">';
        completedHTML += '    <p><strong>Occasion:</strong> ' + occasionType + '</p>' + editedNote;
        completedHTML += '    <p><button class="view-speech-btn" data-speech-id="' + speech.id + '">👁️ View Speech</button></p>';
        completedHTML += '  </div>';
        completedHTML += '</div>';
      });
      completedSpeeches.innerHTML = completedHTML;
      
      // Add click handlers for view speech buttons
      var viewButtons = completedSpeeches.querySelectorAll('.view-speech-btn');
      viewButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var speechId = this.getAttribute('data-speech-id');
          var speech = completed.find(function(s) { return s.id === speechId; });
          if (speech) {
            window.openSpeechViewer(speech);
          }
        });
      });
    }
    
    // Display messages if there's a messages section
    var messagesSection = document.getElementById('messagesSection');
    if (messagesSection) {
      currentMessages = messages;
      if (messages.length === 0) {
        messagesSection.innerHTML = '<p class="no-data">No messages yet.</p>';
      } else {
        var messagesHTML = '';
        messages.sort(function(a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        messages.forEach(function(msg) {
          var date = new Date(msg.createdAt).toLocaleDateString();
          var linkText = msg.subject || ((msg.body || 'Message').substring(0, 70) + ((msg.body || '').length > 70 ? '...' : ''));
          messagesHTML += '<div class="message-item">';
          messagesHTML += '  <div class="message-header">';
          messagesHTML += '    <span class="message-from"><strong>From:</strong> ' + msg.from + '</span>';
          messagesHTML += '    <span class="message-date">' + date + '</span>';
          messagesHTML += '  </div>';
          messagesHTML += '  <a href="#" class="message-link" data-message-id="' + msg.id + '">💬 ' + linkText + '</a>';
          messagesHTML += '</div>';
        });
        messagesSection.innerHTML = messagesHTML;
        
        // Wire up message links to open the viewer
        var messageLinks = messagesSection.querySelectorAll('.message-link');
        messageLinks.forEach(function(link) {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            var msgId = this.getAttribute('data-message-id');
            var msg = currentMessages.find(function(m) { return m.id === msgId; });
            if (msg) {
              openMessageViewer(msg);
            }
          });
        });
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
        // Show dashboard modal
        dashboardModal.style.display = 'block';
        loadUserDashboard(user);
      } else {
        // Not logged in, redirect to login
        netlifyIdentity.open('login');
        window.location.hash = '';
      }
    } else {
      // Hide dashboard when navigating away
      if (dashboardModal) {
        dashboardModal.style.display = 'none';
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
        dashboardModal.style.display = 'block';
        loadUserDashboard(user);
      } else {
        window.location.hash = '';
      }
    }
  });
  
  // ===========================
  // Speech Viewer Modal
  // ===========================
  
  window.openSpeechViewer = function(speech) {
    var modal = document.getElementById('speechViewerModal');
    var title = document.getElementById('speechViewerTitle');
    var content = document.getElementById('speechContent');
    var closeBtn = document.getElementById('speechViewerClose');
    var copyBtn = document.getElementById('copySpeechBtn');
    var printBtn = document.getElementById('printSpeechBtn');
    var downloadBtn = document.getElementById('downloadSpeechBtn');
    var requestEditBtn = document.getElementById('requestEditBtn');
    
    if (!modal || !content) return;
    
    // Set content
    var occasionType = speech.occasionType || speech.occasion || 'Custom Speech';
    title.textContent = occasionType + ' Speech';
    content.textContent = speech.speechContent || speech.speech || 'Speech content not available';
    
    // Show modal
    modal.style.display = 'block';
    
    // Close button handler
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
    
    // Copy button handler
    copyBtn.onclick = function() {
      var text = content.textContent;
      navigator.clipboard.writeText(text).then(function() {
        var originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(function() {
          copyBtn.textContent = originalText;
        }, 2000);
      }).catch(function(err) {
        alert('Failed to copy: ' + err);
      });
    };
    
    // Print button handler
    printBtn.onclick = function() {
      var printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>' + occasionType + ' Speech</title>');
      printWindow.document.write('<style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;line-height:1.6;font-size:16px;}h1{text-align:center;margin-bottom:30px;}</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1>' + occasionType + ' Speech</h1>');
      printWindow.document.write('<div>' + content.textContent.replace(/\n/g, '<br>') + '</div>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    };
    
    // Download button handler - generates a large-print PDF for stage reading
    if (downloadBtn) {
      downloadBtn.onclick = function() {
        var filename = (occasionType + ' speech').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        var text = content.textContent;
        
        if (window.jspdf && window.jspdf.jsPDF) {
          var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
          var pageWidth = doc.internal.pageSize.getWidth();
          var pageHeight = doc.internal.pageSize.getHeight();
          var margin = 20;
          var y = 28;
          var lineHeight = 9;
          
          doc.setFont('times', 'bold');
          doc.setFontSize(22);
          doc.text(occasionType + ' Speech', pageWidth / 2, y, { align: 'center' });
          y += 16;
          
          doc.setFont('times', 'normal');
          doc.setFontSize(15);
          
          text.split('\n').forEach(function(paragraph) {
            if (paragraph.trim() === '') {
              y += lineHeight;
              return;
            }
            doc.splitTextToSize(paragraph, pageWidth - margin * 2).forEach(function(line) {
              if (y > pageHeight - margin) {
                doc.addPage();
                y = margin + 8;
              }
              doc.text(line, margin, y);
              y += lineHeight;
            });
            y += 4;
          });
          
          doc.save(filename + '.pdf');
        } else {
          // Fallback to plain text if the PDF library failed to load
          var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          var link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename + '.txt';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        }
      };
    }
    
    // Request Edit button handler
    if (requestEditBtn) {
      requestEditBtn.onclick = function() {
        openEditRequestModal(speech);
      };
    }
    
    // Close when clicking outside
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
      var editModal = document.getElementById('editRequestModal');
      if (event.target === editModal) {
        editModal.style.display = 'none';
      }
    };
  };
  
  // ===========================
  // Edit Request Modal
  // ===========================
  
  // Tier 1 (The Toast) = 3 edits, Tier 2 (The Main Event) = 5, Tier 3 (The Keynote) = 7
  function getMaxEditsForPackage(pkg) {
    var p = (pkg || '').toLowerCase();
    if (p.indexOf('keynote') !== -1 || p === 'tier3' || p === '3') return 7;
    if (p.indexOf('main') !== -1 || p === 'tier2' || p === '2') return 5;
    return 3;
  }
  
  function findPackageForSpeech(speech) {
    // Prefer a package stored directly on the speech record
    if (speech.package) return speech.package;
    if (speech.metadata && speech.metadata.package) return speech.metadata.package;
    // Otherwise match the order/questionnaire that produced this speech
    var order = currentOrders.find(function(o) { return o.id === speech.questionnaireId; });
    if (order) {
      return order.package || (order.order && order.order.package) || null;
    }
    return null;
  }
  
  // ===========================
  // Message Viewer Modal
  // ===========================

  function openMessageViewer(msg) {
    var modal = document.getElementById('messageViewerModal');
    var title = document.getElementById('messageViewerTitle');
    var meta = document.getElementById('messageViewerMeta');
    var body = document.getElementById('messageViewerBody');
    var closeBtn = document.getElementById('messageViewerClose');

    if (!modal || !body) return;

    title.textContent = msg.subject || 'Message';
    meta.textContent = 'From: ' + (msg.from || 'SuperSpeech') + ' • ' + new Date(msg.createdAt).toLocaleString();
    body.textContent = msg.body || msg.message || 'No message content.';

    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
    modal.onclick = function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    };

    modal.style.display = 'flex';
  }

  function openEditRequestModal(speech) {
    var modal = document.getElementById('editRequestModal');
    var remainingEl = document.getElementById('editsRemainingText');
    var textarea = document.getElementById('editRequestText');
    var submitBtn = document.getElementById('submitEditRequest');
    var statusEl = document.getElementById('editRequestStatus');
    var closeBtn = document.getElementById('editRequestClose');
    
    if (!modal || !textarea || !submitBtn) return;
    
    var pkg = findPackageForSpeech(speech);
    var maxEdits = getMaxEditsForPackage(pkg);
    var used = speech.editCount || 0;
    var remaining = Math.max(0, maxEdits - used);
    
    remainingEl.textContent = 'You have ' + remaining + ' edit' + (remaining === 1 ? '' : 's') + ' remaining for this speech.';
    statusEl.textContent = '';
    textarea.value = '';
    submitBtn.disabled = remaining <= 0;
    submitBtn.textContent = 'Submit Edit Request';
    
    if (remaining <= 0) {
      statusEl.textContent = 'You have used all the edits included with your package. Contact hello@superspeech.biz for further changes.';
    }
    
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
    
    submitBtn.onclick = function() {
      var editText = textarea.value.trim();
      if (!editText) {
        statusEl.textContent = 'Please describe the edits you would like before submitting.';
        return;
      }
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusEl.textContent = 'Our AI is working on your edit - this can take up to a minute.';
      
      fetch('https://superspeech-backend.onrender.com/api/webhooks/edit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': SUPERSPEECH_API_KEY },
        body: JSON.stringify({
          speechId: speech.id,
          originalSpeech: speech.speechContent || speech.speech,
          editRequest: editText,
          userEmail: currentUser ? currentUser.email : (speech.userEmail || ''),
          userId: currentUser ? currentUser.id : (speech.userId || null),
          packageTier: pkg,
          editCount: used + 1
        })
      })
      .then(function(response) {
        return response.json().catch(function() { return {}; }).then(function(data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function(result) {
        if (result.ok && result.data.success !== false) {
          speech.editCount = used + 1;
          var newRemaining = Math.max(0, maxEdits - speech.editCount);
          remainingEl.textContent = 'You have ' + newRemaining + ' edit' + (newRemaining === 1 ? '' : 's') + ' remaining for this speech.';
          statusEl.textContent = 'Done! Your updated speech has been emailed to you and will appear in your dashboard.';
          textarea.value = '';
          
          // Update the open viewer if the backend returned the new text
          if (result.data.editedSpeech || result.data.speechContent) {
            var updated = result.data.editedSpeech || result.data.speechContent;
            speech.speechContent = updated;
            var content = document.getElementById('speechContent');
            if (content) content.textContent = updated;
          }
          
          setTimeout(function() {
            modal.style.display = 'none';
          }, 4000);
          
          // Refresh dashboard so the edited speech shows its Edit badge
          if (currentUser) {
            loadUserDashboard(currentUser);
          }
          
          submitBtn.disabled = newRemaining <= 0;
          submitBtn.textContent = 'Submit Edit Request';
        } else {
          throw new Error((result.data && (result.data.message || result.data.error)) || 'Request failed');
        }
      })
      .catch(function(err) {
        statusEl.textContent = (err && err.message && err.message !== 'Request failed')
          ? err.message
          : 'Something went wrong sending your edit request. Please try again or email hello@superspeech.biz';
        submitBtn.disabled = remaining <= 0;
        submitBtn.textContent = 'Submit Edit Request';
        console.error('Edit request failed:', err);
      });
    };
    
    modal.style.display = 'flex';
  }
  
})();
