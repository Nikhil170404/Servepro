import {
  Chat as ChatIcon,
  Web as WebIcon,
  Campaign as MarketingIcon,
  Psychology as ConsultingIcon,
  Language as SeoIcon,
  Business as StartupIcon
} from '@mui/icons-material';

export const services = [
  {
    id: 'webdev',
    title: 'Web Development',
    icon: WebIcon,
    description: 'Custom websites and web applications built with modern technologies',
    longDescription: `Our web development services include:
      • Custom website development
      • E-commerce solutions
      • Progressive Web Apps (PWA)
      • Web application development
      • CMS development
      • API integration`,
    price: {
      usd: {
        basic: 499,
        standard: 999,
        premium: 1999
      },
      inr: {
        basic: 19999,
        standard: 39999,
        premium: 79999
      }
    },
    deliveryTime: '2-8 weeks',
    features: {
      basic: [
        'Responsive Design',
        '5 Pages',
        'Basic SEO',
        'Contact Form',
        '1 Month Support',
        'Mobile Friendly',
        'Basic Analytics'
      ],
      standard: [
        'Everything in Basic',
        'Up to 10 Pages',
        'CMS Integration',
        'E-commerce Features',
        '3 Months Support',
        'Performance Optimization',
        'Advanced Analytics'
      ],
      premium: [
        'Everything in Standard',
        'Unlimited Pages',
        'Custom Features',
        'Priority Support',
        '12 Months Support',
        'International SEO',
        'Multi-language Support'
      ]
    },
    technologies: ['React', 'Node.js', 'MongoDB', 'Firebase', 'AWS'],
    category: 'development',
    marketComparison: 'Average market rate: $2000-5000'
  },
  {
    id: 'chatbot',
    title: 'AI Chatbot Development',
    icon: ChatIcon,
    description: 'Custom AI chatbots powered by GPT-4 and other advanced LLMs',
    longDescription: `Our chatbot solutions include:
      • Custom AI chatbot development
      • Integration with existing platforms
      • Training on your business data
      • Multi-language support
      • Analytics and reporting
      • Continuous learning and improvement`,
    price: {
      usd: {
        basic: 299,
        standard: 799,
        premium: 1499
      },
      inr: {
        basic: 11999,
        standard: 29999,
        premium: 59999
      }
    },
    deliveryTime: '2-4 weeks',
    features: {
      basic: [
        'Basic Chatbot',
        'Standard Responses',
        'Single Language',
        'Basic Analytics',
        '1 Month Support',
        'Web Integration'
      ],
      standard: [
        'AI-Powered Responses',
        'Multi-language Support',
        'Custom Training',
        'Advanced Analytics',
        '3 Months Support',
        'API Integration'
      ],
      premium: [
        'GPT-4 Integration',
        'Custom AI Model',
        'Full Platform Integration',
        'Real-time Learning',
        '12 Months Support',
        'Enterprise Features'
      ]
    },
    technologies: ['GPT-4', 'TensorFlow', 'Python', 'Node.js', 'AWS'],
    category: 'ai',
    marketComparison: 'Average market rate: $1000-3000'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    icon: MarketingIcon,
    description: 'Comprehensive digital marketing solutions for business growth',
    longDescription: `Our digital marketing services include:
      • Social media marketing
      • Content marketing
      • Email marketing
      • PPC advertising
      • Marketing automation
      • Analytics and reporting`,
    price: {
      usd: {
        basic: 299,
        standard: 599,
        premium: 999
      },
      inr: {
        basic: 11999,
        standard: 23999,
        premium: 39999
      }
    },
    deliveryTime: 'Monthly Subscription',
    features: {
      basic: [
        'Social Media Management',
        'Basic Content Creation',
        'Monthly Reports',
        'Basic SEO',
        'Email Marketing',
        'Local Marketing'
      ],
      standard: [
        'Advanced Social Management',
        'Content Strategy',
        'PPC Campaigns',
        'Advanced SEO',
        'Marketing Automation',
        'Regional Marketing'
      ],
      premium: [
        'Full Digital Strategy',
        'Custom Campaigns',
        'Dedicated Manager',
        'Priority Support',
        'ROI Optimization',
        'International Marketing'
      ]
    },
    technologies: ['Google Ads', 'Facebook Ads', 'Mailchimp', 'SEMrush', 'Google Analytics'],
    category: 'marketing',
    marketComparison: 'Average market rate: $500-2000/month'
  },
  {
    id: 'seo',
    title: 'SEO Services',
    icon: SeoIcon,
    description: 'Improve your search rankings and online visibility',
    longDescription: `Our SEO services include:
      • Technical SEO
      • On-page optimization
      • Off-page optimization
      • Local SEO
      • Content optimization
      • Keyword research`,
    price: {
      usd: {
        basic: 199,
        standard: 399,
        premium: 799
      },
      inr: {
        basic: 7999,
        standard: 15999,
        premium: 31999
      }
    },
    deliveryTime: 'Monthly Subscription',
    features: {
      basic: [
        'Keyword Research',
        'On-page SEO',
        'Monthly Reports',
        'Basic Optimization',
        'Google My Business',
        'Local Citations'
      ],
      standard: [
        'Technical SEO',
        'Content Strategy',
        'Link Building',
        'Local SEO',
        'Competitor Analysis',
        'Schema Markup'
      ],
      premium: [
        'Advanced Technical SEO',
        'Content Creation',
        'Authority Building',
        'International SEO',
        'Custom Strategy',
        'E-commerce SEO'
      ]
    },
    technologies: ['SEMrush', 'Ahrefs', 'Google Analytics', 'Google Search Console'],
    category: 'marketing',
    marketComparison: 'Average market rate: $500-1500/month'
  },
  {
    id: 'startup',
    title: 'Startup Package',
    icon: StartupIcon,
    description: 'Complete digital solution package for startups',
    longDescription: `Our startup package includes:
      • Website development
      • Branding
      • Digital marketing
      • Technical consulting
      • Business strategy
      • Growth planning`,
    price: {
      usd: {
        basic: 799,
        standard: 1499,
        premium: 2999
      },
      inr: {
        basic: 31999,
        standard: 59999,
        premium: 119999
      }
    },
    deliveryTime: '1-3 months',
    features: {
      basic: [
        'Basic Website',
        'Logo Design',
        'Social Media Setup',
        'Basic SEO',
        'Email Setup',
        'Business Consultation'
      ],
      standard: [
        'Custom Website',
        'Full Branding',
        'Digital Marketing',
        'CRM Setup',
        'Technical Support',
        'Growth Strategy'
      ],
      premium: [
        'Advanced Website',
        'Full Digital Presence',
        'Marketing Strategy',
        'Business Consulting',
        'Dedicated Support',
        'International Setup'
      ]
    },
    technologies: ['All Available Technologies'],
    category: 'startup',
    marketComparison: 'Average market rate: $3000-8000'
  },
  {
    id: 'consulting',
    title: 'Technical Consulting',
    icon: ConsultingIcon,
    description: 'Expert technical consulting for your business needs',
    longDescription: `Our consulting services include:
      • Technical strategy
      • Architecture planning
      • Technology selection
      • Security consulting
      • Performance optimization
      • Scale planning`,
    price: {
      usd: {
        basic: 149,
        standard: 399,
        premium: 799
      },
      inr: {
        basic: 5999,
        standard: 15999,
        premium: 31999
      }
    },
    deliveryTime: 'As Needed',
    features: {
      basic: [
        'Technical Assessment',
        'Basic Recommendations',
        'One-time Consultation',
        'Written Report',
        'Follow-up Call',
        'Best Practices Guide'
      ],
      standard: [
        'Detailed Analysis',
        'Strategy Planning',
        'Monthly Consultation',
        'Implementation Guide',
        'Priority Support',
        'Team Training'
      ],
      premium: [
        'Full Technical Audit',
        'Custom Strategy',
        'Weekly Consultation',
        'Implementation Support',
        'Emergency Support',
        'Dedicated Consultant'
      ]
    },
    technologies: ['All Available Technologies'],
    category: 'consulting',
    marketComparison: 'Average market rate: $200-1000/hour'
  }
];

export const categories = [
  {
    id: 'development',
    title: 'Development',
    description: 'Custom software development services'
  },
  {
    id: 'ai',
    title: 'AI Solutions',
    description: 'Artificial Intelligence and Machine Learning services'
  },
  {
    id: 'marketing',
    title: 'Digital Marketing',
    description: 'Marketing and growth services'
  },
  {
    id: 'startup',
    title: 'Startup Solutions',
    description: 'Complete packages for startups'
  },
  {
    id: 'consulting',
    title: 'Consulting',
    description: 'Expert technical consulting services'
  }
];

export const getServiceById = (id) => services.find(service => service.id === id);
export const getServicesByCategory = (category) => services.filter(service => service.category === category);
export const getAllServices = () => services;
export const getAllCategories = () => categories;
