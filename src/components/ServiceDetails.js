import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Timer as TimerIcon,
  Assignment as ProcessIcon
} from '@mui/icons-material';

const serviceDetails = {
  webdev: {
    title: 'Web Development Services',
    description: 'Professional web development services tailored to your needs',
    features: [
      'Custom website design and development',
      'E-commerce solutions with payment integration',
      'Progressive Web Apps (PWA)',
      'Responsive design for all devices',
      'SEO optimization & analytics setup',
      'Performance optimization & caching',
      'SSL/Security implementation',
      'API integration & custom backend'
    ],
    process: [
      'Requirements gathering and analysis',
      'Design mockups and wireframes',
      'Development and coding',
      'Testing and quality assurance',
      'Deployment and launch',
      'Maintenance and support'
    ],
    timeline: '2-8 weeks',
    packages: {
      india: [
        {
          name: 'Basic Website',
          price: '₹40,000',
          duration: '2 weeks'
        },
        {
          name: 'E-commerce Store',
          price: '₹1,00,000',
          duration: '4 weeks'
        },
        {
          name: 'Custom Web App',
          price: '₹2,00,000+',
          duration: '6-8 weeks'
        }
      ],
      international: [
        {
          name: 'Basic Website',
          price: '$1,000',
          duration: '2 weeks'
        },
        {
          name: 'E-commerce Store',
          price: '$3,000',
          duration: '4 weeks'
        },
        {
          name: 'Custom Web App',
          price: '$5,000+',
          duration: '6-8 weeks'
        }
      ]
    }
  },
  mobileapp: {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications',
    features: [
      'iOS & Android development',
      'React Native & Flutter apps',
      'UI/UX design',
      'App Store optimization',
      'Push notifications',
      'Analytics integration',
      'Payment gateway integration',
      'Offline functionality'
    ],
    process: [
      'Market research',
      'Wireframing & prototyping',
      'Development',
      'Testing',
      'App store submission',
      'Post-launch support'
    ],
    timeline: '2-4 months',
    packages: {
      india: [
        {
          name: 'Basic App',
          price: '₹2,00,000',
          duration: '2 months'
        },
        {
          name: 'Professional App',
          price: '₹5,00,000',
          duration: '3 months'
        },
        {
          name: 'Enterprise App',
          price: '₹10,00,000+',
          duration: '4+ months'
        }
      ],
      international: [
        {
          name: 'Basic App',
          price: '$5,000',
          duration: '2 months'
        },
        {
          name: 'Professional App',
          price: '$12,000',
          duration: '3 months'
        },
        {
          name: 'Enterprise App',
          price: '$25,000+',
          duration: '4+ months'
        }
      ]
    }
  },
  chatbot: {
    title: 'AI Chatbot Development',
    description: 'Enterprise-grade AI chatbots powered by latest LLM technology',
    features: [
      'GPT-4 or Claude integration',
      'Multi-platform deployment',
      'Custom AI model training',
      'Advanced analytics dashboard',
      '24/7 automated support',
      'Seamless human handoff',
      'Multi-language support',
      'Custom knowledge base integration'
    ],
    process: [
      'Use case analysis & requirements',
      'Knowledge base preparation',
      'AI model training & fine-tuning',
      'Integration & deployment setup',
      'Testing & optimization',
      'Monitoring & maintenance'
    ],
    timeline: '2-6 weeks',
    packages: {
      india: [
        {
          name: 'Basic Chatbot',
          price: '₹80,000',
          duration: '2 weeks'
        },
        {
          name: 'Advanced AI Assistant',
          price: '₹2,00,000',
          duration: '4 weeks'
        },
        {
          name: 'Enterprise Solution',
          price: '₹5,00,000+',
          duration: '6 weeks'
        }
      ],
      international: [
        {
          name: 'Basic Chatbot',
          price: '$2,000',
          duration: '2 weeks'
        },
        {
          name: 'Advanced AI Assistant',
          price: '$5,000',
          duration: '4 weeks'
        },
        {
          name: 'Enterprise Solution',
          price: '$10,000+',
          duration: '6 weeks'
        }
      ]
    }
  },
  digital: {
    title: 'Digital Marketing Services',
    description: 'Comprehensive digital marketing solutions for business growth',
    features: [
      'SEO optimization',
      'Google Ads management',
      'Social media marketing',
      'Content marketing',
      'Email marketing',
      'Analytics & reporting',
      'Conversion optimization',
      'Brand building'
    ],
    process: [
      'Market analysis',
      'Strategy development',
      'Campaign setup',
      'Content creation',
      'Campaign management',
      'Performance tracking'
    ],
    timeline: 'Monthly subscription',
    packages: {
      india: [
        {
          name: 'Starter Package',
          price: '₹20,000/month',
          duration: 'Monthly'
        },
        {
          name: 'Growth Package',
          price: '₹50,000/month',
          duration: 'Monthly'
        },
        {
          name: 'Enterprise Package',
          price: '₹1,00,000/month',
          duration: 'Monthly'
        }
      ],
      international: [
        {
          name: 'Starter Package',
          price: '$500/month',
          duration: 'Monthly'
        },
        {
          name: 'Growth Package',
          price: '$1,200/month',
          duration: 'Monthly'
        },
        {
          name: 'Enterprise Package',
          price: '$2,500/month',
          duration: 'Monthly'
        }
      ]
    }
  },
  social: {
    title: 'Social Media Management',
    description: 'AI-powered social media management and content creation',
    features: [
      'AI-powered content creation',
      'Social media strategy & planning',
      'Community management',
      'Paid advertising',
      'Influencer marketing',
      'Analytics & reporting',
      'Crisis management',
      'Brand building'
    ],
    process: [
      'Social audit',
      'Strategy development',
      'Content planning',
      'Daily management',
      'Analytics tracking',
      'Monthly reporting'
    ],
    timeline: 'Monthly subscription',
    packages: {
      india: [
        {
          name: 'Basic Package',
          price: '₹15,000/month',
          duration: 'Monthly'
        },
        {
          name: 'Professional Package',
          price: '₹35,000/month',
          duration: 'Monthly'
        },
        {
          name: 'Enterprise Package',
          price: '₹75,000/month',
          duration: 'Monthly'
        }
      ],
      international: [
        {
          name: 'Basic Package',
          price: '$400/month',
          duration: 'Monthly'
        },
        {
          name: 'Professional Package',
          price: '$900/month',
          duration: 'Monthly'
        },
        {
          name: 'Enterprise Package',
          price: '$2,000/month',
          duration: 'Monthly'
        }
      ]
    }
  },
  custom: {
    title: 'Custom Software Development',
    description: 'Enterprise-grade software solutions with cutting-edge technology',
    features: [
      'Custom desktop & mobile apps',
      'Cloud-native applications',
      'Enterprise API development',
      'Database design & optimization',
      'AI/ML integration',
      'Legacy system modernization',
      'Microservices architecture',
      'DevOps & CI/CD setup'
    ],
    process: [
      'Requirements analysis',
      'Architecture design',
      'Agile development',
      'Quality assurance',
      'Deployment & DevOps',
      'Maintenance & support'
    ],
    timeline: '3-12 months',
    packages: {
      india: [
        {
          name: 'MVP Development',
          price: '₹5,00,000',
          duration: '3 months'
        },
        {
          name: 'Full Product',
          price: '₹10,00,000',
          duration: '6 months'
        },
        {
          name: 'Enterprise Solution',
          price: '₹20,00,000+',
          duration: '12 months'
        }
      ],
      international: [
        {
          name: 'MVP Development',
          price: '$10,000',
          duration: '3 months'
        },
        {
          name: 'Full Product',
          price: '$25,000',
          duration: '6 months'
        },
        {
          name: 'Enterprise Solution',
          price: '$50,000+',
          duration: '12 months'
        }
      ]
    }
  },
  consulting: {
    title: 'Technical Consulting',
    description: 'Expert technical consulting and advisory services',
    features: [
      'Architecture review & design',
      'Technology stack selection',
      'Security audit & implementation',
      'Performance optimization',
      'Cloud migration strategy',
      'DevOps implementation',
      'Team training & mentoring',
      'Technical documentation'
    ],
    process: [
      'Initial assessment',
      'Gap analysis',
      'Recommendations',
      'Implementation plan',
      'Execution support',
      'Progress monitoring'
    ],
    timeline: 'Flexible',
    packages: {
      india: [
        {
          name: 'Project Assessment',
          price: '₹75,000',
          duration: '1 week'
        },
        {
          name: 'Technical Strategy',
          price: '₹2,00,000',
          duration: '2 weeks'
        },
        {
          name: 'Ongoing Consulting',
          price: '₹4,00,000/month',
          duration: 'Monthly'
        }
      ],
      international: [
        {
          name: 'Project Assessment',
          price: '$2,000',
          duration: '1 week'
        },
        {
          name: 'Technical Strategy',
          price: '$5,000',
          duration: '2 weeks'
        },
        {
          name: 'Ongoing Consulting',
          price: '$10,000/month',
          duration: 'Monthly'
        }
      ]
    }
  },
  design: {
    title: 'UI/UX Design Services',
    description: 'Beautiful and user-friendly design solutions for your digital products',
    features: [
      'Custom UI design',
      'User experience optimization',
      'Wireframing & prototyping',
      'Brand identity design',
      'Mobile app design',
      'Web design',
      'Design systems',
      'User testing'
    ],
    process: [
      'Requirements gathering',
      'Research & analysis',
      'Wireframing',
      'Design concepts',
      'Prototyping',
      'User testing',
      'Final delivery'
    ],
    timeline: '2-6 weeks',
    packages: {
      india: [
        {
          name: 'Basic Design',
          price: '₹30,000',
          duration: '2 weeks',
          includes: ['5 pages design', 'Basic branding', 'Responsive design']
        },
        {
          name: 'Professional',
          price: '₹75,000',
          duration: '4 weeks',
          includes: ['10 pages design', 'Full branding', 'Interactive prototype']
        },
        {
          name: 'Enterprise',
          price: '₹1,50,000+',
          duration: '6 weeks',
          includes: ['Unlimited pages', 'Design system', 'Full documentation']
        }
      ],
      international: [
        {
          name: 'Basic Design',
          price: '$800',
          duration: '2 weeks',
          includes: ['5 pages design', 'Basic branding', 'Responsive design']
        },
        {
          name: 'Professional',
          price: '$2,000',
          duration: '4 weeks',
          includes: ['10 pages design', 'Full branding', 'Interactive prototype']
        },
        {
          name: 'Enterprise',
          price: '$4,000+',
          duration: '6 weeks',
          includes: ['Unlimited pages', 'Design system', 'Full documentation']
        }
      ]
    }
  },
  seo: {
    title: 'SEO Services',
    description: 'Improve your search rankings and online visibility',
    features: [
      'Keyword research & analysis',
      'On-page optimization',
      'Technical SEO',
      'Content optimization',
      'Link building',
      'Local SEO',
      'SEO audit',
      'Monthly reporting'
    ],
    process: [
      'Initial audit',
      'Strategy development',
      'Implementation',
      'Content optimization',
      'Link building',
      'Monitoring & reporting'
    ],
    timeline: 'Monthly subscription',
    packages: {
      india: [
        {
          name: 'Basic SEO',
          price: '₹15,000/month',
          duration: 'Monthly',
          includes: ['5 keywords', 'Basic optimization', 'Monthly report']
        },
        {
          name: 'Business SEO',
          price: '₹30,000/month',
          duration: 'Monthly',
          includes: ['15 keywords', 'Content creation', 'Link building']
        },
        {
          name: 'Enterprise SEO',
          price: '₹60,000/month',
          duration: 'Monthly',
          includes: ['Unlimited keywords', 'Full optimization', 'Weekly reports']
        }
      ],
      international: [
        {
          name: 'Basic SEO',
          price: '$400/month',
          duration: 'Monthly',
          includes: ['5 keywords', 'Basic optimization', 'Monthly report']
        },
        {
          name: 'Business SEO',
          price: '$800/month',
          duration: 'Monthly',
          includes: ['15 keywords', 'Content creation', 'Link building']
        },
        {
          name: 'Enterprise SEO',
          price: '$1,600/month',
          duration: 'Monthly',
          includes: ['Unlimited keywords', 'Full optimization', 'Weekly reports']
        }
      ]
    }
  },
  cloud: {
    title: 'Cloud Solutions',
    description: 'Cloud infrastructure and deployment services',
    features: [
      'Cloud migration',
      'Infrastructure setup',
      'DevOps implementation',
      'Containerization',
      'Monitoring & logging',
      'Auto-scaling',
      'Security implementation',
      'Cost optimization'
    ],
    process: [
      'Assessment',
      'Planning',
      'Migration',
      'Testing',
      'Deployment',
      'Monitoring'
    ],
    timeline: '1-3 months',
    packages: {
      india: [
        {
          name: 'Startup Cloud',
          price: '₹40,000',
          duration: '1 month',
          includes: ['Basic setup', 'Single service', 'Basic monitoring']
        },
        {
          name: 'Business Cloud',
          price: '₹1,00,000',
          duration: '2 months',
          includes: ['Multiple services', 'Auto-scaling', 'Advanced monitoring']
        },
        {
          name: 'Enterprise Cloud',
          price: '₹2,50,000+',
          duration: '3 months',
          includes: ['Full infrastructure', 'DevOps', '24/7 support']
        }
      ],
      international: [
        {
          name: 'Startup Cloud',
          price: '$1,000',
          duration: '1 month',
          includes: ['Basic setup', 'Single service', 'Basic monitoring']
        },
        {
          name: 'Business Cloud',
          price: '$2,500',
          duration: '2 months',
          includes: ['Multiple services', 'Auto-scaling', 'Advanced monitoring']
        },
        {
          name: 'Enterprise Cloud',
          price: '$6,000+',
          duration: '3 months',
          includes: ['Full infrastructure', 'DevOps', '24/7 support']
        }
      ]
    }
  },
  security: {
    title: 'Cybersecurity Services',
    description: 'Protect your business with advanced security solutions',
    features: [
      'Security assessment',
      'Penetration testing',
      'Vulnerability scanning',
      'Security monitoring',
      'Incident response',
      'Compliance audit',
      'Security training',
      'Policy development'
    ],
    process: [
      'Initial assessment',
      'Risk analysis',
      'Security implementation',
      'Testing',
      'Training',
      'Monitoring'
    ],
    timeline: '2-4 weeks',
    packages: {
      india: [
        {
          name: 'Basic Security',
          price: '₹50,000',
          duration: '2 weeks',
          includes: ['Basic assessment', 'Vulnerability scan', 'Basic training']
        },
        {
          name: 'Advanced Security',
          price: '₹1,25,000',
          duration: '3 weeks',
          includes: ['Full assessment', 'Pen testing', 'Advanced training']
        },
        {
          name: 'Enterprise Security',
          price: '₹2,50,000+',
          duration: '4 weeks',
          includes: ['Complete security', '24/7 monitoring', 'Incident response']
        }
      ],
      international: [
        {
          name: 'Basic Security',
          price: '$1,200',
          duration: '2 weeks',
          includes: ['Basic assessment', 'Vulnerability scan', 'Basic training']
        },
        {
          name: 'Advanced Security',
          price: '$3,000',
          duration: '3 weeks',
          includes: ['Full assessment', 'Pen testing', 'Advanced training']
        },
        {
          name: 'Enterprise Security',
          price: '$6,000+',
          duration: '4 weeks',
          includes: ['Complete security', '24/7 monitoring', 'Incident response']
        }
      ]
    }
  },
  training: {
    title: 'Technical Training Services',
    description: 'Custom training programs for your team',
    features: [
      'Custom curriculum',
      'Hands-on workshops',
      'Project-based learning',
      'Live coding sessions',
      'Assessment & feedback',
      'Course materials',
      'Certification',
      'Post-training support'
    ],
    process: [
      'Needs assessment',
      'Curriculum design',
      'Material preparation',
      'Training delivery',
      'Assessment',
      'Feedback & support'
    ],
    timeline: '1-4 weeks',
    packages: {
      india: [
        {
          name: 'Basic Training',
          price: '₹25,000',
          duration: '1 week',
          includes: ['Basic concepts', '10 hours', 'Course materials']
        },
        {
          name: 'Comprehensive',
          price: '₹60,000',
          duration: '2 weeks',
          includes: ['Advanced topics', '30 hours', 'Projects']
        },
        {
          name: 'Enterprise Training',
          price: '₹1,20,000+',
          duration: '4 weeks',
          includes: ['Custom program', 'Unlimited hours', 'Certification']
        }
      ],
      international: [
        {
          name: 'Basic Training',
          price: '$600',
          duration: '1 week',
          includes: ['Basic concepts', '10 hours', 'Course materials']
        },
        {
          name: 'Comprehensive',
          price: '$1,500',
          duration: '2 weeks',
          includes: ['Advanced topics', '30 hours', 'Projects']
        },
        {
          name: 'Enterprise Training',
          price: '$3,000+',
          duration: '4 weeks',
          includes: ['Custom program', 'Unlimited hours', 'Certification']
        }
      ]
    }
  }
};

function ServiceDetails({ serviceId, open, onClose, region = 'india' }) {
  const details = serviceDetails[serviceId];

  if (!details) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          {details.title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            {details.description}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <List dense>
              {details.features.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Process
            </Typography>
            <List dense>
              {details.process.map((step, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ProcessIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary={step} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Packages ({region === 'india' ? 'Indian Pricing' : 'International Pricing'})
          </Typography>
          <Grid container spacing={2}>
            {details.packages[region].map((pkg, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    bgcolor: index === 1 ? 'primary.light' : 'background.paper',
                    position: 'relative'
                  }}
                >
                  {index === 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderBottomLeftRadius: 4
                      }}
                    >
                      Popular
                    </Box>
                  )}
                  <div>
                    <Typography variant="h6" gutterBottom>
                      {pkg.name}
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {pkg.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Duration: {pkg.duration}
                    </Typography>
                    {pkg.includes && (
                      <List dense>
                        {pkg.includes.map((item, i) => (
                          <ListItem key={i} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={item}
                              primaryTypographyProps={{
                                variant: 'body2'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </div>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TimerIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  Timeline: {details.timeline}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onClose();
          }}
        >
          Request Service
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ServiceDetails;
