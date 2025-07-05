export interface IPreviousSchoolTemplate {
  class: string;
  school: string;
  passingYear: string;
  percentage: string;
}

export interface IStudentStore {
  isLoadingClassList: boolean;
  classList: IClassList[];
  studentEnrollment: number | null;
  studentFeeDetails: IFeeDetails[],
  studentDetail: IStudent | null,
  isLoadingStudent: boolean;
  students: IAllStudent[];
  isLoadingStudents: boolean;
  previousSchool: IPreviousSchoolTemplate[];
  isUpdatingDetails: boolean;
  isSearching: boolean;
}

export interface IStudent {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: "m" | "f";
  dob: string;
  aadhar: number;
  photo: string;
  aadharFront: string;
  aadharBack: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  email: string;
  phone: string;
  phone2: string;
  address: string;
  address2: string;
  class_id: number;
  previousSchool: string;
  joiningDate: IPreviousSchoolTemplate[];
  id: string;
  enrollment: number;
  updated_on?: string;
  joiningClass: number;
  fee_type_id: string;
  transport: number;
  distance: number;
}

type TAllStudents = Pick<
  IStudent,
  "id" | "joiningClass" | "enrollment" | "dob" | "phone" | "address" | "photo"
>;

interface IAllStudent extends TAllStudents {
  full_name: string;
  balance_fee: number;
}

export interface IFeeDetails {
  payment_id: number;
  amount_paid: number;
  month: string;
  balance_fee: number;
  collected_by: string;
  photo: string;
  fee_type: string;
  full_name: string;
  notes: string;
  payment_date: string;
  payment_method: string;
  receipt_number: string;
  student_id: string;
  transaction_id?: string;
}

interface IClassList {
  id: number;
  name: string;
}
