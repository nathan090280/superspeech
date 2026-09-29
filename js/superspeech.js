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
    },
    
    // Wedding Guest Toast
    'wedding-guest-toast': {
      base: [
        { id: 'relationship', label: 'How do you know the couple?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'What do you most respect or admire about the couple and the relationship they have built together?', type: 'textarea', required: false },
        { id: 'q2', label: 'What moment or experience best demonstrates the strength of their relationship?', type: 'textarea', required: false },
        { id: 'q3', label: 'What qualities do they each bring to the relationship that make them such a good match?', type: 'textarea', required: false },
        { id: 'q4', label: 'How have you seen them support or influence each other over the years?', type: 'textarea', required: false },
        { id: 'q5', label: 'Is there a particular memory that captures what their relationship means to you?', type: 'textarea', required: false },
        { id: 'q6', label: 'What sincere wish or piece of advice would you like to leave them with for their married life?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'How did you first meet the couple, and what was your immediate impression of them?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the funniest story from your time knowing either of them?', type: 'textarea', required: false },
        { id: 'q3', label: 'What amusing habits, quirks or weaknesses does either of them have that their partner has somehow learned to tolerate?', type: 'textarea', required: false },
        { id: 'q4', label: 'What embarrassing or ridiculous incident involving the couple could make a great story in front of a wedding audience?', type: 'textarea', required: false },
        { id: 'q5', label: 'What is the most questionable decision either of them has made that you can safely bring up today?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could give them one piece of deliberately terrible marital advice, what would it be?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What is your most meaningful memory of either of the newlyweds?', type: 'textarea', required: false },
        { id: 'q2', label: 'When did you first realise that their relationship was something genuinely special?', type: 'textarea', required: false },
        { id: 'q3', label: 'What have you witnessed between them that has moved or inspired you?', type: 'textarea', required: false },
        { id: 'q4', label: 'How has having them in your life changed or enriched your own life?', type: 'textarea', required: false },
        { id: 'q5', label: 'Is there a particular moment that shows how deeply they care for each other?', type: 'textarea', required: false },
        { id: 'q6', label: 'What do you hope they will always remember about this time in their lives and about the love they share?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'What is the absolute worst thing you can truthfully say about either of them that will still get a laugh rather than end the marriage?', type: 'textarea', required: false },
        { id: 'q2', label: 'What ridiculous story, disaster or moment of questionable judgement involving the couple deserves to be immortalised in the speech?', type: 'textarea', required: false },
        { id: 'q3', label: 'What are their most obvious flaws, weird habits or deeply irritating personality traits — and which one is going to drive the other insane first?', type: 'textarea', required: false },
        { id: 'q4', label: 'What did you think when they first got together — and, looking back, how badly did you predict what was going to happen?', type: 'textarea', required: false },
        { id: 'q5', label: 'If their relationship came with a warning label, instruction manual or set of terms and conditions, what would it say?', type: 'textarea', required: false }
      ]
    },

    // Anniversary Party
    'anniversary-party': {
      base: [
        { id: 'relationship', label: 'How do you know the couple?', type: 'text', required: true },
        { id: 'years', label: 'How many years are they celebrating?', type: 'text', required: false }
      ],
      serious: [
        { id: 'q1', label: 'What do you admire most about the couple and the life they have built together?', type: 'textarea', required: false },
        { id: 'q2', label: 'What moment or period in their relationship best demonstrates their commitment to one another?', type: 'textarea', required: false },
        { id: 'q3', label: 'How have you seen them support each other through the different stages of their life together?', type: 'textarea', required: false },
        { id: 'q4', label: 'What qualities have helped their relationship endure and grow over the years?', type: 'textarea', required: false },
        { id: 'q5', label: 'Is there a particular memory that captures what their relationship has meant to you or to those around them?', type: 'textarea', required: false },
        { id: 'q6', label: 'What would you like to wish them for the years they still have ahead of them together?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'What do you remember about the couple when they first got together, and what has changed most since then?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the funniest story you can remember from their years together?', type: 'textarea', required: false },
        { id: 'q3', label: 'What habits or quirks have they somehow managed to put up with in each other all these years?', type: 'textarea', required: false },
        { id: 'q4', label: 'What memorable mishap, argument, holiday, celebration or disaster involving the couple could make a great story?', type: 'textarea', required: false },
        { id: 'q5', label: 'What is something they did years ago that would be completely out of character for them now?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could give them one piece of humorous advice for surviving the next chapter of their relationship, what would it be?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What is your most treasured memory of the couple or their life together?', type: 'textarea', required: false },
        { id: 'q2', label: 'Was there a particular moment when you realised just how deeply they cared for each other?', type: 'textarea', required: false },
        { id: 'q3', label: 'What have you witnessed in their relationship that has stayed with you over the years?', type: 'textarea', required: false },
        { id: 'q4', label: 'How have they influenced your life or the lives of the people around them?', type: 'textarea', required: false },
        { id: 'q5', label: 'What do you think has allowed their love and commitment to endure through the years?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could give them one message to carry with them into the next chapter of their life together, what would you say?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'After all these years, what is the funniest thing you can say about them that they absolutely cannot deny?', type: 'textarea', required: false },
        { id: 'q2', label: 'What ridiculous story from their relationship has somehow survived all these years and still deserves to be dragged out tonight?', type: 'textarea', required: false },
        { id: 'q3', label: 'Which of their habits or personality traits would have had you placing bets on the marriage not making it this far?', type: 'textarea', required: false },
        { id: 'q4', label: 'What have they argued about, disagreed over or stubbornly refused to admit defeat on that could now be safely turned into a joke?', type: 'textarea', required: false },
        { id: 'q5', label: 'If their years together were reviewed like a badly managed business, what would be their biggest success, biggest failure and most questionable decision?', type: 'textarea', required: false },
        { id: 'q6', label: 'If they had to publish an instruction manual for surviving another anniversary, what absolutely essential rule would you put on page one?', type: 'textarea', required: false }
      ]
    },

    // Company Anniversary
    'company-anniversary': {
      base: [
        { id: 'role', label: 'How long have you been with the company?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'How long have you been with the company, and what has your role or position been during that time?', type: 'textarea', required: false },
        { id: 'q2', label: 'What do you remember most clearly about the company when you first joined, and what has changed since then?', type: 'textarea', required: false },
        { id: 'q3', label: 'What achievement, milestone or period of growth stands out most to you during your time with the business?', type: 'textarea', required: false },
        { id: 'q4', label: 'What people, teams or individuals have made a particularly significant contribution to the company\'s journey?', type: 'textarea', required: false },
        { id: 'q5', label: 'What do you think is most important to recognise or celebrate about the company at this anniversary?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'How long have you worked here, what was your job when you started, and how different is your role now?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the biggest change you\'ve witnessed since joining — apart from the number of meetings?', type: 'textarea', required: false },
        { id: 'q3', label: 'What memorable mistake, mishap, office tradition or bizarre incident from your time here still gets talked about?', type: 'textarea', required: false },
        { id: 'q4', label: 'Who or what has provided the most entertainment during your time at the company?', type: 'textarea', required: false },
        { id: 'q5', label: 'If you could describe the company\'s journey so far using one ridiculous analogy, what would it be?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'How long have you been part of the company, and what has your journey through the business meant to you personally?', type: 'textarea', required: false },
        { id: 'q2', label: 'What moment during your time here made you feel particularly proud to be part of the company?', type: 'textarea', required: false },
        { id: 'q3', label: 'Which colleagues, mentors or teams have had the greatest impact on you during your time here?', type: 'textarea', required: false },
        { id: 'q4', label: 'Is there a particular challenge, achievement or period of change that brought the people in the company together?', type: 'textarea', required: false },
        { id: 'q5', label: 'When you look back at the company\'s journey, what are you most grateful to have been part of?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'How long have you been here, what did you actually do when you started, and how much of that job do you still understand?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the most ridiculous thing that has happened at the company during your time here?', type: 'textarea', required: false },
        { id: 'q3', label: 'Which colleague, department or company habit deserves the dubious honour of being the biggest source of workplace chaos?', type: 'textarea', required: false },
        { id: 'q4', label: 'What company decision, policy or change from the past makes you wonder what the people in charge were smoking?', type: 'textarea', required: false },
        { id: 'q5', label: 'If you had to give the company a brutally honest review after all these years, what would the headline be?', type: 'textarea', required: false }
      ]
    },

    // Engagement Party
    'engagement-party': {
      base: [
        { id: 'relationship', label: 'How do you know the couple?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'How did you first meet the couple, and what was your first impression of each of them?', type: 'textarea', required: false },
        { id: 'q2', label: 'When did you first realise that their relationship was becoming something serious?', type: 'textarea', required: false },
        { id: 'q3', label: 'What qualities do they each bring to the relationship that make them well suited to one another?', type: 'textarea', required: false },
        { id: 'q4', label: 'What moment or experience best demonstrates the strength of their relationship?', type: 'textarea', required: false },
        { id: 'q5', label: 'How have you seen them support or influence each other since they got together?', type: 'textarea', required: false },
        { id: 'q6', label: 'What sincere wish or piece of advice would you like to give them as they begin this next chapter together?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'How did they meet, and what did you honestly think when you first heard they were getting together?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the funniest or most ridiculous thing you\'ve witnessed since they became a couple?', type: 'textarea', required: false },
        { id: 'q3', label: 'What habit, quirk or personality trait does one of them have that the other has somehow agreed to tolerate?', type: 'textarea', required: false },
        { id: 'q4', label: 'Was there a moment when you thought, "Yep, these two are definitely going to get married"?', type: 'textarea', required: false },
        { id: 'q5', label: 'What embarrassing, awkward or questionable story about either of them can safely be told in front of both families?', type: 'textarea', required: false },
        { id: 'q6', label: 'What piece of deliberately unhelpful relationship advice would you give them before the wedding?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What is your most meaningful memory of the couple since they first got together?', type: 'textarea', required: false },
        { id: 'q2', label: 'When did you first see how deeply they cared for one another?', type: 'textarea', required: false },
        { id: 'q3', label: 'What have you witnessed in their relationship that has particularly moved or inspired you?', type: 'textarea', required: false },
        { id: 'q4', label: 'How has their relationship changed or enriched the lives of the people around them?', type: 'textarea', required: false },
        { id: 'q5', label: 'What qualities do you think will help them build a happy life together?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could give them one heartfelt message to carry with them towards their wedding and beyond, what would you say?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'How did these two actually get together, and at what point did you realise this was going to become everyone else\'s problem?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the most ridiculous thing either of them has done since they became a couple?', type: 'textarea', required: false },
        { id: 'q3', label: 'Which of their habits or personality defects makes you wonder how they have made it this far?', type: 'textarea', required: false },
        { id: 'q4', label: 'What is the most embarrassing story about either of them that is technically safe to tell now that they\'re engaged?', type: 'textarea', required: false },
        { id: 'q5', label: 'If their relationship came with a warning label, what would it say?', type: 'textarea', required: false },
        { id: 'q6', label: 'What brutally honest piece of advice would you give them before they make the catastrophic decision to get married?', type: 'textarea', required: false }
      ]
    },

    // Baby Shower
    'baby-shower': {
      base: [
        { id: 'relationship', label: 'How do you know the parents-to-be?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'What is your relationship to the parents-to-be, and how long have you known them?', type: 'textarea', required: false },
        { id: 'q2', label: 'What qualities do they each have that you think will make them good parents?', type: 'textarea', required: false },
        { id: 'q3', label: 'What moment during their journey towards becoming parents has stood out to you?', type: 'textarea', required: false },
        { id: 'q4', label: 'What have you seen in their relationship that gives you confidence in the family they are about to build?', type: 'textarea', required: false },
        { id: 'q5', label: 'Is there a particular memory or experience that you hope they will carry with them into parenthood?', type: 'textarea', required: false },
        { id: 'q6', label: 'What sincere wish would you like to make for the parents and their new baby?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'How do you know the parents-to-be, and what was your immediate reaction when you heard they were going to have a baby?', type: 'textarea', required: false },
        { id: 'q2', label: 'Which of the parents is most likely to be the organised one — and which is going to need adult supervision?', type: 'textarea', required: false },
        { id: 'q3', label: 'What funny habit, personality trait or questionable life choice do you predict their baby will have to put up with?', type: 'textarea', required: false },
        { id: 'q4', label: 'What is the funniest or most ridiculous thing either parent has done that might give us some indication of what is coming?', type: 'textarea', required: false },
        { id: 'q5', label: 'Which piece of conventional parenting advice are they least likely to follow?', type: 'textarea', required: false },
        { id: 'q6', label: 'What humorous piece of completely unsolicited advice would you give them before the baby arrives?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What is your most meaningful memory of the parents-to-be and their journey together?', type: 'textarea', required: false },
        { id: 'q2', label: 'When did you first realise how much they were looking forward to becoming parents?', type: 'textarea', required: false },
        { id: 'q3', label: 'What qualities in them make you particularly excited for this baby to join their family?', type: 'textarea', required: false },
        { id: 'q4', label: 'Is there a moment that showed you how much love they already have for their unborn child?', type: 'textarea', required: false },
        { id: 'q5', label: 'What do you hope their child will grow up knowing about the people and family who welcomed them into the world?', type: 'textarea', required: false },
        { id: 'q6', label: 'What heartfelt wish would you like to make for this new family as they begin this next chapter?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'Which parent is actually going to be in charge once the baby arrives, and what evidence do you have?', type: 'textarea', required: false },
        { id: 'q2', label: 'Who is most likely to panic at 3 a.m., and who is most likely to Google the symptoms and make everything considerably worse?', type: 'textarea', required: false },
        { id: 'q3', label: 'What existing habit, personality flaw or questionable lifestyle choice is the baby about to inherit?', type: 'textarea', required: false },
        { id: 'q4', label: 'What is the funniest thing either parent has ever done that makes you think, "Christ, they\'re responsible for a child now"?', type: 'textarea', required: false },
        { id: 'q5', label: 'If the baby could read the parents\' history before being born, what would they immediately have questions about?', type: 'textarea', required: false },
        { id: 'q6', label: 'What brutally honest piece of advice would you give the parents before they discover that absolutely nobody knows what they\'re doing?', type: 'textarea', required: false }
      ]
    },

    // Retirement Party
    'retirement-party': {
      base: [
        { id: 'relationship', label: 'How do you know the retiree?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'What is your relationship to the retiree, and how long have you known or worked with them?', type: 'textarea', required: false },
        { id: 'q2', label: 'What has their role or contribution to the organisation meant to you and those around them?', type: 'textarea', required: false },
        { id: 'q3', label: 'What achievement, project or period during their career stands out as particularly significant?', type: 'textarea', required: false },
        { id: 'q4', label: 'What qualities have made them such a valued colleague, leader, mentor or friend?', type: 'textarea', required: false },
        { id: 'q5', label: 'Is there a particular moment from their career that you think deserves to be remembered and celebrated?', type: 'textarea', required: false },
        { id: 'q6', label: 'What would you like to wish them as they begin this next chapter of their life?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'How long have you known or worked with the retiree, and what was your first impression of them?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the funniest, strangest or most memorable thing that happened during their working life?', type: 'textarea', required: false },
        { id: 'q3', label: 'What workplace habit or personality trait are everyone going to miss — or finally be relieved to escape?', type: 'textarea', required: false },
        { id: 'q4', label: 'What is the most questionable decision, mishap or piece of advice from their career that can safely be mentioned tonight?', type: 'textarea', required: false },
        { id: 'q5', label: 'What do you think they will actually do with all their newfound free time?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could give them one piece of humorous advice for surviving retirement, what would it be?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What is your relationship with the retiree, and what has knowing or working with them meant to you personally?', type: 'textarea', required: false },
        { id: 'q2', label: 'What moment or experience from their career has stayed with you most strongly?', type: 'textarea', required: false },
        { id: 'q3', label: 'How have they made a difference to the people they have worked with or the organisation they have been part of?', type: 'textarea', required: false },
        { id: 'q4', label: 'Is there a particular quality, kindness or act of support from them that you will always remember?', type: 'textarea', required: false },
        { id: 'q5', label: 'What do you think their colleagues, friends or family will miss most about having them around?', type: 'textarea', required: false },
        { id: 'q6', label: 'What heartfelt wish would you like to give them as they leave working life behind and begin their next chapter?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'How long have you known or worked with them, and how much of their actual job do you think they have been successfully avoiding all these years?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the funniest incident, workplace disaster or spectacular bit of nonsense from their career that absolutely has to be mentioned tonight?', type: 'textarea', required: false },
        { id: 'q3', label: 'What annoying habit or workplace behaviour are you secretly delighted you will never have to deal with again?', type: 'textarea', required: false },
        { id: 'q4', label: 'What is the most suspiciously convenient excuse they have ever used to get out of doing something at work?', type: 'textarea', required: false },
        { id: 'q5', label: 'What do you reckon they will actually do with retirement — and how long before they start annoying everyone at home?', type: 'textarea', required: false },
        { id: 'q6', label: 'If retirement came with an employee exit interview, what would their final review say?', type: 'textarea', required: false }
      ]
    },

    // Achievement Celebration
    'achievement-celebration': {
      base: [
        { id: 'achievement', label: 'What achievement are we celebrating?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'What is the achievement being celebrated, and what exactly did you accomplish?', type: 'textarea', required: false },
        { id: 'q2', label: 'What motivated you to pursue this achievement, and why was it important to you?', type: 'textarea', required: false },
        { id: 'q3', label: 'What were the biggest challenges, obstacles or setbacks you had to overcome along the way?', type: 'textarea', required: false },
        { id: 'q4', label: 'Who helped, supported or encouraged you during the journey, and what did their support mean to you?', type: 'textarea', required: false },
        { id: 'q5', label: 'What does achieving this milestone mean to you personally, professionally or to those around you?', type: 'textarea', required: false },
        { id: 'q6', label: 'What would you like people to take away from your achievement, and what are you hoping to do next?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'What exactly have you achieved, and how much of it was skill, determination and sheer luck?', type: 'textarea', required: false },
        { id: 'q2', label: 'What was the funniest, strangest or most unexpected thing that happened while you were trying to achieve it?', type: 'textarea', required: false },
        { id: 'q3', label: 'What went wrong along the way, and which disaster are you now able to laugh about?', type: 'textarea', required: false },
        { id: 'q4', label: 'Who deserves credit for helping you get there — and who made the whole process considerably harder than it needed to be?', type: 'textarea', required: false },
        { id: 'q5', label: 'At what point did you think, "Bloody hell, I might actually pull this off"?', type: 'textarea', required: false },
        { id: 'q6', label: 'Now that you\'ve achieved it, what completely unnecessary or ridiculous thing are you going to do next?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What is the achievement being celebrated, and what does reaching this milestone mean to you?', type: 'textarea', required: false },
        { id: 'q2', label: 'What personal journey, sacrifice or determination lies behind the achievement that people may not have seen?', type: 'textarea', required: false },
        { id: 'q3', label: 'Was there a particular moment when you nearly gave up, or when you realised you were going to succeed?', type: 'textarea', required: false },
        { id: 'q4', label: 'Who has supported you along the way, and what would you like them to know about the part they played?', type: 'textarea', required: false },
        { id: 'q5', label: 'How has achieving this changed the way you see yourself, your future or what you are capable of?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could look back at yourself before you began and say one thing, what would you want to tell that person?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'What exactly have you achieved, and let\'s be honest — how surprised are you that you actually managed it?', type: 'textarea', required: false },
        { id: 'q2', label: 'What went spectacularly wrong on the way there, and what story absolutely has to be told tonight?', type: 'textarea', required: false },
        { id: 'q3', label: 'Who helped you achieve it, and who should probably receive some sort of formal apology for having to put up with you?', type: 'textarea', required: false },
        { id: 'q4', label: 'What was your lowest point during the process, and how close were you to saying, "Fuck this, I\'m off"?', type: 'textarea', required: false },
        { id: 'q5', label: 'What is the most ridiculous thing you did in pursuit of this achievement that, in hindsight, probably wasn\'t necessary?', type: 'textarea', required: false },
        { id: 'q6', label: 'Now that you\'ve reached the summit, what is the next completely unnecessary challenge you\'re likely to set yourself?', type: 'textarea', required: false }
      ]
    },

    // Celebration of Life
    'celebration-of-life': {
      base: [
        { id: 'relationship', label: 'What was your relationship to the deceased?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'What was your relationship to the deceased, and how long did you know them?', type: 'textarea', required: false },
        { id: 'q2', label: 'What qualities, values or characteristics best defined them as a person?', type: 'textarea', required: false },
        { id: 'q3', label: 'What achievement, contribution or aspect of their life are you most proud to remember?', type: 'textarea', required: false },
        { id: 'q4', label: 'What memory best captures the person they were and the life they lived?', type: 'textarea', required: false },
        { id: 'q5', label: 'What impact did they have on the people, family, community or world around them?', type: 'textarea', required: false },
        { id: 'q6', label: 'What would you most like everyone here to remember and carry forward about them?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'What was your relationship to the deceased, and how long did you have the pleasure — or misfortune — of knowing them?', type: 'textarea', required: false },
        { id: 'q2', label: 'What funny habit, quirk or personality trait made them unmistakably themselves?', type: 'textarea', required: false },
        { id: 'q3', label: 'What is the funniest story about them that would have everyone who knew them saying, "That sounds exactly like them"?', type: 'textarea', required: false },
        { id: 'q4', label: 'What memorable mishap, eccentricity or questionable decision perfectly sums up their character?', type: 'textarea', required: false },
        { id: 'q5', label: 'What phrase, saying, joke or bit of behaviour were they particularly known for?', type: 'textarea', required: false },
        { id: 'q6', label: 'If they were here today, what part of this speech would they probably interrupt, correct or take the piss out of you for?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What was your relationship to the deceased, and what did they mean to you personally?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the memory of them that you treasure most?', type: 'textarea', required: false },
        { id: 'q3', label: 'What quality, kindness or part of their character made such a lasting impression on you?', type: 'textarea', required: false },
        { id: 'q4', label: 'Can you describe a moment when they made you — or someone else — feel particularly loved, supported or valued?', type: 'textarea', required: false },
        { id: 'q5', label: 'What did they bring to the lives of their family, friends and the people around them that you hope will never be forgotten?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could celebrate one thing about the life they lived, what would you choose and why?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'What was your relationship to the deceased, and what sort of trouble did you regularly find yourselves getting into together?', type: 'textarea', required: false },
        { id: 'q2', label: 'What was their most ridiculous habit, obsession or personality trait that everyone who knew them will immediately recognise?', type: 'textarea', required: false },
        { id: 'q3', label: 'What story about them is so ridiculous that it could only possibly be true?', type: 'textarea', required: false },
        { id: 'q4', label: 'What completely unnecessary argument, eccentric opinion or hill were they prepared to die on?', type: 'textarea', required: false },
        { id: 'q5', label: 'What piece of classic behaviour from them would have everyone in the room saying, "Oh God, I remember that"?', type: 'textarea', required: false },
        { id: 'q6', label: 'If they could magically appear for five minutes during this celebration, what would they immediately take the piss out of?', type: 'textarea', required: false }
      ]
    },

    // Charity Gala/Fundraiser
    'charity-gala-fundraiser': {
      base: [
        { id: 'charity', label: 'What charity or cause are we supporting?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'What charity, cause or organisation is the event supporting, and what is your connection to it?', type: 'textarea', required: false },
        { id: 'q2', label: 'Why is this cause important to you, the organisation or the people you are here to support?', type: 'textarea', required: false },
        { id: 'q3', label: 'What difference does the charity\'s work make, and is there a particular example that demonstrates its impact?', type: 'textarea', required: false },
        { id: 'q4', label: 'What achievement, milestone or progress has the organisation made that deserves recognition tonight?', type: 'textarea', required: false },
        { id: 'q5', label: 'Who deserves particular thanks for their work, support, fundraising or contribution to the cause?', type: 'textarea', required: false },
        { id: 'q6', label: 'What would you like guests to take away from tonight and feel inspired to contribute towards?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'What charity, cause or organisation are we raising money for, and how did you become involved with it?', type: 'textarea', required: false },
        { id: 'q2', label: 'What funny, unexpected or slightly chaotic thing has happened while supporting the cause?', type: 'textarea', required: false },
        { id: 'q3', label: 'What is the most ridiculous fundraising idea, challenge or event you\'ve encountered — and did it actually work?', type: 'textarea', required: false },
        { id: 'q4', label: 'Who involved with the charity deserves a gentle public roasting for their particular contribution, habit or fundraising obsession?', type: 'textarea', required: false },
        { id: 'q5', label: 'What is the strangest thing you have done, worn, eaten, endured or persuaded other people to do in the name of raising money?', type: 'textarea', required: false },
        { id: 'q6', label: 'What can you say tonight that might persuade people to part with their money while still keeping a smile on their faces?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What charity, cause or organisation are we supporting, and what is your personal connection to it?', type: 'textarea', required: false },
        { id: 'q2', label: 'What personal experience first made this cause important to you?', type: 'textarea', required: false },
        { id: 'q3', label: 'Can you share a story that shows the real difference this charity makes to someone\'s life?', type: 'textarea', required: false },
        { id: 'q4', label: 'Who has inspired you through their connection to the cause, and what have they taught you?', type: 'textarea', required: false },
        { id: 'q5', label: 'What does the support of everyone in this room mean to the people or communities the charity serves?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could leave everyone tonight with one heartfelt reason to support this cause, what would you want them to remember?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'What exactly are we raising money for, and how on earth did you end up getting involved?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the most ridiculous thing you\'ve done in the name of fundraising — and would you willingly do it again?', type: 'textarea', required: false },
        { id: 'q3', label: 'What fundraising challenge, event or idea sounded absolutely terrible when suggested but somehow became a success?', type: 'textarea', required: false },
        { id: 'q4', label: 'Who deserves to be publicly mocked tonight for their heroic, ridiculous or slightly obsessive approach to raising money?', type: 'textarea', required: false },
        { id: 'q5', label: 'What is the strangest donation, fundraising stunt or attempt to extract money from innocent members of the public you\'ve encountered?', type: 'textarea', required: false },
        { id: 'q6', label: 'If everyone\'s wallets could hear one final argument before tonight\'s donations, what would you say to them?', type: 'textarea', required: false }
      ]
    },

    // Tribute to Mentor
    'tribute-to-mentor': {
      base: [
        { id: 'mentor', label: 'Who is the mentor you are paying tribute to?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'What area, subject or stage of your life or career did this person mentor you in, and what was the nature of your relationship?', type: 'textarea', required: false },
        { id: 'q2', label: 'What knowledge, experience or guidance did they give you that had the greatest impact?', type: 'textarea', required: false },
        { id: 'q3', label: 'Was there a particular piece of advice or lesson from them that has stayed with you?', type: 'textarea', required: false },
        { id: 'q4', label: 'How did their mentorship influence your development, confidence or direction?', type: 'textarea', required: false },
        { id: 'q5', label: 'What qualities made them such an effective or respected mentor?', type: 'textarea', required: false },
        { id: 'q6', label: 'What would you most like to thank them for, and what do you hope to carry forward from their influence?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'What did they mentor you in, and how did you first end up under their guidance?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the funniest lesson, piece of advice or memorable exchange you had with them?', type: 'textarea', required: false },
        { id: 'q3', label: 'What habit, phrase or particular way of doing things did they repeatedly try to drum into you?', type: 'textarea', required: false },
        { id: 'q4', label: 'What mistake did you have to watch you make before you finally listened to them?', type: 'textarea', required: false },
        { id: 'q5', label: 'What amusing personality trait or mentoring habit made them unmistakably themselves?', type: 'textarea', required: false },
        { id: 'q6', label: 'If they could give you one final piece of advice today, what would it probably be — and would you actually listen this time?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What did they mentor you in, and how did they come to play such an important role in your life?', type: 'textarea', required: false },
        { id: 'q2', label: 'What did they see in you that perhaps you did not yet see in yourself?', type: 'textarea', required: false },
        { id: 'q3', label: 'Is there a particular lesson, conversation or moment with them that fundamentally changed your direction?', type: 'textarea', required: false },
        { id: 'q4', label: 'How did their support affect your confidence, ambitions or belief in what you could achieve?', type: 'textarea', required: false },
        { id: 'q5', label: 'What part of their character or wisdom has stayed with you long after their guidance was needed?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could tell them what their mentorship ultimately meant to you, what would you want them to know?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'What did they actually mentor you in, and how did you end up becoming their problem?', type: 'textarea', required: false },
        { id: 'q2', label: 'What is the most memorable piece of advice they gave you — whether you followed it or spectacularly ignored it?', type: 'textarea', required: false },
        { id: 'q3', label: 'What mistake did you repeatedly make despite them telling you not to, and how long did it take before you finally admitted they were right?', type: 'textarea', required: false },
        { id: 'q4', label: 'What ridiculous phrase, rule, habit or bit of wisdom did they inflict upon you so often that you can still hear them saying it?', type: 'textarea', required: false },
        { id: 'q5', label: 'What is the funniest thing that happened between you while they were attempting to turn you into a competent human being?', type: 'textarea', required: false },
        { id: 'q6', label: 'If they had to write your final report as their mentee, what brutally honest comment would they put at the bottom?', type: 'textarea', required: false }
      ]
    },

    // Thank You Speech
    'thank-you-speech': {
      base: [
        { id: 'recipient', label: 'Who are you thanking?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'Who are you thanking, and what specifically are you thanking them for?', type: 'textarea', required: false },
        { id: 'q2', label: 'What did they do, contribute or provide that made a meaningful difference to you?', type: 'textarea', required: false },
        { id: 'q3', label: 'Was there a particular moment when their help or support was especially important?', type: 'textarea', required: false },
        { id: 'q4', label: 'What qualities or actions of theirs do you particularly appreciate?', type: 'textarea', required: false },
        { id: 'q5', label: 'How has their support affected you, your situation or the outcome you are celebrating?', type: 'textarea', required: false },
        { id: 'q6', label: 'What would you most like them to know about how genuinely grateful you are?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'Who are you thanking, what did they do for you, and how did you somehow end up needing their help in the first place?', type: 'textarea', required: false },
        { id: 'q2', label: 'What funny, unexpected or slightly chaotic thing happened along the way?', type: 'textarea', required: false },
        { id: 'q3', label: 'Did they have to put up with any of your bad decisions, incompetence or questionable behaviour while helping you?', type: 'textarea', required: false },
        { id: 'q4', label: 'What amusing quality, habit or characteristic of theirs deserves a mention?', type: 'textarea', required: false },
        { id: 'q5', label: 'Is there a particular moment when their help saved the day — or at least stopped things getting considerably worse?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you had to thank them in the most entertaining way possible, what would you absolutely have to mention?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'Who are you thanking, why are you thanking them, and what do they mean to you personally?', type: 'textarea', required: false },
        { id: 'q2', label: 'What did they do for you at a time when you genuinely needed their support?', type: 'textarea', required: false },
        { id: 'q3', label: 'Is there a particular moment of kindness, generosity or encouragement that you will never forget?', type: 'textarea', required: false },
        { id: 'q4', label: 'How did their actions affect you or change your circumstances?', type: 'textarea', required: false },
        { id: 'q5', label: 'What is it about this person that makes their support particularly meaningful to you?', type: 'textarea', required: false },
        { id: 'q6', label: 'If you could make sure they understood just one thing about how much their support meant to you, what would you say?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'Who are you thanking, why do they deserve your thanks, and what exactly did they get themselves involved in?', type: 'textarea', required: false },
        { id: 'q2', label: 'What ridiculous situation did they have to endure while helping you?', type: 'textarea', required: false },
        { id: 'q3', label: 'What did they have to put up with from you that probably deserves an apology alongside the thank-you?', type: 'textarea', required: false },
        { id: 'q4', label: 'What funny habit, personality trait or moment from them absolutely has to be included?', type: 'textarea', required: false },
        { id: 'q5', label: 'What is the most entertaining example of them saving your arse, despite probably wondering why they bothered?', type: 'textarea', required: false },
        { id: 'q6', label: 'If this thank-you came with an award, what completely inappropriate award would you give them?', type: 'textarea', required: false }
      ]
    },

    // Legacy Event
    'legacy-event': {
      base: [
        { id: 'legacy', label: 'What legacy is being celebrated?', type: 'text', required: true }
      ],
      serious: [
        { id: 'q1', label: 'What is the legacy being recognised or celebrated, and what is the occasion?', type: 'textarea', required: false },
        { id: 'q2', label: 'Who or what is at the heart of that legacy, and what have they achieved or contributed?', type: 'textarea', required: false },
        { id: 'q3', label: 'What aspect of this legacy do you think is most significant?', type: 'textarea', required: false },
        { id: 'q4', label: 'Is there a particular achievement, story or moment that best represents what is being celebrated?', type: 'textarea', required: false },
        { id: 'q5', label: 'How has this person, group, organisation, idea or achievement affected the people around it?', type: 'textarea', required: false },
        { id: 'q6', label: 'What do you hope will continue or endure as a result of this legacy?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'q1', label: 'What exactly are we here to celebrate, and how did this whole legacy come about?', type: 'textarea', required: false },
        { id: 'q2', label: 'Who or what is responsible for the legacy, and what is the funniest thing you remember about them or it?', type: 'textarea', required: false },
        { id: 'q3', label: 'What story, incident or memorable moment best sums up what we\'re celebrating?', type: 'textarea', required: false },
        { id: 'q4', label: 'What unusual habit, tradition, personality trait or bit of history has become part of the legacy?', type: 'textarea', required: false },
        { id: 'q5', label: 'What would probably surprise people most about how this legacy came about?', type: 'textarea', required: false },
        { id: 'q6', label: 'If the legacy could be summed up in one amusing story, what would you tell?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'q1', label: 'What are we here to celebrate, and what does this legacy mean to you personally?', type: 'textarea', required: false },
        { id: 'q2', label: 'Who or what has had the greatest influence on the legacy, and why has that influence mattered?', type: 'textarea', required: false },
        { id: 'q3', label: 'Is there a particular memory or moment that captures what this legacy means to you?', type: 'textarea', required: false },
        { id: 'q4', label: 'How has this person, group, organisation, achievement or idea changed the lives of others?', type: 'textarea', required: false },
        { id: 'q5', label: 'What part of the legacy do you hope will never be forgotten?', type: 'textarea', required: false },
        { id: 'q6', label: 'What would you most like people to carry forward from what we are celebrating today?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'q1', label: 'What exactly are we celebrating, and how the hell did it become a legacy?', type: 'textarea', required: false },
        { id: 'q2', label: 'Who or what is responsible for it, and what is the most ridiculous thing associated with them or it?', type: 'textarea', required: false },
        { id: 'q3', label: 'What story best demonstrates the sheer nonsense, chaos or questionable decisions behind this legacy?', type: 'textarea', required: false },
        { id: 'q4', label: 'What bizarre habit, tradition, incident or achievement has somehow survived long enough to become part of the history?', type: 'textarea', required: false },
        { id: 'q5', label: 'What would the people responsible for this legacy absolutely not want mentioned tonight?', type: 'textarea', required: false },
        { id: 'q6', label: 'If this legacy had to be remembered for one completely ridiculous thing, what should it be?', type: 'textarea', required: false }
      ]
    },
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
    'wedding-guest-toast': 'wedding-guest-toast',
    'anniversary-party': 'anniversary-party',
    'engagement-party': 'engagement-party',
    'rehearsal-dinner': 'wedding-guest-toast',  // Similar to wedding guest toast
    'sibling-of-bride-groom': 'best-man',  // Similar to best man
    'retirement-farewell': 'retirement-farewell',
    'retirement-party': 'retirement-party',
    'promotion-welcome': 'retirement-farewell',  // Similar structure
    'keynote-panel': 'retirement-farewell',
    'town-hall': 'retirement-farewell',
    'product-launch-pitch': 'retirement-farewell',
    'award-acceptance': 'retirement-farewell',
    'award-presentation': 'retirement-farewell',
    'team-building-event': 'retirement-farewell',
    'sales-conference': 'retirement-farewell',
    'leadership-summit': 'retirement-farewell',
    'company-anniversary': 'company-anniversary',
    'training-workshop-introduction': 'retirement-farewell',
    'big-birthday-30th-50th-etc-': 'big-birthday-30th-50th-etc-',
    'anniversary': 'anniversary-party',  // Use anniversary-party questions
    'graduation': 'big-birthday-30th-50th-etc-',
    'bar-bat-mitzvah': 'big-birthday-30th-50th-etc-',
    'quinceañera': 'big-birthday-30th-50th-etc-',
    'housewarming-grand-opening': 'big-birthday-30th-50th-etc-',
    'engagement-party': 'engagement-party',
    'baby-shower': 'baby-shower',
    'new-baby-announcement': 'baby-shower',  // Similar to baby shower
    'school-reunion': 'big-birthday-30th-50th-etc-',
    'achievement-celebration': 'achievement-celebration',
    'eulogy': 'eulogy',
    'celebration-of-life': 'celebration-of-life',
    'charity-gala-fundraiser': 'charity-gala-fundraiser',
    'tribute-to-mentor': 'tribute-to-mentor',
    'thank-you-speech': 'thank-you-speech',
    'legacy-event': 'legacy-event'
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
      
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      var formData = new FormData(contactForm);
      
      // Get current user if logged in
      var currentUser = window.netlifyIdentity && window.netlifyIdentity.currentUser ? window.netlifyIdentity.currentUser() : null;
      
      var data = {
        name: formData.get('contactName'),
        email: formData.get('contactEmail'),
        subject: formData.get('contactSubject'),
        message: formData.get('contactMessage'),
        userId: currentUser ? currentUser.id : null
      };
      
      // Submit to backend API
      fetch('https://superspeech-backend.onrender.com/api/webhooks/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        contactForm.reset();
        contactForm.style.display = 'none';
        contactSuccess.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        console.log('Contact form submitted successfully');
        
        // Show AI reply in success message
        if (result.reply) {
          var replyDiv = document.createElement('div');
          replyDiv.style.marginTop = '15px';
          replyDiv.style.padding = '15px';
          replyDiv.style.background = '#f0f7ff';
          replyDiv.style.borderRadius = '8px';
          replyDiv.innerHTML = '<strong>Our response:</strong><br/>' + result.reply.replace(/\n/g, '<br/>');
          contactSuccess.appendChild(replyDiv);
        }
      })
      .catch(function(error) {
        console.error('Error submitting contact form:', error);
        alert('Error sending message. Please email us directly at hello@superspeech.biz');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
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
