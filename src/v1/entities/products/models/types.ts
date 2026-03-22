import { ProductStock } from "../../stocks/models/types";
import { Tag } from "../../tags/models/type";

export interface Product {
    product_id: string;
    code: string;
    price: number;
    box_price?: number;
    barcode: string;
    barcode_for_box?: string;
    box_barcode?: string;
    name: string;
    name_kor: string;
    name_eng: string;
    name_chi: string;
    name_jap: string;
    type: string;
    available_for_order: boolean;
    image_path: string;
    ingredients?: string;
    has_beef?: boolean;
    has_pork?: boolean;
    is_halal?: boolean;
    reasoning?: string;
    created_at: Date;
    stock: ProductStock[];
    tags: Tag[];
  }

  export type ProductInfo = Omit<Product, 'stock' | 'tags' | 'created_at' | 'available_for_order' >;
  