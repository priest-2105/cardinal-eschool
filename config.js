const cardinalConfig = {
  appName: "Cardinal E School",
  version: "1.0.0",
  description: "A modern e-learning platform for seamless school management.",
  apiBaseURL: "",
  contactInfo: {
    phone: "+234 813 9295 906",
    email: "cardinaleschool@gmail.com",
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
  payment: {
    accountNumber: "2005415730",
    accountName: "CARDINAL E-SCHOOL AND EDU SERVICES LTD",
    bankName: "FCMB",
    accountType: "",
    currency: "NGN",
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
    refundPolicy: "/refund-policy",
    terms: "/terms",
    dashboard: {
      student: {
        home: "/student",
        courses: "/student/courses",
        courseDetails: (courseId) => `/student/course/${courseId}`,
        assessments: "/student/assessments",
        notifications: "/student/notifications",
        studentinformation: "/student/studentinformation",
        guardianinformation: "/student/guardianinformation",
        studentprofilesettings: "/student/settings",
        studentticketlist: "/student/ticketlist",
        studentcreateticket: "/student/createticket",
        studentticketdetails: "/student/ticketdetails",
        studentMakePayment: "/student/makepayment",
        studentPaymentHistory: "/student/paymenthistory",
        studentTransactionDetails: (id) => `student/transaction/${id}`,
        studentNotifications: "/student/notifications", 
      },
      tutor: {
        home: "/tutor",
        courses: "/tutor/courses",
        courseDetails: (courseId) => `/tutor/course/${courseId}`,
        assessments: "/tutor/assessments", 
        tutorinformation: "/tutor/tutorinformation",
        guardianinformation: "/tutor/guardianinformation",
        tutorprofilesettings: "/tutor/settings",
        tutorticketlist: "/tutor/ticketlist",
        tutorcreateticket: "/tutor/createticket",
        tutorticketdetails: (ticketId) => `/tutor/ticket/${ticketId}`,
        tutorMakePayment: "/tutor/makepayment",
        tutorPaymentHistory: "/tutor/paymenthistory",
        tutorTransactionDetails: "/tutor/transactiondetails",
        tutorNotifications: "/tutor/notifications", 
      },
      admin: {
        home: "/admin",
        admincreatecourse: "/admin/createcourse",        
        adminmanagecourses: "/admin/courses",
        courseDetails: (courseId) => `/admin/course/${courseId}`,
        assessments: "/admin/assessments",
        notifications: "/admin/notifications",
        admininformation: "/admin/admininformation",
        guardianinformation: "/admin/guardianinformation",
        adminprofilesettings: "/admin/settings",
        adminticketlist: "/admin/ticketlist",
        adminreplyticket: "/admin/replyticket",
        adminticketdetails: (ticketId) => `/admin/ticket/${ticketId}`,
        adminMakePayment: "/admin/managepayment",
        adminPaymentHistory: "/admin/paymenthistory",
        adminTransactionDetails: "/admin/transactiondetails",
        adminManageStudents: "/admin/students",
        adminStudentDetails:(studentdetails) => `/admin/student/${studentdetails}`,
        adminManageTutors: "/admin/tutors",
        adminTutorDetails:(tutordetails) => `/admin/tutor/${tutordetails}`,
        adminAnnouncements: "/admin/announcements",
        adminPendingReports: "/admin/pendingreports",
        adminAnnouncementDetails:(announcementdetail) => `/admin/coupon/${announcementdetail}`,
        adminCreateAnnouncement: "/admin/announcement/create",
        adminCreateCoupon: "/admin/createcoupon",
        adminCouponList: "/admin/coupons",
        adminCouponDetails:  (couponId) => `/admin/coupon/${couponId}`,
        adminEditCoupon: (couponId) => `/admin/editcoupon/${couponId}`,
        adminNotifications: "/admin/notifications", 
      },
    },
  },
}

module.exports = cardinalConfig

