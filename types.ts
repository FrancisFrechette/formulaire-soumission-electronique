
export interface Product {
  sku: string;
  description: string;
  price: number;
}

export interface LineItem {
  id: string;
  sku: string;
  description: string;
  price: number;
  quantity: number;
}

export interface Address {
  companyName: string;
  contactName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  email: string;
}
