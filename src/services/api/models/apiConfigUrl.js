import { App_uri } from '../../config';

export const APP_LAST_URI = Object.freeze({
    signin: {
        path: App_uri.BASE_URI + "api/v1/signin",
        isAuth: false,
        isPicLocation: false,
        method: "POST"
    },

    //without roles permission
    // login: {
    //     path: App_uri.CRM_BASE_URI + "api/v3/user/login",
    //     isAuth: false,
    //     isPicLocation: false,
    //     isEncrypt:true,
    //     method: "POST"
    // },


    // for new login api
    loginNew: {
        path: App_uri.CRM_BASE_URI + "api/v1/user/gn_mobileLogin",
        isAuth: false,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    //for customer login api
    customerLogin: {
        path: App_uri.CRM_BASE_URI + "api/v2/user/gn_customerLogin",
        isAuth: false,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for roles permission 
    login: {
        path: App_uri.CRM_BASE_URI + "api/v1/user/mobileLogin",
        isAuth: false,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    logout: {
        path: App_uri.CRM_BASE_URI + "api/v1/user/logout",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    customerLogout: {
        path: App_uri.CRM_BASE_URI + "api/v2/user/customerLogout",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },


    forgetpassword: {
        path: App_uri.BASE_URI + "api/v1/forgetpassword",
        isAuth: false,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    otpverification: {
        path: App_uri.BASE_URI + "api/v1/otpverification",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    resetpassword: {
        path: App_uri.BASE_URI + "api/v1/resetpassword",
        isAuth: false,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // change password for employee
    changepasswordEmployee: {
        path: App_uri.CRM_BASE_URI + "api/v1/user/changePassword",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // change password for customer
    changepasswordCustomer: {
        path: App_uri.CRM_BASE_URI + "api/v1/user/customerChangePassword",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    phoneNumberExist: {
        path: App_uri.CRM_BASE_URI + "api/v1/contactManage/ifTargetPhoneNumberExsist",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    phoneNumberExist_customer: {
        path: App_uri.CRM_BASE_URI + "api/v1/customerManagement/ifPhoneExistCustomer",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getPartnerCustomerList: {
        path: App_uri.CRM_BASE_URI + "api/v1/customerManagement/getlistOfNotApprvdCustomers",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for get general data
    getGeneralData: {
        path: App_uri.BASE_URI + "api/v1/pjpmanagement/getGeneralData",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for get customer general data
    getCustomerGeneralData: {
        path: App_uri.CRM_BASE_URI + "api/v2/customerManagement/gn_getDetailsNewRegCustomer",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },



    getAllMasterUnitList: {
        path: App_uri.BASE_URI + "api/v1/stockManagement/getAllMasterUnitList",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for update profile picture
    profilePicUpdate: {
        path: App_uri.BASE_URI + "api/v1/pjpmanagement/profilePicUpdate",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for update customer picture
    customerProfilePicUpdate: {
        path: App_uri.CRM_BASE_URI + "api/v1/customerManagement/updateCustomerImages",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for sfa image upload
    imageupload: {
        path: App_uri.BASE_URI + "api/v1/imageupload",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    // for crm image upload
    crmImageupload: {
        path: App_uri.CRM_BASE_URI + "api/v1/imageupload",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // fetch influencer list - customer login
    fetchInfluencerDetails: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/fetchInfluencerDetails",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // to get month wise data - dashboard chart data
    getMonthWisePoint: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getMonthWisePoint",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },


    addOdometer: {
        path: App_uri.BASE_URI + "api/v2/odometerManagement/addOdometer",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    registrationList: {
        path: App_uri.CRM_BASE_URI + "api/v3/customerManagement/gn_getlistOfNewRegCustomers",
        // path: App_uri.CRM_BASE_URI + "api/v2/customerManagement/getlistOfNewRegCustomers",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //  for new registration
    addNewRegCustomer: {
        path: App_uri.CRM_BASE_URI + "api/v1/customerManagement/gn_addNewRegCustomer",
        // path: App_uri.CRM_BASE_URI + "api/v1/customerManagement/addNewRegCustomer",
        isAuth: true,
        isPicLocation: true,
        isEncrypt: true,
        method: "POST"
    },

    notificationList: {
        path: App_uri.BASE_URI + "api/v1/notificationManagement/notificationList",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    deleteNotification: {
        path: App_uri.BASE_URI + "api/v1/notificationManagement/deleteNotification",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },


    //for version info

    //for prod
    getCurrentAppVersionInfo: {
        path: App_uri.BASE_URI + "api/v2/common/getCurrentAppVersionInfo",
        isAuth: false,
        isPicLocation: false,
        isEncrypt: false,
        method: "POST"
    },

    // for staging
    // getCurrentAppVersionInfo: {
    //     path: App_uri.BASE_URI + "api/v1/common/getCurrentAppVersionInfo",
    //     isAuth: false,
    //     isPicLocation: false,
    //     isEncrypt: false,
    //     method: "POST"
    // },


    ////////////////map section

    getUserStatus: {
        path: App_uri.CRM_BASE_URI + "api/v1/user/checkUserCurrentStatus",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getCustomerStatus: {
        path: App_uri.CRM_BASE_URI + "api/v1/user/checkCustomerCurrentStatus",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    // for getAllUser
    getContactTypes_v2: {
        path: App_uri.CRM_BASE_URI + "api/v2/mstContactType/getContactTypes",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getProjectCustomerData_v2: {
        path: App_uri.BASE_URI + "api/v2/customer/getProjectCustomerData",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },


    // for pic the users locations

    pickUserCurrentLocation: {
        path: App_uri.CRM_BASE_URI + "api/v1/pickUserCurrentLocation",
        isAuth: true,
        isPicLocation: true,
        isEncrypt: true,
        method: "POST"
    },
    // for pic the customer locations

    pickCustomerCurrentLocation: {
        path: App_uri.CRM_BASE_URI + "api/v1/pickCustomerCurrentLocation",
        isAuth: true,
        isPicLocation: true,
        isEncrypt: true,
        method: "POST"
    },

    //////////////////////////////////////////////////
    checkInterServerError: {
        path: App_uri.BASE_URI + "api/v1/checkInterServerError",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getCurrentLocation: {
        path: App_uri.CRM_BASE_URI + "api/v1/user/getUserCurrentLocation",
        isAuth: true,
        isPicLocation: true,
        isEncrypt: true,
        method: "POST"
    },


    // order section API's

    getAllProductBrandwiseList: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/getAllProductBrandwiseList",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //add to cart for order

    addProductForOrder: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/addProductForOrder",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for customer profile data

    getCustomerDataWithCartItemCount: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/getCustomerDataWithCartItemCount",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for cart details
    getListForCartDetails: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/getListForCartDetails",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for delete cart item
    deleteItemFromCart: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/deleteItemFromCart",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for order history
    getOrderHistory: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/getOrderHistory",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for repeat order
    repeatOrder: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/repeatOrder",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for order History Details
    getOrderHistoryDetails: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/getOrderDataFrmOrderHistrory",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for placing order
    placeNewOrder: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/placeNewOrder",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for successfull place order
    orderSuccessfullyDetails: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/orderDetails",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for recent orders
    recentOrderDetails: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/recentOrderDetails",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for update payment api 
    updatePayment: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/updatePayment",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for update payment api 
    fileupload: {
        path: App_uri.CRM_BASE_URI + "api/v1/fileupload",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for payment history list
    paymentHistory: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/paymentHistory",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for get Products Hirarchy wise
    getProductsHirarchywise: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/getProductsHirarchywise",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // for get Hierarchy Types Sl No from api
    getHierarchyTypesSlNo: {
        path: App_uri.CRM_BASE_URI + "api/v1/common/getHierarchyTypesSlNo",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    // for get User Immediate Child Data from api
    getUserImmediateChildData: {
        path: App_uri.CRM_BASE_URI + "api/v1/common/getUserImmediateChildData",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },






    ///////////////////////////////

    getUserMappedLastLevelLocations: {
        path: App_uri.CRM_BASE_URI + "api/v1/user/getUserMappedLastLevelLocations",
        isAuth: true,
        isPicLocation: true,
        isEncrypt: true,
        method: "POST"
    },

    //Cliky 2.0

    // for User Activity Selection Section for dashboard
    UserActivitySelectionSection: {
        path: App_uri.CRM_BASE_URI + "api/v1/dashboard/UserActivitySelectionSection",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },


    //to verify the otp
    orderOTPverification: {
        path: App_uri.CRM_BASE_URI + "api/v1/orderManagement/orderOTPverification",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for customer details section
    getDetailsNewRegCustomer: {
        path: App_uri.CRM_BASE_URI + "api/v2/customerManagement/gn_getDetailsNewRegCustomer",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //-----LMS-------------
    //get banner image
    getPromotionalImage: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getPromotionalImage",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },


    getCategoryByLocation: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getCategoryByLocation",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getCategoryByCatalogue: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getCategoryByCatalogue",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getGroupByCategory: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getCatalogueGroup",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },



    getItemByCatalogue: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getItemByCatalogue",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getItemDetails: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getItemDetails",
        isAuth: false,
        isPicLocation: false,
        isEncrypt: false,
        method: "POST"
    },

    //for lms dashboard card section
    getCardSection: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getCardSection",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "GET"
    },

    //for lms employee dashboard card section
    employeeDashboard: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/employeeDashboard",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "GET"
    },

    //for lms catalogue details screen suggestion section
    suggestionFromCatalogue: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/suggestionFromCatalogue",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },


    //for lms employee dashboard card section
    dashboardChart: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/dashboardChart",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    //for lms employee user points card section
    getUserPoints: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getUserPoints",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getPassbookList: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getPassbookList",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getRedemptionHistory: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getRedemptionHistory",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    fetchOffer: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/fetchOffer",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    claimNow: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/claimNow",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    saveSecondarySales: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v2/saveSecondarySales",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    lmsFileUpload: {
        path: App_uri.LMS_BASE_URI + "lms/upload/v1/uploadFile",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // download file
    geLMSFileDownloadPreview: {
        path: App_uri.LMS_BASE_URI + "lms/upload/v1/downloadFile",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    readExcelAndaddSales: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/readExcelAndaddSales",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },


    fetchLatestOffer: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/fetchLatestOffer",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    saveStockUpdate: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/saveStockUpdate",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },


    getAllDeliveryAddress: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getAllDeliveryAddress",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    addDeliveryAddress: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/addDeliveryAddress",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    fetchRedemptionHistory: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/fetchRedemptionHistory",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    fetchLifterDetails: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/fetchLifterDetails",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // new lms
    fetchRecentSecondarySalesList: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/fetchRecentSecondarySalesList",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    getCurrentFinYear: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/getCurrentFinYear",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // get all influencer
    getAllInfluencerList: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/getAllInfluencerList",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // get last level attribites
    getLastLevelAttributes: {
        path: App_uri.CRM_BASE_URI + "api/v1/dlocationManagement/getLastLevelAttributes",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // get doc type
    getDocumentsType: {
        path: App_uri.CRM_BASE_URI + "api/v1/mstCustomerDocumentTypes/getDocumentsType",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // delete recent lifting
    deleteSecondarySale: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/deleteSecondarySale",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // reject recent lifting
    approveSecondarySaleMultiple: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v2/approveSecondarySaleMultiple",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // To check lifting date
    checkLiftingDate: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/checkLiftingDate",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // To check if lifting is on same date
    checkSameDayLifting: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/checkSameDayLifting",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    getCappingContactTypes: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/getCappingContactTypes",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },
    fetchCappingValue: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/fetchCappingValue",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    // update recent lifting details/ quantity
    modifyLiftingQuantityMultiple: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/modifyLiftingQuantityMultiple",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    fetchSaleEditPermission: {
        path: App_uri.LMS_BASE_URI + "lms/master/v1/fetchSaleEditPermission",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

    fetchParentCustomer: {
        path: App_uri.LMS_BASE_URI + "lms/sales/v1/fetchParentCustomer",
        isAuth: true,
        isPicLocation: false,
        isEncrypt: true,
        method: "POST"
    },

})