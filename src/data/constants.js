export const SERVICES = [
  "Retirement Planning",
  "Investment Advice",
  "Wills & Estate Planning",
  "Tax Advice",
  "UK Pension Transfer",
  "Regular Saving",
  "Property Investments",
  "Insurance",
  "US Retirement Plans",
];

export const FUND_SIZES = [
  "Less than £100,000",
  "£100,000 to £250,000",
  "£250,000 to £500,000",
  "More than £500,000",
];

export const DAYS_HEADER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const MIN_PHONE_LENGTH = 4;
export const MAX_PHONE_LENGTH = 15;

export const IS_DEV = typeof import.meta !== "undefined" && import.meta.env?.DEV;
