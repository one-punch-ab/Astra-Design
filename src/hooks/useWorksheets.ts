import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import type { Worksheet, TestCaseRow, CustomColumn, ColumnType } from '@/types/test-cases.types';
import { deepClone } from '@/lib/utils';

// EdTech Sample test case data for PW.live-style support agent - 16 realistic scenarios
export const createSampleTestCases = (): TestCaseRow[] => [
  {
    id: uuid(),
    question: 'What are your pricing plans?',
    expectedAnswer: 'We offer three plans: Starter at ₹299/month for individual learners, Pro at ₹999/month for serious aspirants with live doubt sessions, and Premium at ₹2,499/month with personalized mentorship and offline center access.',
    leadingQuestions: 'How much does it cost?\nWhat plans do you have?\nPricing details?\nWhich plan is best for JEE preparation?',
    aiResponse: {
      content: 'We have three pricing tiers:\n\n1. **Starter** - ₹299/month for self-paced learning\n2. **Pro** - ₹999/month includes live classes and doubt clearing\n3. **Premium** - ₹2,499/month with mentorship and offline access\n\nWhich exam are you preparing for?',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 94,
      latency: 1.2,
      status: 'passed',
    },
    notes: 'Core pricing question - high traffic',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'How do I reset my password?',
    expectedAnswer: 'Click "Forgot Password" on login page, enter your registered email/phone, you\'ll receive an OTP to create a new password. Need help? Contact support at support@pw.live',
    leadingQuestions: 'I forgot my password\nCan\'t log in\nPassword reset\nLost password help',
    aiResponse: {
      content: 'To reset your password:\n1. Go to the login page\n2. Click "Forgot Password"\n3. Enter your registered email\n4. Check your email for reset link\n5. Create new password',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 92,
      latency: 0.8,
      status: 'passed',
    },
    notes: 'Common support question',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'Do you offer refunds?',
    expectedAnswer: 'Yes, 30-day money-back guarantee if you\'ve attended less than 20% of classes. Refunds processed within 5-7 business days to original payment method.',
    leadingQuestions: 'Can I get my money back?\nRefund policy\nMoney back guarantee\nCourse cancellation',
    aiResponse: {
      content: 'Yes! We offer a **30-day money-back guarantee**. If you\'ve attended less than 20% of your course, you can request a full refund. Process takes 5-7 business days.',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 96,
      latency: 0.6,
      status: 'passed',
    },
    notes: 'Refund handling test',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'How do I integrate with Slack?',
    expectedAnswer: 'Go to Settings > Integrations > Slack and click Connect. Follow OAuth flow to authorize. You can then map course updates and student queries to specific channels.',
    leadingQuestions: 'Slack integration\nConnect to Slack\nSlack setup\nIntegration help',
    aiResponse: {
      content: 'To integrate with Slack:\n1. Go to Settings\n2. Click Integrations\n3. Find Slack and click Connect\n4. Authorize the connection',
      feedback: undefined,
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 78,
      latency: 1.5,
      status: 'failed',
    },
    notes: 'Missing OAuth details - needs improvement',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
    recommendations: [
      {
        id: 'r1',
        type: 'format',
        title: 'Refine Response Format',
        priority: 'medium',
        description: 'The response is partially correct but could be structured better to match expectations. Consider adding specific OAuth flow details.',
        actionLabel: 'Go to Agent Settings → Response Format → Add formatting guidelines or examples',
        icon: 'file-text',
      },
      {
        id: 'r2',
        type: 'knowledge',
        title: 'Add Integration Documentation',
        priority: 'high',
        description: 'Missing detailed OAuth flow steps. Upload Slack integration documentation to help agent provide complete answers.',
        actionLabel: 'Go to Knowledge Base → Upload Slack integration guide with OAuth details',
        icon: 'book',
      },
    ],
  },
  {
    id: uuid(),
    question: 'What languages do you support?',
    expectedAnswer: 'We support 25+ languages including Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, and more. All courses have multilingual subtitles and select courses offer regional language instruction.',
    leadingQuestions: 'Language support\nOther languages\nHindi available\nRegional languages\nCourse language options',
    aiResponse: {
      content: 'We support over 25 languages including:\n- English and Hindi (primary)\n- Regional languages like Tamil, Telugu, Bengali, Marathi\n- Subtitles available for all courses\n- Some courses taught in regional languages',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 89,
      latency: 0.9,
      status: 'passed',
    },
    notes: 'Language support query',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'Can I export my data?',
    expectedAnswer: 'Yes, go to Settings > Data > Export. You can download your progress reports, quiz scores, and study history as CSV or PDF. GDPR compliant.',
    leadingQuestions: 'Export data\nDownload my data\nData portability\nGDPR data access',
    aiResponse: {
      content: 'You can export your data anytime:\n1. Go to Settings\n2. Click on Data section\n3. Select Export\n4. Choose format (CSV or PDF)\n5. Download your reports, scores, and history',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 91,
      latency: 1.1,
      status: 'passed',
    },
    notes: 'GDPR compliance question',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'What is your uptime guarantee?',
    expectedAnswer: 'We guarantee 99.9% uptime SLA with 24/7 monitoring. If uptime falls below 99.5% in any month, you receive automatic service credits. Check status.pw.live for real-time status.',
    leadingQuestions: 'Uptime\nReliability\nDowntime\nSLA\nService availability',
    aiResponse: {
      content: 'We maintain a **99.9% uptime SLA**. If uptime drops below 99.5%, you automatically receive service credits. Monitor status at status.pw.live',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 95,
      latency: 0.7,
      status: 'passed',
    },
    notes: 'Enterprise sales question',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'How do I cancel my subscription?',
    expectedAnswer: 'Go to Settings > Billing > Cancel Subscription. You\'ll retain access until period ends. We\'d love to hear why you\'re leaving - feedback helps us improve.',
    leadingQuestions: 'Cancel account\nStop subscription\nUnsubscribe\nEnd membership',
    aiResponse: {
      content: 'To cancel:\n1. Go to Settings > Billing\n2. Click "Cancel Subscription"\n3. Confirm cancellation\n\nYour access continues until the current billing period ends.',
      feedback: undefined,
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 72,
      latency: 2.1,
      status: 'failed',
    },
    notes: 'Response too long - optimization needed',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
    recommendations: [
      {
        id: 'r3',
        type: 'format',
        title: 'Reduce Response Length',
        priority: 'medium',
        description: 'Response exceeds optimal length (2.1s latency). Consider making the steps more concise.',
        actionLabel: 'Go to Agent Settings → Response Format → Set maximum response length',
        icon: 'file-text',
      },
    ],
  },
  {
    id: uuid(),
    question: 'Is my data secure?',
    expectedAnswer: 'Yes, we use AES-256 encryption, SOC 2 Type II certified, and GDPR compliant. All data stored in Indian servers with regular security audits.',
    leadingQuestions: 'Security\nData privacy\nEncryption\nSafe data\nHow secure is my information',
    aiResponse: {
      content: 'Your data is protected by:\n- AES-256 encryption\n- SOC 2 Type II certification\n- GDPR compliance\n- Indian server storage\n- Regular security audits',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 97,
      latency: 0.5,
      status: 'passed',
    },
    notes: 'Security-conscious customer',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'Do you have a mobile app?',
    expectedAnswer: 'Yes, available on iOS App Store and Google Play Store. Full feature parity with web including offline video download, live classes, and doubt clearing.',
    leadingQuestions: 'Mobile app\niPhone app\nAndroid app\nApp download',
    aiResponse: {
      content: 'Yes! Our mobile apps are available on:\n- **iOS App Store**\n- **Google Play Store**\n\nFeatures include offline downloads, live classes, and instant doubt solving.',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 93,
      latency: 0.8,
      status: 'passed',
    },
    notes: 'Mobile platform query',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'How do I access recorded lectures?',
    expectedAnswer: 'Go to My Courses > Select course > Recordings tab. All live classes are recorded and available within 2 hours. Download for offline viewing in the mobile app.',
    leadingQuestions: 'Recorded classes\nPast lectures\nVideo recordings\nMissed class',
    aiResponse: {
      content: 'Access recordings:\n1. Go to "My Courses"\n2. Select your course\n3. Click "Recordings" tab\n4. Videos available 2 hours after live class\n\nDownload via mobile app for offline viewing.',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 88,
      latency: 1.3,
      status: 'passed',
    },
    notes: 'Course access question',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'Can I switch to a different batch?',
    expectedAnswer: 'Yes, contact support@pw.live or go to Settings > My Batches > Request Switch. We\'ll check availability and process within 24 hours. No additional charges if switching within same course level.',
    leadingQuestions: 'Change batch\nBatch transfer\nSwitch timing\nDifferent batch',
    aiResponse: {
      content: 'You can request a batch switch by contacting support@pw.live. We\'ll check availability and confirm within 24 hours.',
      feedback: undefined,
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 67,
      latency: 1.8,
      status: 'failed',
    },
    notes: 'Incomplete - missing self-service option',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
    recommendations: [
      {
        id: 'r4',
        type: 'knowledge',
        title: 'Add Batch Management Details',
        priority: 'high',
        description: 'Response missing self-service batch switching option. Add documentation about the Settings > My Batches feature.',
        actionLabel: 'Go to Knowledge Base → Upload batch management guide',
        icon: 'book',
      },
      {
        id: 'r5',
        type: 'action',
        title: 'Add Batch Check Action',
        priority: 'medium',
        description: 'Create an action to check batch availability in real-time instead of always routing to support.',
        actionLabel: 'Go to Actions → Create "Check Batch Availability" workflow',
        icon: 'zap',
      },
    ],
  },
  {
    id: uuid(),
    question: 'What payment methods do you accept?',
    expectedAnswer: 'We accept Credit/Debit cards (Visa, Mastercard, RuPay), UPI, Net Banking, Wallets (Paytm, PhonePe, Google Pay), and EMI options through partner banks.',
    leadingQuestions: 'Payment options\nHow to pay\nCredit card\nUPI\nEMI available',
    aiResponse: {
      content: 'We accept:\n- Credit/Debit cards (Visa, Mastercard, RuPay)\n- UPI payments\n- Net Banking\n- Digital wallets (Paytm, PhonePe, Google Pay)\n- EMI through partner banks',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 94,
      latency: 0.9,
      status: 'passed',
    },
    notes: 'Payment inquiry',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'Do you provide study materials?',
    expectedAnswer: 'Yes, all courses include comprehensive study materials: PDFs, practice questions, previous year papers, formula sheets, and chapter-wise notes. Available in app and web.',
    leadingQuestions: 'Study material\nPDF notes\nPractice questions\nResources',
    aiResponse: {
      content: 'Yes! Every course includes:\n- Downloadable PDF notes\n- Practice question banks\n- Previous year papers\n- Formula sheets\n- Chapter summaries\n\nAccess via app or web dashboard.',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 91,
      latency: 1.0,
      status: 'passed',
    },
    notes: 'Content resources query',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'How does doubt clearing work?',
    expectedAnswer: 'Ask doubts via app/web, get responses within 4 hours from subject experts. Pro and Premium plans include live doubt sessions. Upload photos of problems for step-by-step solutions.',
    leadingQuestions: 'Ask doubts\nDoubt resolution\nHelp with questions\nLive doubt session',
    aiResponse: {
      content: 'Doubt clearing process:\n1. Submit via app or web\n2. Expert response within 4 hours\n3. Pro/Premium: Live sessions available\n4. Upload problem photos for detailed solutions',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 86,
      latency: 1.4,
      status: 'passed',
    },
    notes: 'Support mechanism query',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'Can I get a demo before enrolling?',
    expectedAnswer: 'Yes! Request a free demo class - we\'ll send you a sample live class link and trial access for 7 days. Book via website or call 1800-120-456789.',
    leadingQuestions: 'Free demo\nTrial class\nSample lecture\nTest before buying\nDemo request',
    aiResponse: {
      content: 'Absolutely! Request a free demo and get 7-day trial access. Book online or call our helpline.',
      feedback: undefined,
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 64,
      latency: 2.3,
      status: 'failed',
    },
    notes: 'Missing contact details and booking process',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
    recommendations: [
      {
        id: 'r6',
        type: 'knowledge',
        title: 'Add Demo Booking Information',
        priority: 'high',
        description: 'Response lacks specific booking instructions and contact number. This is a high-intent query from potential customers.',
        actionLabel: 'Go to Knowledge Base → Add demo booking process with contact details',
        icon: 'book',
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
            checked: false,
          },
          {
            id: 'c2',
            label: 'Book a meeting',
            icon: 'calendar',
            description: 'Share available demo slots using Calendly',
            checked: false,
          },
          {
            id: 'c3',
            label: 'Create/update contact',
            icon: 'user-plus',
            description: 'Save lead in your CRM (HubSpot/Zoho)',
            checked: false,
          },
          {
            id: 'c4',
            label: 'Send message to channel',
            icon: 'message-square',
            description: 'Notify sales team in Slack #demo-requests',
            checked: false,
          },
        ],
      },
    ],
  },
];

