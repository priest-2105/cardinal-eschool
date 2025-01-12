const cardinalConfig = {
    appName: "Cardinal E School",
    version: "1.0.0",
    description: "A modern e-learning platform for seamless school management.",
    apiBaseURL: "",
    contactInfo: {
      phone: "+234 01 2345 6789",
      email: "online@cardinalschools.com",
      address: "123 Cardinal Street, Lagos, Nigeria",
    },
    socialInfo: {
      facebook: "https://facebook.com/cardinaleschools",
      X: "https://x.com/cardinaleschools",
      tikTok: "https://tiktok.com/cardinaleschools",
      youtube: "https://youtube.com/cardinaleschools",
      whatsapp: "https://whatsapp.com/cardinaleschools",
    },
    features: {
      enableNotifications: true,
      enableDarkMode: false,
      supportedLanguages: ["en", "fr", "es"],
    },
    developerInfo: {
      name: "Cardinal Tech Team", 
      website: "https://cardinaleschool.com",
      supportEmail: "support@cardinaleschool.com",
    },
    routes: {
        home: "/",
        login: "/login",
        aboutUs: "/about",
        contactUs: "/contact",
        testPrep: "/text-prep",
        careers: "/team",
        courses: "/courses",
        members: "/team/#member",
        faq: "/faq",
        ourMembers: "/members",
        dashboard: "/dashboard",
        privacyPolicy: "/privacy-policy", 
      },
  };
  
  export default cardinalConfig;
  