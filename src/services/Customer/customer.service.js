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

import ApiError from "../../utils/ApiError.js";
import FormData from "form-data";
import fs from "fs";
import activlineClient from "../../external/activline/activline.client.js";
// import { createCustomer } from "../../repositories/Customer/customer.repository.js";
import Customer from "../../models/Customer/customer.model.js";
// export const createCustomer = async (payload) => {
//   const existing = await CustomerRepo.findByMobile(payload.mobile);
//   if (existing) {
//     throw new ApiError(409, "Mobile already registered");
//   }

//   const customerId = "ACT" + Date.now();

//   const customer = await CustomerRepo.createCustomer({
//     ...payload,
//     customerId,
//   });

//   // ✅ THIS OBJECT CONTROLS THE RESPONSE
//   return {
//     _id: customer._id,
//     customerId: customer.customerId,
//     fullName: customer.fullName,
//     mobile: customer.mobile,
//     email: customer.email,
//     role: customer.role,          // ✅ MUST BE HERE
//     createdAt: customer.createdAt,
//   };
// };





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
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  if (files?.idFile) {
    formData.append("idFile", fs.createReadStream(files.idFile[0].path));
  }

  if (files?.addressFile) {
    formData.append(
      "addressFile",
      fs.createReadStream(files.addressFile[0].path)
    );
  }

  // ✅ FIXED CALL
  const activlineData = await activlineClient.post(
    "/add_user",
    formData,
    { headers: formData.getHeaders() }
  );

  if (activlineData?.status !== "success") {
    throw new ApiError(502, activlineData?.message || "Failed to create user in Activline");
  }

  const savedCustomer = await createCustomerRepo({
    userGroupId: payload.userGroupId,
    accountId: payload.accountId,
    userName: payload.userName,
    phoneNumber: payload.phoneNumber,
    emailId: payload.emailId,
    userState: payload.userState,
    userType: payload.userType,
    activationDate: payload.activationDate,
    firstName: payload.firstName,
    lastName: payload.lastName,
    address: {
      line1: payload.address_line1,
      city: payload.address_city,
      pin: payload.address_pin,
      state: payload.address_state,
      country: payload.address_country,
    },
    activlineUserId: activlineData?.message?.userId?.toString(),
    documents: {
      idFile: files?.idFile?.[0]?.filename,
      addressFile: files?.addressFile?.[0]?.filename,
    },
    rawPayload: payload,
  });

  return savedCustomer;
};

// const buildCustomerUpdateData = (payload) => {
//   const update = {};

//   // Simple fields
//   if (payload.userName) update.userName = payload.userName;
//   if (payload.emailId) update.emailId = payload.emailId;
//   if (payload.userType) update.userType = payload.userType;
//   if (payload.activationDate) update.activationDate = payload.activationDate;
//   if (payload.firstName) update.firstName = payload.firstName;
//   if (payload.lastName) update.lastName = payload.lastName;

//   // Address mapping
//   if (
//     payload.address_line1 ||
//     payload.address_city ||
//     payload.address_pin ||
//     payload.address_state ||
//     payload.address_country
//   ) {
//     update.address = {};
//     if (payload.address_line1) update.address.line1 = payload.address_line1;
//     if (payload.address_city) update.address.city = payload.address_city;
//     if (payload.address_pin) update.address.pin = payload.address_pin;
//     if (payload.address_state) update.address.state = payload.address_state;
//     if (payload.address_country) update.address.country = payload.address_country;
//   }

//   return update;
// };

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




export const getMyProfileService = async (activlineUserId) => {
  const customer = await Customer.findOne({ activlineUserId }).lean();

  if (!customer) {
    throw new ApiError(404, "Customer profile not found");
  }

  return customer; // 🔥 return FULL document
};
