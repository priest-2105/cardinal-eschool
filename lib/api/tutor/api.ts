// Authentication  API EXPORT

export * from "./auth/login";
export * from "./auth//resetpassword";
export * from "./auth/changepassword";
export * from "./auth/logout";



// Tutor Profile API EXPORT 
export * from "./profile/fetchuserProfile";
export * from "./profile/updateTutorDP";
export * from "./profile/updatetutorProfile";

// Tutor Class API EXPORT 
export * from "./courses/assignresources"
export * from "./courses/courselist"
export * from "./courses/createresources"
export * from "./courses/fetchresources"
export * from "./courses/fetchsinglecourse"
export * from "./courses/createassessment"
export * from "./courses/fetchsingleassessment"
export * from "./courses/deleteassessment"
export * from "./courses/createreport"
export * from "./courses/fetchreport"
export * from "./courses/updaterereport"



// Tutor Ticket API EXPORT
export * from "./ticket/createticket";
export * from "./ticket/fetchtickets";
export * from "./ticket/tickedetails";



// Tutor Notification API EXPORT
export * from "./notifcation/fetchnotification";
export * from "./notifcation/marknotificationasread";
export * from "./notifcation/markallnotificationasread";
export * from "./notifcation/deletenotification";