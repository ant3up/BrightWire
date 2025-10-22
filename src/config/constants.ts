// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Caps Electrical",
  PHONE: "+61498227997",
  ADDRESS: "10 Lancelot St, Concord NSW 2137",
  SUBURB: "10 Lancelot St, Concord NSW 2137",
  DESCRIPTION: "Professional electrical services for Caps Electrical",
  CONTACT_INFO: {
    phone: "+61498227997",
    address: "10 Lancelot St, Concord NSW 2137",
    suburb: "10 Lancelot St, Concord NSW 2137"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Caps Electrical",
  phone: "+61498227997",
  address: "10 Lancelot St, Concord NSW 2137",
  suburb: "10 Lancelot St, Concord NSW 2137"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Caps Electrical",
  phone: {
    display: "0498 227 997",
    href: "tel:61498227997"
  },
  address: "10 Lancelot St, Concord NSW 2137",
  suburb: "10 Lancelot St, Concord NSW 2137",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;