import activlineClient from "../../external/activline/activline.client.js";

/**
 * Get franchise account(s)
 * @param {string | undefined} accountId
 */
export const getFranchiseAccounts = async (accountId) => {
  const endpoint = accountId
    ? `/get_account_details/${accountId}`
    : `/get_account_details`;

  return await activlineClient.get(endpoint);
};
