// Authentication  API EXPORT

export * from "./auth/login";
export * from "./auth/signnup";
export * from "./auth//resetpassword";
export * from "./auth/changepassword";
export * from "./auth/logout";



// Student Profile API EXPORT 
export * from "./profile/fetchuserProfile";
export * from "./profile/updateStudentDP";
export * from "./profile/updatestudentProfile";
export * from "./profile/fetchStudentAssessment";
export * from "./profile/updateAssessment";
export * from "./profile/fetchguardiandetails";
export * from "./profile/updateguardiandetails";
export * from "./profile/fetchsingleplan";



// Student Ticket API EXPORT
export * from "./ticket/createticket";
export * from "./ticket/fetchtickets";
export * from "./ticket/tickedetails";



// Student Notification API EXPORT
export * from "./notifcation/fetchnotification";
export * from "./notifcation/marknotificationasread";
export * from "./notifcation/markallnotificationasread";
export * from "./notifcation/deletenotification";


// Student Payment API EXPORT
export * from "./payment/makepayment";
export * from "./payment/fetchTransactionHistory";
export * from "./payment/transactiondetails";