/**
 * Every empirical claim on the site cites one of these. Keeping them in one file
 * means a claim can be traced, and a superseded source is fixed once.
 *
 * All metadata below was verified against Crossref, none of it recalled from memory. Links use
 * doi.org where a DOI exists, because publisher pages block automated checks.
 *
 * Editorial rule for this project: the positive case for analog rests on firmer
 * ground than the negative case against screens. Lead with displacement, play,
 * sleep and reading. Where a finding is disputed, say so on the page.
 */
export interface Source {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  url: string;
  /** What this source does and does not establish, in plain language. */
  claim: string;
  /** True when the finding is disputed among serious researchers, so pages must say so. */
  contested?: boolean;
}

export const SOURCES = {
  readingPaperMeta: {
    id: 'readingPaperMeta',
    title: "A Comparison of Children's Reading on Paper Versus Screen: A Meta-Analysis",
    authors: 'Furenes, Kucirkova & Bus',
    venue: 'Review of Educational Research',
    year: 2021,
    url: 'https://doi.org/10.3102/0034654321998074',
    claim:
      'Across 39 studies of roughly 1,800 children aged 1–8, comprehension was lower for digital books than paper books when digitisation was the only difference. Digital books built with story-congruent enhancements did better than plain ports.',
  },
  freePlaySelfRegulation: {
    id: 'freePlaySelfRegulation',
    title:
      'Free play predicts self-regulation years later: Longitudinal evidence from a large Australian sample of toddlers and preschoolers',
    authors: 'Colliver, Harrison, Brown & Humburg',
    venue: 'Early Childhood Research Quarterly',
    year: 2022,
    url: 'https://doi.org/10.1016/j.ecresq.2021.11.011',
    claim:
      'Time spent in unstructured free play in the early years predicted stronger self-regulation years later. That capacity tracks with health, educational and financial outcomes across a lifetime.',
  },
  riskyPlayCPS: {
    id: 'riskyPlayCPS',
    title:
      'Healthy childhood development through outdoor risky play: Navigating the balance with injury prevention',
    authors: 'Canadian Paediatric Society',
    venue: 'CPS position statement',
    year: 2024,
    url: 'https://cps.ca/en/documents/position/outdoor-risky-play',
    claim:
      'A national paediatric body’s formal position that outdoor risky play supports physical activity, social competence, risk perception and self-esteem, and that over-restricting it carries its own developmental costs.',
  },
  sleepPortableDevices: {
    id: 'sleepPortableDevices',
    title:
      'Associations between screen time and sleep duration are primarily driven by portable electronic devices',
    authors: 'Twenge, Hisler & Krizan',
    venue: 'Sleep Medicine',
    year: 2019,
    url: 'https://doi.org/10.1016/j.sleep.2018.11.009',
    claim:
      'In a population sample of US children aged 0–17, the screen-time and sleep relationship was driven mainly by portable devices, the ones that follow a child into the bedroom, rather than by screens in general.',
  },
  sleepMeta: {
    id: 'sleepMeta',
    title:
      'The association of screen time and the risk of sleep outcomes: a systematic review and meta-analysis',
    authors: 'Systematic review',
    venue: 'PubMed Central',
    year: 2025,
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12754674/',
    claim:
      'Pooled evidence that higher screen time, especially in the evening and at bedtime, is associated with shorter sleep, later sleep onset, more disturbance and more daytime sleepiness in school-aged children.',
  },
  csAiCensus: {
    id: 'csAiCensus',
    title: 'The Common Sense Media Census: AI Use by Tweens and Teens (2026)',
    authors: 'Common Sense Media Youth AI Safety Institute',
    venue: 'Common Sense Media',
    year: 2026,
    url: 'https://www.commonsensemedia.org/press-releases/common-sense-media-releases-inaugural-annual-study-on-ai-use-by-tweens-and-teens',
    claim:
      'A survey of 1,204 children aged 9 to 17. 86 per cent use AI and nearly a quarter use it daily, but more than four in ten say no parent or guardian has ever talked to them about AI safety. Only a third know AI cannot reliably tell fact from fiction. Over half of users have asked it about their health or body and more than a third have used it to discuss feelings; a quarter of those say it sometimes understands them better than most people. One in six have seen inappropriate material through a chatbot and only a third told an adult. Kids who find it hard to focus on schoolwork lean on AI more.',
  },
  geminiClassroom: {
    id: 'geminiClassroom',
    title: 'Gemini in Google Classroom is expanding to users of all ages',
    authors: 'Google Workspace Updates',
    venue: 'Google',
    year: 2026,
    url: 'https://workspaceupdates.googleblog.com/2026/08/gemini-in-google-classroom-is-expanding-to-users-of-all-ages-with-contextualized-Gemini-starter-prompts-for-students.html',
    claim:
      "Google's own announcement. It states that access to the Gemini tab in Classroom is on by default for teachers and students of all ages, rolling out from 10 August 2026 on the web. Access is controlled by the school's Workspace administrator. The post describes no teacher-level control and no parental notification.",
  },
  oneToOneLaptops: {
    id: 'oneToOneLaptops',
    title: 'Learning in One-to-One Laptop Environments: A Meta-Analysis and Research Synthesis',
    authors: 'Zheng, B., Warschauer, M., Lin, C.-H., & Chang, C.',
    venue: 'Review of Educational Research',
    year: 2016,
    url: 'https://doi.org/10.3102/0034654316628645',
    claim:
      'Pooling the usable studies, one-to-one laptop programs produced small positive effects on achievement in English, writing, mathematics and science, around 0.16 standard deviations. This is evidence against the claim that giving every child a laptop harms achievement. It is a small effect next to interventions like tutoring, and only ten studies met the bar for the statistical pooling, so the base is thin.',
  },
  screenReading: {
    id: 'screenReading',
    title:
      "Don't throw away your printed books: A meta-analysis on the effects of reading media on reading comprehension",
    authors: 'Delgado, P., Vargas, C., Ackerman, R., & Salmerón, L.',
    venue: 'Educational Research Review',
    year: 2018,
    url: 'https://doi.org/10.1016/j.edurev.2018.09.003',
    claim:
      'Across 54 studies and more than 170,000 readers, comprehension was better on paper than on screen, and the advantage for paper widened over the years even as screens improved. Strongest where the reader is working against a time limit and for informational text.',
  },
  danishChromebooks: {
    id: 'danishChromebooks',
    title: 'Decision on the use of Google Workspace for Education in Danish municipal schools',
    authors: 'Datatilsynet, the Danish Data Protection Authority',
    venue: 'Datatilsynet',
    year: 2024,
    url: 'https://www.datatilsynet.dk/english',
    claim:
      'A national regulator found that the way student data reached Google through Chromebooks and Google Workspace lacked a legal basis for all of the purposes it was disclosed for, and ordered 53 municipalities to change their practices. It is a data protection finding and says nothing about whether the devices help children learn.',
  },
  craAiEducation: {
    id: 'craAiEducation',
    title: 'AI in Computing Education: Principles and Practical Guidance for Program Leaders',
    authors: 'Bell, J., Hilton, M., Kam, M., Poshyvanyk, D., Sotomayor, B., & Troy, C.',
    venue: 'Computing Research Association (CRA-E) white paper',
    year: 2026,
    url: 'https://cra.org/crae/wp-content/uploads/sites/3/2026/08/AI-in-Computing-Education_-Principles-and-Practical-Guidance-for-Program-Leaders.pdf',
    claim:
      'Written as guidance for university computing departments, by experts, without peer review, and none of it studies children. Its transferable point is about how rules are framed: a restriction stated without a reason reads as arbitrary, while the same restriction tied to what it is protecting is engaged with honestly. Two of the six authors work at Google and Mozilla.',
  },
  pratherWideningGap: {
    id: 'pratherWideningGap',
    title: 'The Widening Gap: The Benefits and Harms of Generative AI for Novice Programmers',
    authors: 'Prather, J., Reeves, B. N., Leinonen, J., MacNeil, S., Randrianasolo, A. S., et al.',
    venue: 'ACM Conference on International Computing Education Research (ICER)',
    year: 2024,
    url: 'https://doi.org/10.1145/3632620.3671116',
    claim:
      'Beginners who produced correct work with AI assistance overestimated how much they had understood. Independent corroboration, from a different field and method, of the illusion of learning the MIT report describes. Its subjects are university novices, so the bridge to children is an inference.',
  },
  hakObserving: {
    id: 'hakObserving',
    title: 'Observing Without Doing: Pseudo-Apprenticeship Patterns in Student LLM Use',
    authors: 'Hak, J., Lam Johnson, N., Amoozadeh, M., Alipour, A., & Chattopadhyay, S.',
    venue: 'Koli Calling International Conference on Computing Education Research',
    year: 2025,
    url: 'https://doi.org/10.1145/3769994.3770027',
    claim:
      'Names the pattern where a learner watches a system solve a problem and comes away feeling taught, having practiced nothing. Apprenticeship works because the apprentice does the work under supervision; watching alone removes the part that builds the skill.',
  },
  thornGrooming: {
    id: 'thornGrooming',
    title: 'Online Grooming: Examining risky encounters amid everyday digital socialization',
    authors: 'Thorn',
    venue: 'Thorn',
    year: 2022,
    url: 'https://info.thorn.org/hubfs/Research/2022_Online_Grooming_Report.pdf',
    claim:
      'A survey of 1,200 young people aged 9 to 17. Two thirds said somebody they met online had asked them to move from a public forum into a private conversation on a different platform. Nearly a quarter stayed in contact with somebody who had made them uncomfortable, and for one in three their closest friendship had formed online. Survey research by a child-safety organization, without peer review, and the authors state plainly that stigma around the subject probably means undercounting. The figures cover online life in general and are not specific to games.',
  },
  robloxSettlement: {
    id: 'robloxSettlement',
    title: 'Attorney General Marshall Announces $12.2 Million Settlement with Roblox to Ensure Child Safety',
    authors: 'Office of the Attorney General of Alabama',
    venue: 'Alabama Attorney General',
    year: 2026,
    url: 'https://www.alabamaag.gov/attorney-general-marshall-announces-12-2-million-settlement-with-roblox-to-ensure-child-safety/',
    claim:
      'A settlement announced on 21 April 2026 requiring Roblox to verify the age of all users, to stop adults and under sixteens chatting unless they are identified as trusted friends, to let parents restrict transfers of in-game currency from adults, and to leave communications involving minors unencrypted for law enforcement. A settlement is not a finding of wrongdoing. What it establishes for a parent is that these controls now exist and can be switched on.',
  },
  technoference: {
    id: 'technoference',
    title: 'Technoference: Parent Distraction With Technology and Associations With Child Behavior Problems',
    authors: 'McDaniel, B. T., & Radesky, J. S.',
    venue: 'Child Development',
    year: 2018,
    url: 'https://doi.org/10.1111/cdev.12822',
    claim:
      "Parent reports from 170 American families with young children, average age three. Parents' own problematic phone use predicted more technology interruptions in time with their children, and those interruptions tracked with more child behavior problems. Parent-reported and correlational: the arrow can run both ways, since a hard evening also sends a parent to the phone. What it establishes is that the parent's phone belongs in this conversation at all.",
  },
  odgersRewiring: {
    id: 'odgersRewiring',
    title: 'The great rewiring: is social media really behind an epidemic of teenage mental illness?',
    authors: 'Odgers, C. L.',
    venue: 'Nature',
    year: 2024,
    url: 'https://doi.org/10.1038/d41586-024-00902-2',
    claim:
      'The serious version of the counter-argument. Odgers, reviewing The Anxious Generation, argues the evidence does not show social media causing an epidemic of teenage mental illness and that the likely causes sit elsewhere. Cited so that when these pages say the question is disputed, the dispute is between named researchers on both sides.',
  },
  edWeekPhones: {
    id: 'edWeekPhones',
    title: 'Which States Ban or Restrict Cellphones in Schools?',
    authors: 'Education Week',
    venue: 'Education Week policy tracker',
    year: 2026,
    url: 'https://www.edweek.org/technology/which-states-ban-or-restrict-cellphones-in-schools/2024/06',
    claim:
      'A continuously updated tracker. As of late July 2026, at least 39 states and the District of Columbia require school districts to ban or restrict student phone use in schools, most of that legislation passed within two years. What it establishes for a parent: asking a school to restrain technology is now the mainstream position across most of the country.',
  },
  mitAiEducation: {
    id: 'mitAiEducation',
    title: 'Report of the Ad Hoc Committee on AI Use in Teaching, Learning, and Research Training',
    authors: 'Klopfer, Madden et al.',
    venue: 'Massachusetts Institute of Technology',
    year: 2026,
    url: 'https://aiandeducation.mit.edu/report/',
    claim:
      'After five months studying AI use across MIT, a committee of students, faculty and staff reported that learning requires productive struggle, and that offloading that struggle to a chatbot produces an illusion of learning rather than the thing itself. It names cognitive surrender, falling back on AI at the first hint of difficulty, and records early signals that overreliance diminishes critical thinking, weakens memory, erodes confidence and undermines mastery. It also found AI increasing isolation by displacing study groups and contact with teachers.',
  },
  socialMediaUnsettled: {
    id: 'socialMediaUnsettled',
    title: 'Unsettled science on social media',
    authors: 'Thorp',
    venue: 'Science',
    year: 2024,
    url: 'https://doi.org/10.1126/science.adr1730',
    claim:
      'An editorial in Science on the unresolved state of the field. Large analyses have not found consistent associations between social media use and wellbeing, and where links appear, the direction of causation remains open.',
    contested: true,
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;
export const sourceList: Source[] = Object.values(SOURCES);
