/**
 * SuperSpeech - Dynamic Questionnaire System
 * Handles occasion-based question routing and form submission
 */

(function() {
  'use strict';
  
  // ===========================
  // Occasion Data Structure
  // ===========================
  
  var occasions = {
    wedding: {
      name: 'Weddings & Romance',
      types: [
        'Best Man',
        'Best Woman',
        'Best Person',
        'Maid/Matron of Honour',
        'Groom',
        'Bride',
        'Newlyweds',
        'Parent of Bride/Groom',
        'Bridesmaid/Groomsman',
        'Vow Renewal',
        'Sibling of Bride/Groom',
        'Wedding Guest Toast',
        'Rehearsal Dinner',
        'Anniversary Party'
      ]
    },
    corporate: {
      name: 'Corporate & Professional',
      types: [
        'Retirement/Farewell',
        'Promotion/Welcome',
        'Keynote/Panel',
        'Town Hall',
        'Product Launch/Pitch',
        'Award Acceptance',
        'Award Presentation',
        'Team Building Event',
        'Sales Conference',
        'Leadership Summit',
        'Company Anniversary',
        'Training/Workshop Introduction'
      ]
    },
    milestone: {
      name: 'Milestone Celebrations',
      types: [
        'Big Birthday (30th, 50th etc.)',
        'Anniversary',
        'Graduation',
        'Bar/Bat Mitzvah',
        'Quinceañera',
        'Housewarming/Grand Opening',
        'Engagement Party',
        'Baby Shower',
        'New Baby Announcement',
        'Retirement Party',
        'School Reunion',
        'Achievement Celebration'
      ]
    },
    memorial: {
      name: 'Memorials & Tributes',
      types: [
        'Eulogy',
        'Celebration of Life',
        'Charity Gala/Fundraiser',
        'Tribute to Mentor',
        'Thank You Speech',
        'Legacy Event'
      ]
    }
  };
  
  // ===========================
  // Dynamic Questions by Occasion Type & Tone
  // ===========================
  
  var questionSets = {
    // Best Man / Best Woman / Best Person (same questions)
    'best-man': {
      base: [
        { id: 'relationship', label: 'What is your relationship to the groom/bride?', type: 'text', required: true },
        { id: 'firstMet', label: 'What was the groom/bride like when you first met them?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'embarrassingPhase', label: 'What was their most embarrassing fashion phase, haircut, or hobby?', type: 'textarea', required: false },
        { id: 'arrestedFor', label: 'If they were arrested, what would it most likely be for?', type: 'text', required: false },
        { id: 'terribleAt', label: 'What is something they are surprisingly terrible at?', type: 'text', required: false }
      ],
      emotional: [
        { id: 'firstMentioned', label: 'When did they first mention their partner to you, and what did they say?', type: 'textarea', required: false },
        { id: 'realizedTheOne', label: 'When did you realize this relationship was "the one" for them?', type: 'textarea', required: false },
        { id: 'changedForBetter', label: 'How have they changed for the better since meeting their partner?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'definingQuality', label: 'What is the one quality that defines them as a person?', type: 'text', required: false },
        { id: 'coupleAsTeam', label: 'What is your favorite quality about the couple as a team?', type: 'textarea', required: false },
        { id: 'marriageAdvice', label: 'What is your number one piece of marriage advice for them?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'childhoodStory', label: 'What childhood or college story perfectly sums up their personality?', type: 'textarea', required: false },
        { id: 'ridiculousHabit', label: 'What is their most ridiculous or endearing habit?', type: 'text', required: false },
        { id: 'proposalDetails', label: 'Any behind-the-scenes details about how they planned the proposal?', type: 'textarea', required: false }
      ]
    },
    
    // Maid/Matron of Honour
    'maid-matron-of-honour': {
      base: [
        { id: 'relationship', label: 'What is your relationship to the bride/groom?', type: 'text', required: true },
        { id: 'friendship', label: 'How did your friendship begin?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'shoppingDisaster', label: 'What was the funniest disaster during wedding planning or dress shopping?', type: 'textarea', required: false },
        { id: 'datingHistory', label: 'Any funny stories about their dating history before meeting "the one"?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'firstImpressionPartner', label: 'What was your first impression of their partner?', type: 'textarea', required: false },
        { id: 'perfectMatch', label: 'What makes them a perfect match?', type: 'textarea', required: false },
        { id: 'growthTogether', label: 'How have you seen them grow together as a couple?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'admirableQuality', label: 'What quality do you most admire in them?', type: 'text', required: false },
        { id: 'relationshipAdvice', label: 'What advice would you give them for a lasting marriage?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'secretKeeper', label: 'What secret have they sworn you to keep (that you can now reveal)?', type: 'textarea', required: false },
        { id: 'worstBoyfriend', label: 'Can you roast one of their terrible ex-boyfriends/girlfriends?', type: 'textarea', required: false }
      ]
    },
    
    // Groom Speech
    'groom': {
      base: [
        { id: 'howMet', label: 'How did you and your partner meet?', type: 'textarea', required: true },
        { id: 'knewSheWasOne', label: 'When did you know they were "the one"?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'firstDateDisaster', label: 'Any funny first date disasters or mishaps?', type: 'textarea', required: false },
        { id: 'inLawsStory', label: 'Funny story about winning over the in-laws?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'favoriteMemory', label: 'What is your favorite memory together?', type: 'textarea', required: false },
        { id: 'gratefulFor', label: 'What are you most grateful for about your partner?', type: 'textarea', required: false },
        { id: 'futureVision', label: 'What are you most excited about for your future together?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'vows', label: 'What promises do you want to make publicly?', type: 'textarea', required: false },
        { id: 'thankYous', label: 'Who do you want to thank and why?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'nervousStory', label: 'What were you most nervous about before proposing?', type: 'textarea', required: false }
      ]
    },
    
    // Bride Speech (same structure as groom)
    'bride': {
      base: [
        { id: 'howMet', label: 'How did you and your partner meet?', type: 'textarea', required: true },
        { id: 'knewHeWasOne', label: 'When did you know they were "the one"?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'firstDateDisaster', label: 'Any funny first date disasters or mishaps?', type: 'textarea', required: false },
        { id: 'inLawsStory', label: 'Funny story about winning over the in-laws?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'favoriteMemory', label: 'What is your favorite memory together?', type: 'textarea', required: false },
        { id: 'gratefulFor', label: 'What are you most grateful for about your partner?', type: 'textarea', required: false },
        { id: 'futureVision', label: 'What are you most excited about for your future together?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'vows', label: 'What promises do you want to make publicly?', type: 'textarea', required: false },
        { id: 'thankYous', label: 'Who do you want to thank and why?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'proposalReaction', label: 'What was your honest first reaction when they proposed?', type: 'textarea', required: false }
      ]
    },
    
    // Parent of Bride/Groom
    'parent-of-bride-groom': {
      base: [
        { id: 'relationship', label: 'Are you parent of the bride or groom?', type: 'text', required: true },
        { id: 'childhoodMemory', label: 'Share a cherished childhood memory of your son/daughter', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'embarrassingStory', label: 'What embarrassing childhood story can you finally reveal?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'proudestMoment', label: 'What is your proudest moment as their parent?', type: 'textarea', required: false },
        { id: 'firstMetPartner', label: 'What did you think when you first met their partner?', type: 'textarea', required: false },
        { id: 'wishesForFuture', label: 'What are your wishes for their future together?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'valuesShared', label: 'What values did you try to instill in them?', type: 'textarea', required: false },
        { id: 'adviceForMarriage', label: 'What marriage advice from your own experience would you share?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'teenageYears', label: 'What were they like during their teenage years?', type: 'textarea', required: false }
      ]
    },
    
    // Corporate - Retirement/Farewell
    'retirement-farewell': {
      base: [
        { id: 'role', label: 'What is your role and relationship to the retiree?', type: 'text', required: true },
        { id: 'yearsService', label: 'How many years have they served, and in what capacity?', type: 'text', required: true }
      ],
      humorous: [
        { id: 'officeStory', label: 'What is the funniest office story involving them?', type: 'textarea', required: false },
        { id: 'retirementPlans', label: 'What do they plan to do in retirement (or what are you hoping they will do)?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'legacy', label: 'What legacy are they leaving behind?', type: 'textarea', required: false },
        { id: 'impactOnTeam', label: 'How did they impact the team or company?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'achievements', label: 'What are their most notable achievements?', type: 'textarea', required: true },
        { id: 'lessons', label: 'What lessons did they teach others?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'quirks', label: 'What workplace quirks or habits will we miss?', type: 'textarea', required: false }
      ]
    },
    
    // Milestone - Big Birthday
    'big-birthday-30th-50th-etc-': {
      base: [
        { id: 'relationship', label: 'What is your relationship to the birthday person?', type: 'text', required: true },
        { id: 'age', label: 'What milestone birthday are we celebrating?', type: 'text', required: true }
      ],
      humorous: [
        { id: 'ageJoke', label: 'What gentle roast about their age can we include?', type: 'textarea', required: false },
        { id: 'throughYears', label: 'How have they changed (or not changed!) through the years?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'favoriteMemory', label: 'What is your favorite memory with them?', type: 'textarea', required: false },
        { id: 'impact', label: 'What impact have they had on your life?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'achievements', label: 'What are their greatest achievements so far?', type: 'textarea', required: false },
        { id: 'wishesAhead', label: 'What are your wishes for their next chapter?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'decade', label: 'What defines their personality from the last decade?', type: 'textarea', required: false }
      ]
    },
    
    // Memorial - Eulogy
    'eulogy': {
      base: [
        { id: 'relationship', label: 'What was your relationship to the deceased?', type: 'text', required: true },
        { id: 'definingQuality', label: 'What was their most defining quality or characteristic?', type: 'textarea', required: true }
      ],
      humorous: [],
      emotional: [
        { id: 'favoriteMemory', label: 'What is your most cherished memory with them?', type: 'textarea', required: true },
        { id: 'taught', label: 'What did they teach you or others?', type: 'textarea', required: false },
        { id: 'legacy', label: 'What legacy do they leave behind?', type: 'textarea', required: true }
      ],
      serious: [
        { id: 'values', label: 'What values did they embody?', type: 'textarea', required: false },
        { id: 'impactCommunity', label: 'What impact did they have on the community?', type: 'textarea', required: false }
      ],
      banter: []
    }
  };
  
  // Map occasion types to question sets (handles variations)
  var occasionMapping = {
    'best-man': 'best-man',
    'best-woman': 'best-man',  // Same questions as best man
    'best-person': 'best-man',
    'maid-matron-of-honour': 'maid-matron-of-honour',
    'groom': 'groom',
    'bride': 'bride',
    'newlyweds': 'groom',  // Can use groom/bride questions
    'parent-of-bride-groom': 'parent-of-bride-groom',
    'bridesmaid-groomsman': 'maid-matron-of-honour',  // Similar to maid of honour
    'vow-renewal': 'groom',  // Similar to bride/groom
    'retirement-farewell': 'retirement-farewell',
    'promotion-welcome': 'retirement-farewell',  // Similar structure
    'keynote-panel': 'retirement-farewell',
    'town-hall': 'retirement-farewell',
    'product-launch-pitch': 'retirement-farewell',
    'award-acceptance': 'retirement-farewell',
    'award-presentation': 'retirement-farewell',
    'big-birthday-30th-50th-etc-': 'big-birthday-30th-50th-etc-',
    'anniversary': 'big-birthday-30th-50th-etc-',
    'graduation': 'big-birthday-30th-50th-etc-',
    'bar-bat-mitzvah': 'big-birthday-30th-50th-etc-',
    'quinceañera': 'big-birthday-30th-50th-etc-',
    'housewarming-grand-opening': 'big-birthday-30th-50th-etc-',
    'eulogy': 'eulogy',
    'celebration-of-life': 'eulogy',  // Same as eulogy
    'charity-gala-fundraiser': 'eulogy'
  };
  
  // ===========================
  // DOM Elements
  // ===========================
  
  var categorySelect = document.getElementById('category');
  var specificOccasionSelect = document.getElementById('specificOccasion');
  var dynamicQuestionsSection = document.getElementById('dynamicQuestions');
  var questionsContainer = document.getElementById('questionsContainer');
  var speechForm = document.getElementById('speechForm');
  var successMessage = document.getElementById('successMessage');
  
  // ===========================
  // Event Listeners
  // ===========================
  
  categorySelect.addEventListener('change', handleCategoryChange);
  specificOccasionSelect.addEventListener('change', handleSpecificOccasionChange);
  speechForm.addEventListener('submit', handleFormSubmit);
  
  // ===========================
  // Functions
  // ===========================
  
  function handleCategoryChange() {
    var category = categorySelect.value;
    
    // Reset specific occasion dropdown
    specificOccasionSelect.innerHTML = '<option value="">Select an occasion...</option>';
    specificOccasionSelect.disabled = !category;
    
    // Hide dynamic questions
    dynamicQuestionsSection.style.display = 'none';
    questionsContainer.innerHTML = '';
    
    if (category && occasions[category]) {
      // Populate specific occasion options
      occasions[category].types.forEach(function(type) {
        var option = document.createElement('option');
        option.value = type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        option.textContent = type;
        specificOccasionSelect.appendChild(option);
      });
    }
  }
  
  function handleSpecificOccasionChange() {
    var category = categorySelect.value;
    var specificOccasion = specificOccasionSelect.value;
    var tone = document.getElementById('tone').value;
    
    if (!category || !specificOccasion) {
      dynamicQuestionsSection.style.display = 'none';
      return;
    }
    
    // Map occasion to question set key using the mapping
    var mappedKey = occasionMapping[specificOccasion];
    var questionSet = questionSets[mappedKey];
    
    // If no specific question set, show nothing
    if (!questionSet) {
      dynamicQuestionsSection.style.display = 'none';
      console.log('No question set found for:', specificOccasion, 'mapped to:', mappedKey);
      return;
    }
    
    // Show and populate dynamic questions
    questionsContainer.innerHTML = '';
    
    // Start with base questions (always shown)
    var questionsToShow = [].concat(questionSet.base || []);
    
    // Add tone-specific questions if tone is selected
    if (tone && questionSet[tone]) {
      // Randomly select 2-3 questions from the tone-specific set to keep it manageable
      var toneQuestions = questionSet[tone];
      var numToShow = Math.min(3, toneQuestions.length);
      var selectedToneQuestions = toneQuestions.slice(0, numToShow);
      questionsToShow = questionsToShow.concat(selectedToneQuestions);
    }
    
    // Add "Subjects to steer clear from" at the end (always last, always optional)
    questionsToShow.push({
      id: 'avoidTopics',
      label: 'Subjects to steer clear from',
      type: 'textarea',
      required: false
    });
    
    // Render all questions
    questionsToShow.forEach(function(question) {
      var formGroup = document.createElement('div');
      formGroup.className = 'form-group';
      
      var label = document.createElement('label');
      label.setAttribute('for', question.id);
      label.textContent = question.label + (question.required ? ' *' : '');
      
      var input;
      if (question.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 4;
      } else {
        input = document.createElement('input');
        input.type = question.type;
      }
      
      input.id = question.id;
      input.name = question.id;
      if (question.required) {
        input.required = true;
      }
      
      formGroup.appendChild(label);
      formGroup.appendChild(input);
      questionsContainer.appendChild(formGroup);
    });
    
    dynamicQuestionsSection.style.display = 'block';
  }
  
  // Update questions when tone changes
  document.getElementById('tone').addEventListener('change', function() {
    if (specificOccasionSelect.value) {
      handleSpecificOccasionChange();
    }
  });
  
  function handleFormSubmit(e) {
    e.preventDefault();
    
    console.log('✓ Form submit handler triggered');
    
    // Collect form data
    var formData = new FormData(speechForm);
    var data = {
      timestamp: new Date().toISOString(),
      customer: {
        name: formData.get('customerName'),
        email: formData.get('customerEmail')
      },
      order: {
        package: formData.get('package'),
        tone: formData.get('tone'),
        category: formData.get('category'),
        specificOccasion: formData.get('specificOccasion')
      },
      questionnaire: {}
    };
    
    // Add all dynamic questionnaire answers from the form
    // Get all form inputs and collect their values
    var allInputs = speechForm.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
    allInputs.forEach(function(input) {
      var name = input.getAttribute('name');
      // Skip the basic form fields, only collect questionnaire answers
      if (name && !['customerName', 'customerEmail', 'package', 'tone', 'category', 'specificOccasion'].includes(name)) {
        var value = input.value;
        if (value) {
          data.questionnaire[name] = value;
        }
      }
    });
    
    console.log('Order Data:', data);
    
    // Save to localStorage as backup
    var orders = JSON.parse(localStorage.getItem('superspeech_orders') || '[]');
    orders.push(data);
    localStorage.setItem('superspeech_orders', JSON.stringify(orders));
    
    // Submit with authentication check
    if (window.submitOrderWithAuth) {
      console.log('✓ Calling submitOrderWithAuth');
      window.submitOrderWithAuth(data);
    } else {
      console.log('⚠ submitOrderWithAuth not available, using fallback');
      // Fallback if auth not loaded yet
      saveOrderToWorkspace(data);
      showSuccessMessage();
    }
  }
  
  function showSuccessMessage() {
    speechForm.style.display = 'none';
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });
    console.log('✓ Success message shown');
  }
  
  function saveOrderToWorkspace(data) {
    // Send to Netlify form (will be emailed to you)
    var formData = new FormData();
    formData.append('form-name', 'superspeech-order');
    formData.append('customer-name', data.customer.name);
    formData.append('customer-email', data.customer.email);
    formData.append('package', data.order.package);
    formData.append('tone', data.order.tone);
    formData.append('category', data.order.category);
    formData.append('specific-occasion', data.order.specificOccasion);
    formData.append('full-data', JSON.stringify(data, null, 2));
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(function() {
      console.log('Order submitted to Netlify Forms');
    })
    .catch(function(error) {
      console.error('Error submitting to Netlify:', error);
    });
    
    // Also save locally for backup
    console.log('Order data:', data);
    
    // Create downloadable JSON file
    var dataStr = JSON.stringify(data, null, 2);
    var dataBlob = new Blob([dataStr], { type: 'application/json' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'superspeech_order_' + data.timestamp.replace(/[:.]/g, '-') + '.json';
    
    // Auto-download submission for your records
    link.click();
    
    console.log('Order saved locally');
  }
  
  // ===========================
  // Pricing Card Selection
  // ===========================
  
  function initPricingCards() {
    var pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(function(card) {
      card.addEventListener('click', function() {
        // Remove selected class from all cards
        pricingCards.forEach(function(c) {
          c.classList.remove('selected');
        });
        
        // Add selected class to clicked card
        this.classList.add('selected');
        
        // Find the package value from the card
        var packageTitle = this.querySelector('h3').textContent;
        var packageSelect = document.getElementById('package');
        
        // Map title to package value
        var packageMap = {
          'The Toast': 'toast',
          'The Main Event': 'main',
          'The Keynote': 'keynote'
        };
        
        if (packageSelect && packageMap[packageTitle]) {
          packageSelect.value = packageMap[packageTitle];
        }
        
        // Scroll to order form
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }
  
  // ===========================
  // Contact Form Handler
  // ===========================
  
  function initContactForm() {
    var contactForm = document.getElementById('contactForm');
    var contactSuccess = document.getElementById('contactSuccess');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var formData = new FormData(contactForm);
      var data = {
        'form-name': 'superspeech-contact',
        'contact-name': formData.get('contactName'),
        'contact-email': formData.get('contactEmail'),
        'contact-subject': formData.get('contactSubject'),
        'contact-message': formData.get('contactMessage')
      };
      
      // Submit to Netlify
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      })
      .then(function() {
        contactForm.style.display = 'none';
        contactSuccess.style.display = 'block';
        console.log('Contact form submitted successfully');
      })
      .catch(function(error) {
        console.error('Error submitting contact form:', error);
        alert('Error sending message. Please email us directly at hello@superspeech.biz');
      });
    });
  }
  
  // ===========================
  // Smooth Scroll Enhancement
  // ===========================
  
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // ===========================
  // Initialize on DOM Ready
  // ===========================
  
  document.addEventListener('DOMContentLoaded', function() {
    initPricingCards();
    initContactForm();
  });
  
  // Expose showSuccessMessage to global scope for auth.js
  window.showSuccessMessage = showSuccessMessage;
  
})();
