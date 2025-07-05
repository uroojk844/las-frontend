export interface IPaymentDetail {
  student_id: string;
  phone: number;
  full_name: string;
  joiningClass: number;
  fee_type_id: string;
  fee_data: string;
  distance: number;
  transport_fee: number;
  months: string;
}

export interface IFeeType {
  id: number;
  name: string;
  amount?: number;
}
