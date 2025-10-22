// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "D&M Electrical Services",
  PHONE: "+61416075381",
  ADDRESS: "126 Main St, Sydney NSW 2000",
  SUBURB: "126 Main St, Sydney NSW 2000",
  DESCRIPTION: "Professional electrical services for D&M Electrical Services",
  CONTACT_INFO: {
    phone: "+61416075381",
    address: "126 Main St, Sydney NSW 2000",
    suburb: "126 Main St, Sydney NSW 2000"
  }
} as const;

export const BUSINESS_INFO = {
  name: "D&M Electrical Services",
  phone: "+61416075381",
  address: "126 Main St, Sydney NSW 2000",
  suburb: "126 Main St, Sydney NSW 2000"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "D&M Electrical Services",
  phone: {
    display: "0416 075 381",
    href: "tel:61416075381"
  },
  address: "126 Main St, Sydney NSW 2000",
  suburb: "126 Main St, Sydney NSW 2000",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;