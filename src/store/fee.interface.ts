export interface IPaymentDetail {
  admission?: string,
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

export interface IReport {
  id: string;
  full_name: string;
  fatherName: string;
  phone: string;
  address: string;
  photo: string;
  balance_fee: string;
  collected_by: string;
  notes: string;
}

export interface IFeeType {
  id: number;
  name: string;
  amount?: number;
}
