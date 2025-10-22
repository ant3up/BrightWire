// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Clinton White Electrical",
  PHONE: "+61481195546",
  ADDRESS: "701/10 Norfolk St, Liverpool NSW 2170",
  SUBURB: "701/10 Norfolk St, Liverpool NSW 2170",
  DESCRIPTION: "Professional electrical services for Clinton White Electrical",
  CONTACT_INFO: {
    phone: "+61481195546",
    address: "701/10 Norfolk St, Liverpool NSW 2170",
    suburb: "701/10 Norfolk St, Liverpool NSW 2170"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Clinton White Electrical",
  phone: "+61481195546",
  address: "701/10 Norfolk St, Liverpool NSW 2170",
  suburb: "701/10 Norfolk St, Liverpool NSW 2170"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Clinton White Electrical",
  phone: {
    display: "0481 195 546",
    href: "tel:61481195546"
  },
  address: "701/10 Norfolk St, Liverpool NSW 2170",
  suburb: "701/10 Norfolk St, Liverpool NSW 2170",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;