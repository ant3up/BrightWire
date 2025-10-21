// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "BrightWire Electrical",
  PHONE: "0412 345 678",
  ADDRESS: "123 Main Street, Melbourne VIC 3000",
  SUBURB: "Melbourne",
  DESCRIPTION: "Professional electrical services for BrightWire Electrical",
  CONTACT_INFO: {
    phone: "0412 345 678",
    address: "123 Main Street, Melbourne VIC 3000",
    suburb: "Melbourne"
  }
} as const;

export const BUSINESS_INFO = {
  name: "BrightWire Electrical",
  phone: "0412 345 678",
  address: "123 Main Street, Melbourne VIC 3000",
  suburb: "Melbourne"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "BrightWire Electrical",
  phone: "0412 345 678",
  address: "123 Main Street, Melbourne VIC 3000",
  suburb: "Melbourne"
} as const;