// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Always Current Electrical",
  PHONE: "+61449977226",
  ADDRESS: "10 Alderton Ave, Springwood NSW 2777",
  SUBURB: "10 Alderton Ave, Springwood NSW 2777",
  DESCRIPTION: "Professional electrical services for Always Current Electrical",
  CONTACT_INFO: {
    phone: "+61449977226",
    address: "10 Alderton Ave, Springwood NSW 2777",
    suburb: "10 Alderton Ave, Springwood NSW 2777"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Always Current Electrical",
  phone: "+61449977226",
  address: "10 Alderton Ave, Springwood NSW 2777",
  suburb: "10 Alderton Ave, Springwood NSW 2777"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Always Current Electrical",
  phone: {
    display: "0449 977 226",
    href: "tel:61449977226"
  },
  address: "10 Alderton Ave, Springwood NSW 2777",
  suburb: "10 Alderton Ave, Springwood NSW 2777",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;