// Advanced knowledge base for the chatbot
const knowledgeBase = {
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy', 'greetings'],
    responses: [
      {
        text: "Hello! I'm your Service Giving Assistant. How can I help you today?",
        suggestions: ["Tell me about your services", "I need pricing information", "How to get started?"]
      },
      {
        text: "Hi there! Welcome to Service Giving. I'm here to assist you with anything you need.",
        suggestions: ["View services", "Get a quote", "Talk to support"]
      }
    ]
  },

  services: {
    patterns: ['services', 'what do you offer', 'what services', 'help me with', 'offerings'],
    responses: [
      {
        text: "We offer comprehensive digital solutions across multiple domains:\n\n" +
          "🌐 Web Development\n" +
          "• Custom Websites & Web Apps\n" +
          "  - Responsive design\n" +
          "  - E-commerce platforms\n" +
          "  - Progressive Web Apps\n" +
          "  - Content Management Systems\n" +
          "  - API Development\n\n" +
          "📱 Mobile Development\n" +
          "• Cross-Platform & Native Apps\n" +
          "  - iOS Development\n" +
          "  - Android Development\n" +
          "  - Flutter Applications\n" +
          "  - React Native Solutions\n\n" +
          "🎯 Digital Marketing\n" +
          "• Full-Service Marketing\n" +
          "  - SEO & Content Strategy\n" +
          "  - Social Media Management\n" +
          "  - PPC Campaigns\n" +
          "  - Email Marketing\n\n" +
          "🛡️ Cybersecurity\n" +
          "• Security Solutions\n" +
          "  - Security Audits\n" +
          "  - Penetration Testing\n" +
          "  - Secure Architecture\n" +
          "  - Compliance Management\n\n" +
          "🤖 AI & Machine Learning\n" +
          "• Intelligent Solutions\n" +
          "  - Data Analysis\n" +
          "  - Predictive Models\n" +
          "  - Chatbots & Virtual Assistants\n" +
          "  - Process Automation",
        suggestions: ["Tell me about web development", "Mobile app pricing", "Marketing services", "Security solutions"]
      }
    ]
  },

  webDevelopment: {
    patterns: ['web development', 'website', 'web app', 'web application', 'ecommerce', 'online store'],
    responses: [
      {
        text: "Our Web Development Solutions:\n\n" +
          "🎨 Frontend Development\n" +
          "• Modern UI/UX\n" +
          "  - React.js/Next.js\n" +
          "  - Vue.js/Nuxt.js\n" +
          "  - Angular\n" +
          "  - Responsive Design\n" +
          "  - Performance Optimization\n\n" +
          "⚙️ Backend Development\n" +
          "• Robust Server Solutions\n" +
          "  - Node.js/Express\n" +
          "  - Python/Django/Flask\n" +
          "  - Java Spring Boot\n" +
          "  - PHP/Laravel\n" +
          "  - GraphQL APIs\n\n" +
          "🛍️ E-commerce Solutions\n" +
          "• Complete Online Stores\n" +
          "  - Shopify Development\n" +
          "  - WooCommerce\n" +
          "  - Custom E-commerce\n" +
          "  - Payment Integration\n" +
          "  - Inventory Management\n\n" +
          "📊 Enterprise Features\n" +
          "• Business Solutions\n" +
          "  - CRM Integration\n" +
          "  - Analytics Dashboard\n" +
          "  - Cloud Services\n" +
          "  - Load Balancing\n" +
          "  - Microservices",
        suggestions: ["E-commerce pricing", "Custom web app", "Website maintenance", "Start a project"]
      }
    ]
  },

  mobileDevelopment: {
    patterns: ['mobile app', 'android', 'ios', 'smartphone', 'mobile development', 'app development'],
    responses: [
      {
        text: "Mobile Development Excellence:\n\n" +
          "📱 Native Development\n" +
          "• iOS Development\n" +
          "  - Swift/SwiftUI\n" +
          "  - iOS Guidelines\n" +
          "  - App Store Optimization\n" +
          "  - iCloud Integration\n\n" +
          "🤖 Android Development\n" +
          "  - Kotlin/Java\n" +
          "  - Material Design\n" +
          "  - Google Play Store\n" +
          "  - Android Services\n\n" +
          "🔄 Cross-Platform\n" +
          "• Unified Solutions\n" +
          "  - React Native\n" +
          "  - Flutter\n" +
          "  - Xamarin\n" +
          "  - Single Codebase\n\n" +
          "🔧 Advanced Features\n" +
          "• Modern Capabilities\n" +
          "  - Push Notifications\n" +
          "  - Offline Mode\n" +
          "  - Social Integration\n" +
          "  - Analytics\n" +
          "  - AR/VR Features",
        suggestions: ["App development cost", "iOS vs Android", "Start app project", "App maintenance"]
      }
    ]
  },

  pricing: {
    patterns: ['price', 'cost', 'how much', 'pricing', 'package', 'fee', 'budget'],
    responses: [
      {
        text: "Our Flexible Pricing Options:\n\n" +
          "🌟 Starter Package\n" +
          "• Basic Solutions\n" +
          "  - Essential features\n" +
          "  - Basic support\n" +
          "  - Starting at $2,000\n" +
          "  - 2-4 weeks delivery\n\n" +
          "💼 Professional Package\n" +
          "• Business Solutions\n" +
          "  - Advanced features\n" +
          "  - Priority support\n" +
          "  - Starting at $5,000\n" +
          "  - 4-8 weeks delivery\n\n" +
          "🏢 Enterprise Package\n" +
          "• Custom Solutions\n" +
          "  - Full customization\n" +
          "  - 24/7 support\n" +
          "  - Custom pricing\n" +
          "  - Flexible timeline\n\n" +
          "💡 Additional Services\n" +
          "• Maintenance Plans\n" +
          "  - Monthly updates\n" +
          "  - Security patches\n" +
          "  - Performance monitoring\n" +
          "  - From $500/month",
        suggestions: ["Get custom quote", "View packages", "Schedule consultation", "Payment plans"]
      }
    ]
  },

  process: {
    patterns: ['process', 'how does it work', 'steps', 'procedure', 'workflow', 'methodology'],
    responses: [
      {
        text: "Our Development Process:\n\n" +
          "1️⃣ Discovery Phase\n" +
          "• Understanding Needs\n" +
          "  - Requirements gathering\n" +
          "  - Market research\n" +
          "  - Competitor analysis\n" +
          "  - Technical planning\n\n" +
          "2️⃣ Design Phase\n" +
          "• Creative Process\n" +
          "  - Wireframing\n" +
          "  - UI/UX design\n" +
          "  - Prototyping\n" +
          "  - Design approval\n\n" +
          "3️⃣ Development Phase\n" +
          "• Building Solution\n" +
          "  - Agile methodology\n" +
          "  - Sprint planning\n" +
          "  - Regular updates\n" +
          "  - Quality assurance\n\n" +
          "4️⃣ Launch Phase\n" +
          "• Deployment\n" +
          "  - Testing\n" +
          "  - Optimization\n" +
          "  - Launch preparation\n" +
          "  - Go-live support\n\n" +
          "5️⃣ Maintenance\n" +
          "• Ongoing Support\n" +
          "  - Regular updates\n" +
          "  - Performance monitoring\n" +
          "  - Security patches\n" +
          "  - Feature updates",
        suggestions: ["Start a project", "View timeline", "Schedule meeting", "Get quote"]
      }
    ]
  },

  support: {
    patterns: ['support', 'help', 'contact', 'reach', 'talk to human', 'representative', 'assistance'],
    responses: [
      {
        text: "We're Here to Help!\n\n" +
          "📧 Email Support\n" +
          "• 24/7 Availability\n" +
          "  - support@servicegiving.com\n" +
          "  - Response within 24h\n" +
          "  - Technical assistance\n" +
          "  - Project inquiries\n\n" +
          "📱 Phone Support\n" +
          "• Direct Communication\n" +
          "  - +1 (555) 123-4567\n" +
          "  - Mon-Fri: 9AM-6PM\n" +
          "  - Emergency support\n" +
          "  - Instant assistance\n\n" +
          "💬 Live Chat\n" +
          "• Instant Help\n" +
          "  - Available in dashboard\n" +
          "  - Quick responses\n" +
          "  - Technical support\n" +
          "  - File sharing\n\n" +
          "🤝 Account Manager\n" +
          "• Personal Assistance\n" +
          "  - Dedicated support\n" +
          "  - Project coordination\n" +
          "  - Regular meetings\n" +
          "  - Progress updates",
        suggestions: ["Contact support", "Emergency help", "Schedule call", "Report issue"]
      }
    ]
  },

  technologies: {
    patterns: ['technology', 'tech stack', 'programming', 'framework', 'platform', 'tools'],
    responses: [
      {
        text: "Our Technology Stack:\n\n" +
          "🎨 Frontend\n" +
          "• Modern Frameworks\n" +
          "  - React/Next.js\n" +
          "  - Vue.js/Nuxt.js\n" +
          "  - Angular\n" +
          "  - TypeScript\n" +
          "  - Tailwind CSS\n\n" +
          "⚙️ Backend\n" +
          "• Server Technologies\n" +
          "  - Node.js/Express\n" +
          "  - Python/Django\n" +
          "  - Java Spring\n" +
          "  - PHP Laravel\n" +
          "  - Go\n\n" +
          "📱 Mobile\n" +
          "• App Development\n" +
          "  - React Native\n" +
          "  - Flutter\n" +
          "  - Swift/SwiftUI\n" +
          "  - Kotlin\n\n" +
          "☁️ Cloud & DevOps\n" +
          "• Infrastructure\n" +
          "  - AWS/Azure/GCP\n" +
          "  - Docker/Kubernetes\n" +
          "  - CI/CD pipelines\n" +
          "  - Microservices",
        suggestions: ["Tech consultation", "Architecture review", "Best practices", "Performance optimization"]
      }
    ]
  },

  maintenance: {
    patterns: ['maintenance', 'update', 'upgrade', 'support plan', 'service plan'],
    responses: [
      {
        text: "Maintenance & Support Plans:\n\n" +
          "🛠️ Basic Maintenance\n" +
          "• Essential Care\n" +
          "  - Security updates\n" +
          "  - Bug fixes\n" +
          "  - Basic monitoring\n" +
          "  - $500/month\n\n" +
          "⚡ Professional Care\n" +
          "• Enhanced Support\n" +
          "  - 24/7 monitoring\n" +
          "  - Performance optimization\n" +
          "  - Regular backups\n" +
          "  - $1,000/month\n\n" +
          "🌟 Enterprise Support\n" +
          "• Complete Coverage\n" +
          "  - Dedicated team\n" +
          "  - Priority response\n" +
          "  - Custom solutions\n" +
          "  - Custom pricing\n\n" +
          "📊 All Plans Include\n" +
          "• Standard Features\n" +
          "  - Monthly reports\n" +
          "  - Health checks\n" +
          "  - Update management\n" +
          "  - Technical support",
        suggestions: ["View plans", "Custom maintenance", "Start maintenance", "Emergency support"]
      }
    ]
  },

  default: {
    responses: [
      {
        text: "I'm here to help! You can ask me about:\n\n" +
          "• Our services and solutions\n" +
          "• Pricing and packages\n" +
          "• Development process\n" +
          "• Technology stack\n" +
          "• Support options\n" +
          "• Maintenance plans\n\n" +
          "What would you like to know more about?",
        suggestions: ["View services", "Get pricing", "Contact support", "Start project"]
      }
    ]
  }
};

