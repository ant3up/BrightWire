// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Bisho Electro",
  PHONE: "+61416199234",
  ADDRESS: "125 Main St, Sydney NSW 2000",
  SUBURB: "125 Main St, Sydney NSW 2000",
  DESCRIPTION: "Professional electrical services for Bisho Electro",
  CONTACT_INFO: {
    phone: "+61416199234",
    address: "125 Main St, Sydney NSW 2000",
    suburb: "125 Main St, Sydney NSW 2000"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Bisho Electro",
  phone: "+61416199234",
  address: "125 Main St, Sydney NSW 2000",
  suburb: "125 Main St, Sydney NSW 2000"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Bisho Electro",
  phone: {
    display: "0416 199 234",
    href: "tel:61416199234"
  },
  address: "125 Main St, Sydney NSW 2000",
  suburb: "125 Main St, Sydney NSW 2000",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;