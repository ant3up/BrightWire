// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "{{BUSINESS_NAME}}",
  PHONE: "{{PHONE}}",
  ADDRESS: "{{ADDRESS}}",
  SUBURB: "{{SUBURB}}",
  DESCRIPTION: "Professional electrical services for {{BUSINESS_NAME}}",
  CONTACT_INFO: {
    phone: "{{PHONE}}",
    address: "{{ADDRESS}}",
    suburb: "{{SUBURB}}"
  }
} as const;

export const BUSINESS_INFO = {
  name: "{{BUSINESS_NAME}}",
  phone: "{{PHONE}}",
  address: "{{ADDRESS}}",
  suburb: "{{SUBURB}}"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "{{BUSINESS_NAME}}",
  phone: "{{PHONE}}",
  address: "{{ADDRESS}}",
  suburb: "{{SUBURB}}"
} as const;