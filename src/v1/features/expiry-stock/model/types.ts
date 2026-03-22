import { Product } from "../../../entities/products/models/types";
import { ProductStock } from "../../../entities/stocks/models/types";
import { Tag } from "../../../entities/tags/models/type";


export interface ExpiryRange {
  id: string;
  label: string;
  minDays: number;
  maxDays: number;
  days: number;
}
export interface ExpiringProductStockBetweenDays {
  products: Product[];
  total: number;
  startDate: string;
  endDate: string
}
export interface ExpiringProductStockWithLeftDays {
  products: Product[];
  daysLeft: number;
  isExpired: boolean;
  total: number;
}
export type StockWithPicture = 
ProductStock & Pick<Product, 'image_path' | 'product_id' | "name" | "name_kor" | "name_eng" | "name_chi" | "name_jap" | "code" | "price" | "box_price">

export const EXPIRY_RANGES: ExpiryRange[] = [
  { id: "-1", minDays: -1, maxDays: -1, days: -1, label: "Expired" },
  { id: '0-7', minDays: 0, maxDays: 7, days: 7, label: "0-7 days" },
  { id: '8-14', minDays: 8, maxDays: 14, days: 14, label: "1-2 weeks" },
  { id: '15-21', minDays: 15, maxDays: 21, days: 21, label: "2-3 weeks" },
  { id: '22-28', minDays: 22, maxDays: 28, days: 28, label: "3-4 weeks" },
  { id: '29-35', minDays: 29, maxDays: 35, days: 35, label: "4-5 weeks" },
  { id: '30-60', minDays: 30, maxDays: 60, days: 60, label: "1-2 months" },
  { id: '60-120', minDays: 60, maxDays: 120, days: 120, label: "2-3+ months" },
];