// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Alfords PT Electrical Contracting",
  PHONE: "+61417022212",
  ADDRESS: "45 Brushwood Dr, Alfords Point NSW 2234",
  SUBURB: "45 Brushwood Dr, Alfords Point NSW 2234",
  DESCRIPTION: "Professional electrical services for Alfords PT Electrical Contracting",
  CONTACT_INFO: {
    phone: "+61417022212",
    address: "45 Brushwood Dr, Alfords Point NSW 2234",
    suburb: "45 Brushwood Dr, Alfords Point NSW 2234"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Alfords PT Electrical Contracting",
  phone: "+61417022212",
  address: "45 Brushwood Dr, Alfords Point NSW 2234",
  suburb: "45 Brushwood Dr, Alfords Point NSW 2234"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Alfords PT Electrical Contracting",
  phone: {
    display: "0417 022 212",
    href: "tel:61417022212"
  },
  address: "45 Brushwood Dr, Alfords Point NSW 2234",
  suburb: "45 Brushwood Dr, Alfords Point NSW 2234",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;