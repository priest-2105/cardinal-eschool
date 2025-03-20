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


// Admin Manage Tutort API EXPORT
export * from "./managetutor/createtutor";
export * from "./managetutor/fetchtutors";


//  Admin Manage Coupon API

export * from "./coupon/createcoupon";
export * from "./coupon/fetchCoupons";
export * from "./coupon/deactivatecoupon";



// Admin Notification API EXPORT
export * from "./notifcation/fetchnotification";
export * from "./notifcation/marknotificationasread";
export * from "./notifcation/markallnotificationasread";
export * from "./notifcation/deletenotification";

// Admin Coupon API EXPORT
export * from "./coupon/fetchCoupons";
export * from "./coupon/deactivatecoupon";