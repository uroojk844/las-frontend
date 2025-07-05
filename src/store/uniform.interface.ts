type TGender = "m" | "f";

export interface IUniform {
  id: number;
  name: string;
  buying_price: number;
  selling_price: number;
  size: string;
  size_id: number;
  gender: TGender;
}

export interface IBuyDetail {
  student_id: string;
  gender: TGender;
}

export interface ISize {
  id: number;
  size: string;
}
