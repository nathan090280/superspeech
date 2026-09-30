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
        'Maid/Matron of Honour',
        'Groom',
        'Bride',
        'Parent of Bride/Groom',
        'Wedding Guest Toast',
        'Vow Renewal',
        'Anniversary Party'
      ]
    },
    corporate: {
      name: 'Corporate & Professional',
      types: [
        'Retirement/Farewell',
        'Promotion/Welcome',
        'Keynote/Panel',
        'Award Acceptance',
        'Award Presentation',
        'Company Anniversary'
      ]
    },
    milestone: {
      name: 'Milestone Celebrations',
      types: [
        'Big Birthday (30th, 50th etc.)',
        'Graduation',
        'Bar/Bat Mitzvah',
        'Engagement Party',
        'Baby Shower',
        'Retirement Party',
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
        { id: 'firstMet', label: 'What was the groom/bride like when you first met them?', type: 'textarea', required: true },
        { id: 'memorableAdventure', label: 'What was the most memorable adventure or experience you shared?', type: 'textarea', required: false },
        { id: 'theirBestQuality', label: 'What quality about them do you admire most?', type: 'text', required: false }
      ],
      humorous: [
        { id: 'embarrassingPhase', label: 'What was their most embarrassing fashion phase, haircut, or hobby?', type: 'textarea', required: false },
        { id: 'arrestedFor', label: 'If they were arrested, what would it most likely be for?', type: 'text', required: false },
        { id: 'terribleAt', label: 'What is something they are surprisingly terrible at?', type: 'text', required: false },
        { id: 'legendaryMishap', label: 'What\'s the most legendary mishap or blunder they\'ve had?', type: 'textarea', required: false },
        { id: 'funnyNickname', label: 'What\'s a funny nickname or inside joke you have about them?', type: 'text', required: false }
      ],
      emotional: [
        { id: 'firstMentioned', label: 'When did they first mention their partner to you, and what did they say?', type: 'textarea', required: false },
        { id: 'realizedTheOne', label: 'When did you realize this relationship was "the one" for them?', type: 'textarea', required: false },
        { id: 'changedForBetter', label: 'How have they changed for the better since meeting their partner?', type: 'textarea', required: false },
        { id: 'whatPartnerBringsOut', label: 'What does their partner bring out in them that you love to see?', type: 'textarea', required: false },
        { id: 'yourHope', label: 'What is your deepest hope for their future together?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'definingQuality', label: 'What is the one quality that defines them as a person?', type: 'text', required: false },
        { id: 'coupleAsTeam', label: 'What is your favorite quality about the couple as a team?', type: 'textarea', required: false },
        { id: 'marriageAdvice', label: 'What is your number one piece of marriage advice for them?', type: 'textarea', required: false },
        { id: 'lifeLessons', label: 'What life lessons have you learned from knowing them?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'childhoodStory', label: 'What childhood or college story perfectly sums up their personality?', type: 'textarea', required: false },
        { id: 'ridiculousHabit', label: 'What is their most ridiculous or endearing habit?', type: 'text', required: false },
        { id: 'proposalDetails', label: 'Any behind-the-scenes details about how they planned the proposal?', type: 'textarea', required: false },
        { id: 'competitiveStory', label: 'What\'s the funniest competitive moment you\'ve had with them?', type: 'textarea', required: false },
        { id: 'almostDisaster', label: 'When did they almost get themselves into serious trouble (but didn\'t)?', type: 'textarea', required: false }
      ]
    },
    
    // Maid/Matron of Honour
    'maid-matron-of-honour': {
      base: [
        { id: 'relationship', label: 'What is your relationship to the bride/groom?', type: 'text', required: true },
        { id: 'friendship', label: 'How did your friendship begin?', type: 'textarea', required: true },
        { id: 'favoriteTogether', label: 'What\'s your favorite thing to do together?', type: 'text', required: false },
        { id: 'whenTheyNeedYou', label: 'When do they come to you and why?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'shoppingDisaster', label: 'What was the funniest disaster during wedding planning or dress shopping?', type: 'textarea', required: false },
        { id: 'datingHistory', label: 'Any funny stories about their dating history before meeting "the one"?', type: 'textarea', required: false },
        { id: 'questionableDecision', label: 'What\'s the most questionable decision they\'ve made that you supported anyway?', type: 'textarea', required: false },
        { id: 'hiddenTalent', label: 'What\'s a hidden talent or quirk that surprises people?', type: 'text', required: false }
      ],
      emotional: [
        { id: 'firstImpressionPartner', label: 'What was your first impression of their partner?', type: 'textarea', required: false },
        { id: 'perfectMatch', label: 'What makes them a perfect match?', type: 'textarea', required: false },
        { id: 'growthTogether', label: 'How have you seen them grow together as a couple?', type: 'textarea', required: false },
        { id: 'witnessedLove', label: 'When did you witness a moment that showed how deep their love is?', type: 'textarea', required: false },
        { id: 'wishForThem', label: 'What do you wish for them in their marriage?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'admirableQuality', label: 'What quality do you most admire in them?', type: 'text', required: false },
        { id: 'relationshipAdvice', label: 'What advice would you give them for a lasting marriage?', type: 'textarea', required: false },
        { id: 'whatTheyTaughtYou', label: 'What has their relationship taught you about love?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'secretKeeper', label: 'What secret have they sworn you to keep (that you can now reveal)?', type: 'textarea', required: false },
        { id: 'worstBoyfriend', label: 'Can you roast one of their terrible ex-boyfriends/girlfriends?', type: 'textarea', required: false },
        { id: 'crazyNight', label: 'What\'s the craziest night out you\'ve had together?', type: 'textarea', required: false },
        { id: 'theyOweYou', label: 'When did you save them from disaster (and they owe you for it)?', type: 'textarea', required: false }
      ]
    },
    
    // Groom Speech
    'groom': {
      base: [
        { id: 'howMet', label: 'How did you and your partner meet?', type: 'textarea', required: true },
        { id: 'knewSheWasOne', label: 'When did you know they were "the one"?', type: 'textarea', required: true },
        { id: 'whatLoveAbout', label: 'What do you love most about your partner?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'firstDateDisaster', label: 'Any funny first date disasters or mishaps?', type: 'textarea', required: false },
        { id: 'inLawsStory', label: 'Funny story about winning over the in-laws?', type: 'textarea', required: false },
        { id: 'embarrassingMoment', label: 'What\'s the most embarrassing thing you\'ve done in front of them?', type: 'textarea', required: false },
        { id: 'theyRollEyes', label: 'What do you do that makes them roll their eyes?', type: 'text', required: false }
      ],
      emotional: [
        { id: 'favoriteMemory', label: 'What is your favorite memory together?', type: 'textarea', required: false },
        { id: 'gratefulFor', label: 'What are you most grateful for about your partner?', type: 'textarea', required: false },
        { id: 'futureVision', label: 'What are you most excited about for your future together?', type: 'textarea', required: false },
        { id: 'howTheyChanged', label: 'How have they made you a better person?', type: 'textarea', required: false },
        { id: 'momentFellDeeper', label: 'When did you fall even deeper in love with them?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'vows', label: 'What promises do you want to make publicly?', type: 'textarea', required: false },
        { id: 'thankYous', label: 'Who do you want to thank and why?', type: 'textarea', required: false },
        { id: 'whatMarriageMeans', label: 'What does marriage mean to you?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'nervousStory', label: 'What were you most nervous about before proposing?', type: 'textarea', required: false },
        { id: 'almostBlew', label: 'When did you almost blow the surprise of the proposal?', type: 'textarea', required: false },
        { id: 'friendsReaction', label: 'What did your friends say when you told them you were getting married?', type: 'textarea', required: false }
      ]
    },
    
    // Bride Speech (same structure as groom)
    'bride': {
      base: [
        { id: 'howMet', label: 'How did you and your partner meet?', type: 'textarea', required: true },
        { id: 'knewHeWasOne', label: 'When did you know they were "the one"?', type: 'textarea', required: true },
        { id: 'whatLoveAbout', label: 'What do you love most about your partner?', type: 'textarea', required: false }
      ],
      humorous: [
        { id: 'firstDateDisaster', label: 'Any funny first date disasters or mishaps?', type: 'textarea', required: false },
        { id: 'inLawsStory', label: 'Funny story about winning over the in-laws?', type: 'textarea', required: false },
        { id: 'embarrassingMoment', label: 'What\'s the most embarrassing thing you\'ve done in front of them?', type: 'textarea', required: false },
        { id: 'theyRollEyes', label: 'What do you do that makes them roll their eyes?', type: 'text', required: false }
      ],
      emotional: [
        { id: 'favoriteMemory', label: 'What is your favorite memory together?', type: 'textarea', required: false },
        { id: 'gratefulFor', label: 'What are you most grateful for about your partner?', type: 'textarea', required: false },
        { id: 'futureVision', label: 'What are you most excited about for your future together?', type: 'textarea', required: false },
        { id: 'howTheyChanged', label: 'How have they made you a better person?', type: 'textarea', required: false },
        { id: 'momentFellDeeper', label: 'When did you fall even deeper in love with them?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'vows', label: 'What promises do you want to make publicly?', type: 'textarea', required: false },
        { id: 'thankYous', label: 'Who do you want to thank and why?', type: 'textarea', required: false },
        { id: 'whatMarriageMeans', label: 'What does marriage mean to you?', type: 'textarea', required: false }
      ],
      banter: [
        { id: 'proposalReaction', label: 'What was your honest first reaction when they proposed?', type: 'textarea', required: false },
        { id: 'friendsReaction', label: 'What did your friends say when you told them you were getting married?', type: 'textarea', required: false },
        { id: 'planningStress', label: 'What\'s been the most stressful (or hilarious) part of wedding planning?', type: 'textarea', required: false }
      ]
    },
    
    // Parent of Bride/Groom
    'parent-of-bride-groom': {
      base: [
        { id: 'relationship', label: 'Are you the mother or father of the bride or groom?', type: 'select', options: ['Mother of Bride', 'Father of Bride', 'Mother of Groom', 'Father of Groom'], required: true },
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
    
    // Wedding Guest Toast
    'wedding-guest-toast': {
      base: [
        { id: 'relationshipToCouple', label: 'How do you know the couple?', type: 'text', required: true }
      ],
      serious: [
        { id: 'respectAdmire', label: 'What do you most respect or admire about the couple and the relationship they have built together?', type: 'textarea', required: true },
        { id: 'relationshipStrength', label: 'What moment or experience best demonstrates the strength of their relationship?', type: 'textarea', required: true },
        { id: 'qualitiesMatch', label: 'What qualities do they each bring to the relationship that make them such a good match?', type: 'textarea', required: true },
        { id: 'supportInfluence', label: 'How have you seen them support or influence each other over the years?', type: 'textarea', required: true },
        { id: 'meaningfulMemory', label: 'Is there a particular memory that captures what their relationship means to you?', type: 'textarea', required: true },
        { id: 'sincereWish', label: 'What sincere wish or piece of advice would you like to leave them with for their married life?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'firstMeetImpression', label: 'How did you first meet the couple, and what was your immediate impression of them?', type: 'textarea', required: true },
        { id: 'funniestStory', label: 'What is the funniest story from your time knowing either of them?', type: 'textarea', required: true },
        { id: 'quirksHabits', label: 'What amusing habits, quirks or weaknesses does either of them have that their partner has somehow learned to tolerate?', type: 'textarea', required: true },
        { id: 'embarrassingIncident', label: 'What embarrassing or ridiculous incident involving the couple could make a great story in front of a wedding audience?', type: 'textarea', required: true },
        { id: 'questionableDecision', label: 'What is the most questionable decision either of them has made that you can safely bring up today?', type: 'textarea', required: true },
        { id: 'terribleAdvice', label: 'If you could give them one piece of deliberately terrible marital advice, what would it be?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'meaningfulMemoryEmotional', label: 'What is your most meaningful memory of either of the newlyweds?', type: 'textarea', required: true },
        { id: 'realisedSpecial', label: 'When did you first realise that their relationship was something genuinely special?', type: 'textarea', required: true },
        { id: 'witnessedInspired', label: 'What have you witnessed between them that has moved or inspired you?', type: 'textarea', required: true },
        { id: 'enrichedLife', label: 'How has having them in your life changed or enriched your own life?', type: 'textarea', required: true },
        { id: 'deeplyCare', label: 'Is there a particular moment that shows how deeply they care for each other?', type: 'textarea', required: true },
        { id: 'hopeRemember', label: 'What do you hope they will always remember about this time in their lives and about the love they share?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'worstTruthful', label: 'What is the absolute worst thing you can truthfully say about either of them that will still get a laugh rather than end the marriage?', type: 'textarea', required: true },
        { id: 'ridiculousStory', label: 'What ridiculous story, disaster or moment of questionable judgement involving the couple deserves to be immortalised in the speech?', type: 'textarea', required: true },
        { id: 'obviousFlaws', label: 'What are their most obvious flaws, weird habits or deeply irritating personality traits — and which one is going to drive the other insane first?', type: 'textarea', required: true },
        { id: 'firstTogetherPrediction', label: 'What did you think when they first got together — and, looking back, how badly did you predict what was going to happen?', type: 'textarea', required: true },
        { id: 'warningLabel', label: 'If their relationship came with a warning label, instruction manual or set of terms and conditions, what would it say?', type: 'textarea', required: true },
        { id: 'brutalAdvice', label: 'What piece of completely unnecessary, brutally honest or utterly useless advice would you give them before they embark on married life?', type: 'textarea', required: true }
      ]
    },
    
    // Anniversary Party
    'anniversary-party': {
      base: [
        { id: 'relationshipToCouple', label: 'How do you know the couple?', type: 'text', required: true }
      ],
      serious: [
        { id: 'admireMost', label: 'What do you admire most about the couple and the life they have built together?', type: 'textarea', required: true },
        { id: 'commitmentMoment', label: 'What moment or period in their relationship best demonstrates their commitment to one another?', type: 'textarea', required: true },
        { id: 'supportStages', label: 'How have you seen them support each other through the different stages of their life together?', type: 'textarea', required: true },
        { id: 'enduringQualities', label: 'What qualities have helped their relationship endure and grow over the years?', type: 'textarea', required: true },
        { id: 'meaningfulMemory', label: 'Is there a particular memory that captures what their relationship has meant to you or to those around them?', type: 'textarea', required: true },
        { id: 'futureWish', label: 'What would you like to wish them for the years they still have ahead of them together?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'firstTogetherChanged', label: 'What do you remember about the couple when they first got together, and what has changed most since then?', type: 'textarea', required: true },
        { id: 'funniestYears', label: 'What is the funniest story you can remember from their years together?', type: 'textarea', required: true },
        { id: 'habitsQuirks', label: 'What habits or quirks have they somehow managed to put up with in each other all these years?', type: 'textarea', required: true },
        { id: 'memorableMishap', label: 'What memorable mishap, argument, holiday, celebration or disaster involving the couple could make a great story?', type: 'textarea', required: true },
        { id: 'outOfCharacter', label: 'What is something they did years ago that would be completely out of character for them now?', type: 'textarea', required: true },
        { id: 'humorousAdvice', label: 'If you could give them one piece of humorous advice for surviving the next chapter of their relationship, what would it be?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'treasuredMemory', label: 'What is your most treasured memory of the couple or their life together?', type: 'textarea', required: true },
        { id: 'realisedCare', label: 'Was there a particular moment when you realised just how deeply they cared for each other?', type: 'textarea', required: true },
        { id: 'witnessedStayed', label: 'What have you witnessed in their relationship that has stayed with you over the years?', type: 'textarea', required: true },
        { id: 'influencedLives', label: 'How have they influenced your life or the lives of the people around them?', type: 'textarea', required: true },
        { id: 'loveEndure', label: 'What do you think has allowed their love and commitment to endure through the years?', type: 'textarea', required: true },
        { id: 'messageNext', label: 'If you could give them one message to carry with them into the next chapter of their life together, what would you say?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'cannotDeny', label: 'After all these years, what is the funniest thing you can say about them that they absolutely cannot deny?', type: 'textarea', required: true },
        { id: 'ridiculousSurvived', label: 'What ridiculous story from their relationship has somehow survived all these years and still deserves to be dragged out tonight?', type: 'textarea', required: true },
        { id: 'bettingAgainst', label: 'Which of their habits or personality traits would have had you placing bets on the marriage not making it this far?', type: 'textarea', required: true },
        { id: 'arguedDisagreed', label: 'What have they argued about, disagreed over or stubbornly refused to admit defeat on that could now be safely turned into a joke?', type: 'textarea', required: true },
        { id: 'badlyManaged', label: 'If their years together were reviewed like a badly managed business, what would be their biggest success, biggest failure and most questionable decision?', type: 'textarea', required: true },
        { id: 'survivalManual', label: 'If they had to publish an instruction manual for surviving another anniversary, what absolutely essential rule would you put on page one?', type: 'textarea', required: true }
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
    
    // Charity Gala/Fundraiser (NOT memorial - people are alive!)
    'charity-gala-fundraiser': {
      base: [
        { id: 'causeSupported', label: 'What cause or charity are you supporting?', type: 'text', required: true },
        { id: 'yourRole', label: 'What is your role in this event/organization?', type: 'text', required: true },
        { id: 'impactStory', label: 'Share a story about the impact this cause has made', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'funnyFundraising', label: 'Any funny fundraising moments or stories?', type: 'textarea', required: false },
        { id: 'donorAppreciation', label: 'How can you thank donors in a lighthearted way?', type: 'textarea', required: false }
      ],
      emotional: [
        { id: 'personalConnection', label: 'What is your personal connection to this cause?', type: 'textarea', required: true },
        { id: 'whoHelped', label: 'Who has been helped by this organization?', type: 'textarea', required: false },
        { id: 'futureHope', label: 'What future do you hope to create through this cause?', type: 'textarea', required: false }
      ],
      serious: [
        { id: 'missionStatement', label: 'What is the mission and purpose of this cause?', type: 'textarea', required: false },
        { id: 'accomplishments', label: 'What has been accomplished so far?', type: 'textarea', required: false },
        { id: 'callToAction', label: 'What action do you want attendees to take?', type: 'textarea', required: false }
      ],
      banter: []
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
    'charity-gala-fundraiser': 'charity-gala-fundraiser',  // Has its own questions now!
    'wedding-guest-toast': 'wedding-guest-toast',  // Has its own 6 questions per tone!
    'anniversary-party': 'anniversary-party',  // Has its own 6 questions per tone!
    'company-anniversary': 'retirement-farewell',  // Corporate celebration
    'engagement-party': 'groom',  // Pre-wedding celebration
    'baby-shower': 'big-birthday-30th-50th-etc-',  // Milestone celebration
    'retirement-party': 'retirement-farewell',  // Already exists
    'achievement-celebration': 'big-birthday-30th-50th-etc-',  // Milestone
    'tribute-to-mentor': 'retirement-farewell',  // Professional tribute
    'thank-you-speech': 'retirement-farewell',  // Gratitude speech
    'legacy-event': 'retirement-farewell'  // Honor/tribute
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
  var submittingMessage = document.getElementById('submittingMessage');
  
  // ===========================
  // State Management
  // ===========================
  
  var isSubmitting = false;
  
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
      } else if (question.type === 'select') {
        input = document.createElement('select');
        // Add default option
        var defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Please select...';
        input.appendChild(defaultOption);
        // Add options from question.options array
        if (question.options && Array.isArray(question.options)) {
          question.options.forEach(function(optionText) {
            var option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            input.appendChild(option);
          });
        }
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
    
    // Prevent spam/double submission
    if (isSubmitting) {
      console.log('⚠️ Form already submitting, ignoring duplicate submission');
      return;
    }
    
    isSubmitting = true;
    
    // Disable submit button
    var submitButton = speechForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
      submitButton.style.opacity = '0.6';
      submitButton.style.cursor = 'not-allowed';
    }
    
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
      questionnaire: {
        subjectNames: formData.get('subjectNames') // Critical: subject of the speech
      }
    };
    
    // Add all dynamic questionnaire answers from the form
    // Get all form inputs and collect their values
    var allInputs = speechForm.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
    allInputs.forEach(function(input) {
      var name = input.getAttribute('name');
      // Skip the basic form fields, only collect questionnaire answers
      if (name && !['customerName', 'customerEmail', 'subjectNames', 'package', 'tone', 'category', 'specificOccasion'].includes(name)) {
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
    
    // Show submitting message while processing
    speechForm.style.display = 'none';
    submittingMessage.style.display = 'block';
    submittingMessage.scrollIntoView({ behavior: 'smooth' });
    
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
    submittingMessage.style.display = 'none';
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
  
  // Expose functions to global scope for auth.js
  window.showSuccessMessage = showSuccessMessage;
  window.resetSubmitFlag = function() {
    isSubmitting = false;
  };
  
})();
