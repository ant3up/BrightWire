// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Hoang Electrician",
  PHONE: "61488899789",
  ADDRESS: "123 Main St, Sydney NSW 2000",
  SUBURB: "123 Main St, Sydney NSW 2000",
  DESCRIPTION: "Professional electrical services for Hoang Electrician",
  CONTACT_INFO: {
    phone: "61488899789",
    address: "123 Main St, Sydney NSW 2000",
    suburb: "123 Main St, Sydney NSW 2000"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Hoang Electrician",
  phone: "61488899789",
  address: "123 Main St, Sydney NSW 2000",
  suburb: "123 Main St, Sydney NSW 2000"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Hoang Electrician",
  phone: {
    display: "61488899789",
    href: "tel:61488899789"
  },
  address: "123 Main St, Sydney NSW 2000",
  suburb: "123 Main St, Sydney NSW 2000",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;