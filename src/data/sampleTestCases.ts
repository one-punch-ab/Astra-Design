export interface TestCase {
  id: string;
  question: string;
  expectedAnswer: string;
  leadingQuestions: string;
  aiResponse: string;
  metrics: {
    accuracy: number;
    latency: number;
    status: 'passed' | 'failed';
  };
  notes: string;
  recommendations?: Recommendation[];
}

export interface Recommendation {
  id: string;
  type: 'knowledge' | 'action' | 'format' | 'intent';
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  actionLabel: string;
  actionLink?: string;
  icon?: string;
  checklist?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  checked: boolean;
}

export const sampleTestCases: TestCase[] = [
  {
    id: '1',
    question: 'What are your pricing plans?',
    expectedAnswer: 'We offer three plans: Starter at ₹299/month for individual learners, Pro at ₹999/month for serious aspirants with live doubt sessions, and Premium at ₹2,499/month with personalized mentorship and offline center access.',
    leadingQuestions: 'How much does it cost? What plans do you have? Pricing details? Which plan is best for JEE preparation?',
    aiResponse: 'We have three pricing tiers: 1. ★★Starter★★ - ₹299/month for self-paced learning 2. Pro - ₹999/month includes live classes and doubt clearing 3. Premium - ₹2,499/month with mentorship and offline access. Which exam are you preparing for?',
    metrics: {
      accuracy: 94,
      latency: 1.2,
      status: 'passed'
    },
    notes: 'Core pricing question - high traffic'
  },
  {
    id: '2',
    question: 'How do I reset my password?',
    expectedAnswer: 'Click "Forgot Password" on login page, enter your registered email/phone, you\'ll receive an OTP to create a new password. Need help? Contact support at support@pw.live',
    leadingQuestions: 'I forgot my password Can\'t log in Password reset Lost password help',
    aiResponse: 'To reset your password: 1. Go to the login page 2. Click "Forgot Password" 3. Enter your registered email 4. Check your email for reset link 5. Create new password',
    metrics: {
      accuracy: 92,
      latency: 0.8,
      status: 'passed'
    },
    notes: 'Common support question'
  },
  {
    id: '3',
    question: 'Do you offer refunds?',
    expectedAnswer: 'Yes, 30-day money-back guarantee if you\'ve attended less than 20% of classes. Refunds processed within 5-7 business days to original payment method.',
    leadingQuestions: 'Can I get my money back? Refund policy Money back guarantee Course cancellation',
    aiResponse: 'Yes! We offer a ★★30-day money-back guarantee★★. If you\'ve attended less than 20% of your course, you can request a full refund. Process takes 5-7 business days.',
    metrics: {
      accuracy: 96,
      latency: 0.6,
      status: 'passed'
    },
    notes: 'Refund handling test'
  },
  {
    id: '4',
    question: 'How do I integrate with Slack?',
    expectedAnswer: 'Go to Settings > Integrations > Slack and click Connect. Follow OAuth flow to authorize. You can then map course updates and student queries to specific channels.',
    leadingQuestions: 'Slack integration Connect to Slack Slack setup Integration help',
    aiResponse: 'To integrate with Slack: 1. Go to Settings 2. Click Integrations 3. Find Slack and click Connect 4. Authorize the connection',
    metrics: {
      accuracy: 78,
      latency: 1.5,
      status: 'failed'
    },
    notes: 'Missing OAuth details - needs improvement',
    recommendations: [
      {
        id: 'r1',
        type: 'format',
        title: 'Refine Response Format',
        priority: 'medium',
        description: 'The response is partially correct but could be structured better to match expectations. Consider adding specific OAuth flow details.',
        actionLabel: 'Go to Agent Settings → Response Format → Add formatting guidelines or examples',
        icon: 'file-text'
      },
      {
        id: 'r2',
        type: 'knowledge',
        title: 'Add Integration Documentation',
        priority: 'high',
        description: 'Missing detailed OAuth flow steps. Upload Slack integration documentation to help agent provide complete answers.',
        actionLabel: 'Go to Knowledge Base → Upload Slack integration guide with OAuth details',
        icon: 'book'
      }
    ]
  },
  {
    id: '5',
    question: 'What languages do you support?',
    expectedAnswer: 'We support 25+ languages including Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, and more. All courses have multilingual subtitles and select courses offer regional language instruction.',
    leadingQuestions: 'Language support Other languages Hindi available Regional languages Course language options',
    aiResponse: 'We support over 25 languages including: - English and Hindi (primary) - Regional languages like Tamil, Telugu, Bengali, Marathi - Subtitles available for all courses - Some courses taught in regional languages',
    metrics: {
      accuracy: 89,
      latency: 0.9,
      status: 'passed'
    },
    notes: 'Language support query'
  },
  {
    id: '6',
    question: 'Can I export my data?',
    expectedAnswer: 'Yes, go to Settings > Data > Export. You can download your progress reports, quiz scores, and study history as CSV or PDF. GDPR compliant.',
    leadingQuestions: 'Export data Download my data Data portability GDPR data access',
    aiResponse: 'You can export your data anytime: 1. Go to Settings 2. Click on Data section 3. Select Export 4. Choose format (CSV or PDF) 5. Download your reports, scores, and history',
    metrics: {
      accuracy: 91,
      latency: 1.1,
      status: 'passed'
    },
    notes: 'GDPR compliance question'
  },
  {
    id: '7',
    question: 'What is your uptime guarantee?',
    expectedAnswer: 'We guarantee 99.9% uptime SLA with 24/7 monitoring. If uptime falls below 99.5% in any month, you receive automatic service credits. Check status.pw.live for real-time status.',
    leadingQuestions: 'Uptime Reliability Downtime SLA Service availability',
    aiResponse: 'We maintain a ★★99.9% uptime SLA★★. If uptime drops below 99.5%, you automatically receive service credits. Monitor status at status.pw.live',
    metrics: {
      accuracy: 95,
      latency: 0.7,
      status: 'passed'
    },
    notes: 'Enterprise sales question'
  },
  {
    id: '8',
    question: 'How do I cancel my subscription?',
    expectedAnswer: 'Go to Settings > Billing > Cancel Subscription. You\'ll retain access until period ends. We\'d love to hear why you\'re leaving - feedback helps us improve.',
    leadingQuestions: 'Cancel account Stop subscription Unsubscribe End membership',
    aiResponse: 'To cancel: 1. Go to Settings > Billing 2. Click "Cancel Subscription" 3. Confirm cancellation. Your access continues until the current billing period ends.',
    metrics: {
      accuracy: 72,
      latency: 2.1,
      status: 'failed'
    },
    notes: 'Response too long - optimization needed',
    recommendations: [
      {
        id: 'r3',
        type: 'format',
        title: 'Reduce Response Length',
        priority: 'medium',
        description: 'Response exceeds optimal length (2.1s latency). Consider making the steps more concise.',
        actionLabel: 'Go to Agent Settings → Response Format → Set maximum response length',
        icon: 'file-text'
      }
    ]
  },
  {
    id: '9',
    question: 'Is my data secure?',
    expectedAnswer: 'Yes, we use AES-256 encryption, SOC 2 Type II certified, and GDPR compliant. All data stored in Indian servers with regular security audits.',
    leadingQuestions: 'Security Data privacy Encryption Safe data How secure is my information',
    aiResponse: 'Your data is protected by: - AES-256 encryption - SOC 2 Type II certification - GDPR compliance - Indian server storage - Regular security audits',
    metrics: {
      accuracy: 97,
      latency: 0.5,
      status: 'passed'
    },
    notes: 'Security-conscious customer'
  },
  {
    id: '10',
    question: 'Do you have a mobile app?',
    expectedAnswer: 'Yes, available on iOS App Store and Google Play Store. Full feature parity with web including offline video download, live classes, and doubt clearing.',
    leadingQuestions: 'Mobile app iPhone app Android app App download',
    aiResponse: 'Yes! Our mobile apps are available on: - ★★iOS App Store★★ - ★★Google Play Store★★ Features include offline downloads, live classes, and instant doubt solving.',
    metrics: {
      accuracy: 93,
      latency: 0.8,
      status: 'passed'
    },
    notes: 'Mobile platform query'
  },
  {
    id: '11',
    question: 'How do I access recorded lectures?',
    expectedAnswer: 'Go to My Courses > Select course > Recordings tab. All live classes are recorded and available within 2 hours. Download for offline viewing in the mobile app.',
    leadingQuestions: 'Recorded classes Past lectures Video recordings Missed class',
    aiResponse: 'Access recordings: 1. Go to "My Courses" 2. Select your course 3. Click "Recordings" tab 4. Videos available 2 hours after live class. Download via mobile app for offline viewing.',
    metrics: {
      accuracy: 88,
      latency: 1.3,
      status: 'passed'
    },
    notes: 'Course access question'
  },
  {
    id: '12',
    question: 'Can I switch to a different batch?',
    expectedAnswer: 'Yes, contact support@pw.live or go to Settings > My Batches > Request Switch. We\'ll check availability and process within 24 hours. No additional charges if switching within same course level.',
    leadingQuestions: 'Change batch Batch transfer Switch timing Different batch',
    aiResponse: 'You can request a batch switch by contacting support@pw.live. We\'ll check availability and confirm within 24 hours.',
    metrics: {
      accuracy: 67,
      latency: 1.8,
      status: 'failed'
    },
    notes: 'Incomplete - missing self-service option',
    recommendations: [
      {
        id: 'r4',
        type: 'knowledge',
        title: 'Add Batch Management Details',
        priority: 'high',
        description: 'Response missing self-service batch switching option. Add documentation about the Settings > My Batches feature.',
        actionLabel: 'Go to Knowledge Base → Upload batch management guide',
        icon: 'book'
      },
      {
        id: 'r5',
        type: 'action',
        title: 'Add Batch Check Action',
        priority: 'medium',
        description: 'Create an action to check batch availability in real-time instead of always routing to support.',
        actionLabel: 'Go to Actions → Create "Check Batch Availability" workflow',
        icon: 'zap'
      }
    ]
  },
  {
    id: '13',
    question: 'What payment methods do you accept?',
    expectedAnswer: 'We accept Credit/Debit cards (Visa, Mastercard, RuPay), UPI, Net Banking, Wallets (Paytm, PhonePe, Google Pay), and EMI options through partner banks.',
    leadingQuestions: 'Payment options How to pay Credit card UPI EMI available',
    aiResponse: 'We accept: Credit/Debit cards (Visa, Mastercard, RuPay), UPI payments, Net Banking, Digital wallets (Paytm, PhonePe, Google Pay), and EMI through partner banks.',
    metrics: {
      accuracy: 94,
      latency: 0.9,
      status: 'passed'
    },
    notes: 'Payment inquiry'
  },
  {
    id: '14',
    question: 'Do you provide study materials?',
    expectedAnswer: 'Yes, all courses include comprehensive study materials: PDFs, practice questions, previous year papers, formula sheets, and chapter-wise notes. Available in app and web.',
    leadingQuestions: 'Study material PDF notes Practice questions Resources',
    aiResponse: 'Yes! Every course includes: - Downloadable PDF notes - Practice question banks - Previous year papers - Formula sheets - Chapter summaries. Access via app or web dashboard.',
    metrics: {
      accuracy: 91,
      latency: 1.0,
      status: 'passed'
    },
    notes: 'Content resources query'
  },
  {
    id: '15',
    question: 'How does doubt clearing work?',
    expectedAnswer: 'Ask doubts via app/web, get responses within 4 hours from subject experts. Pro and Premium plans include live doubt sessions. Upload photos of problems for step-by-step solutions.',
    leadingQuestions: 'Ask doubts Doubt resolution Help with questions Live doubt session',
    aiResponse: 'Doubt clearing process: 1. Submit via app or web 2. Expert response within 4 hours 3. Pro/Premium: Live sessions available 4. Upload problem photos for detailed solutions',
    metrics: {
      accuracy: 86,
      latency: 1.4,
      status: 'passed'
    },
    notes: 'Support mechanism query'
  },
  {
    id: '16',
    question: 'Can I get a demo before enrolling?',
    expectedAnswer: 'Yes! Request a free demo class - we\'ll send you a sample live class link and trial access for 7 days. Book via website or call 1800-120-456789.',
    leadingQuestions: 'Free demo Trial class Sample lecture Test before buying Demo request',
    aiResponse: 'Absolutely! Request a free demo and get 7-day trial access. Book online or call our helpline.',
    metrics: {
      accuracy: 64,
      latency: 2.3,
      status: 'failed'
    },
    notes: 'Missing contact details and booking process',
    recommendations: [
      {
        id: 'r6',
        type: 'knowledge',
        title: 'Add Demo Booking Information',
        priority: 'high',
        description: 'Response lacks specific booking instructions and contact number. This is a high-intent query from potential customers.',
        actionLabel: 'Go to Knowledge Base → Add demo booking process with contact details',
        icon: 'book'
      },
      {
        id: 'r7',
        type: 'action',
        title: 'Create Demo Booking Flow',
        priority: 'high',
        description: 'Set up automated demo booking to capture leads better. Include calendar integration for seamless scheduling.',
        actionLabel: 'Go to Actions → Set up these flows',
        icon: 'zap',
        checklist: [
          {
            id: 'c1',
            label: 'Custom form',
            icon: 'file-text',
            description: 'Collect their details (name, phone, preferred subject)',
            checked: false
          },
          {
            id: 'c2',
            label: 'Book a meeting',
            icon: 'calendar',
            description: 'Share available demo slots using Calendly',
            checked: false
          },
          {
            id: 'c3',
            label: 'Create/update contact',
            icon: 'user-plus',
            description: 'Save lead in your CRM (HubSpot/Zoho)',
            checked: false
          },
          {
            id: 'c4',
            label: 'Send message to channel',
            icon: 'message-square',
            description: 'Notify sales team in Slack #demo-requests',
            checked: false
          }
        ]
      }
    ]
  }
];