// Enhanced response selection with context awareness
const getResponseWithContext = (message, previousMessages = []) => {
  const lowerMessage = message.toLowerCase();
  let bestMatch = {
    category: 'default',
    score: 0,
    confidence: 0
  };

  // Helper function to calculate word similarity
  const calculateWordSimilarity = (word1, word2) => {
    const len1 = word1.length;
    const len2 = word2.length;
    const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;

    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }

    return 1 - matrix[len2][len1] / Math.max(len1, len2);
  };

  // Process each category
  Object.entries(knowledgeBase).forEach(([category, data]) => {
    if (!data.patterns) return;

    let categoryScore = 0;
    let patternMatches = 0;
    let wordMatches = 0;
    const messageWords = lowerMessage.split(/\s+/);

    // Check exact pattern matches
    data.patterns.forEach(pattern => {
      if (lowerMessage.includes(pattern)) {
        categoryScore += 2;
        patternMatches++;
      }

      // Check word-by-word similarity
      const patternWords = pattern.split(/\s+/);
      patternWords.forEach(patternWord => {
        messageWords.forEach(messageWord => {
          const similarity = calculateWordSimilarity(patternWord, messageWord);
          if (similarity > 0.8) {
            categoryScore += similarity;
            wordMatches++;
          }
        });
      });
    });

    // Add context score from previous messages
    const recentContext = previousMessages.slice(-3);
    recentContext.forEach((prevMessage, index) => {
      const contextWeight = 0.5 / (index + 1); // More recent messages have higher weight
      data.patterns.forEach(pattern => {
        if (prevMessage.toLowerCase().includes(pattern)) {
          categoryScore += contextWeight;
        }
      });
    });

    // Calculate confidence based on matches and message length
    const confidence = (patternMatches * 2 + wordMatches) / messageWords.length;

    if (categoryScore > bestMatch.score) {
      bestMatch = {
        category,
        score: categoryScore,
        confidence
      };
    }
  });

  // Get response from best matching category
  const category = bestMatch.confidence > 0.3 ? bestMatch.category : 'default';
  const responses = knowledgeBase[category].responses;
  const response = responses[Math.floor(Math.random() * responses.length)];

  // Generate dynamic suggestions based on context
  let suggestions = [...response.suggestions];
  if (previousMessages.length > 0) {
    const lastContext = previousMessages[previousMessages.length - 1].toLowerCase();
    Object.entries(knowledgeBase).forEach(([cat, data]) => {
      if (cat !== category && data.patterns && data.patterns.some(p => lastContext.includes(p))) {
        const contextResponse = data.responses[0];
        suggestions = [...suggestions, ...contextResponse.suggestions.slice(0, 2)];
      }
    });
  }

  return {
    text: response.text,
    suggestions: [...new Set(suggestions)].slice(0, 4),
    category,
    confidence: bestMatch.confidence
  };
};

export const getBotResponse = (message, context = []) => {
  return getResponseWithContext(message, context);
};

export const knowledge = knowledgeBase;
