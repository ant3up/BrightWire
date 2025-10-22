// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Blue Mountains Professional Electricians",
  PHONE: "+61428661166",
  ADDRESS: "12 Noble St, Bullaburra NSW 2784",
  SUBURB: "12 Noble St, Bullaburra NSW 2784",
  DESCRIPTION: "Professional electrical services for Blue Mountains Professional Electricians",
  CONTACT_INFO: {
    phone: "+61428661166",
    address: "12 Noble St, Bullaburra NSW 2784",
    suburb: "12 Noble St, Bullaburra NSW 2784"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Blue Mountains Professional Electricians",
  phone: "+61428661166",
  address: "12 Noble St, Bullaburra NSW 2784",
  suburb: "12 Noble St, Bullaburra NSW 2784"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Blue Mountains Professional Electricians",
  phone: {
    display: "0428 661 166",
    href: "tel:61428661166"
  },
  address: "12 Noble St, Bullaburra NSW 2784",
  suburb: "12 Noble St, Bullaburra NSW 2784",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;