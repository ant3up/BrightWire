// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Be Connected Electrical Services NSW",
  PHONE: "+61411168385",
  ADDRESS: "102 Bellinger Rd, Ruse NSW 2560",
  SUBURB: "102 Bellinger Rd, Ruse NSW 2560",
  DESCRIPTION: "Professional electrical services for Be Connected Electrical Services NSW",
  CONTACT_INFO: {
    phone: "+61411168385",
    address: "102 Bellinger Rd, Ruse NSW 2560",
    suburb: "102 Bellinger Rd, Ruse NSW 2560"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Be Connected Electrical Services NSW",
  phone: "+61411168385",
  address: "102 Bellinger Rd, Ruse NSW 2560",
  suburb: "102 Bellinger Rd, Ruse NSW 2560"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Be Connected Electrical Services NSW",
  phone: {
    display: "0411 168 385",
    href: "tel:61411168385"
  },
  address: "102 Bellinger Rd, Ruse NSW 2560",
  suburb: "102 Bellinger Rd, Ruse NSW 2560",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;