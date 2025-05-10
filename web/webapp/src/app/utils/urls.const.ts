export const BASE_URL = "http://localhost:3000/api";
// export const BASE_URL = "https://decor.doggyduty.live/api";


export const AuthenticationUrls = {
  LOGIN : BASE_URL + "/auth/login",
  SIGN_OUT : BASE_URL + "/auth/signout",
  ADD_USER: BASE_URL + "/auth/adduser",
  GET_ALL_USER: BASE_URL + "/auth/getalluser",
  CHECK_EXISTING_USER: BASE_URL + "/auth/checkexistinguser",
  CHECK_IS_LOGGEDIN: BASE_URL + "/auth/islogedin",
  SEND_RESET_TOKEN: BASE_URL + "/auth/sendresettoken",
  VERIFY_RESET_TOKEN: BASE_URL + "/auth/verifytoken",
  RESET_PASSWORD: BASE_URL + "/auth/resetpassword",
}

export const ServiceUrls = {
  GETALL : BASE_URL + "/service/getall",
  CREATE_SERVICE : BASE_URL + "/service/create",
}

export const CommunityUrls = {
  CREATE : BASE_URL + "/community/create",
  UPDATE : BASE_URL + "/community/update",
  GET_BY_ID : BASE_URL + "/community/getbyid",
  GETALL : BASE_URL + "/community/getall",
  GETALL_BY_DISTANCE_ORDER : BASE_URL + "/community/getallbydistance",
  CREATE_EVENT : BASE_URL + "/community/event/create",
  UPDATE_EVENT_SCHED : BASE_URL + "/community/event/update",
  GETALL_TNX_HISTORY : BASE_URL + "/community/history/getbyid",
  
}

export const ConfigUrls = {
  GET_ALL : BASE_URL + "/config/getall",
  GET_ALL_BY_NAME : BASE_URL + "/config/getallbyname",
  ADD : BASE_URL + "/config/create",
  UPDATE : BASE_URL + "/config/update",
}
export const EventScheduleUrls = {
  CREATE : BASE_URL + "/event/create",
  GET_ALL : BASE_URL + "/event/getall",
  GET_BY_ID : BASE_URL + "/event/getbyid",
  UPDATE : BASE_URL + "/event/update",
  UPDATE_ITEM : BASE_URL + "/event/item/update",
  DELETE : BASE_URL + "/event/delete",
  COMPLETE : BASE_URL + "/event/complete",
  GET_SUMMARY : BASE_URL + "/event/getsummary",

}

export const DecorationItemsUrls = {
  CREATE : BASE_URL + "/items/create",
  GET_ALL : BASE_URL + "/items/getall",
  GET_BY_ID : BASE_URL + "/items/getbyid",
  UPDATE : BASE_URL + "/items/update",
  DELETE : BASE_URL + "/items/delete",
}
export const UploadUrls = {
  UPLOAD : BASE_URL + "/file-upload/upload",
}