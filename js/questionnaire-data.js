/**
 * SuperSpeech - Complete Questionnaire Data
 * Tier-based, tone-aware questions for all occasions
 */

const QUESTIONNAIRE_DATA = {
  // WEDDING & ROMANCE
  'best-man': {
    core: [
      { id: 'subjectNames', label: 'Names of the couple getting married', type: 'text', required: true },
      { id: 'groomName', label: 'Groom\'s full name', type: 'text', required: true },
      { id: 'brideName', label: 'Bride\'s full name', type: 'text', required: true },
      { id: 'relationship', label: 'How do you know the groom?', type: 'text', required: true },
      { id: 'firstMet', label: 'When and how did you first meet the groom?', type: 'textarea', required: true },
      { id: 'memorableStory', label: 'Share a memorable story about the groom', type: 'textarea', required: true }
    ],
    toast: {
      serious: [
        { id: 'groomQualities', label: 'What qualities do you admire most in the groom?', type: 'textarea' },
        { id: 'coupleStrength', label: 'What makes this couple strong together?', type: 'textarea' }
      ],
      humorous: [
        { id: 'funnyMoment', label: 'Funniest moment you\'ve shared with the groom?', type: 'textarea' },
        { id: 'embarrassingStory', label: 'Light-hearted embarrassing story (keep it clean!)', type: 'textarea' }
      ],
      emotional: [
        { id: 'emotionalMoment', label: 'Most touching moment you\'ve witnessed with the couple?', type: 'textarea' },
        { id: 'groomTransformation', label: 'How has love changed the groom for the better?', type: 'textarea' }
      ],
      banter: [
        { id: 'roastMaterial', label: 'What can we lovingly roast the groom about?', type: 'textarea' },
        { id: 'beforeAfter', label: 'How was the groom before vs. after meeting the bride?', type: 'textarea' }
      ]
    },
    speech: {
      serious: [
        { id: 'groomQualities', label: 'What qualities do you admire most in the groom?', type: 'textarea' },
        { id: 'coupleStrength', label: 'What makes this couple strong together?', type: 'textarea' },
        { id: 'brideImpact', label: 'How has the bride positively impacted the groom?', type: 'textarea' },
        { id: 'futureWishes', label: 'What are your wishes for their future together?', type: 'textarea' },
        { id: 'adviceMarriage', label: 'What marriage advice would you give them?', type: 'textarea' },
        { id: 'coupleJourney', label: 'Describe their journey from dating to marriage', type: 'textarea' }
      ],
      humorous: [
        { id: 'funnyMoment', label: 'Funniest moment you\'ve shared with the groom?', type: 'textarea' },
        { id: 'embarrassingStory', label: 'Light-hearted embarrassing story (keep it clean!)', type: 'textarea' },
        { id: 'datingDays', label: 'Funny story from their dating days', type: 'textarea' },
        { id: 'groomHabits', label: 'What quirky habits does the groom have?', type: 'textarea' },
        { id: 'singleDays', label: 'What was the groom like when he was single?', type: 'textarea' },
        { id: 'proposal', label: 'Any funny details about how they got engaged?', type: 'textarea' }
      ],
      emotional: [
        { id: 'emotionalMoment', label: 'Most touching moment you\'ve witnessed with the couple?', type: 'textarea' },
        { id: 'groomTransformation', label: 'How has love changed the groom for the better?', type: 'textarea' },
        { id: 'witnessedLove', label: 'When did you realize they were meant for each other?', type: 'textarea' },
        { id: 'brideQualities', label: 'What special qualities does the bride bring out in the groom?', type: 'textarea' },
        { id: 'proudMoment', label: 'What makes you most proud of the groom today?', type: 'textarea' },
        { id: 'familyWelcome', label: 'What does it mean to welcome the bride into your lives?', type: 'textarea' }
      ],
      banter: [
        { id: 'roastMaterial', label: 'What can we lovingly roast the groom about?', type: 'textarea' },
        { id: 'beforeAfter', label: 'How was the groom before vs. after meeting the bride?', type: 'textarea' },
        { id: 'competitiveStory', label: 'Any competitive or silly moments between you two?', type: 'textarea' },
        { id: 'brideWinning', label: 'How does the bride always win arguments?', type: 'textarea' },
        { id: 'groomFails', label: 'Memorable fails or mishaps (that you can laugh about now)', type: 'textarea' },
        { id: 'insideJokes', label: 'Any inside jokes worth sharing (that make sense to everyone)?', type: 'textarea' }
      ]
    },
    keynote: {
      serious: [
        { id: 'groomQualities', label: 'What qualities do you admire most in the groom?', type: 'textarea' },
        { id: 'coupleStrength', label: 'What makes this couple strong together?', type: 'textarea' },
        { id: 'brideImpact', label: 'How has the bride positively impacted the groom?', type: 'textarea' },
        { id: 'futureWishes', label: 'What are your wishes for their future together?', type: 'textarea' },
        { id: 'adviceMarriage', label: 'What marriage advice would you give them?', type: 'textarea' },
        { id: 'coupleJourney', label: 'Describe their journey from dating to marriage', type: 'textarea' },
        { id: 'sharedValues', label: 'What values do they share that will sustain their marriage?', type: 'textarea' },
        { id: 'challengesOvercome', label: 'What challenges have they already overcome together?', type: 'textarea' },
        { id: 'groomGrowth', label: 'How have you seen the groom grow as a person?', type: 'textarea' },
        { id: 'coupleInspiration', label: 'How does this couple inspire you?', type: 'textarea' },
        { id: 'familySignificance', label: 'What does this marriage mean to family and friends?', type: 'textarea' },
        { id: 'legacyWishes', label: 'What legacy do you hope they build together?', type: 'textarea' }
      ],
      humorous: [
        { id: 'funnyMoment', label: 'Funniest moment you\'ve shared with the groom?', type: 'textarea' },
        { id: 'embarrassingStory', label: 'Light-hearted embarrassing story (keep it clean!)', type: 'textarea' },
        { id: 'datingDays', label: 'Funny story from their dating days', type: 'textarea' },
        { id: 'groomHabits', label: 'What quirky habits does the groom have?', type: 'textarea' },
        { id: 'singleDays', label: 'What was the groom like when he was single?', type: 'textarea' },
        { id: 'proposal', label: 'Any funny details about how they got engaged?', type: 'textarea' },
        { id: 'coupleQuirks', label: 'What quirks do they have as a couple?', type: 'textarea' },
        { id: 'firstImpressionBride', label: 'What was your first impression of the bride?', type: 'textarea' },
        { id: 'groomDatingFails', label: 'Any funny dating fails before meeting the bride?', type: 'textarea' },
        { id: 'weddingPrep', label: 'Any funny stories from wedding preparations?', type: 'textarea' },
        { id: 'groomPredictions', label: 'What did you predict for the groom\'s future? Were you right?', type: 'textarea' },
        { id: 'marriedLifeJokes', label: 'What jokes can you make about their upcoming married life?', type: 'textarea' }
      ],
      emotional: [
        { id: 'emotionalMoment', label: 'Most touching moment you\'ve witnessed with the couple?', type: 'textarea' },
        { id: 'groomTransformation', label: 'How has love changed the groom for the better?', type: 'textarea' },
        { id: 'witnessedLove', label: 'When did you realize they were meant for each other?', type: 'textarea' },
        { id: 'brideQualities', label: 'What special qualities does the bride bring out in the groom?', type: 'textarea' },
        { id: 'proudMoment', label: 'What makes you most proud of the groom today?', type: 'textarea' },
        { id: 'familyWelcome', label: 'What does it mean to welcome the bride into your lives?', type: 'textarea' },
        { id: 'difficultTimes', label: 'How have they supported each other through difficult times?', type: 'textarea' },
        { id: 'loveStory', label: 'What makes their love story special and unique?', type: 'textarea' },
        { id: 'groomVulnerable', label: 'Moment when the groom was most vulnerable or open with you', type: 'textarea' },
        { id: 'familyBond', label: 'How has this relationship strengthened family bonds?', type: 'textarea' },
        { id: 'gratitude', label: 'What are you most grateful for about their relationship?', type: 'textarea' },
        { id: 'hopeFuture', label: 'What gives you hope about their future together?', type: 'textarea' }
      ],
      banter: [
        { id: 'roastMaterial', label: 'What can we lovingly roast the groom about?', type: 'textarea' },
        { id: 'beforeAfter', label: 'How was the groom before vs. after meeting the bride?', type: 'textarea' },
        { id: 'competitiveStory', label: 'Any competitive or silly moments between you two?', type: 'textarea' },
        { id: 'brideWinning', label: 'How does the bride always win arguments?', type: 'textarea' },
        { id: 'groomFails', label: 'Memorable fails or mishaps (that you can laugh about now)', type: 'textarea' },
        { id: 'insideJokes', label: 'Any inside jokes worth sharing (that make sense to everyone)?', type: 'textarea' },
        { id: 'roastBride', label: 'Light roasting of the bride (all in good fun)', type: 'textarea' },
        { id: 'coupleArguments', label: 'What silly things do they argue about?', type: 'textarea' },
        { id: 'groomWhipped', label: 'How whipped is the groom? (Examples welcome)', type: 'textarea' },
        { id: 'badAdvice', label: 'What\'s the worst advice you could give them?', type: 'textarea' },
        { id: 'predictions', label: 'Bold predictions for their married life', type: 'textarea' },
        { id: 'groomSecrets', label: 'Harmless secrets about the groom the bride should know', type: 'textarea' }
      ]
    }
  },

  'maid-of-honour': {
    core: [
      { id: 'subjectNames', label: 'Names of the couple getting married', type: 'text', required: true },
      { id: 'brideName', label: 'Bride\'s full name', type: 'text', required: true },
      { id: 'groomName', label: 'Groom\'s full name', type: 'text', required: true },
      { id: 'relationship', label: 'How do you know the bride?', type: 'text', required: true },
      { id: 'firstMet', label: 'When and how did you first meet the bride?', type: 'textarea', required: true },
      { id: 'memorableStory', label: 'Share a memorable story about the bride', type: 'textarea', required: true }
    ],
    toast: {
      serious: [
        { id: 'brideQualities', label: 'What qualities do you admire most in the bride?', type: 'textarea' },
        { id: 'coupleStrength', label: 'What makes this couple strong together?', type: 'textarea' }
      ],
      humorous: [
        { id: 'funnyMoment', label: 'Funniest moment you\'ve shared with the bride?', type: 'textarea' },
        { id: 'embarrassingStory', label: 'Light-hearted embarrassing story (keep it clean!)', type: 'textarea' }
      ],
      emotional: [
        { id: 'emotionalMoment', label: 'Most touching moment you\'ve witnessed?', type: 'textarea' },
        { id: 'brideTransformation', label: 'How has love changed the bride?', type: 'textarea' }
      ],
      banter: [
        { id: 'roastMaterial', label: 'What can we lovingly roast the bride about?', type: 'textarea' },
        { id: 'singleDays', label: 'What was the bride like when single?', type: 'textarea' }
      ]
    },
    speech: {
      serious: [
        { id: 'brideQualities', label: 'What qualities do you admire most in the bride?', type: 'textarea' },
        { id: 'coupleStrength', label: 'What makes this couple strong together?', type: 'textarea' },
        { id: 'groomImpact', label: 'How has the groom positively impacted the bride?', type: 'textarea' },
        { id: 'futureWishes', label: 'What are your wishes for their future?', type: 'textarea' },
        { id: 'adviceMarriage', label: 'What marriage advice would you give?', type: 'textarea' },
        { id: 'friendshipMeaning', label: 'What does your friendship with the bride mean?', type: 'textarea' }
      ],
      humorous: [
        { id: 'funnyMoment', label: 'Funniest moment with the bride?', type: 'textarea' },
        { id: 'embarrassingStory', label: 'Embarrassing story (keep it clean!)', type: 'textarea' },
        { id: 'datingStories', label: 'Funny dating stories before the groom', type: 'textarea' },
        { id: 'brideQuirks', label: 'What quirky habits does the bride have?', type: 'textarea' },
        { id: 'weddingDrama', label: 'Any wedding planning drama/comedy?', type: 'textarea' },
        { id: 'bridalParty', label: 'Funny moments from being in the bridal party', type: 'textarea' }
      ],
      emotional: [
        { id: 'emotionalMoment', label: 'Most touching moment witnessed?', type: 'textarea' },
        { id: 'brideTransformation', label: 'How has love changed the bride?', type: 'textarea' },
        { id: 'perfectMatch', label: 'When did you know the groom was perfect for her?', type: 'textarea' },
        { id: 'groomQualities', label: 'What special qualities does the groom have?', type: 'textarea' },
        { id: 'proudMoment', label: 'When were you most proud of the bride?', type: 'textarea' },
        { id: 'friendshipJourney', label: 'How has your friendship evolved over the years?', type: 'textarea' }
      ],
      banter: [
        { id: 'roastMaterial', label: 'Lovingly roast the bride', type: 'textarea' },
        { id: 'singleDays', label: 'Bride when she was single', type: 'textarea' },
        { id: 'brideSecrets', label: 'Harmless secrets the groom should know', type: 'textarea' },
        { id: 'wildStories', label: 'Tame wild stories from the past', type: 'textarea' },
        { id: 'brideHabits', label: 'Annoying habits the groom must accept', type: 'textarea' },
        { id: 'roastGroom', label: 'Light roasting of the groom too', type: 'textarea' }
      ]
    },
    keynote: {
      serious: [
        { id: 'brideQualities', label: 'Qualities you admire in the bride?', type: 'textarea' },
        { id: 'coupleStrength', label: 'What makes this couple strong?', type: 'textarea' },
        { id: 'groomImpact', label: 'Groom\'s positive impact on bride?', type: 'textarea' },
        { id: 'futureWishes', label: 'Wishes for their future?', type: 'textarea' },
        { id: 'adviceMarriage', label: 'Marriage advice for them?', type: 'textarea' },
        { id: 'friendshipMeaning', label: 'Meaning of your friendship?', type: 'textarea' },
        { id: 'brideGrowth', label: 'How has the bride grown?', type: 'textarea' },
        { id: 'coupleJourney', label: 'Their journey together', type: 'textarea' },
        { id: 'sharedValues', label: 'Values they share', type: 'textarea' },
        { id: 'brideInspiration', label: 'How does she inspire you?', type: 'textarea' },
        { id: 'familyMeaning', label: 'What this marriage means', type: 'textarea' },
        { id: 'legacyHope', label: 'Legacy you hope they build', type: 'textarea' }
      ],
      humorous: [
        { id: 'funnyMoment', label: 'Funniest moment?', type: 'textarea' },
        { id: 'embarrassingStory', label: 'Embarrassing story?', type: 'textarea' },
        { id: 'datingStories', label: 'Dating stories?', type: 'textarea' },
        { id: 'brideQuirks', label: 'Bride\'s quirks?', type: 'textarea' },
        { id: 'weddingDrama', label: 'Wedding planning comedy?', type: 'textarea' },
        { id: 'bridalParty', label: 'Bridal party moments?', type: 'textarea' },
        { id: 'coupleQuirks', label: 'Couple\'s quirks together?', type: 'textarea' },
        { id: 'groomFirstImpression', label: 'First impression of groom?', type: 'textarea' },
        { id: 'brideDating', label: 'Bride\'s dating history humor?', type: 'textarea' },
        { id: 'weddingPrep', label: 'Wedding prep stories?', type: 'textarea' },
        { id: 'predictions', label: 'Predictions for married life?', type: 'textarea' },
        { id: 'brideSecrets', label: 'Secrets groom should know?', type: 'textarea' }
      ],
      emotional: [
        { id: 'emotionalMoment', label: 'Most touching moment?', type: 'textarea' },
        { id: 'brideTransformation', label: 'How love changed bride?', type: 'textarea' },
        { id: 'perfectMatch', label: 'When did you know?', type: 'textarea' },
        { id: 'groomQualities', label: 'Groom\'s special qualities?', type: 'textarea' },
        { id: 'proudMoment', label: 'Proudest moment?', type: 'textarea' },
        { id: 'friendshipJourney', label: 'Friendship evolution?', type: 'textarea' },
        { id: 'difficultTimes', label: 'Support through hard times?', type: 'textarea' },
        { id: 'loveStory', label: 'What makes their love special?', type: 'textarea' },
        { id: 'brideVulnerable', label: 'Vulnerable moment shared?', type: 'textarea' },
        { id: 'friendshipBond', label: 'Your bond with bride?', type: 'textarea' },
        { id: 'gratitude', label: 'What are you grateful for?', type: 'textarea' },
        { id: 'hopeFuture', label: 'Hope for their future?', type: 'textarea' }
      ],
      banter: [
        { id: 'roastMaterial', label: 'Roast the bride?', type: 'textarea' },
        { id: 'singleDays', label: 'Single bride stories?', type: 'textarea' },
        { id: 'brideSecrets', label: 'Bride\'s secrets?', type: 'textarea' },
        { id: 'wildStories', label: 'Wild (tame) stories?', type: 'textarea' },
        { id: 'brideHabits', label: 'Annoying habits?', type: 'textarea' },
        { id: 'roastGroom', label: 'Roast groom too?', type: 'textarea' },
        { id: 'coupleArguments', label: 'What they argue about?', type: 'textarea' },
        { id: 'groomWhipped', label: 'Is groom whipped?', type: 'textarea' },
        { id: 'badAdvice', label: 'Worst advice?', type: 'textarea' },
        { id: 'predictions', label: 'Bold predictions?', type: 'textarea' },
        { id: 'brideBoss', label: 'Who\'s really the boss?', type: 'textarea' },
        { id: 'marriageReality', label: 'Marriage reality check?', type: 'textarea' }
      ]
    }
  },

  'parent-bride-groom': {
    core: [
      { id: 'subjectNames', label: 'Names of the couple getting married', type: 'text', required: true },
      { id: 'parentRole', label: 'Are you the mother or father of the bride or groom?', type: 'select', options: ['Mother of Bride', 'Father of Bride', 'Mother of Groom', 'Father of Groom'], required: true },
      { id: 'childName', label: 'Your child\'s full name', type: 'text', required: true },
      { id: 'spouseName', label: 'Your child\'s spouse\'s name', type: 'text', required: true },
      { id: 'childhoodMemory', label: 'Favorite childhood memory of your child', type: 'textarea', required: true },
      { id: 'grownUp', label: 'How have you seen them grow into the person they are today?', type: 'textarea', required: true }
    ],
    toast: {
      serious: [
        { id: 'proudMoment', label: 'What makes you most proud?', type: 'textarea' },
        { id: 'welcomeSpouse', label: 'What does it mean to welcome their spouse?', type: 'textarea' }
      ],
      humorous: [
        { id: 'funnyChildhood', label: 'Funny childhood story?', type: 'textarea' },
        { id: 'parentingMoment', label: 'Humorous parenting moment?', type: 'textarea' }
      ],
      emotional: [
        { id: 'emotionalMoment', label: 'Most emotional moment as a parent?', type: 'textarea' },
        { id: 'lettingGo', label: 'What does letting go mean to you?', type: 'textarea' }
      ],
      banter: [
        { id: 'embarrassChild', label: 'Mildly embarrassing childhood story?', type: 'textarea' },
        { id: 'parentalAdvice', label: 'Tongue-in-cheek advice?', type: 'textarea' }
      ]
    },
    speech: {
      serious: [
        { id: 'proudMoment', label: 'What makes you proud?', type: 'textarea' },
        { id: 'welcomeSpouse', label: 'Welcoming their spouse?', type: 'textarea' },
        { id: 'parentalWishes', label: 'Your wishes for their marriage?', type: 'textarea' },
        { id: 'spouseQualities', label: 'Qualities you love in their spouse?', type: 'textarea' },
        { id: 'familyLegacy', label: 'Family values you hope they carry forward?', type: 'textarea' },
        { id: 'grownUpMoment', label: 'When did you realize they were all grown up?', type: 'textarea' }
      ],
      humorous: [
        { id: 'funnyChildhood', label: 'Funny childhood story?', type: 'textarea' },
        { id: 'parentingMoment', label: 'Humorous parenting?', type: 'textarea' },
        { id: 'teenageYears', label: 'Teenage antics?', type: 'textarea' },
        { id: 'datingHistory', label: 'Past dating stories?', type: 'textarea' },
        { id: 'firstMeetSpouse', label: 'Meeting their spouse?', type: 'textarea' },
        { id: 'weddingPrep', label: 'Wedding prep comedy?', type: 'textarea' }
      ],
      emotional: [
        { id: 'emotionalMoment', label: 'Emotional parent moment?', type: 'textarea' },
        { id: 'lettingGo', label: 'Letting go feelings?', type: 'textarea' },
        { id: 'perfectMatch', label: 'When did you know spouse was the one?', type: 'textarea' },
        { id: 'parentGratitude', label: 'What are you grateful for?', type: 'textarea' },
        { id: 'childhoodDream', label: 'Dreams you had for your child?', type: 'textarea' },
        { id: 'familyCircle', label: 'Welcoming spouse into family?', type: 'textarea' }
      ],
      banter: [
        { id: 'embarrassChild', label: 'Embarrassing childhood?', type: 'textarea' },
        { id: 'parentalAdvice', label: 'Tongue-in-cheek advice?', type: 'textarea' },
        { id: 'payback', label: 'Payback time for spouse?', type: 'textarea' },
        { id: 'childHabits', label: 'Annoying habits to warn spouse about?', type: 'textarea' },
        { id: 'parentalWarning', label: 'What should spouse know?', type: 'textarea' },
        { id: 'familyQuirks', label: 'Family quirks spouse is joining?', type: 'textarea' }
      ]
    },
    keynote: {
      serious: [
        { id: 'proudMoment', label: 'Proudest moment?', type: 'textarea' },
        { id: 'welcomeSpouse', label: 'Welcoming spouse?', type: 'textarea' },
        { id: 'parentalWishes', label: 'Marriage wishes?', type: 'textarea' },
        { id: 'spouseQualities', label: 'Spouse qualities?', type: 'textarea' },
        { id: 'familyLegacy', label: 'Family legacy?', type: 'textarea' },
        { id: 'grownUpMoment', label: 'Grown-up realization?', type: 'textarea' },
        { id: 'characterGrowth', label: 'Character development?', type: 'textarea' },
        { id: 'parentalJourney', label: 'Your parenting journey?', type: 'textarea' },
        { id: 'coupleStrength', label: 'Couple\'s strengths?', type: 'textarea' },
        { id: 'futureGenerations', label: 'Hope for future generations?', type: 'textarea' },
        { id: 'marriageAdvice', label: 'Marriage advice from experience?', type: 'textarea' },
        { id: 'familyUnity', label: 'Meaning of family unity?', type: 'textarea' },
        { id: 'parentalLove', label: 'Unconditional love message?', type: 'textarea' },
        { id: 'lifeCircle', label: 'Life coming full circle?', type: 'textarea' },
        { id: 'spouseBond', label: 'Bond with new spouse?', type: 'textarea' },
        { id: 'legacyContinues', label: 'How legacy continues?', type: 'textarea' }
      ],
      humorous: [
        { id: 'funnyChildhood', label: 'Funny childhood?', type: 'textarea' },
        { id: 'parentingMoment', label: 'Parenting humor?', type: 'textarea' },
        { id: 'teenageYears', label: 'Teenage years?', type: 'textarea' },
        { id: 'datingHistory', label: 'Dating history?', type: 'textarea' },
        { id: 'firstMeetSpouse', label: 'Meeting spouse?', type: 'textarea' },
        { id: 'weddingPrep', label: 'Wedding prep?', type: 'textarea' },
        { id: 'parentingFails', label: 'Parenting fails?', type: 'textarea' },
        { id: 'childhoodAntics', label: 'Childhood antics?', type: 'textarea' },
        { id: 'schoolYears', label: 'School stories?', type: 'textarea' },
        { id: 'firstDate', label: 'First date stories?', type: 'textarea' },
        { id: 'familyDinners', label: 'Family dinner comedy?', type: 'textarea' },
        { id: 'adviceIgnored', label: 'Advice they ignored?', type: 'textarea' }
      ],
      emotional: [
        { id: 'emotionalMoment', label: 'Emotional moment?', type: 'textarea' },
        { id: 'lettingGo', label: 'Letting go?', type: 'textarea' },
        { id: 'perfectMatch', label: 'Perfect match moment?', type: 'textarea' },
        { id: 'parentGratitude', label: 'Gratitude?', type: 'textarea' },
        { id: 'childhoodDream', label: 'Childhood dreams?', type: 'textarea' },
        { id: 'familyCircle', label: 'Family circle?', type: 'textarea' },
        { id: 'unconditionalLove', label: 'Unconditional love?', type: 'textarea' },
        { id: 'difficultTimes', label: 'Through difficult times?', type: 'textarea' },
        { id: 'parentTransformation', label: 'How parenthood transformed you?', type: 'textarea' },
        { id: 'firstHold', label: 'First time holding them?', type: 'textarea' },
        { id: 'watchingGrow', label: 'Watching them grow?', type: 'textarea' },
        { id: 'spouseAppreciation', label: 'Appreciating spouse?', type: 'textarea' }
      ],
      banter: [
        { id: 'embarrassChild', label: 'Embarrass child?', type: 'textarea' },
        { id: 'parentalAdvice', label: 'Sarcastic advice?', type: 'textarea' },
        { id: 'payback', label: 'Payback?', type: 'textarea' },
        { id: 'childHabits', label: 'Habits warning?', type: 'textarea' },
        { id: 'parentalWarning', label: 'Spouse warnings?', type: 'textarea' },
        { id: 'familyQuirks', label: 'Family quirks?', type: 'textarea' },
        { id: 'survivalGuide', label: 'Survival guide for spouse?', type: 'textarea' },
        { id: 'roastChild', label: 'Lovingly roast child?', type: 'textarea' },
        { id: 'parentalRevenge', label: 'Parental revenge stories?', type: 'textarea' },
        { id: 'marriageReality', label: 'Marriage reality check?', type: 'textarea' },
        { id: 'inLawJokes', label: 'In-law jokes?', type: 'textarea' },
        { id: 'futureGrandkids', label: 'Grandkids expectations?', type: 'textarea' }
      ]
    }
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUESTIONNAIRE_DATA;
}
