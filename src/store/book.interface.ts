export interface IBook {
  id?: number;
  name: string;
  class_name: string;
  class_id: number;
  selling_price: number;
  buying_price: number;
  price?: number;
}

export type TBookList = Pick<IBook, "name" | "price">;

export interface IClassBook {
  student_id: string;
  class_name: number;
  book_list: string;
}

export interface IFeeData {
  id?: number;
  amount_paid: number;
  balance_fee: number;
}
