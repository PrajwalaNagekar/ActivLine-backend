import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Session from "../../models/Customer/session.model.js";
import {
  createCustomerRepo,
  findByIdentifier,
  findByMobile,
   updateCustomerRepo,
   findCustomerByActivlineId
} from "../../repositories/Customer/customer.repository.js";

import { generateReferralCode } from "../../utils/referralCode.js";
import ApiError from "../../utils/ApiError.js";
import FormData from "form-data";
import fs from "fs";
import activlineClient from "../../external/activline/activline.client.js";
import { uploadOnCloudinary,deleteFromCloudinary } from "../../utils/cloudinary.js";
// import { createCustomer } from "../../repositories/Customer/customer.repository.js";
import Customer from "../../models/Customer/customer.model.js";




export const loginCustomer = async ({ identifier, password }) => {
  const customer = await CustomerRepo.findByIdentifier(identifier);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  if (!customer.isActive) {
    throw new ApiError(403, "Account is inactive");
  }

  const isMatch = await customer.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    {
      _id: customer._id,
      role: customer.role,
      email: customer.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return {
    accessToken: token,
    user: {
      _id: customer._id,
      customerId: customer.customerId,
      fullName: customer.fullName,
      mobile: customer.mobile,
      email: customer.email,
      role: customer.role,
    },
  };
};



export const getMessagesByRoom = async (roomId) => {
  return ChatMessageRepo.getMessagesByRoom(roomId);
};






export const createCustomerService = async (payload, files) => {
  const uploadedFilePaths = [];
  // 🔹 1. Generate sequential username
  let nextUserNumber = 1;
  // Find the last customer to determine the next user number
  const lastCustomer = await Customer.findOne({}, { userName: 1 })
    .sort({ createdAt: -1 })
    .lean();

  if (lastCustomer && lastCustomer.userName && lastCustomer.userName.startsWith("AL-")) {
    const lastNumberStr = lastCustomer.userName.split("-")[1];
    if (lastNumberStr) {
      const lastNumber = parseInt(lastNumberStr, 10);
      if (!isNaN(lastNumber)) {
        nextUserNumber = lastNumber + 1;
      }
    }
  }
  const newUserName = `AL-${String(nextUserNumber).padStart(6, "0")}`;

  const formData = new FormData();

  // Use the generated username for Activline and local DB
  Object.entries({ ...payload, userName: newUserName }).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  if (files?.idFile) {
    uploadedFilePaths.push(files.idFile[0].path);
    formData.append("idFile", fs.createReadStream(files.idFile[0].path));
  }

  if (files?.addressFile) {
    uploadedFilePaths.push(files.addressFile[0].path);
    formData.append(
      "addressFile",
      fs.createReadStream(files.addressFile[0].path)
    );
  }

  // 🔹 2. Create user in Activline
  const activlineData = await activlineClient.post(
    "/add_user",
    formData,
    { headers: formData.getHeaders() }
  );

  if (activlineData?.status !== "success") {
    throw new ApiError(
      502,
      activlineData?.message || "Failed to create user in Activline"
    );
  }

  // 🔹 NEW: Upload all files to Cloudinary
  const documentUrls = {};
  const uploadPromises = [];
  const fileTypes = ['idFile', 'addressFile', 'cafFile', 'reportFile', 'signFile', 'profilePicFile'];

  for (const fileType of fileTypes) {
    if (files?.[fileType]?.[0]?.path) {
      const filePath = files[fileType][0].path;
      if (!uploadedFilePaths.includes(filePath)) {
        uploadedFilePaths.push(filePath);
      }
      uploadPromises.push(
        uploadOnCloudinary(filePath).then(result => {
          if (result) {
            documentUrls[fileType] = result.secure_url;
          }
        })
      );
    }
  }

  // Wait for all Cloudinary uploads to finish
  await Promise.all(uploadPromises);

  // 🔹 3. Validate referral code if user used one
  let referrer = null;
  if (payload.referralCode) {
    referrer = await Customer.findOne({
      "referral.code": payload.referralCode
    });

    if (!referrer) {
      throw new ApiError(400, "Invalid referral code");
    }
  }

  // 🔹 4. Generate OWN referral code
  const ownReferralCode = await generateReferralCode(payload.firstName);

  // 🔹 5. Save customer
 // ❌ Never store plain password inside rawPayload
const cleanPayload = { ...payload };
delete cleanPayload.password;

const savedCustomer = await createCustomerRepo({
  /* ===============================
     🔹 CORE DETAILS
  =============================== */
  userGroupId: payload.userGroupId,
  accountId: payload.accountId,
  userName: newUserName, // Use generated username
  phoneNumber: payload.phoneNumber,
  emailId: payload.emailId,
  password: payload.password, // will hash if schema has pre-save hook
  userState: payload.userState,
  userType: payload.userType,
  activationDate: payload.activationDate,
  expirationDate: payload.expirationDate,
  customActivationDate: payload.customActivationDate,
  customExpirationDate: payload.customExpirationDate,

  /* ===============================
     🔹 USER DETAILS
  =============================== */
  firstName: payload.firstName,
  lastName: payload.lastName,
  altPhoneNumber: payload.altPhoneNumber,
  altEmailId: payload.altEmailId,

  /* ===============================
     🔹 CUSTOMER ADDRESS
  =============================== */
  address: {
    line1: payload.address_line1,
    line2: payload.address_line2,
    city: payload.address_city,
    pin: payload.address_pin,
    state: payload.address_state,
    country: payload.address_country,
  },

  /* ===============================
     🔹 INSTALLATION ADDRESS
  =============================== */
  installationAddress: {
    line1: payload.installation_address_line1,
    line2: payload.installation_address_line2,
    city: payload.installation_address_city,
    pin: payload.installation_address_pin,
    state: payload.installation_address_state,
    country: payload.installation_address_country,
  },

  /* ===============================
     🔹 BILLING / OVERRIDE
  =============================== */
  overridePriceEnable: payload.overridePriceEnable,
  overrideAmount: payload.overrideAmount,
  overrideAmountBasedOn: payload.overrideAmountBasedOn,
  createBilling: payload.createBilling,

  /* ===============================
     🔹 LOCATION
  =============================== */
  locationDetailsNotImport: payload.location_details_not_import,
  collectionAreaImport: payload.collection_area_import,
  collectionStreetImport: payload.collection_street_import,
  collectionBlockImport: payload.collection_block_import,

  /* ===============================
     🔹 AUTH FLAGS
  =============================== */
  disableUserIpAuth: payload.disableUserIpAuth,
  disableUserMacAuth: payload.disableUserMacAuth,
  disableUserHotspotAuth: payload.disableUserHotspotAuth,

  /* ===============================
     🔹 CAF
  =============================== */
  cafNum: payload.caf_num,

  /* ===============================
     🔹 ACTIVLINE ID
  =============================== */
  activlineUserId: activlineData?.message?.userId?.toString(),

  /* ===============================
     🔹 DOCUMENTS
  =============================== */
  documents: {
    idFile: documentUrls.idFile || null,
    addressFile: documentUrls.addressFile || null,
    cafFile: documentUrls.cafFile || null,
    reportFile: documentUrls.reportFile || null,
    signFile: documentUrls.signFile || null,
    profilePicFile: documentUrls.profilePicFile || null,
  },

  /* ===============================
     🔹 REFERRAL
  =============================== */
  referral: {
    code: ownReferralCode,
    referredCount: 0,
  },

  /* ===============================
     🔹 AUDIT
  =============================== */
  rawPayload: cleanPayload,
});


  // 🔹 6. Increase referrer count AFTER customer creation
  if (referrer) {
    await Customer.updateOne(
      { _id: referrer._id },
      { $inc: { "referral.referredCount": 1 } }
    );
  }

  // 🔹 7. Clean up local files
  uploadedFilePaths.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  return savedCustomer;
};

const buildCustomerUpdateData = (payload) => {
  const update = {};

  /* ===============================
   🔹 CORE / BASIC
  =============================== */
  if (payload.userGroupId) update.userGroupId = payload.userGroupId;
  if (payload.accountId) update.accountId = payload.accountId;
  if (payload.userName) update.userName = payload.userName;
  if (payload.phoneNumber) update.phoneNumber = payload.phoneNumber;
  if (payload.emailId) update.emailId = payload.emailId;
  if (payload.password) update.password = payload.password;

  /* ===============================
   🔹 USER DETAILS
  =============================== */
  if (payload.firstName) update.firstName = payload.firstName;
  if (payload.lastName) update.lastName = payload.lastName;
  if (payload.altPhoneNumber) update.altPhoneNumber = payload.altPhoneNumber;
  if (payload.altEmailId) update.altEmailId = payload.altEmailId;

  /* ===============================
   🔹 USER TYPE & STATUS
  =============================== */
  if (payload.userType) update.userType = payload.userType;
  if (payload.userState) update.userState = payload.userState;
  if (payload.activationDate) update.activationDate = payload.activationDate;
  if (payload.expirationDate) update.expirationDate = payload.expirationDate;
  if (payload.customActivationDate)
    update.customActivationDate = payload.customActivationDate;
  if (payload.customExpirationDate)
    update.customExpirationDate = payload.customExpirationDate;

  /* ===============================
   🔹 CUSTOMER ADDRESS
  =============================== */
  if (
    payload.address_line1 ||
    payload.address_line2 ||
    payload.address_city ||
    payload.address_pin ||
    payload.address_state ||
    payload.address_country
  ) {
    update.address = {};

    if (payload.address_line1) update.address.line1 = payload.address_line1;
    if (payload.address_line2) update.address.line2 = payload.address_line2;
    if (payload.address_city) update.address.city = payload.address_city;
    if (payload.address_pin) update.address.pin = payload.address_pin;
    if (payload.address_state) update.address.state = payload.address_state;
    if (payload.address_country) update.address.country = payload.address_country;
  }

  /* ===============================
   🔹 INSTALLATION ADDRESS
  =============================== */
  if (
    payload.installation_address_line1 ||
    payload.installation_address_line2 ||
    payload.installation_address_city ||
    payload.installation_address_pin ||
    payload.installation_address_state ||
    payload.installation_address_country
  ) {
    update.installationAddress = {};

    if (payload.installation_address_line1)
      update.installationAddress.line1 =
        payload.installation_address_line1;

    if (payload.installation_address_line2)
      update.installationAddress.line2 =
        payload.installation_address_line2;

    if (payload.installation_address_city)
      update.installationAddress.city =
        payload.installation_address_city;

    if (payload.installation_address_pin)
      update.installationAddress.pin =
        payload.installation_address_pin;

    if (payload.installation_address_state)
      update.installationAddress.state =
        payload.installation_address_state;

    if (payload.installation_address_country)
      update.installationAddress.country =
        payload.installation_address_country;
  }

  /* ===============================
   🔹 LOCATION MAPPING
  =============================== */
  if (payload.location_details_not_import)
    update.locationDetailsNotImport =
      payload.location_details_not_import;

  if (payload.collection_area_import)
    update.collectionAreaImport = payload.collection_area_import;

  if (payload.collection_street_import)
    update.collectionStreetImport = payload.collection_street_import;

  if (payload.collection_block_import)
    update.collectionBlockImport = payload.collection_block_import;

  /* ===============================
   🔹 BILLING / PRICE OVERRIDE
  =============================== */
  if (payload.overridePriceEnable)
    update.overridePriceEnable = payload.overridePriceEnable;

  if (payload.overrideAmount)
    update.overrideAmount = payload.overrideAmount;

  if (payload.overrideAmountBasedOn)
    update.overrideAmountBasedOn = payload.overrideAmountBasedOn;

  if (payload.createBilling)
    update.createBilling = payload.createBilling;

  /* ===============================
   🔹 CAF / DOCUMENT INFO
  =============================== */
  if (payload.caf_num) update.cafNum = payload.caf_num;

  /* ===============================
   🔹 AUTH / SECURITY FLAGS
  =============================== */
  if (payload.disableUserIpAuth)
    update.disableUserIpAuth = payload.disableUserIpAuth;

  if (payload.disableUserMacAuth)
    update.disableUserMacAuth = payload.disableUserMacAuth;

  if (payload.disableUserHotspotAuth)
    update.disableUserHotspotAuth = payload.disableUserHotspotAuth;

  /* ===============================
   🔹 NOTIFICATIONS
  =============================== */
  if (payload.notifyUserSms)
    update.notifyUserSms = payload.notifyUserSms;

  /* ===============================
   🔹 AUDIT (OPTIONAL BUT GOOD)
  =============================== */
  update.rawPayload = payload;

  return update;
};



export const updateCustomerService = async (
  activlineUserId,
  payload,
  files
) => {
  // 1️⃣ Call Activline (already works)
  const formData = new FormData();
  formData.append("userId", activlineUserId);

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  if (files?.idFile?.[0]?.path) {
    formData.append("idFile", fs.createReadStream(files.idFile[0].path));
  }

  await activlineClient.post("/add_user", formData, {
    headers: formData.getHeaders(),
  });

  // 2️⃣ REMOVE EMPTY VALUES (CRITICAL)
  Object.keys(payload).forEach((key) => {
    if (payload[key] === "") delete payload[key];
  });

  // 3️⃣ MAP PAYLOAD → MONGODB SCHEMA (🔥 THIS FIXES DB)
  const updateData = buildCustomerUpdateData(payload);

  console.log("✅ MongoDB updateData:", updateData); // DEBUG

  // 4️⃣ UPDATE MONGODB
  const updatedCustomer = await updateCustomerRepo(
    activlineUserId,
    updateData
  );

  return updatedCustomer;
};




export const loginCustomerService = async ({
  username,
  password,
  deviceId,
  deviceInfo,
}) => {
  // 🔹 1. Authenticate with Activline
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const res = await activlineClient.post(
    "/authenticate_user",
    formData,
    { headers: formData.getHeaders() }
  );

  const data = res.data;

  // Expected: ["success","655490137614528","activline"]
  if (!Array.isArray(data) || data[0] !== "success") {
    throw new ApiError(401, "Invalid username or password");
  }

  const activlineUserId = data[1].toString();
  const accountId = data[2];

  // 🔹 2. Prepare session
  const sessionId = deviceId || uuidv4();

  const accessToken = jwt.sign(
    { activlineUserId, accountId, role: "CUSTOMER" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { activlineUserId, accountId, sessionId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // 🔹 3. Store refresh token (per device)
  await Session.create({
    activlineUserId,
    accountId,
    sessionId,
    refreshToken,
    deviceInfo,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
    sessionId,
    expiresIn: 900,
  };
};




export const getMyProfileService = async (userId) => {
  const customer = await Customer.findById(userId).lean();

  if (!customer) {
    throw new ApiError(404, "Customer profile not found");
  }

  return {
    _id: customer._id,

    /* ===============================
       🔹 BASIC INFO
    =============================== */
    userGroupId: customer.userGroupId,
    accountId: customer.accountId,
    userName: customer.userName,
    phoneNumber: customer.phoneNumber,
    emailId: customer.emailId,
    userType: customer.userType,

    /* ===============================
       🔹 NAME DETAILS
    =============================== */
    firstName: customer.firstName,
    lastName: customer.lastName,

    /* ===============================
       🔹 PRIMARY ADDRESS
    =============================== */
    address: customer.address
      ? {
          line1: customer.address.line1,
          line2: customer.address.line2,
          city: customer.address.city,
          pin: customer.address.pin,
          state: customer.address.state,
          country: customer.address.country,
        }
      : undefined,

    /* ===============================
       🔹 INSTALLATION ADDRESS
    =============================== */
    installationAddress: customer.installationAddress
      ? {
          line1: customer.installationAddress.line1,
          line2: customer.installationAddress.line2,
          city: customer.installationAddress.city,
          pin: customer.installationAddress.pin,
          state: customer.installationAddress.state,
          country: customer.installationAddress.country,
        }
      : undefined,

    /* ===============================
       🔹 ACTIVLINE
    =============================== */
    activlineUserId: customer.activlineUserId,

    /* ===============================
       🔹 PROFILE IMAGE
    =============================== */
    profilePicFile: customer.documents?.profilePicFile,

    /* ===============================
       🔹 STATUS & REFERRAL
    =============================== */
    status: customer.status,
    referral: customer.referral || {
      code: undefined,
      referredCount: 0,
    },

    /* ===============================
       🔹 CUSTOM DATES
    =============================== */
    customActivationDate: customer.customActivationDate,
    customExpirationDate: customer.customExpirationDate,

    /* ===============================
       🔹 TIMESTAMPS
    =============================== */
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  };
};

// services/Customer/customer.service.js


export const getProfileImageService = async (userId) => {
  const customer = await Customer.findById(userId).select("documents.profilePicFile");

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return {
    profilePicFile: customer.documents?.profilePicFile || null,
  };
};

export const updateProfileImageService = async (userId, file) => {
  const customer = await Customer.findById(userId);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // 🔹 Upload new image
  const uploaded = await uploadOnCloudinary(file.path);

  if (!uploaded) {
    throw new ApiError(500, "Cloudinary upload failed");
  }

  // 🔹 Delete old image (if exists)
  const oldImage = customer.documents?.profilePicFile;

  if (oldImage) {
    await deleteFromCloudinary(oldImage);
  }

  // 🔹 Update DB
  customer.documents.profilePicFile = uploaded.secure_url;
  await customer.save();

  // 🔹 Cleanup local file
  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  return {
    profilePicFile: uploaded.secure_url,
  };
};

export const deleteProfileImageService = async (userId) => {
  const customer = await Customer.findById(userId);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  const oldImage = customer.documents?.profilePicFile;

  if (!oldImage) {
    throw new ApiError(400, "No profile image to delete");
  }

  // 🔹 Delete from Cloudinary
  await deleteFromCloudinary(oldImage);

  // 🔹 Remove from DB
  customer.documents.profilePicFile = null;
  await customer.save();
};