// Create initial default worksheet - EMPTY (no sample data)
const createDefaultWorksheet = (): Worksheet => ({
  id: uuid(),
  name: 'All tests',
  testCases: [], // Start empty
  customColumns: [], // No custom columns by default
  createdAt: new Date(),
  updatedAt: new Date(),
});

export function useWorksheets(initialWorksheets?: Worksheet[]) {
  const [worksheets, setWorksheets] = useState<Worksheet[]>(
    initialWorksheets?.length ? initialWorksheets : [createDefaultWorksheet()]
  );
  const [activeWorksheetId, setActiveWorksheetId] = useState<string>(
    worksheets[0].id
  );

  // Get active worksheet
  const activeWorksheet = worksheets.find((ws) => ws.id === activeWorksheetId) || worksheets[0];

  // Create a new worksheet (always empty)
  const createWorksheet = useCallback((name?: string) => {
    const worksheetNumber = worksheets.length + 1;
    const newWorksheet: Worksheet = {
      id: uuid(),
      name: name || `Worksheet ${worksheetNumber}`,
      testCases: [], // Always empty
      customColumns: [], // No custom columns
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setWorksheets((prev) => [...prev, newWorksheet]);
    setActiveWorksheetId(newWorksheet.id);
    return newWorksheet;
  }, [worksheets.length]);

  // Rename a worksheet
  const renameWorksheet = useCallback((id: string, name: string) => {
    setWorksheets((prev) =>
      prev.map((ws) =>
        ws.id === id
          ? { ...ws, name, updatedAt: new Date() }
          : ws
      )
    );
  }, []);

  // Duplicate a worksheet
  const duplicateWorksheet = useCallback((id: string) => {
    const worksheet = worksheets.find((ws) => ws.id === id);
    if (!worksheet) return null;

    const duplicated: Worksheet = {
      ...deepClone(worksheet),
      id: uuid(),
      name: `${worksheet.name} (copy)`,
      testCases: worksheet.testCases.map((tc) => ({
        ...deepClone(tc),
        id: uuid(),
        runStatus: 'idle',
        aiResponse: undefined,
        metrics: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      customColumns: worksheet.customColumns.map((col) => ({
        ...deepClone(col),
        id: uuid(),
        createdAt: new Date(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setWorksheets((prev) => {
      const index = prev.findIndex((ws) => ws.id === id);
      const newWorksheets = [...prev];
      newWorksheets.splice(index + 1, 0, duplicated);
      return newWorksheets;
    });

    setActiveWorksheetId(duplicated.id);
    return duplicated;
  }, [worksheets]);

  // Delete a worksheet
  const deleteWorksheet = useCallback((id: string) => {
    // Don't allow deleting the last worksheet
    if (worksheets.length <= 1) return false;

    setWorksheets((prev) => {
      const filtered = prev.filter((ws) => ws.id !== id);
      // If deleting active worksheet, switch to first available
      if (id === activeWorksheetId) {
        setActiveWorksheetId(filtered[0].id);
      }
      return filtered;
    });

    return true;
  }, [worksheets.length, activeWorksheetId]);

  // Update test cases in active worksheet
  const updateActiveWorksheetTestCases = useCallback((testCases: TestCaseRow[]) => {
    setWorksheets((prev) =>
      prev.map((ws) =>
        ws.id === activeWorksheetId
          ? { ...ws, testCases, updatedAt: new Date() }
          : ws
      )
    );
  }, [activeWorksheetId]);

  // Load sample data into active worksheet
  const loadSampleDataToActiveWorksheet = useCallback(async () => {
    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const sampleData = createSampleTestCases();
    setWorksheets((prev) =>
      prev.map((ws) =>
        ws.id === activeWorksheetId
          ? { ...ws, testCases: sampleData, updatedAt: new Date() }
          : ws
      )
    );
  }, [activeWorksheetId]);

  // Move test cases between worksheets
  const moveTestCasesToWorksheet = useCallback(
    (testCaseIds: string[], targetWorksheetId: string) => {
      setWorksheets((prev) => {
        // Find test cases to move
        const sourceWorksheet = prev.find((ws) => ws.id === activeWorksheetId);
        if (!sourceWorksheet) return prev;

        const testCasesToMove = sourceWorksheet.testCases.filter((tc) =>
          testCaseIds.includes(tc.id)
        );

        return prev.map((ws) => {
          if (ws.id === activeWorksheetId) {
            // Remove from source
            return {
              ...ws,
              testCases: ws.testCases.filter((tc) => !testCaseIds.includes(tc.id)),
              updatedAt: new Date(),
            };
          }
          if (ws.id === targetWorksheetId) {
            // Add to target
            return {
              ...ws,
              testCases: [...ws.testCases, ...testCasesToMove],
              updatedAt: new Date(),
            };
          }
          return ws;
        });
      });
    },
    [activeWorksheetId]
  );

  // Add a custom column to the active worksheet
  const addCustomColumn = useCallback((name: string, type: ColumnType, options?: string[]) => {
    const field = `custom_${uuid().slice(0, 8)}`;
    const newColumn: CustomColumn = {
      id: uuid(),
      name,
      field,
      type,
      options: type === 'multiselect' ? options || [] : undefined,
      width: 200,
      createdAt: new Date(),
    };

    setWorksheets((prev) =>
      prev.map((ws) =>
        ws.id === activeWorksheetId
          ? { ...ws, customColumns: [...ws.customColumns, newColumn], updatedAt: new Date() }
          : ws
      )
    );

    return newColumn;
  }, [activeWorksheetId]);

  // Update a custom column
  const updateCustomColumn = useCallback((columnId: string, updates: Partial<CustomColumn>) => {
    setWorksheets((prev) =>
      prev.map((ws) =>
        ws.id === activeWorksheetId
          ? {
              ...ws,
              customColumns: ws.customColumns.map((col) =>
                col.id === columnId ? { ...col, ...updates } : col
              ),
              updatedAt: new Date(),
            }
          : ws
      )
    );
  }, [activeWorksheetId]);

  // Delete a custom column
  const deleteCustomColumn = useCallback((columnId: string) => {
    setWorksheets((prev) =>
      prev.map((ws) => {
        if (ws.id !== activeWorksheetId) return ws;
        
        const columnToDelete = ws.customColumns.find((col) => col.id === columnId);
        if (!columnToDelete) return ws;

        return {
          ...ws,
          customColumns: ws.customColumns.filter((col) => col.id !== columnId),
          // Also remove the custom data from all test cases
          testCases: ws.testCases.map((tc) => {
            if (!tc.customData) return tc;
            const { [columnToDelete.field]: _, ...restCustomData } = tc.customData;
            return { ...tc, customData: restCustomData };
          }),
          updatedAt: new Date(),
        };
      })
    );
  }, [activeWorksheetId]);

  // Duplicate a custom column
  const duplicateCustomColumn = useCallback((columnId: string) => {
    setWorksheets((prev) =>
      prev.map((ws) => {
        if (ws.id !== activeWorksheetId) return ws;
        
        const columnToDuplicate = ws.customColumns.find((col) => col.id === columnId);
        if (!columnToDuplicate) return ws;

        const newField = `custom_${uuid().slice(0, 8)}`;
        const newColumn: CustomColumn = {
          ...deepClone(columnToDuplicate),
          id: uuid(),
          name: `${columnToDuplicate.name} (copy)`,
          field: newField,
          createdAt: new Date(),
        };

        // Copy the data from the original column to the new column
        const updatedTestCases = ws.testCases.map((tc) => {
          if (!tc.customData || !tc.customData[columnToDuplicate.field]) return tc;
          return {
            ...tc,
            customData: {
              ...tc.customData,
              [newField]: tc.customData[columnToDuplicate.field],
            },
          };
        });

        const columnIndex = ws.customColumns.findIndex((col) => col.id === columnId);
        const newCustomColumns = [...ws.customColumns];
        newCustomColumns.splice(columnIndex + 1, 0, newColumn);

        return {
          ...ws,
          customColumns: newCustomColumns,
          testCases: updatedTestCases,
          updatedAt: new Date(),
        };
      })
    );
  }, [activeWorksheetId]);

  return {
    worksheets,
    activeWorksheet,
    activeWorksheetId,
    setActiveWorksheetId,
    createWorksheet,
    renameWorksheet,
    duplicateWorksheet,
    deleteWorksheet,
    updateActiveWorksheetTestCases,
    loadSampleDataToActiveWorksheet,
    moveTestCasesToWorksheet,
    addCustomColumn,
    updateCustomColumn,
    deleteCustomColumn,
    duplicateCustomColumn,
  };
}
