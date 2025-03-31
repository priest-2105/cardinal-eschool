// Authentication  API EXPORT

export * from "./auth/login";
export * from "./auth/resetpassword";
export * from "./auth/changepassword";
export * from "./auth/logout";



// Admin Profile API EXPORT 
export * from "./profile/fetchuserProfile";
export * from "./profile/updateteadminProfile";



// Admin Ticket API EXPORT
export * from "./ticket/replyticket";
export * from "./ticket/fetchtickets";
export * from "./ticket/tickedetails";


// Admin Manage Tutor API EXPORT
export * from "./managetutor/createtutor";
export * from "./managetutor/fetchtutors";
export * from "./managetutor/gettutordetails";


// Admin Manage Student API EXPORT
export * from "./managestudent/getstudentlist"
export * from "./managestudent/getstudentdetails"


// Admin Update User Status
export * from "./userstatus/updateuserstatus"


// Admin Course Management
export * from "./managecourses/createcourse" 
export * from "./managecourses/courselist"
export * from "./managecourses/fetchsinglecourse"
export * from "./managecourses/fetchasessments"
export * from "./managecourses/fetchreport"
export * from "./managecourses/fetchresources"





//  Admin Manage Coupon API
export * from "./coupon/createcoupon";
export * from "./coupon/fetchCoupons";
export * from "./coupon/deactivatecoupon";


// Admin Announcement API EXPORT
export * from "./announcement/announcementlist"
export * from "./announcement/createannouncement"
export * from "./announcement/announcementdetails"
export * from "./announcement/editannouncement"
export * from "./announcement/deleteannouncement"


// Admin Notification API EXPORT
export * from "./notifcation/fetchnotification";
export * from "./notifcation/marknotificationasread";
export * from "./notifcation/markallnotificationasread";
export * from "./notifcation/deletenotification";

// Admin Coupon API EXPORT
export * from "./coupon/fetchCoupons";
export * from "./coupon/deactivatecoupon";