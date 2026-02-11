// import mongoose from "mongoose";

// const customerSchema = new mongoose.Schema(
//   {
//     // 🔹 Activline core fields
//     userGroupId: {
//       type: Number,
//       required: true,
//     },

//     accountId: {
//       type: String,
//       required: true,
//     },

//     userName: {
//       type: String,
//       required: true,
//     },

//     phoneNumber: {
//       type: String,
//       required: true,
//     },

//     emailId: {
//       type: String,
//     },

//     // 🔹 Optional fields
//     userState: String,
//     userType: String,
//     activationDate: String,

//     firstName: String,
//     lastName: String,

//     address: {
//       line1: String,
//       city: String,
//       pin: String,
//       state: String,
//       country: String,
//     },
// installationAddress: {
//   line2: String,
//   city: String,
//   pin: String,
//   state: String,
//   country: String,
// },

//     // 🔹 External system reference
//     activlineUserId: {
//       type: String,
//     },

//     // 🔹 Files
//     documents: {
//   idFile: String,
//   addressFile: String,
//   cafFile: String,
//   reportFile: String,
//   signFile: String,
//   profilePicFile: String,
// },


//     // 🔹 Audit
//     rawPayload: {
//       type: Object,
//     },

//     status: {
//       type: String,
//       default: "ACTIVE",
//     },
//     referral: {
//   code: {
//     type: String,
  
//     index: true
//   },
//   referredCount: {
//     type: Number,
//     default: 0
//   }
// },
//   },
//   { timestamps: true }
// );

// // ✅ Prevent OverwriteModelError
// const Customer =
//   mongoose.models.Customer ||
//   mongoose.model("Customer", customerSchema);

// export default Customer;


import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    /* =================================
       🔹 CORE ACTIVLINE FIELDS
    ================================= */
    userGroupId: {
      type: Number,
      required: true,
    },

    accountId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },

    emailId: {
      type: String,
      index: true,
    },

    /* =================================
       🔹 OPTIONAL FIELDS
    ================================= */
    userState: String,
    userType: String,
    activationDate: String,
    expirationDate: String,
    customActivationDate: String,
    customExpirationDate: String,

    firstName: String,
    lastName: String,
    altPhoneNumber: String,
    altEmailId: String,

    /* =================================
       🔹 CUSTOMER ADDRESS
    ================================= */
    address: {
      line1: String,
      // line2: String,
      city: String,
      pin: String,
      state: String,
      country: String,
    },

    /* =================================
       🔹 INSTALLATION ADDRESS (FIXED)
    ================================= */
    installationAddress: {
      // line1: String,  // ✅ ADDED THIS (IMPORTANT FIX)
      line2: String,
      city: String,
      pin: String,
      state: String,
      country: String,
    },

    /* =================================
       🔹 BILLING / FLAGS
    ================================= */
    overridePriceEnable: String,
    overrideAmount: String,
    overrideAmountBasedOn: String,
    createBilling: String,
    disableUserIpAuth: String,
    disableUserMacAuth: String,
    disableUserHotspotAuth: String,

    /* =================================
       🔹 CAF
    ================================= */
    cafNum: String,

    /* =================================
       🔹 EXTERNAL REFERENCE
    ================================= */
    activlineUserId: {
      type: String,
    },

    /* =================================
       🔹 FILES
    ================================= */
    documents: {
      idFile: String,
      addressFile: String,
      cafFile: String,
      reportFile: String,
      signFile: String,
      profilePicFile: String,
    },

    /* =================================
       🔹 STATUS
    ================================= */
    status: {
      type: String,
      default: "ACTIVE",
    },

    /* =================================
       🔹 REFERRAL
    ================================= */
    referral: {
      code: {
        type: String,
        index: true,
      },
      referredCount: {
        type: Number,
        default: 0,
      },
    },

    /* =================================
       🔹 AUDIT
    ================================= */
    rawPayload: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Customer =
  mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);

export default Customer;
