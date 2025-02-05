const cardinalConfig = {
    appName: "Cardinal E School",
    version: "1.0.0",
    description: "A modern e-learning platform for seamless school management.",
    apiBaseURL: "",
    contactInfo: {
      phone: "+234 811 181 1995",
      email: "online@cardinalschools.com",
      address: "3, Olalekan Adekoya Street, Off Liasu Road, Egbe-Idimu, Lagos.",
    },
    socialInfo: {
      facebook: "https://www.facebook.com/share/1A5tjqXiNN/",
      X: "https://x.com/@CardinalEschool",
      tikTok: "https://tiktok.com/@cardinal.eschool",
      youtube: "https://youtube.com/@cardinale-school?si=zGTvnW1KDIeM_CGt",
      whatsapp: "https://wa.link/bbt2vr",
      instagram: "https://www.instagram.com/cardinaleschool?igsh=eDd1ejdubXo5OWpt",
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
        signup: "/signup",
        aboutUs: "/about",
        contactUs: "/contact",
        testPrep: "/text-prep",
        careers: "/team",
        courses: "/courses",
        members: "/team/#ourteam",
        faq: "/faq", 
        dashboard: "/dashboard",
        privacyPolicy: "/privacy-policy", 
        dashboard: {
          student: {
            home: "/student",
            courses: "/student/courses",
            coursesdetails: "/student/courses/:id",
            assignments: "/student/assignments",
            notifications: "/student/notifications",
            studentinformation: "/student/studentinformation",
            guardianinformation : "/student/guardianinformation",
            studentprofilesettings: "/student/settings",
            studentticketlist: "/student/ticketlist",
            studentcreateticket: "/student/createticket",
            studentticketdetails: "/student/ticketdetails",
            studentMakePayment: "/student/makepayment",
            studentPaymentHistory: "/student/paymenthistory",
          },
          tutor: {
            home: "/tutor",
            courses: "/tutor/courses",
            assignments: "/tutor/assignments",
            notifications: "/tutor/notifications",
            profile: "/tutor/profile",
          },
          admin: {
            home: "/admin",
            courses: "/admin/courses",
            assignments: "/admin/assignments",
            notifications: "/admin/notifications",
            profile: "/admin/profile",
          },
        }
      },
  };
  
  export default cardinalConfig;
  