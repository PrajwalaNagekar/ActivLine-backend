import Joi from "joi";

export const createLeadSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),

  phoneNumber: Joi.string().optional(),
  altPhoneNumber: Joi.string().optional(),

  emailId: Joi.string().email().optional(),
  altEmailId: Joi.string().email().optional(),

  address_line1: Joi.string().optional(),
  address_line2: Joi.string().optional(),
  address_city: Joi.string().optional(),
  address_state: Joi.string().optional(),
  address_pin: Joi.string().optional(),
  address_country: Joi.string().optional(),

  useBillingAddAsLeadInstallationAdd: Joi.string().valid("on", "off").optional(),

  installation_address_line1: Joi.string().optional(),
  installation_address_line2: Joi.string().optional(),
  installation_address_city: Joi.string().optional(),
  installation_address_state: Joi.string().optional(),
  installation_address_pin: Joi.string().optional(),
  installation_address_country: Joi.string().optional(),

  userType: Joi.string().valid("home", "business").optional(),

  comments: Joi.string().optional(),
  activationComments: Joi.string().optional(),

  lead_latitude: Joi.number().optional(),
  lead_longitude: Joi.number().optional(),

  requestedBandwidthAmount: Joi.number().optional(),
  requestedBandwidthData: Joi.string().valid("mb", "gb").optional(),

  leadSource: Joi.string().optional(),

  assignAdminToLead: Joi.string().valid("on", "off").optional(),
  assignedAdminStep: Joi.string().optional(),

  contactName: Joi.string().optional(),
  contactDesignation: Joi.string().optional(),
  contactPhoneNumber: Joi.string().optional(),
  contactEmail: Joi.string().email().optional(),
  contactDesc: Joi.string().optional(),

  leadUserReferralCode: Joi.string().optional(),

  notifySms: Joi.string().valid("yes", "no").optional(),
  notifyWhatsapp: Joi.string().valid("yes", "no").optional(),
});
