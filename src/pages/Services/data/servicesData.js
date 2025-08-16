// pages/Services/data/servicesData.js
import { 
  HeartOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  MedicineBoxOutlined,
  SmileOutlined,
  WomanOutlined,
  TeamOutlined,
  PhoneOutlined,
  BookOutlined,
  ExperimentOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

export const servicesData = [
  {
    id: 1,
    title: "YONI AROGYA",
    icon: <WomanOutlined style={{ fontSize: '24px', color: '#e91e63' }} />,
    duration: "3 MONTHS",
    includes: [
      "Complete Diet & Yoga Program",
      "2 Consultations per Month", 
      "Nari Arogya Classes",
      "Eligible for Other Online Programs",
      "Personalized Exercise Routines",
      "24/7 WhatsApp Support"
    ],
    options: [
      { type: "Complete Program", price: "3499", duration: "1 Month" },
      { type: "Diet/Yoga Only", price: "1199", duration: "1 Month" }
    ],
    category: "Women's Health",
    description: "Comprehensive program for menstrual health and women's wellness through natural methods.",
    benefits: [
      "Hormonal balance through natural methods",
      "Reduced menstrual discomfort and irregularities",
      "Improved reproductive health",
      "Enhanced energy and vitality",
      "Better sleep quality and mood stability"
    ],
    rating: "4.9"
  },
  {
    id: 2,
    title: "SWASTHA AROGYA", 
    icon: <HeartOutlined style={{ fontSize: '24px', color: '#2196f3' }} />,
    duration: "3 MONTHS",
    includes: [
      "Complete Diet & Yoga Program",
      "2 Consultations per Month",
      "Disease-specific Diet Plans", 
      "General Health Yoga",
      "Progress Tracking & Monitoring",
      "Lifestyle Modification Guidance"
    ],
    options: [
      { type: "Complete Program", price: "3500", duration: "1 Month" },
      { type: "Specific Diet/Yoga", price: "1199", duration: "1 Month" }
    ],
    category: "Programs",
    description: "Holistic health program combining personalized diet and yoga for overall wellness.",
    benefits: [
      "Improved overall health and immunity",
      "Better digestion and metabolism",
      "Stress reduction and mental clarity",
      "Weight management and fitness",
      "Prevention of lifestyle diseases"
    ],
    rating: "4.8"
  },
  {
    id: 3,
    title: "GARBHINI AROGYA",
    icon: <SmileOutlined style={{ fontSize: '24px', color: '#ff9800' }} />,
    duration: "3 MONTHS (3rd Trimester)",
    includes: [
      "Pregnancy Yoga (4 days/week)",
      "Pranayama Techniques",
      "Meditation Sessions",
      "Safe Exercise Routines",
      "Labor Preparation Classes",
      "Postpartum Recovery Guide"
    ],
    options: [
      { type: "Complete Program", price: "999", duration: "1 Month" }
    ],
    category: "Women & Pregnancy",
    description: "Specialized yoga and wellness program for expecting mothers in their third trimester.",
    benefits: [
      "Easier labor and delivery",
      "Reduced pregnancy discomfort",
      "Better baby positioning",
      "Improved mental well-being",
      "Faster postpartum recovery"
    ],
    rating: "4.9"
  },
  {
    id: 4,
    title: "GARBHA SANSKAR",
    icon: <UserOutlined style={{ fontSize: '24px', color: '#9c27b0' }} />,
    duration: "12 MONTHS (Pre-conception to Delivery)",
    includes: [
      "Pre-conception Body Detox",
      "Nutrition for Couples",
      "Pregnancy Diet Management",
      "Relaxation Techniques",
      "Fetus Connection Sessions",
      "Pelvic Opening Yoga",
      "Emotional Support & Counseling",
      "Partner Involvement Programs"
    ],
    options: [
      { type: "Complete Journey", price: "Contact", duration: "12 Months" }
    ],
    category: "Women & Pregnancy",
    description: "Complete journey from pre-conception preparation to delivery with comprehensive care.",
    benefits: [
      "Optimal health for conception",
      "Healthy pregnancy progression",
      "Strong parent-child bonding",
      "Reduced pregnancy complications",
      "Holistic child development"
    ],
    rating: "5.0"
  },
  {
    id: 5,
    title: "NARI AROGYA CLASSES",
    icon: <BookOutlined style={{ fontSize: '24px', color: '#4caf50' }} />,
    duration: "7 DAYS",
    includes: [
      "Understanding Menstrual Cycle",
      "Hormone Balance Education",
      "Cancer Prevention",
      "Menstrual Hygiene",
      "Natural Disease Management",
      "Naturopathy Treatments",
      "Q&A Sessions",
      "Take-home Resources"
    ],
    options: [
      { type: "Complete Classes", price: "499", duration: "7 Days" }
    ],
    category: "Women & Pregnancy",
    description: "Comprehensive educational program on women's health and natural wellness methods.",
    benefits: [
      "Better understanding of body cycles",
      "Improved self-care practices",
      "Early disease detection knowledge",
      "Natural healing techniques",
      "Confident health decisions"
    ],
    rating: "4.7"
  },
  {
    id: 6,
    title: "DR CONSULTATION",
    icon: <MedicineBoxOutlined style={{ fontSize: '24px', color: '#795548' }} />,
    duration: "1 SITTING (30 mins)",
    includes: [
      "Body Composition Analysis",
      "Nadi Pariksha",
      "Diet Modifications",
      "Naturopathy Treatments",
      "General Yoga Chart",
      "Health Assessment Report"
    ],
    options: [
      { type: "Basic Consultation", price: "399", duration: "30 mins" }
    ],
    category: "Consultation",
    description: "Personalized consultation with comprehensive health assessment and recommendations.",
    benefits: [
      "Accurate health diagnosis",
      "Personalized treatment plan",
      "Expert medical guidance",
      "Natural healing approach",
      "Follow-up recommendations"
    ],
    rating: "4.8"
  },
  {
    id: 7,
    title: "DR CONSULTATION WITH DIET CHART",
    icon: <CalendarOutlined style={{ fontSize: '24px', color: '#607d8b' }} />,
    duration: "1 SITTING + Monthly Follow-up",
    includes: [
      "Complete Health Assessment",
      "Detailed Diet Chart",
      "Disease-specific Plans",
      "Combination Disease Management",
      "Monthly Guidance",
      "Progress Monitoring",
      "Diet Adjustments"
    ],
    options: [
      { type: "Complete Package", price: "1499", duration: "1 Month" }
    ],
    category: "Consultation",
    description: "Comprehensive consultation with personalized diet charts and ongoing monthly support.",
    benefits: [
      "Customized nutrition plan",
      "Ongoing health monitoring",
      "Expert dietary guidance",
      "Disease management support",
      "Sustainable lifestyle changes"
    ],
    rating: "4.9"
  },
  {
    id: 8,
    title: "NATUROPATHY DIAGNOSIS",
    icon: <ExperimentOutlined style={{ fontSize: '24px', color: '#ff5722' }} />,
    duration: "1 SITTING (20 mins)",
    includes: [
      "Tongue Analysis",
      "Iris Diagnosis", 
      "Elemental Diagnosis",
      "Natural Assessment Methods",
      "Body Constitution Analysis",
      "Detailed Report"
    ],
    options: [
      { type: "Diagnostic Session", price: "199", duration: "20 mins" }
    ],
    category: "Consultation",
    description: "Natural diagnostic methods using traditional techniques for health assessment.",
    benefits: [
      "Non-invasive health assessment",
      "Early disease detection",
      "Constitutional analysis",
      "Natural treatment guidance",
      "Preventive health insights"
    ],
    rating: "4.6"
  },
  {
    id: 9,
    title: "ACUPUNCTURE",
    icon: <TeamOutlined style={{ fontSize: '24px', color: '#3f51b5' }} />,
    duration: "7 SESSIONS",
    includes: [
      "Nadi Pariksha (1st Day)",
      "Acupuncture Sessions",
      "Traditional Healing Methods",
      "Progress Monitoring",
      "Pain Management Techniques",
      "Energy Balancing"
    ],
    options: [
      { type: "Complete Course", price: "999", duration: "7 Sessions (25 min each)" }
    ],
    category: "Programs",
    description: "Traditional acupuncture therapy with initial assessment and multiple sessions.",
    benefits: [
      "Natural pain relief",
      "Improved energy flow",
      "Stress reduction",
      "Better sleep quality",
      "Enhanced healing response"
    ],
    rating: "4.7"
  },
  {
    id: 10,
    title: "WEEKEND SPECIALS",
    icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#8bc34a' }} />,
    duration: "1 HOUR",
    includes: [
      "Pranayama Sessions",
      "Trataka Meditation",
      "108 Surya Namaskara",
      "Krida Yoga (Playful Yoga)",
      "Group Activities",
      "Refreshments"
    ],
    options: [
      { type: "Weekend Session", price: "99", duration: "1 Hour" }
    ],
    category: "Specials",
    description: "Special weekend sessions focusing on breathing, meditation, and energizing yoga practices.",
    benefits: [
      "Weekend stress relief",
      "Community connection",
      "Energy rejuvenation",
      "Fun fitness activities",
      "Mental refreshment"
    ],
    rating: "4.5"
  }
];

// Updated service groups based on your requirements
export const serviceGroups = [
  {
    id: 'consultation',
    title: "Consultation",
    icon: '🩺',
    description: "Professional health consultations using traditional and modern diagnostic methods for personalized treatment plans.",
    services: [6, 7, 8], // DR CONSULTATION, DR CONSULTATION WITH DIET CHART, NATUROPATHY DIAGNOSIS
    features: [
      {
        title: "Comprehensive Assessment",
        description: "Detailed health evaluation using multiple diagnostic methods"
      },
      {
        title: "Personalized Plans",
        description: "Customized treatment and diet plans based on individual needs"
      },
      {
        title: "Expert Guidance",
        description: "Professional medical guidance with natural healing approaches"
      }
    ]
  },
  {
    id: 'specials',
    title: "Specials",
    icon: '⚡',
    description: "Special wellness programs and weekend sessions designed for community wellness and stress relief.",
    services: [10], // WEEKEND SPECIALS
    features: [
      {
        title: "Community Wellness",
        description: "Group sessions for social connection and shared healing"
      },
      {
        title: "Stress Relief",
        description: "Quick and effective stress-busting techniques"
      },
      {
        title: "Affordable Options",
        description: "Budget-friendly wellness solutions for everyone"
      }
    ]
  },
  {
    id: 'women-pregnancy',
    title: "Women & Pregnancy",
    icon: '🌸',
    description: "Comprehensive care for women's health, pregnancy, and maternity needs with specialized programs.",
    services: [1, 3, 4, 5], // YONI AROGYA, GARBHINI AROGYA, GARBHA SANSKAR, NARI AROGYA CLASSES
    features: [
      {
        title: "Hormonal Balance",
        description: "Natural methods to regulate hormones and improve menstrual health"
      },
      {
        title: "Pregnancy Care",
        description: "Complete support from pre-conception to postpartum recovery"
      },
      {
        title: "Women's Education",
        description: "Comprehensive education on women's health and wellness"
      }
    ]
  },
  {
    id: 'programs',
    title: "Programs",
    icon: '🌿',
    description: "Comprehensive wellness programs combining traditional therapies with modern health approaches.",
    services: [2, 9], // SWASTHA AROGYA, ACUPUNCTURE
    features: [
      {
        title: "Holistic Approach",
        description: "Complete wellness programs addressing mind, body, and spirit"
      },
      {
        title: "Traditional Therapies",
        description: "Ancient healing methods combined with modern techniques"
      },
      {
        title: "Long-term Wellness",
        description: "Sustainable programs for lasting health improvements"
      }
    ]
  }
];