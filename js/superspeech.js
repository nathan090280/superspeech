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
        'Best Man / Woman / Person',
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
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'relationshipToday', label: 'What is your relationship to the bride or groom, and what does it mean to you to be standing here today?', type: 'textarea', required: true },
        { id: 'proudOverYears', label: 'What have you seen in them over the years that makes you particularly proud?', type: 'textarea', required: true },
        { id: 'growingUp', label: 'What do you remember about them growing up that gives you a sense of the person they have become?', type: 'textarea', required: true },
        { id: 'happyForThem', label: 'What have you seen in their relationship with their partner that makes you happy for them?', type: 'textarea', required: true },
        { id: 'specialMoment', label: 'Is there a particular memory or moment that captures something special about them or their journey?', type: 'textarea', required: true },
        { id: 'marriedLife', label: 'What would you most like to say to them as they begin married life together?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'beforeSpouse', label: 'What is your relationship to the bride or groom, and what were they like before they became someone\'s spouse?', type: 'textarea', required: true },
        { id: 'childhoodStory', label: 'What is the funniest or most embarrassing story from their childhood or younger years that can safely be told today?', type: 'textarea', required: true },
        { id: 'tolerateTrait', label: 'What habit, quirk or personality trait have they had for years that their new spouse has now signed up to tolerate?', type: 'textarea', required: true },
        { id: 'firstToldPartner', label: 'What did you think when they first told you about their partner?', type: 'textarea', required: true },
        { id: 'ridiculousWitnessed', label: 'What is the most ridiculous thing you have witnessed during their relationship?', type: 'textarea', required: true },
        { id: 'parentalAdvice', label: 'What piece of completely unnecessary but well-intentioned parental advice would you like to give them before they begin married life?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'seeingMarried', label: 'What is your relationship to the bride or groom, and what does seeing them get married mean to you personally?', type: 'textarea', required: true },
        { id: 'treasuredGrowingUp', label: 'What is your most treasured memory of them growing up?', type: 'textarea', required: true },
        { id: 'personToday', label: 'What moment made you realise they had become the person they are today?', type: 'textarea', required: true },
        { id: 'reassuredFuture', label: 'What have you seen in their relationship that has made you feel particularly happy or reassured about their future together?', type: 'textarea', required: true },
        { id: 'proudQualities', label: 'What qualities in them make you most proud as a parent?', type: 'textarea', required: true },
        { id: 'heartfeltNewChapter', label: 'What heartfelt message would you like to give them as they begin this new chapter of their lives together?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'crimesPatience', label: 'What is your relationship to the bride or groom, and what crimes against your patience did they commit while growing up?', type: 'textarea', required: true },
        { id: 'waitingToTell', label: 'What is the most embarrassing story from their childhood that you\'ve been waiting years for an excuse to tell?', type: 'textarea', required: true },
        { id: 'inheritedDefect', label: 'What ridiculous habit or personality defect have they had since childhood that their new spouse has now inherited?', type: 'textarea', required: true },
        { id: 'broughtPartnerHome', label: 'What did you actually think when they first brought their partner home?', type: 'textarea', required: true },
        { id: 'notReadyEvidence', label: 'What is the funniest evidence you have that your child is absolutely not ready for married life?', type: 'textarea', required: true },
        { id: 'honestParentalAdvice', label: 'What brutally honest piece of parental advice would you give them before you finally hand them over to someone else\'s family?', type: 'textarea', required: true }
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
    
    // Corporate - Promotion/Welcome
    'promotion-welcome': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'occasionRole', label: 'What is the occasion, who is being welcomed or promoted, and what is their new role?', type: 'textarea', required: true },
        { id: 'suitedQualities', label: 'What experience, qualities or achievements make them well suited to this position?', type: 'textarea', required: true },
        { id: 'contributionImpact', label: 'What have they contributed so far, and what impact have they had on the team or organisation?', type: 'textarea', required: true },
        { id: 'bringToRole', label: 'What do you think they will bring to their new role?', type: 'textarea', required: true },
        { id: 'opportunitiesChallenges', label: 'What opportunities or challenges lie ahead for them?', type: 'textarea', required: true },
        { id: 'bestWishes', label: 'What message or best wishes would you like to offer as they begin this next chapter?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'howEndedUpHere', label: 'Who is being welcomed or promoted, what is their new role, and how did they end up here?', type: 'textarea', required: true },
        { id: 'firstImpression', label: 'What was your first impression of them, and has it changed since?', type: 'textarea', required: true },
        { id: 'funnyIncident', label: 'What funny incident, workplace mishap or memorable moment involving them deserves a mention?', type: 'textarea', required: true },
        { id: 'habitQuirk', label: 'What habit, quirk or personality trait will their new colleagues quickly discover?', type: 'textarea', required: true },
        { id: 'surprisingChallenging', label: 'What do you think they will find most surprising, confusing or challenging about their new position?', type: 'textarea', required: true },
        { id: 'amusingAdvice', label: 'What amusing piece of advice would you give them as they settle into their new role?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'occasionMeaning', label: 'Who is being welcomed or promoted, what is their new role, and what does this occasion mean to you?', type: 'textarea', required: true },
        { id: 'deservingQualities', label: 'What qualities or experiences have made them particularly deserving of this opportunity?', type: 'textarea', required: true },
        { id: 'sawPotential', label: 'Is there a moment when you saw their potential or realised how much they had to offer?', type: 'textarea', required: true },
        { id: 'differenceToPeople', label: 'How have they made a difference to the people they have worked with?', type: 'textarea', required: true },
        { id: 'hopeNewChapter', label: 'What do you hope this new chapter will bring them?', type: 'textarea', required: true },
        { id: 'likeThemToKnow', label: 'What would you most like them to know as they take this next step?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'whosResponsible', label: 'Who is being welcomed or promoted, what is their new role, and who thought giving them that responsibility was a good idea?', type: 'textarea', required: true },
        { id: 'questionableThing', label: 'What is the funniest or most questionable thing they have done during their time here?', type: 'textarea', required: true },
        { id: 'flawToLiveWith', label: 'What habit or personality flaw will their new colleagues have to learn to live with?', type: 'textarea', required: true },
        { id: 'getSpectacularlyWrong', label: 'What are they most likely to get spectacularly wrong in their new role?', type: 'textarea', required: true },
        { id: 'notInHandover', label: 'What should their new colleagues know about them that probably wasn\'t included in the handover?', type: 'textarea', required: true },
        { id: 'brutalAdvice', label: 'What brutally honest piece of advice would you give them before they get too comfortable?', type: 'textarea', required: true }
      ]
    },

    // Corporate - Keynote/Panel
    'keynote-panel': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'eventAndSubject', label: 'What is the event about, what is your role, and what subject will you be speaking about?', type: 'textarea', required: true },
        { id: 'takeaways', label: 'What are the main ideas, experiences or messages you want the audience to take away?', type: 'textarea', required: true },
        { id: 'whyImportant', label: 'Why is this subject important or relevant to the audience?', type: 'textarea', required: true },
        { id: 'bestExample', label: 'What experience, evidence or example best illustrates the point you want to make?', type: 'textarea', required: true },
        { id: 'challengesPerspectives', label: 'What challenges, questions or differing perspectives are important to address?', type: 'textarea', required: true },
        { id: 'audienceAction', label: 'What would you like the audience to think about or do after hearing you speak?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'expectedToTalk', label: 'What is the event about, what is your role, and what are you expected to talk about?', type: 'textarea', required: true },
        { id: 'amusingExperience', label: 'What is the most amusing, unexpected or ridiculous experience you\'ve had relating to the subject?', type: 'textarea', required: true },
        { id: 'gentleRoasting', label: 'What common misconception, industry habit or professional buzzword deserves a gentle roasting?', type: 'textarea', required: true },
        { id: 'goneWrong', label: 'What has gone wrong in your experience that might help make your point?', type: 'textarea', required: true },
        { id: 'tooSerious', label: 'What aspect of the subject do people take far too seriously, or not seriously enough?', type: 'textarea', required: true },
        { id: 'oneThingRemembered', label: 'If the audience remembers just one thing from your talk, what would you like it to be?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'whyMattersPersonally', label: 'What is the event about, what is your role, and why does this subject matter to you personally?', type: 'textarea', required: true },
        { id: 'turningPoint', label: 'What experience or turning point first made you passionate about this topic?', type: 'textarea', required: true },
        { id: 'shapedPerspective', label: 'What challenge, setback or achievement has shaped your perspective?', type: 'textarea', required: true },
        { id: 'influentialPerson', label: 'Is there a particular person or experience that has influenced the message you want to share?', type: 'textarea', required: true },
        { id: 'hopeAudienceFeel', label: 'What do you hope your words will help the audience understand, feel or reconsider?', type: 'textarea', required: true },
        { id: 'oneMessage', label: 'If the audience remembers one message from your contribution, what would you want it to be?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'foolishlyTrusted', label: 'What is the event about, what is your role, and what have they foolishly trusted you to talk about?', type: 'textarea', required: true },
        { id: 'ridiculousWitnessed', label: 'What is the most ridiculous thing you have witnessed in your industry or area of expertise?', type: 'textarea', required: true },
        { id: 'jargonCliche', label: 'What professional habit, industry cliché or piece of jargon makes you want to leave the room?', type: 'textarea', required: true },
        { id: 'spectacularFailure', label: 'What disaster, mistake or spectacular failure have you experienced that the audience deserves to hear about?', type: 'textarea', required: true },
        { id: 'uncomfortableTruth', label: 'What uncomfortable truth about your subject could you say out loud that everyone in the room already knows?', type: 'textarea', required: true },
        { id: 'brutallyHonestMessage', label: 'If you had to leave the audience with one brutally honest message, what would it be?', type: 'textarea', required: true }
      ]
    },

    // Corporate - Award Acceptance
    'award-acceptance': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'awardDetails', label: 'What award are you receiving, who is presenting it, and what is it recognising?', type: 'textarea', required: true },
        { id: 'awardMeaning', label: 'What does receiving this award mean to you, and why is it significant?', type: 'textarea', required: true },
        { id: 'journeyLed', label: 'What work, achievement or journey has led to this moment?', type: 'textarea', required: true },
        { id: 'supportersThanks', label: 'Who has supported, encouraged or contributed to your success, and what would you like to thank them for?', type: 'textarea', required: true },
        { id: 'challengesLessons', label: 'What challenges or important lessons have shaped the work being recognised?', type: 'textarea', required: true },
        { id: 'messageAndNext', label: 'What would you like to say to the people who made this recognition possible, and what comes next?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'howSurprised', label: 'What award are you receiving, what is it for, and how surprised are you to be standing here?', type: 'textarea', required: true },
        { id: 'funniestThingOnWay', label: 'What is the funniest or most unexpected thing that happened on the way to winning it?', type: 'textarea', required: true },
        { id: 'creditUnbearable', label: 'Who deserves some of the credit, and who would be absolutely unbearable if you thanked them?', type: 'textarea', required: true },
        { id: 'questionableContribution', label: 'What mistake, mishap or questionable decision somehow contributed to this moment?', type: 'textarea', required: true },
        { id: 'peopleWhoKnowYou', label: 'What would the people who know you best say about you winning this award?', type: 'textarea', required: true },
        { id: 'laughWithoutRevoke', label: 'What is the one thing you can say in your acceptance speech that will make people laugh without getting the award taken back?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'momentMeaning', label: 'What award are you receiving, what does it recognise, and what does this moment mean to you?', type: 'textarea', required: true },
        { id: 'personalJourney', label: 'What personal journey, sacrifice or determination lies behind this achievement?', type: 'textarea', required: true },
        { id: 'doubtedSelf', label: 'Was there a point when you doubted yourself or wondered whether you would get here?', type: 'textarea', required: true },
        { id: 'lastingDifference', label: 'Who has made a lasting difference to your journey, and what would you like them to know?', type: 'textarea', required: true },
        { id: 'beyondAward', label: 'What does this recognition mean beyond the award itself?', type: 'textarea', required: true },
        { id: 'heartfeltMessage', label: 'If you could share one heartfelt message with the people who supported you, what would you say?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'publicAttention', label: 'What award are you receiving, what is it for, and what have you done to deserve this level of public attention?', type: 'textarea', required: true },
        { id: 'obligedToThank', label: 'Who are you obliged to thank, and who are you deliberately leaving out?', type: 'textarea', required: true },
        { id: 'ridiculousPursuit', label: 'What is the most ridiculous thing you did in pursuit of this award?', type: 'textarea', required: true },
        { id: 'colleaguesHonest', label: 'What would your colleagues say if they were being completely honest about you winning?', type: 'textarea', required: true },
        { id: 'leastGlamorous', label: 'What is the most embarrassing or least glamorous truth behind this achievement?', type: 'textarea', required: true },
        { id: 'brutallyHonestSpeech', label: 'If you had to give an acceptance speech that was brutally honest rather than diplomatic, what would you say?', type: 'textarea', required: true }
      ]
    },

    // Corporate - Award Presentation
    'award-presentation': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'presentingDetails', label: 'What award are you presenting, who is receiving it, and what does it recognise?', type: 'textarea', required: true },
        { id: 'recipientAchieved', label: 'What has the recipient achieved or contributed that makes this recognition meaningful?', type: 'textarea', required: true },
        { id: 'distinguishedQualities', label: 'What qualities, skills or values have distinguished their work?', type: 'textarea', required: true },
        { id: 'demonstratingMoment', label: 'Is there a particular achievement, example or moment that demonstrates their impact?', type: 'textarea', required: true },
        { id: 'benefitedWhom', label: 'How has their contribution benefited colleagues, customers, the organisation or the wider community?', type: 'textarea', required: true },
        { id: 'acknowledgeFirst', label: 'What would you most like to acknowledge about the recipient before presenting the award?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'earnIt', label: 'What award are you presenting, who is receiving it, and what have they done to earn it?', type: 'textarea', required: true },
        { id: 'funnyStoryRecipient', label: 'What funny, unusual or memorable story about the recipient deserves to be shared?', type: 'textarea', required: true },
        { id: 'recognisedTrait', label: 'What habit, quirk or personality trait will everyone in the room recognise?', type: 'textarea', required: true },
        { id: 'unexpectedEntertaining', label: 'What is the most unexpected or entertaining thing about their work or achievements?', type: 'textarea', required: true },
        { id: 'realReason', label: 'What would their colleagues say is the real reason they deserve this award?', type: 'textarea', required: true },
        { id: 'lightheartedComment', label: 'What light-hearted comment could you make about the recipient before revealing their name?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'recognitionImportant', label: 'What award are you presenting, who is receiving it, and why is this recognition important?', type: 'textarea', required: true },
        { id: 'achievedOvercome', label: 'What has the recipient achieved or overcome to reach this moment?', type: 'textarea', required: true },
        { id: 'greatestImpression', label: 'What personal qualities have made the greatest impression on you?', type: 'textarea', required: true },
        { id: 'sawDifference', label: 'Is there a particular moment when you saw the difference they were making?', type: 'textarea', required: true },
        { id: 'influencedOthers', label: 'How have they influenced, supported or inspired the people around them?', type: 'textarea', required: true },
        { id: 'valueOfContribution', label: 'What would you most like the recipient to understand about the value of their contribution?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'supposedlyDeserve', label: 'What award are you presenting, who is receiving it, and what have they supposedly done to deserve it?', type: 'textarea', required: true },
        { id: 'outrageousStory', label: 'What is the funniest or most outrageous story involving the recipient that is safe to tell in public?', type: 'textarea', required: true },
        { id: 'instantlyRecognisable', label: 'What habit or personality trait makes them instantly recognisable to everyone here?', type: 'textarea', required: true },
        { id: 'ridiculousDetail', label: 'What achievement are they being recognised for, and what is the most ridiculous detail behind it?', type: 'textarea', required: true },
        { id: 'lessAdmirableAward', label: 'What would their colleagues nominate them for if there were an award for their less admirable qualities?', type: 'textarea', required: true },
        { id: 'entertainingAdmission', label: 'What is the most entertaining thing you can say about them before finally admitting they deserve the award?', type: 'textarea', required: true }
      ]
    },

    // Corporate - Company Anniversary
    'company-anniversary': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'timeAndRole', label: 'How long have you been with the company, and what has your role or position been during that time?', type: 'textarea', required: true },
        { id: 'firstJoined', label: 'What do you remember most clearly about the company when you first joined, and what has changed since then?', type: 'textarea', required: true },
        { id: 'milestoneStandsOut', label: 'What achievement, milestone or period of growth stands out most to you during your time with the business?', type: 'textarea', required: true },
        { id: 'significantContribution', label: 'What people, teams or individuals have made a particularly significant contribution to the company\'s journey?', type: 'textarea', required: true },
        { id: 'recogniseCelebrate', label: 'What do you think is most important to recognise or celebrate about the company at this anniversary?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'jobThenNow', label: 'How long have you worked here, what was your job when you started, and how different is your role now?', type: 'textarea', required: true },
        { id: 'biggestChange', label: 'What is the biggest change you\'ve witnessed since joining — apart from the number of meetings?', type: 'textarea', required: true },
        { id: 'talkedAboutIncident', label: 'What memorable mistake, mishap, office tradition or bizarre incident from your time here still gets talked about?', type: 'textarea', required: true },
        { id: 'mostEntertainment', label: 'Who or what has provided the most entertainment during your time at the company?', type: 'textarea', required: true },
        { id: 'ridiculousAnalogy', label: 'If you could describe the company\'s journey so far using one ridiculous analogy, what would it be?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'journeyMeaning', label: 'How long have you been part of the company, and what has your journey through the business meant to you personally?', type: 'textarea', required: true },
        { id: 'proudMoment', label: 'What moment during your time here made you feel particularly proud to be part of the company?', type: 'textarea', required: true },
        { id: 'greatestImpact', label: 'Which colleagues, mentors or teams have had the greatest impact on you during your time here?', type: 'textarea', required: true },
        { id: 'broughtTogether', label: 'Is there a particular challenge, achievement or period of change that brought the people in the company together?', type: 'textarea', required: true },
        { id: 'mostGrateful', label: 'When you look back at the company\'s journey, what are you most grateful to have been part of?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'stillUnderstand', label: 'How long have you been here, what did you actually do when you started, and how much of that job do you still understand?', type: 'textarea', required: true },
        { id: 'mostRidiculous', label: 'What is the most ridiculous thing that has happened at the company during your time here?', type: 'textarea', required: true },
        { id: 'sourceOfChaos', label: 'Which colleague, department or company habit deserves the dubious honour of being the biggest source of workplace chaos?', type: 'textarea', required: true },
        { id: 'whatWereTheySmoking', label: 'What company decision, policy or change from the past makes you wonder what the people in charge were smoking?', type: 'textarea', required: true },
        { id: 'honestReviewHeadline', label: 'If you had to give the company a brutally honest review after all these years, what would the headline be?', type: 'textarea', required: true }
      ]
    },

    // Milestone - Graduation
    'graduation': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'whatGraduating', label: 'What are you graduating from, what qualification or achievement are you celebrating, and what does this milestone mean to you?', type: 'textarea', required: true },
        { id: 'motivation', label: 'What motivated you to pursue this course, qualification or area of study?', type: 'textarea', required: true },
        { id: 'biggestChallenges', label: 'What were the biggest challenges or obstacles you faced along the way?', type: 'textarea', required: true },
        { id: 'whoSupported', label: 'Who supported or encouraged you during your studies, and what did their support mean to you?', type: 'textarea', required: true },
        { id: 'learnedBeyond', label: 'What have you learned or gained from the experience beyond the qualification itself?', type: 'textarea', required: true },
        { id: 'hopingNext', label: 'What are you hoping to do next, and what would you like to say to the people celebrating with you?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'howSurprised', label: 'What are you graduating from, what qualification have you somehow managed to obtain, and how surprised are you to be here?', type: 'textarea', required: true },
        { id: 'funniestStudies', label: 'What was the funniest, strangest or most ridiculous thing that happened during your studies?', type: 'textarea', required: true },
        { id: 'studentDisaster', label: 'What mistake, disaster or questionable decision from your student days deserves to be remembered?', type: 'textarea', required: true },
        { id: 'whoHelped', label: 'Who helped you get through it, and what did they have to put up with from you?', type: 'textarea', required: true },
        { id: 'habitNotTaking', label: 'What student habit are you definitely not taking into your next chapter?', type: 'textarea', required: true },
        { id: 'adviceToSelf', label: 'What is the most entertaining piece of advice you\'d give yourself now that you\'ve actually graduated?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'milestoneMeaning', label: 'What are you graduating from, and what does reaching this milestone mean to you personally?', type: 'textarea', required: true },
        { id: 'sacrificeBehind', label: 'What journey, sacrifice or determination lies behind reaching this point?', type: 'textarea', required: true },
        { id: 'doubtedKeptGoing', label: 'Was there a moment when you struggled or doubted yourself but kept going?', type: 'textarea', required: true },
        { id: 'supportedMost', label: 'Who has supported you most along the way, and what would you like them to know?', type: 'textarea', required: true },
        { id: 'howChanged', label: 'How has this experience changed you or helped you grow?', type: 'textarea', required: true },
        { id: 'sayToHelpers', label: 'What would you like to say to the people who have helped you reach this moment?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'howMadeIt', label: 'What are you graduating from, and how the hell did you actually make it this far?', type: 'textarea', required: true },
        { id: 'mostRidiculous', label: 'What is the most ridiculous thing that happened during your time studying?', type: 'textarea', required: true },
        { id: 'poorJudgement', label: 'What spectacular mistake, disaster or act of poor judgement deserves to be dragged up tonight?', type: 'textarea', required: true },
        { id: 'crimesAgainst', label: 'Who had to put up with you while you were studying, and what crimes against their patience did you commit?', type: 'textarea', required: true },
        { id: 'secretlyEnjoyed', label: 'What part of student life are you absolutely not going to admit you enjoyed?', type: 'textarea', required: true },
        { id: 'inappropriatePlan', label: 'Now that you\'ve somehow obtained a qualification, what completely inappropriate thing are you planning to do with it?', type: 'textarea', required: true }
      ]
    },

    // Milestone - Bar/Bat Mitzvah
    'bar-bat-mitzvah': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'whatCelebrated', label: 'What is being celebrated today, and what does becoming a Bar or Bat Mitzvah mean to you and your family?', type: 'textarea', required: true },
        { id: 'faithMeaningful', label: 'What aspects of your Jewish faith, traditions or community are particularly meaningful to you?', type: 'textarea', required: true },
        { id: 'learnedPreparing', label: 'What have you learned or experienced during your preparation for this milestone?', type: 'textarea', required: true },
        { id: 'whoGuided', label: 'Who has supported, taught or guided you along the way?', type: 'textarea', required: true },
        { id: 'mostProud', label: 'What are you most proud of about reaching this stage in your life?', type: 'textarea', required: true },
        { id: 'hopesBecome', label: 'What hopes or intentions do you have for the person you want to become from this point onwards?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'realisedStanding', label: 'What are we celebrating today, and how did you feel when you realised you\'d have to stand up in front of everyone and actually do this?', type: 'textarea', required: true },
        { id: 'funniestPreparing', label: 'What has been the funniest or most ridiculous part of preparing for your Bar or Bat Mitzvah?', type: 'textarea', required: true },
        { id: 'hardestToLearn', label: 'What has been the hardest thing to learn, practise or remember?', type: 'textarea', required: true },
        { id: 'naggingNeeded', label: 'Who has been helping you prepare, and how much nagging did they have to do?', type: 'textarea', required: true },
        { id: 'embarrassingChildhood', label: 'What embarrassing story from your childhood would your family be most likely to bring up today?', type: 'textarea', required: true },
        { id: 'convenientlyForget', label: 'Now that you\'ve officially reached this milestone, what new responsibility are you hoping everyone will conveniently forget about?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'meanPersonally', label: 'What does becoming a Bar or Bat Mitzvah mean to you personally, and why is this day important to you?', type: 'textarea', required: true },
        { id: 'learnedAboutSelf', label: 'What have you learned about yourself, your faith or your place within your family and community during this journey?', type: 'textarea', required: true },
        { id: 'especiallyImportant', label: 'Who has been especially important in helping and supporting you?', type: 'textarea', required: true },
        { id: 'momentStayed', label: 'Is there a particular moment during your preparation that has stayed with you?', type: 'textarea', required: true },
        { id: 'mostProudOf', label: 'What are you most proud of as you reach this milestone?', type: 'textarea', required: true },
        { id: 'personBecome', label: 'What kind of person do you hope to become as you take this next step in your life?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'relievedOver', label: 'What exactly are we celebrating today, and how relieved are you that all that preparation is finally over?', type: 'textarea', required: true },
        { id: 'mostPainful', label: 'What was the most painful, confusing or ridiculous part of learning everything you needed to know?', type: 'textarea', required: true },
        { id: 'naggingMost', label: 'Who has been nagging you the most during the preparation, and what are they getting away with today?', type: 'textarea', required: true },
        { id: 'heldOverYou', label: 'What embarrassing childhood story is your family currently holding over you?', type: 'textarea', required: true },
        { id: 'firstIrresponsible', label: 'Now that you\'re officially becoming a responsible member of the community, what is the first irresponsible thing you\'re planning to do?', type: 'textarea', required: true },
        { id: 'warningLabel', label: 'If your Bar or Bat Mitzvah came with a warning label, what would it say?', type: 'textarea', required: true }
      ]
    },

    // Milestone - Engagement Party
    'engagement-party': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'firstMetCouple', label: 'How did you first meet the couple, and what was your first impression of each of them?', type: 'textarea', required: true },
        { id: 'realisedSerious', label: 'When did you first realise that their relationship was becoming something serious?', type: 'textarea', required: true },
        { id: 'qualitiesEach', label: 'What qualities do they each bring to the relationship that make them well suited to one another?', type: 'textarea', required: true },
        { id: 'strengthMoment', label: 'What moment or experience best demonstrates the strength of their relationship?', type: 'textarea', required: true },
        { id: 'supportInfluence', label: 'How have you seen them support or influence each other since they got together?', type: 'textarea', required: true },
        { id: 'sincereWish', label: 'What sincere wish or piece of advice would you like to give them as they begin this next chapter together?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'honestThought', label: 'How did they meet, and what did you honestly think when you first heard they were getting together?', type: 'textarea', required: true },
        { id: 'funniestWitnessed', label: 'What is the funniest or most ridiculous thing you\'ve witnessed since they became a couple?', type: 'textarea', required: true },
        { id: 'agreedToTolerate', label: 'What habit, quirk or personality trait does one of them have that the other has somehow agreed to tolerate?', type: 'textarea', required: true },
        { id: 'definitelyMarrying', label: 'Was there a moment when you thought, "Yep, these two are definitely going to get married"?', type: 'textarea', required: true },
        { id: 'safeForFamilies', label: 'What embarrassing, awkward or questionable story about either of them can safely be told in front of both families?', type: 'textarea', required: true },
        { id: 'unhelpfulAdvice', label: 'What piece of deliberately unhelpful relationship advice would you give them before the wedding?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'meaningfulMemory', label: 'What is your most meaningful memory of the couple since they first got together?', type: 'textarea', required: true },
        { id: 'sawDeeplyCared', label: 'When did you first see how deeply they cared for one another?', type: 'textarea', required: true },
        { id: 'movedInspired', label: 'What have you witnessed in their relationship that has particularly moved or inspired you?', type: 'textarea', required: true },
        { id: 'enrichedLives', label: 'How has their relationship changed or enriched the lives of the people around them?', type: 'textarea', required: true },
        { id: 'happyLifeQualities', label: 'What qualities do you think will help them build a happy life together?', type: 'textarea', required: true },
        { id: 'heartfeltMessage', label: 'If you could give them one heartfelt message to carry with them towards their wedding and beyond, what would you say?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'everyonesProblem', label: 'How did these two actually get together, and at what point did you realise this was going to become everyone else\'s problem?', type: 'textarea', required: true },
        { id: 'mostRidiculousCouple', label: 'What is the most ridiculous thing either of them has done since they became a couple?', type: 'textarea', required: true },
        { id: 'personalityDefects', label: 'Which of their habits or personality defects makes you wonder how they have made it this far?', type: 'textarea', required: true },
        { id: 'technicallySafe', label: 'What is the most embarrassing story about either of them that is technically safe to tell now that they\'re engaged?', type: 'textarea', required: true },
        { id: 'relationshipWarning', label: 'If their relationship came with a warning label, what would it say?', type: 'textarea', required: true },
        { id: 'catastrophicAdvice', label: 'What brutally honest piece of advice would you give them before they make the catastrophic decision to get married?', type: 'textarea', required: true }
      ]
    },

    // Milestone - Baby Shower
    'baby-shower': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'relationshipParents', label: 'What is your relationship to the parents-to-be, and how long have you known them?', type: 'textarea', required: true },
        { id: 'goodParentQualities', label: 'What qualities do they each have that you think will make them good parents?', type: 'textarea', required: true },
        { id: 'journeyStoodOut', label: 'What moment during their journey towards becoming parents has stood out to you?', type: 'textarea', required: true },
        { id: 'familyConfidence', label: 'What have you seen in their relationship that gives you confidence in the family they are about to build?', type: 'textarea', required: true },
        { id: 'carryIntoParenthood', label: 'Is there a particular memory or experience that you hope they will carry with them into parenthood?', type: 'textarea', required: true },
        { id: 'sincereWishBaby', label: 'What sincere wish would you like to make for the parents and their new baby?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'immediateReaction', label: 'How do you know the parents-to-be, and what was your immediate reaction when you heard they were going to have a baby?', type: 'textarea', required: true },
        { id: 'organisedParent', label: 'Which of the parents is most likely to be the organised one — and which is going to need adult supervision?', type: 'textarea', required: true },
        { id: 'babyPutUpWith', label: 'What funny habit, personality trait or questionable life choice do you predict their baby will have to put up with?', type: 'textarea', required: true },
        { id: 'indicationComing', label: 'What is the funniest or most ridiculous thing either parent has done that might give us some indication of what is coming?', type: 'textarea', required: true },
        { id: 'leastLikelyFollow', label: 'Which piece of conventional parenting advice are they least likely to follow?', type: 'textarea', required: true },
        { id: 'unsolicitedAdvice', label: 'What humorous piece of completely unsolicited advice would you give them before the baby arrives?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'journeyTogether', label: 'What is your most meaningful memory of the parents-to-be and their journey together?', type: 'textarea', required: true },
        { id: 'lookingForward', label: 'When did you first realise how much they were looking forward to becoming parents?', type: 'textarea', required: true },
        { id: 'excitedQualities', label: 'What qualities in them make you particularly excited for this baby to join their family?', type: 'textarea', required: true },
        { id: 'loveAlready', label: 'Is there a moment that showed you how much love they already have for their unborn child?', type: 'textarea', required: true },
        { id: 'childGrowKnowing', label: 'What do you hope their child will grow up knowing about the people and family who welcomed them into the world?', type: 'textarea', required: true },
        { id: 'wishNewFamily', label: 'What heartfelt wish would you like to make for this new family as they begin this next chapter?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'actuallyInCharge', label: 'Which parent is actually going to be in charge once the baby arrives, and what evidence do you have?', type: 'textarea', required: true },
        { id: 'panicOrGoogle', label: 'Who is most likely to panic at 3 a.m., and who is most likely to Google the symptoms and make everything considerably worse?', type: 'textarea', required: true },
        { id: 'babyInherit', label: 'What existing habit, personality flaw or questionable lifestyle choice is the baby about to inherit?', type: 'textarea', required: true },
        { id: 'responsibleForChild', label: 'What is the funniest thing either parent has ever done that makes you think, "Christ, they\'re responsible for a child now"?', type: 'textarea', required: true },
        { id: 'babyQuestions', label: 'If the baby could read the parents\' history before being born, what would they immediately have questions about?', type: 'textarea', required: true },
        { id: 'nobodyKnows', label: 'What brutally honest piece of advice would you give the parents before they discover that absolutely nobody knows what they\'re doing?', type: 'textarea', required: true }
      ]
    },

    // Milestone - Retirement Party
    'retirement-party': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'relationshipRetiree', label: 'What is your relationship to the retiree, and how long have you known or worked with them?', type: 'textarea', required: true },
        { id: 'roleContribution', label: 'What has their role or contribution to the organisation meant to you and those around them?', type: 'textarea', required: true },
        { id: 'significantPeriod', label: 'What achievement, project or period during their career stands out as particularly significant?', type: 'textarea', required: true },
        { id: 'valuedQualities', label: 'What qualities have made them such a valued colleague, leader, mentor or friend?', type: 'textarea', required: true },
        { id: 'rememberedCelebrated', label: 'Is there a particular moment from their career that you think deserves to be remembered and celebrated?', type: 'textarea', required: true },
        { id: 'wishNextChapter', label: 'What would you like to wish them as they begin this next chapter of their life?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'firstImpression', label: 'How long have you known or worked with the retiree, and what was your first impression of them?', type: 'textarea', required: true },
        { id: 'funniestWorkingLife', label: 'What is the funniest, strangest or most memorable thing that happened during their working life?', type: 'textarea', required: true },
        { id: 'missOrEscape', label: 'What workplace habit or personality trait are everyone going to miss — or finally be relieved to escape?', type: 'textarea', required: true },
        { id: 'questionableCareer', label: 'What is the most questionable decision, mishap or piece of advice from their career that can safely be mentioned tonight?', type: 'textarea', required: true },
        { id: 'freeTime', label: 'What do you think they will actually do with all their newfound free time?', type: 'textarea', required: true },
        { id: 'survivingRetirement', label: 'If you could give them one piece of humorous advice for surviving retirement, what would it be?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'meantPersonally', label: 'What is your relationship with the retiree, and what has knowing or working with them meant to you personally?', type: 'textarea', required: true },
        { id: 'careerStayedWithYou', label: 'What moment or experience from their career has stayed with you most strongly?', type: 'textarea', required: true },
        { id: 'differenceMade', label: 'How have they made a difference to the people they have worked with or the organisation they have been part of?', type: 'textarea', required: true },
        { id: 'kindnessRemembered', label: 'Is there a particular quality, kindness or act of support from them that you will always remember?', type: 'textarea', required: true },
        { id: 'missMost', label: 'What do you think their colleagues, friends or family will miss most about having them around?', type: 'textarea', required: true },
        { id: 'heartfeltWish', label: 'What heartfelt wish would you like to give them as they leave working life behind and begin their next chapter?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'jobAvoiding', label: 'How long have you known or worked with them, and how much of their actual job do you think they have been successfully avoiding all these years?', type: 'textarea', required: true },
        { id: 'hasToBeMentioned', label: 'What is the funniest incident, workplace disaster or spectacular bit of nonsense from their career that absolutely has to be mentioned tonight?', type: 'textarea', required: true },
        { id: 'secretlyDelighted', label: 'What annoying habit or workplace behaviour are you secretly delighted you will never have to deal with again?', type: 'textarea', required: true },
        { id: 'convenientExcuse', label: 'What is the most suspiciously convenient excuse they have ever used to get out of doing something at work?', type: 'textarea', required: true },
        { id: 'annoyingAtHome', label: 'What do you reckon they will actually do with retirement — and how long before they start annoying everyone at home?', type: 'textarea', required: true },
        { id: 'exitInterview', label: 'If retirement came with an employee exit interview, what would their final review say?', type: 'textarea', required: true }
      ]
    },

    // Milestone - Achievement Celebration
    'achievement-celebration': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'whatAchievement', label: 'What is the achievement being celebrated, and what exactly did you accomplish?', type: 'textarea', required: true },
        { id: 'whyImportant', label: 'What motivated you to pursue this achievement, and why was it important to you?', type: 'textarea', required: true },
        { id: 'obstaclesOvercome', label: 'What were the biggest challenges, obstacles or setbacks you had to overcome along the way?', type: 'textarea', required: true },
        { id: 'whoHelped', label: 'Who helped, supported or encouraged you during the journey, and what did their support mean to you?', type: 'textarea', required: true },
        { id: 'milestoneMeans', label: 'What does achieving this milestone mean to you personally, professionally or to those around you?', type: 'textarea', required: true },
        { id: 'takeawayNext', label: 'What would you like people to take away from your achievement, and what are you hoping to do next?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'skillLuck', label: 'What exactly have you achieved, and how much of it was skill, determination and sheer luck?', type: 'textarea', required: true },
        { id: 'unexpectedHappened', label: 'What was the funniest, strangest or most unexpected thing that happened while you were trying to achieve it?', type: 'textarea', required: true },
        { id: 'laughableDisaster', label: 'What went wrong along the way, and which disaster are you now able to laugh about?', type: 'textarea', required: true },
        { id: 'creditAndHarder', label: 'Who deserves credit for helping you get there — and who made the whole process considerably harder than it needed to be?', type: 'textarea', required: true },
        { id: 'mightPullOff', label: 'At what point did you think, "Bloody hell, I might actually pull this off"?', type: 'textarea', required: true },
        { id: 'ridiculousNext', label: 'Now that you\'ve achieved it, what completely unnecessary or ridiculous thing are you going to do next?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'reachingMeans', label: 'What is the achievement being celebrated, and what does reaching this milestone mean to you?', type: 'textarea', required: true },
        { id: 'unseenJourney', label: 'What personal journey, sacrifice or determination lies behind the achievement that people may not have seen?', type: 'textarea', required: true },
        { id: 'nearlyGaveUp', label: 'Was there a particular moment when you nearly gave up, or when you realised you were going to succeed?', type: 'textarea', required: true },
        { id: 'supportersKnow', label: 'Who has supported you along the way, and what would you like them to know about the part they played?', type: 'textarea', required: true },
        { id: 'changedSelf', label: 'How has achieving this changed the way you see yourself, your future or what you are capable of?', type: 'textarea', required: true },
        { id: 'tellPastSelf', label: 'If you could look back at yourself before you began and say one thing, what would you want to tell that person?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'howSurprisedManaged', label: 'What exactly have you achieved, and let\'s be honest — how surprised are you that you actually managed it?', type: 'textarea', required: true },
        { id: 'storyMustTell', label: 'What went spectacularly wrong on the way there, and what story absolutely has to be told tonight?', type: 'textarea', required: true },
        { id: 'formalApology', label: 'Who helped you achieve it, and who should probably receive some sort of formal apology for having to put up with you?', type: 'textarea', required: true },
        { id: 'lowestPoint', label: 'What was your lowest point during the process, and how close were you to saying, "Fuck this, I\'m off"?', type: 'textarea', required: true },
        { id: 'ridiculousPursuit', label: 'What is the most ridiculous thing you did in pursuit of this achievement that, in hindsight, probably wasn\'t necessary?', type: 'textarea', required: true },
        { id: 'nextChallenge', label: 'Now that you\'ve reached the summit, what is the next completely unnecessary challenge you\'re likely to set yourself?', type: 'textarea', required: true }
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
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'relationshipDeceased', label: 'What was your relationship to the deceased, and how long did you know them?', type: 'textarea', required: true },
        { id: 'definedQualities', label: 'What qualities, values or characteristics best defined them as a person?', type: 'textarea', required: true },
        { id: 'deservesRecognition', label: 'What achievement, contribution or aspect of their life do you think deserves particular recognition?', type: 'textarea', required: true },
        { id: 'meaningfulMemory', label: 'What is the most meaningful memory you have of them, or the moment that best captures who they were?', type: 'textarea', required: true },
        { id: 'meantToYou', label: 'What did they mean to you, your family, friends or wider community?', type: 'textarea', required: true },
        { id: 'rememberThem', label: 'What would you most like people to remember about them after today?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'putUpWith', label: 'What was your relationship to the deceased, and how long did you have to put up with them?', type: 'textarea', required: true },
        { id: 'neverGotUsedTo', label: 'What funny habit, personality trait or quirk of theirs could you never quite get used to?', type: 'textarea', required: true },
        { id: 'funniestStory', label: 'What is the funniest, most embarrassing or most ridiculous story about them that can be told appropriately today?', type: 'textarea', required: true },
        { id: 'yepThatsThem', label: 'What was something they regularly did that would make everyone who knew them immediately think, "Yep, that\'s them"?', type: 'textarea', required: true },
        { id: 'memorableMishap', label: 'What memorable mishap, bad decision or piece of questionable advice from them still makes you laugh?', type: 'textarea', required: true },
        { id: 'heckleAbout', label: 'If they could hear this speech, what would they probably heckle you about for getting wrong?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'meantPersonally', label: 'What was your relationship to the deceased, and what did they mean to you personally?', type: 'textarea', required: true },
        { id: 'treasuredMemory', label: 'What is your most treasured memory of them?', type: 'textarea', required: true },
        { id: 'touchedMost', label: 'What quality, kindness or part of their character touched your life most deeply?', type: 'textarea', required: true },
        { id: 'influencedLives', label: 'How did they influence or shape the lives of the people around them?', type: 'textarea', required: true },
        { id: 'missMost', label: 'What do you think you will miss most about them now that they are gone?', type: 'textarea', required: true },
        { id: 'finalThing', label: 'If you could say one final thing directly to them today, what would you want them to know?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'putYouThrough', label: 'What was your relationship to the deceased, and what exactly did they put you through over the years?', type: 'textarea', required: true },
        { id: 'gloriouslyAnnoying', label: 'What was their most gloriously annoying habit or personality trait?', type: 'textarea', required: true },
        { id: 'cryingWithLaughter', label: 'What story about them would have the people who knew them best crying with laughter — rather than crying for the usual reasons?', type: 'textarea', required: true },
        { id: 'ridiculousLegend', label: 'What completely ridiculous thing did they believe, do or insist upon that became part of their legend?', type: 'textarea', required: true },
        { id: 'greatestBadAdvice', label: 'What was their greatest piece of bad advice, questionable decision or spectacularly unnecessary bit of behaviour?', type: 'textarea', required: true },
        { id: 'shoutingAtYou', label: 'If they were here now, what would they be shouting at you for saying in this speech?', type: 'textarea', required: true }
      ]
    },

    // Memorial - Celebration of Life
    'celebration-of-life': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'relationshipHowLong', label: 'What was your relationship to the deceased, and how long did you know them?', type: 'textarea', required: true },
        { id: 'definedThem', label: 'What qualities, values or characteristics best defined them as a person?', type: 'textarea', required: true },
        { id: 'proudToRemember', label: 'What achievement, contribution or aspect of their life are you most proud to remember?', type: 'textarea', required: true },
        { id: 'capturesThem', label: 'What memory best captures the person they were and the life they lived?', type: 'textarea', required: true },
        { id: 'impactOnPeople', label: 'What impact did they have on the people, family, community or world around them?', type: 'textarea', required: true },
        { id: 'carryForward', label: 'What would you most like everyone here to remember and carry forward about them?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'pleasureOrMisfortune', label: 'What was your relationship to the deceased, and how long did you have the pleasure — or misfortune — of knowing them?', type: 'textarea', required: true },
        { id: 'unmistakablyThem', label: 'What funny habit, quirk or personality trait made them unmistakably themselves?', type: 'textarea', required: true },
        { id: 'exactlyLikeThem', label: 'What is the funniest story about them that would have everyone who knew them saying, "That sounds exactly like them"?', type: 'textarea', required: true },
        { id: 'sumsUpCharacter', label: 'What memorable mishap, eccentricity or questionable decision perfectly sums up their character?', type: 'textarea', required: true },
        { id: 'knownFor', label: 'What phrase, saying, joke or bit of behaviour were they particularly known for?', type: 'textarea', required: true },
        { id: 'takeThePiss', label: 'If they were here today, what part of this speech would they probably interrupt, correct or take the piss out of you for?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'meanPersonally', label: 'What was your relationship to the deceased, and what did they mean to you personally?', type: 'textarea', required: true },
        { id: 'treasureMost', label: 'What is the memory of them that you treasure most?', type: 'textarea', required: true },
        { id: 'lastingImpression', label: 'What quality, kindness or part of their character made such a lasting impression on you?', type: 'textarea', required: true },
        { id: 'feltLoved', label: 'Can you describe a moment when they made you — or someone else — feel particularly loved, supported or valued?', type: 'textarea', required: true },
        { id: 'neverForgotten', label: 'What did they bring to the lives of their family, friends and the people around them that you hope will never be forgotten?', type: 'textarea', required: true },
        { id: 'celebrateOneThing', label: 'If you could celebrate one thing about the life they lived, what would you choose and why?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'troubleTogether', label: 'What was your relationship to the deceased, and what sort of trouble did you regularly find yourselves getting into together?', type: 'textarea', required: true },
        { id: 'ridiculousHabit', label: 'What was their most ridiculous habit, obsession or personality trait that everyone who knew them will immediately recognise?', type: 'textarea', required: true },
        { id: 'onlyBeTrue', label: 'What story about them is so ridiculous that it could only possibly be true?', type: 'textarea', required: true },
        { id: 'hillToDieOn', label: 'What completely unnecessary argument, eccentric opinion or hill were they prepared to die on?', type: 'textarea', required: true },
        { id: 'rememberThat', label: 'What piece of classic behaviour from them would have everyone in the room saying, "Oh God, I remember that"?', type: 'textarea', required: true },
        { id: 'fiveMinutes', label: 'If they could magically appear for five minutes during this celebration, what would they immediately take the piss out of?', type: 'textarea', required: true }
      ]
    },

    // Memorial - Charity Gala / Fundraiser
    'charity-gala-fundraiser': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'causeConnection', label: 'What charity, cause or organisation is the event supporting, and what is your connection to it?', type: 'textarea', required: true },
        { id: 'whyCauseImportant', label: 'Why is this cause important to you, the organisation or the people you are here to support?', type: 'textarea', required: true },
        { id: 'differenceExample', label: 'What difference does the charity\'s work make, and is there a particular example that demonstrates its impact?', type: 'textarea', required: true },
        { id: 'orgMilestone', label: 'What achievement, milestone or progress has the organisation made that deserves recognition tonight?', type: 'textarea', required: true },
        { id: 'deservesThanks', label: 'Who deserves particular thanks for their work, support, fundraising or contribution to the cause?', type: 'textarea', required: true },
        { id: 'inspiredToContribute', label: 'What would you like guests to take away from tonight and feel inspired to contribute towards?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'howInvolved', label: 'What charity, cause or organisation are we raising money for, and how did you become involved with it?', type: 'textarea', required: true },
        { id: 'chaoticThing', label: 'What funny, unexpected or slightly chaotic thing has happened while supporting the cause?', type: 'textarea', required: true },
        { id: 'ridiculousFundraising', label: 'What is the most ridiculous fundraising idea, challenge or event you\'ve encountered — and did it actually work?', type: 'textarea', required: true },
        { id: 'gentleRoasting', label: 'Who involved with the charity deserves a gentle public roasting for their particular contribution, habit or fundraising obsession?', type: 'textarea', required: true },
        { id: 'strangestDone', label: 'What is the strangest thing you have done, worn, eaten, endured or persuaded other people to do in the name of raising money?', type: 'textarea', required: true },
        { id: 'partWithMoney', label: 'What can you say tonight that might persuade people to part with their money while still keeping a smile on their faces?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'personalConnection', label: 'What charity, cause or organisation are we supporting, and what is your personal connection to it?', type: 'textarea', required: true },
        { id: 'firstImportant', label: 'What personal experience first made this cause important to you?', type: 'textarea', required: true },
        { id: 'realDifferenceStory', label: 'Can you share a story that shows the real difference this charity makes to someone\'s life?', type: 'textarea', required: true },
        { id: 'whoInspired', label: 'Who has inspired you through their connection to the cause, and what have they taught you?', type: 'textarea', required: true },
        { id: 'supportMeans', label: 'What does the support of everyone in this room mean to the people or communities the charity serves?', type: 'textarea', required: true },
        { id: 'oneReason', label: 'If you could leave everyone tonight with one heartfelt reason to support this cause, what would you want them to remember?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'howEndUp', label: 'What exactly are we raising money for, and how on earth did you end up getting involved?', type: 'textarea', required: true },
        { id: 'doItAgain', label: 'What is the most ridiculous thing you\'ve done in the name of fundraising — and would you willingly do it again?', type: 'textarea', required: true },
        { id: 'soundedTerrible', label: 'What fundraising challenge, event or idea sounded absolutely terrible when suggested but somehow became a success?', type: 'textarea', required: true },
        { id: 'publiclyMocked', label: 'Who deserves to be publicly mocked tonight for their heroic, ridiculous or slightly obsessive approach to raising money?', type: 'textarea', required: true },
        { id: 'extractMoney', label: 'What is the strangest donation, fundraising stunt or attempt to extract money from innocent members of the public you\'ve encountered?', type: 'textarea', required: true },
        { id: 'walletsArgument', label: 'If everyone\'s wallets could hear one final argument before tonight\'s donations, what would you say to them?', type: 'textarea', required: true }
      ]
    },

    // Memorial - Tribute to Mentor
    'tribute-to-mentor': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'mentoredIn', label: 'What area, subject or stage of your life or career did this person mentor you in, and what was the nature of your relationship?', type: 'textarea', required: true },
        { id: 'greatestImpact', label: 'What knowledge, experience or guidance did they give you that had the greatest impact?', type: 'textarea', required: true },
        { id: 'adviceStayed', label: 'Was there a particular piece of advice or lesson from them that has stayed with you?', type: 'textarea', required: true },
        { id: 'influencedDevelopment', label: 'How did their mentorship influence your development, confidence or direction?', type: 'textarea', required: true },
        { id: 'effectiveQualities', label: 'What qualities made them such an effective or respected mentor?', type: 'textarea', required: true },
        { id: 'thankForCarry', label: 'What would you most like to thank them for, and what do you hope to carry forward from their influence?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'endedUpUnder', label: 'What did they mentor you in, and how did you first end up under their guidance?', type: 'textarea', required: true },
        { id: 'funniestLesson', label: 'What is the funniest lesson, piece of advice or memorable exchange you had with them?', type: 'textarea', required: true },
        { id: 'drumIntoYou', label: 'What habit, phrase or particular way of doing things did they repeatedly try to drum into you?', type: 'textarea', required: true },
        { id: 'watchedYouMake', label: 'What mistake did they have to watch you make before you finally listened to them?', type: 'textarea', required: true },
        { id: 'mentoringHabit', label: 'What amusing personality trait or mentoring habit made them unmistakably themselves?', type: 'textarea', required: true },
        { id: 'finalAdvice', label: 'If they could give you one final piece of advice today, what would it probably be — and would you actually listen this time?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'importantRole', label: 'What did they mentor you in, and how did they come to play such an important role in your life?', type: 'textarea', required: true },
        { id: 'sawInYou', label: 'What did they see in you that perhaps you did not yet see in yourself?', type: 'textarea', required: true },
        { id: 'changedDirection', label: 'Is there a particular lesson, conversation or moment with them that fundamentally changed your direction?', type: 'textarea', required: true },
        { id: 'affectedConfidence', label: 'How did their support affect your confidence, ambitions or belief in what you could achieve?', type: 'textarea', required: true },
        { id: 'wisdomStayed', label: 'What part of their character or wisdom has stayed with you long after their guidance was needed?', type: 'textarea', required: true },
        { id: 'meantToYou', label: 'If you could tell them what their mentorship ultimately meant to you, what would you want them to know?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'becameTheirProblem', label: 'What did they actually mentor you in, and how did you end up becoming their problem?', type: 'textarea', required: true },
        { id: 'ignoredAdvice', label: 'What is the most memorable piece of advice they gave you — whether you followed it or spectacularly ignored it?', type: 'textarea', required: true },
        { id: 'admittedRight', label: 'What mistake did you repeatedly make despite them telling you not to, and how long did it take before you finally admitted they were right?', type: 'textarea', required: true },
        { id: 'stillHearThem', label: 'What ridiculous phrase, rule, habit or bit of wisdom did they inflict upon you so often that you can still hear them saying it?', type: 'textarea', required: true },
        { id: 'competentHuman', label: 'What is the funniest thing that happened between you while they were attempting to turn you into a competent human being?', type: 'textarea', required: true },
        { id: 'finalReport', label: 'If they had to write your final report as their mentee, what brutally honest comment would they put at the bottom?', type: 'textarea', required: true }
      ]
    },

    // Memorial - Thank You Speech
    'thank-you-speech': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'whoThanking', label: 'Who are you thanking, and what specifically are you thanking them for?', type: 'textarea', required: true },
        { id: 'meaningfulDifference', label: 'What did they do, contribute or provide that made a meaningful difference to you?', type: 'textarea', required: true },
        { id: 'especiallyImportant', label: 'Was there a particular moment when their help or support was especially important?', type: 'textarea', required: true },
        { id: 'appreciateQualities', label: 'What qualities or actions of theirs do you particularly appreciate?', type: 'textarea', required: true },
        { id: 'affectedOutcome', label: 'How has their support affected you, your situation or the outcome you are celebrating?', type: 'textarea', required: true },
        { id: 'genuinelyGrateful', label: 'What would you most like them to know about how genuinely grateful you are?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'neededHelp', label: 'Who are you thanking, what did they do for you, and how did you somehow end up needing their help in the first place?', type: 'textarea', required: true },
        { id: 'chaoticAlongWay', label: 'What funny, unexpected or slightly chaotic thing happened along the way?', type: 'textarea', required: true },
        { id: 'putUpWithYou', label: 'Did they have to put up with any of your bad decisions, incompetence or questionable behaviour while helping you?', type: 'textarea', required: true },
        { id: 'amusingQuality', label: 'What amusing quality, habit or characteristic of theirs deserves a mention?', type: 'textarea', required: true },
        { id: 'savedTheDay', label: 'Is there a particular moment when their help saved the day — or at least stopped things getting considerably worse?', type: 'textarea', required: true },
        { id: 'entertainingThanks', label: 'If you had to thank them in the most entertaining way possible, what would you absolutely have to mention?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'meanToYou', label: 'Who are you thanking, why are you thanking them, and what do they mean to you personally?', type: 'textarea', required: true },
        { id: 'genuinelyNeeded', label: 'What did they do for you at a time when you genuinely needed their support?', type: 'textarea', required: true },
        { id: 'neverForget', label: 'Is there a particular moment of kindness, generosity or encouragement that you will never forget?', type: 'textarea', required: true },
        { id: 'changedCircumstances', label: 'How did their actions affect you or change your circumstances?', type: 'textarea', required: true },
        { id: 'particularlyMeaningful', label: 'What is it about this person that makes their support particularly meaningful to you?', type: 'textarea', required: true },
        { id: 'oneThing', label: 'If you could make sure they understood just one thing about how much their support meant to you, what would you say?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'gotInvolvedIn', label: 'Who are you thanking, why do they deserve your thanks, and what exactly did they get themselves involved in?', type: 'textarea', required: true },
        { id: 'ridiculousSituation', label: 'What ridiculous situation did they have to endure while helping you?', type: 'textarea', required: true },
        { id: 'deservesApology', label: 'What did they have to put up with from you that probably deserves an apology alongside the thank-you?', type: 'textarea', required: true },
        { id: 'hasToBeIncluded', label: 'What funny habit, personality trait or moment from them absolutely has to be included?', type: 'textarea', required: true },
        { id: 'savingYourArse', label: 'What is the most entertaining example of them saving your arse, despite probably wondering why they bothered?', type: 'textarea', required: true },
        { id: 'inappropriateAward', label: 'If this thank-you came with an award, what completely inappropriate award would you give them?', type: 'textarea', required: true }
      ]
    },

    // Memorial - Legacy Event
    'legacy-event': {
      base: [],
      showAllToneQuestions: true,
      serious: [
        { id: 'legacyOccasion', label: 'What is the legacy being recognised or celebrated, and what is the occasion?', type: 'textarea', required: true },
        { id: 'heartOfLegacy', label: 'Who or what is at the heart of that legacy, and what have they achieved or contributed?', type: 'textarea', required: true },
        { id: 'mostSignificant', label: 'What aspect of this legacy do you think is most significant?', type: 'textarea', required: true },
        { id: 'bestRepresents', label: 'Is there a particular achievement, story or moment that best represents what is being celebrated?', type: 'textarea', required: true },
        { id: 'affectedPeople', label: 'How has this person, group, organisation, idea or achievement affected the people around it?', type: 'textarea', required: true },
        { id: 'continueEndure', label: 'What do you hope will continue or endure as a result of this legacy?', type: 'textarea', required: true }
      ],
      humorous: [
        { id: 'cameAbout', label: 'What exactly are we here to celebrate, and how did this whole legacy come about?', type: 'textarea', required: true },
        { id: 'responsibleFunny', label: 'Who or what is responsible for the legacy, and what is the funniest thing you remember about them or it?', type: 'textarea', required: true },
        { id: 'sumsItUp', label: 'What story, incident or memorable moment best sums up what we\'re celebrating?', type: 'textarea', required: true },
        { id: 'unusualTradition', label: 'What unusual habit, tradition, personality trait or bit of history has become part of the legacy?', type: 'textarea', required: true },
        { id: 'surpriseMost', label: 'What would probably surprise people most about how this legacy came about?', type: 'textarea', required: true },
        { id: 'oneAmusingStory', label: 'If the legacy could be summed up in one amusing story, what would you tell?', type: 'textarea', required: true }
      ],
      emotional: [
        { id: 'meanPersonally', label: 'What are we here to celebrate, and what does this legacy mean to you personally?', type: 'textarea', required: true },
        { id: 'greatestInfluence', label: 'Who or what has had the greatest influence on the legacy, and why has that influence mattered?', type: 'textarea', required: true },
        { id: 'capturesIt', label: 'Is there a particular memory or moment that captures what this legacy means to you?', type: 'textarea', required: true },
        { id: 'changedLives', label: 'How has this person, group, organisation, achievement or idea changed the lives of others?', type: 'textarea', required: true },
        { id: 'neverForgotten', label: 'What part of the legacy do you hope will never be forgotten?', type: 'textarea', required: true },
        { id: 'carryForward', label: 'What would you most like people to carry forward from what we are celebrating today?', type: 'textarea', required: true }
      ],
      banter: [
        { id: 'becameALegacy', label: 'What exactly are we celebrating, and how the hell did it become a legacy?', type: 'textarea', required: true },
        { id: 'mostRidiculousThing', label: 'Who or what is responsible for it, and what is the most ridiculous thing associated with them or it?', type: 'textarea', required: true },
        { id: 'sheerNonsense', label: 'What story best demonstrates the sheer nonsense, chaos or questionable decisions behind this legacy?', type: 'textarea', required: true },
        { id: 'survivedLong', label: 'What bizarre habit, tradition, incident or achievement has somehow survived long enough to become part of the history?', type: 'textarea', required: true },
        { id: 'notWantMentioned', label: 'What would the people responsible for this legacy absolutely not want mentioned tonight?', type: 'textarea', required: true },
        { id: 'oneRidiculousThing', label: 'If this legacy had to be remembered for one completely ridiculous thing, what should it be?', type: 'textarea', required: true }
      ]
    }
  };
  
  // Map occasion types to question sets (handles variations)
  var occasionMapping = {
    'best-man': 'best-man',
    'best-man-woman-person': 'best-man',  // Renamed option, same question set
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
    'promotion-welcome': 'promotion-welcome',  // Own dedicated questions
    'keynote-panel': 'keynote-panel',  // Own dedicated questions
    'town-hall': 'retirement-farewell',
    'product-launch-pitch': 'retirement-farewell',
    'award-acceptance': 'award-acceptance',  // Own dedicated questions
    'award-presentation': 'award-presentation',  // Own dedicated questions
    'big-birthday-30th-50th-etc-': 'big-birthday-30th-50th-etc-',
    'anniversary': 'big-birthday-30th-50th-etc-',
    'graduation': 'graduation',  // Own dedicated questions
    'bar-bat-mitzvah': 'bar-bat-mitzvah',  // Own dedicated questions
    'quinceañera': 'big-birthday-30th-50th-etc-',
    'housewarming-grand-opening': 'big-birthday-30th-50th-etc-',
    'eulogy': 'eulogy',
    'celebration-of-life': 'celebration-of-life',  // Own dedicated questions
    'charity-gala-fundraiser': 'charity-gala-fundraiser',  // Has its own questions now!
    'wedding-guest-toast': 'wedding-guest-toast',  // Has its own 6 questions per tone!
    'anniversary-party': 'anniversary-party',  // Has its own 6 questions per tone!
    'company-anniversary': 'company-anniversary',  // Own dedicated questions
    'engagement-party': 'engagement-party',  // Own dedicated questions
    'baby-shower': 'baby-shower',  // Own dedicated questions
    'retirement-party': 'retirement-party',  // Own dedicated questions
    'achievement-celebration': 'achievement-celebration',  // Own dedicated questions
    'tribute-to-mentor': 'tribute-to-mentor',  // Own dedicated questions
    'thank-you-speech': 'thank-you-speech',  // Own dedicated questions
    'legacy-event': 'legacy-event'  // Own dedicated questions
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
      // Show all questions for sets flagged showAllToneQuestions; otherwise first 3 to keep it manageable
      var toneQuestions = questionSet[tone];
      var numToShow = questionSet.showAllToneQuestions ? toneQuestions.length : Math.min(3, toneQuestions.length);
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
      input.setAttribute('data-question-label', question.label);
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
          // Use the full question text as the key so the AI sees exactly what was asked
          var questionKey = input.getAttribute('data-question-label') || name;
          data.questionnaire[questionKey] = value;
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
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var user = window.netlifyIdentity ? netlifyIdentity.currentUser() : null;
      
      var data = {
        name: formData.get('contactName'),
        email: formData.get('contactEmail'),
        subject: formData.get('contactSubject'),
        message: formData.get('contactMessage'),
        userId: user ? user.id : null
      };
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      
      // Submit to backend AI mailer - generates a reply, emails the
      // customer + business copy, and logs it to dashboard Messages
      fetch('https://superspeech-backend.onrender.com/api/webhooks/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(response) {
        return response.json().catch(function() { return {}; }).then(function(d) {
          return { ok: response.ok, data: d };
        });
      })
      .then(function(result) {
        if (result.ok && result.data.success !== false) {
          contactForm.style.display = 'none';
          contactSuccess.style.display = 'block';
          console.log('Contact form submitted to AI mailer');
        } else {
          throw new Error((result.data && result.data.error) || 'Send failed');
        }
      })
      .catch(function(error) {
        console.error('Error submitting contact form:', error);
        alert('Error sending message. Please try again in a moment.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
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
