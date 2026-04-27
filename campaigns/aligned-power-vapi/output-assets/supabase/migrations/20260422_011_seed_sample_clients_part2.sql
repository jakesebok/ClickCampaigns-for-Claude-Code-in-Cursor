-- Wave 1 demo seed (continued from 20260422_010_seed_sample_clients.sql):
-- - Maya recent (7 days ago) showing trajectory
-- - Darren (struggling)
-- - Sara (Journeyman, 120 days ago)
-- - Leo (Seeker, 40 days ago)

INSERT INTO public.vapi_results (email, first_name, last_name, source, created_at, results) VALUES
('sample-maya@axiom.demo', '[SAMPLE] Maya', 'Chen', 'portal', now() - interval '7 days', jsonb_build_object(
  'overall', 6.4, 'overallTier', 'Functional', 'archetype', 'The Engine',
  'driver', jsonb_build_object('name', 'The Achievers Trap'),
  'arenaScores', jsonb_build_object('Personal', 6.0, 'Relationships', 6.4, 'Business', 7.0),
  'arenaTiers', jsonb_build_object('Personal', 'Functional', 'Relationships', 'Functional', 'Business', 'Functional'),
  'domainScores', jsonb_build_object('PH',5.8,'IA',6.0,'ME',6.2,'AF',6.0,'RS',6.2,'FA',6.5,'CO',6.0,'WI',6.8,'VS',7.4,'EX',7.6,'OH',6.8,'EC',6.2),
  'domains', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','arena','Personal','score',5.8,'tier','Below the Line'),
    jsonb_build_object('code','IA','domain','Inner Alignment','arena','Personal','score',6.0,'tier','Functional'),
    jsonb_build_object('code','ME','domain','Mental & Emotional Health','arena','Personal','score',6.2,'tier','Functional'),
    jsonb_build_object('code','AF','domain','Attention & Focus','arena','Personal','score',6.0,'tier','Functional'),
    jsonb_build_object('code','RS','domain','Relationship to Self','arena','Relationships','score',6.2,'tier','Functional'),
    jsonb_build_object('code','FA','domain','Family','arena','Relationships','score',6.5,'tier','Functional'),
    jsonb_build_object('code','CO','domain','Community','arena','Relationships','score',6.0,'tier','Functional'),
    jsonb_build_object('code','WI','domain','World & Impact','arena','Relationships','score',6.8,'tier','Functional'),
    jsonb_build_object('code','VS','domain','Vision & Strategy','arena','Business','score',7.4,'tier','Functional'),
    jsonb_build_object('code','EX','domain','Execution','arena','Business','score',7.6,'tier','Functional'),
    jsonb_build_object('code','OH','domain','Operational Health','arena','Business','score',6.8,'tier','Functional'),
    jsonb_build_object('code','EC','domain','Ecology','arena','Business','score',6.2,'tier','Functional')
  ),
  'importanceRatings', jsonb_build_object('PH',10,'IA',9,'ME',9,'AF',8,'RS',9,'FA',9,'CO',5,'WI',6,'VS',9,'EX',8,'OH',7,'EC',6),
  'top3', jsonb_build_array(
    jsonb_build_object('code','EX','domain','Execution','score',7.6,'tier','Functional'),
    jsonb_build_object('code','VS','domain','Vision & Strategy','score',7.4,'tier','Functional'),
    jsonb_build_object('code','OH','domain','Operational Health','score',6.8,'tier','Functional')
  ),
  'bottom3', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','score',5.8,'tier','Below the Line'),
    jsonb_build_object('code','IA','domain','Inner Alignment','score',6.0,'tier','Functional'),
    jsonb_build_object('code','CO','domain','Community','score',6.0,'tier','Functional')
  ),
  'priorityMatrix', jsonb_build_object(
    'criticalPriority', jsonb_build_array(
      jsonb_build_object('code','PH','domain','Physical Health','score',5.8,'importance',10,'tier','Below the Line')
    ),
    'protectAndSustain', jsonb_build_array(
      jsonb_build_object('code','IA','domain','Inner Alignment','score',6.0,'importance',9,'tier','Functional'),
      jsonb_build_object('code','ME','domain','Mental & Emotional Health','score',6.2,'importance',9,'tier','Functional'),
      jsonb_build_object('code','AF','domain','Attention & Focus','score',6.0,'importance',8,'tier','Functional'),
      jsonb_build_object('code','RS','domain','Relationship to Self','score',6.2,'importance',9,'tier','Functional'),
      jsonb_build_object('code','FA','domain','Family','score',6.5,'importance',9,'tier','Functional'),
      jsonb_build_object('code','VS','domain','Vision & Strategy','score',7.4,'importance',9,'tier','Functional'),
      jsonb_build_object('code','EX','domain','Execution','score',7.6,'importance',8,'tier','Functional')
    ),
    'monitor', jsonb_build_array(
      jsonb_build_object('code','CO','domain','Community','score',6.0,'importance',5,'tier','Functional'),
      jsonb_build_object('code','EC','domain','Ecology','score',6.2,'importance',6,'tier','Functional'),
      jsonb_build_object('code','WI','domain','World & Impact','score',6.8,'importance',6,'tier','Functional'),
      jsonb_build_object('code','OH','domain','Operational Health','score',6.8,'importance',7,'tier','Functional')
    ),
    'overInvestment', jsonb_build_array()
  ),
  'acquiescence', false, 'allResponses', jsonb_build_object(),
  'contextualProfile', jsonb_build_object('revenueStage','growth','teamSize','6-10','lifeStage','active-family','timeInBusiness','5+_years','primaryChallenge','sustainable-execution')
)),
('sample-darren@axiom.demo', '[SAMPLE] Darren', 'Walsh', 'marketing', now() - interval '75 days', jsonb_build_object(
  'overall', 4.2, 'overallTier', 'Below the Line', 'archetype', 'The Phoenix',
  'driver', jsonb_build_object('name', 'The Escape Artist'),
  'arenaScores', jsonb_build_object('Personal', 3.8, 'Relationships', 4.5, 'Business', 4.3),
  'arenaTiers', jsonb_build_object('Personal', 'In the Red', 'Relationships', 'Below the Line', 'Business', 'Below the Line'),
  'domainScores', jsonb_build_object('PH',3.2,'IA',3.8,'ME',4.0,'AF',4.2,'RS',4.2,'FA',5.0,'CO',4.2,'WI',4.6,'VS',5.5,'EX',4.0,'OH',4.2,'EC',3.5),
  'domains', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','arena','Personal','score',3.2,'tier','In the Red'),
    jsonb_build_object('code','IA','domain','Inner Alignment','arena','Personal','score',3.8,'tier','In the Red'),
    jsonb_build_object('code','ME','domain','Mental & Emotional Health','arena','Personal','score',4.0,'tier','Below the Line'),
    jsonb_build_object('code','AF','domain','Attention & Focus','arena','Personal','score',4.2,'tier','Below the Line'),
    jsonb_build_object('code','RS','domain','Relationship to Self','arena','Relationships','score',4.2,'tier','Below the Line'),
    jsonb_build_object('code','FA','domain','Family','arena','Relationships','score',5.0,'tier','Below the Line'),
    jsonb_build_object('code','CO','domain','Community','arena','Relationships','score',4.2,'tier','Below the Line'),
    jsonb_build_object('code','WI','domain','World & Impact','arena','Relationships','score',4.6,'tier','Below the Line'),
    jsonb_build_object('code','VS','domain','Vision & Strategy','arena','Business','score',5.5,'tier','Below the Line'),
    jsonb_build_object('code','EX','domain','Execution','arena','Business','score',4.0,'tier','Below the Line'),
    jsonb_build_object('code','OH','domain','Operational Health','arena','Business','score',4.2,'tier','Below the Line'),
    jsonb_build_object('code','EC','domain','Ecology','arena','Business','score',3.5,'tier','In the Red')
  ),
  'importanceRatings', jsonb_build_object('PH',8,'IA',9,'ME',9,'AF',8,'RS',7,'FA',8,'CO',6,'WI',7,'VS',9,'EX',9,'OH',8,'EC',6),
  'top3', jsonb_build_array(
    jsonb_build_object('code','VS','domain','Vision & Strategy','score',5.5,'tier','Below the Line'),
    jsonb_build_object('code','FA','domain','Family','score',5.0,'tier','Below the Line'),
    jsonb_build_object('code','WI','domain','World & Impact','score',4.6,'tier','Below the Line')
  ),
  'bottom3', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','score',3.2,'tier','In the Red'),
    jsonb_build_object('code','EC','domain','Ecology','score',3.5,'tier','In the Red'),
    jsonb_build_object('code','IA','domain','Inner Alignment','score',3.8,'tier','In the Red')
  ),
  'priorityMatrix', jsonb_build_object(
    'criticalPriority', jsonb_build_array(
      jsonb_build_object('code','PH','domain','Physical Health','score',3.2,'importance',8,'tier','In the Red'),
      jsonb_build_object('code','IA','domain','Inner Alignment','score',3.8,'importance',9,'tier','In the Red'),
      jsonb_build_object('code','ME','domain','Mental & Emotional Health','score',4.0,'importance',9,'tier','Below the Line'),
      jsonb_build_object('code','AF','domain','Attention & Focus','score',4.2,'importance',8,'tier','Below the Line'),
      jsonb_build_object('code','RS','domain','Relationship to Self','score',4.2,'importance',7,'tier','Below the Line'),
      jsonb_build_object('code','FA','domain','Family','score',5.0,'importance',8,'tier','Below the Line'),
      jsonb_build_object('code','WI','domain','World & Impact','score',4.6,'importance',7,'tier','Below the Line'),
      jsonb_build_object('code','VS','domain','Vision & Strategy','score',5.5,'importance',9,'tier','Below the Line'),
      jsonb_build_object('code','EX','domain','Execution','score',4.0,'importance',9,'tier','Below the Line'),
      jsonb_build_object('code','OH','domain','Operational Health','score',4.2,'importance',8,'tier','Below the Line')
    ),
    'protectAndSustain', jsonb_build_array(),
    'monitor', jsonb_build_array(
      jsonb_build_object('code','CO','domain','Community','score',4.2,'importance',6,'tier','Below the Line'),
      jsonb_build_object('code','EC','domain','Ecology','score',3.5,'importance',6,'tier','In the Red')
    ),
    'overInvestment', jsonb_build_array()
  ),
  'acquiescence', false, 'allResponses', jsonb_build_object(),
  'contextualProfile', jsonb_build_object('revenueStage','stuck','teamSize','1-5','lifeStage','scaling','timeInBusiness','3-5_years','primaryChallenge','burnout')
)),
('sample-sara@axiom.demo', '[SAMPLE] Sara', 'Okafor', 'marketing', now() - interval '120 days', jsonb_build_object(
  'overall', 7.2, 'overallTier', 'Functional', 'archetype', 'The Journeyman',
  'driver', jsonb_build_object('name', 'The Perfectionists Prison'),
  'arenaScores', jsonb_build_object('Personal', 7.0, 'Relationships', 7.4, 'Business', 7.2),
  'arenaTiers', jsonb_build_object('Personal', 'Functional', 'Relationships', 'Functional', 'Business', 'Functional'),
  'domainScores', jsonb_build_object('PH',6.8,'IA',7.2,'ME',7.0,'AF',7.2,'RS',7.2,'FA',7.5,'CO',7.4,'WI',7.6,'VS',7.6,'EX',7.0,'OH',7.2,'EC',7.0),
  'domains', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','arena','Personal','score',6.8,'tier','Functional'),
    jsonb_build_object('code','IA','domain','Inner Alignment','arena','Personal','score',7.2,'tier','Functional'),
    jsonb_build_object('code','ME','domain','Mental & Emotional Health','arena','Personal','score',7.0,'tier','Functional'),
    jsonb_build_object('code','AF','domain','Attention & Focus','arena','Personal','score',7.2,'tier','Functional'),
    jsonb_build_object('code','RS','domain','Relationship to Self','arena','Relationships','score',7.2,'tier','Functional'),
    jsonb_build_object('code','FA','domain','Family','arena','Relationships','score',7.5,'tier','Functional'),
    jsonb_build_object('code','CO','domain','Community','arena','Relationships','score',7.4,'tier','Functional'),
    jsonb_build_object('code','WI','domain','World & Impact','arena','Relationships','score',7.6,'tier','Functional'),
    jsonb_build_object('code','VS','domain','Vision & Strategy','arena','Business','score',7.6,'tier','Functional'),
    jsonb_build_object('code','EX','domain','Execution','arena','Business','score',7.0,'tier','Functional'),
    jsonb_build_object('code','OH','domain','Operational Health','arena','Business','score',7.2,'tier','Functional'),
    jsonb_build_object('code','EC','domain','Ecology','arena','Business','score',7.0,'tier','Functional')
  ),
  'importanceRatings', jsonb_build_object('PH',8,'IA',9,'ME',8,'AF',8,'RS',8,'FA',9,'CO',7,'WI',8,'VS',9,'EX',9,'OH',8,'EC',7),
  'top3', jsonb_build_array(
    jsonb_build_object('code','VS','domain','Vision & Strategy','score',7.6,'tier','Functional'),
    jsonb_build_object('code','WI','domain','World & Impact','score',7.6,'tier','Functional'),
    jsonb_build_object('code','FA','domain','Family','score',7.5,'tier','Functional')
  ),
  'bottom3', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','score',6.8,'tier','Functional'),
    jsonb_build_object('code','EC','domain','Ecology','score',7.0,'tier','Functional'),
    jsonb_build_object('code','ME','domain','Mental & Emotional Health','score',7.0,'tier','Functional')
  ),
  'priorityMatrix', jsonb_build_object(
    'criticalPriority', jsonb_build_array(),
    'protectAndSustain', jsonb_build_array(
      jsonb_build_object('code','IA','domain','Inner Alignment','score',7.2,'importance',9,'tier','Functional'),
      jsonb_build_object('code','ME','domain','Mental & Emotional Health','score',7.0,'importance',8,'tier','Functional'),
      jsonb_build_object('code','AF','domain','Attention & Focus','score',7.2,'importance',8,'tier','Functional'),
      jsonb_build_object('code','RS','domain','Relationship to Self','score',7.2,'importance',8,'tier','Functional'),
      jsonb_build_object('code','FA','domain','Family','score',7.5,'importance',9,'tier','Functional'),
      jsonb_build_object('code','WI','domain','World & Impact','score',7.6,'importance',8,'tier','Functional'),
      jsonb_build_object('code','VS','domain','Vision & Strategy','score',7.6,'importance',9,'tier','Functional'),
      jsonb_build_object('code','EX','domain','Execution','score',7.0,'importance',9,'tier','Functional'),
      jsonb_build_object('code','OH','domain','Operational Health','score',7.2,'importance',8,'tier','Functional'),
      jsonb_build_object('code','PH','domain','Physical Health','score',6.8,'importance',8,'tier','Functional')
    ),
    'monitor', jsonb_build_array(),
    'overInvestment', jsonb_build_array(
      jsonb_build_object('code','CO','domain','Community','score',7.4,'importance',7,'tier','Functional'),
      jsonb_build_object('code','EC','domain','Ecology','score',7.0,'importance',7,'tier','Functional')
    )
  ),
  'acquiescence', false, 'allResponses', jsonb_build_object(),
  'contextualProfile', jsonb_build_object('revenueStage','mature','teamSize','11-25','lifeStage','thriving','timeInBusiness','8+_years','primaryChallenge','next-chapter')
)),
('sample-leo@axiom.demo', '[SAMPLE] Leo', 'Ramirez', 'marketing', now() - interval '40 days', jsonb_build_object(
  'overall', 6.0, 'overallTier', 'Functional', 'archetype', 'The Seeker',
  'driver', jsonb_build_object('name', 'The Imposter Loop'),
  'arenaScores', jsonb_build_object('Personal', 5.8, 'Relationships', 6.2, 'Business', 6.0),
  'arenaTiers', jsonb_build_object('Personal', 'Below the Line', 'Relationships', 'Functional', 'Business', 'Functional'),
  'domainScores', jsonb_build_object('PH',5.5,'IA',5.5,'ME',6.0,'AF',6.0,'RS',5.8,'FA',6.5,'CO',6.2,'WI',6.4,'VS',6.2,'EX',5.8,'OH',6.0,'EC',6.0),
  'domains', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','arena','Personal','score',5.5,'tier','Below the Line'),
    jsonb_build_object('code','IA','domain','Inner Alignment','arena','Personal','score',5.5,'tier','Below the Line'),
    jsonb_build_object('code','ME','domain','Mental & Emotional Health','arena','Personal','score',6.0,'tier','Functional'),
    jsonb_build_object('code','AF','domain','Attention & Focus','arena','Personal','score',6.0,'tier','Functional'),
    jsonb_build_object('code','RS','domain','Relationship to Self','arena','Relationships','score',5.8,'tier','Below the Line'),
    jsonb_build_object('code','FA','domain','Family','arena','Relationships','score',6.5,'tier','Functional'),
    jsonb_build_object('code','CO','domain','Community','arena','Relationships','score',6.2,'tier','Functional'),
    jsonb_build_object('code','WI','domain','World & Impact','arena','Relationships','score',6.4,'tier','Functional'),
    jsonb_build_object('code','VS','domain','Vision & Strategy','arena','Business','score',6.2,'tier','Functional'),
    jsonb_build_object('code','EX','domain','Execution','arena','Business','score',5.8,'tier','Below the Line'),
    jsonb_build_object('code','OH','domain','Operational Health','arena','Business','score',6.0,'tier','Functional'),
    jsonb_build_object('code','EC','domain','Ecology','arena','Business','score',6.0,'tier','Functional')
  ),
  'importanceRatings', jsonb_build_object('PH',7,'IA',8,'ME',8,'AF',7,'RS',8,'FA',8,'CO',7,'WI',6,'VS',9,'EX',9,'OH',7,'EC',6),
  'top3', jsonb_build_array(
    jsonb_build_object('code','FA','domain','Family','score',6.5,'tier','Functional'),
    jsonb_build_object('code','WI','domain','World & Impact','score',6.4,'tier','Functional'),
    jsonb_build_object('code','CO','domain','Community','score',6.2,'tier','Functional')
  ),
  'bottom3', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','score',5.5,'tier','Below the Line'),
    jsonb_build_object('code','IA','domain','Inner Alignment','score',5.5,'tier','Below the Line'),
    jsonb_build_object('code','RS','domain','Relationship to Self','score',5.8,'tier','Below the Line')
  ),
  'priorityMatrix', jsonb_build_object(
    'criticalPriority', jsonb_build_array(
      jsonb_build_object('code','IA','domain','Inner Alignment','score',5.5,'importance',8,'tier','Below the Line'),
      jsonb_build_object('code','ME','domain','Mental & Emotional Health','score',6.0,'importance',8,'tier','Functional'),
      jsonb_build_object('code','RS','domain','Relationship to Self','score',5.8,'importance',8,'tier','Below the Line'),
      jsonb_build_object('code','FA','domain','Family','score',6.5,'importance',8,'tier','Functional'),
      jsonb_build_object('code','VS','domain','Vision & Strategy','score',6.2,'importance',9,'tier','Functional'),
      jsonb_build_object('code','EX','domain','Execution','score',5.8,'importance',9,'tier','Below the Line')
    ),
    'protectAndSustain', jsonb_build_array(),
    'monitor', jsonb_build_array(
      jsonb_build_object('code','PH','domain','Physical Health','score',5.5,'importance',7,'tier','Below the Line'),
      jsonb_build_object('code','AF','domain','Attention & Focus','score',6.0,'importance',7,'tier','Functional'),
      jsonb_build_object('code','CO','domain','Community','score',6.2,'importance',7,'tier','Functional'),
      jsonb_build_object('code','WI','domain','World & Impact','score',6.4,'importance',6,'tier','Functional'),
      jsonb_build_object('code','OH','domain','Operational Health','score',6.0,'importance',7,'tier','Functional'),
      jsonb_build_object('code','EC','domain','Ecology','score',6.0,'importance',6,'tier','Functional')
    ),
    'overInvestment', jsonb_build_array()
  ),
  'acquiescence', false, 'allResponses', jsonb_build_object(),
  'contextualProfile', jsonb_build_object('revenueStage','growth','teamSize','1-5','lifeStage','early-career','timeInBusiness','2-3_years','primaryChallenge','visibility')
));
