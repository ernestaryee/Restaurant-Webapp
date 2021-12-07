export interface Order {
  name: string;
  phoneNumber: string;
  location: string;
  paymentoption: string;
  amount: string;
  extraComments?: string;
}

export interface PaymentResponse {
  status: string;
  reason: string;
  transactionid: number;
  clienttransid: string;
  clientreference: string | null;
  statusdate: string;
  brandtransid: string | null;
}

export interface Food {
  id: string;
  body: string;
  image: string;
  alt: string;
  price: string;
}
