
export type StockType = 'BOX' | 'BUNDLE' | 'PCS';

export interface ProductStock {
    stock_id: number;
    item_id: string;
    box_number: string;
    bundle_number: string;
    pcs_number: string;
    expiry_date: Date;
    registered_date: Date;
    created_at: Date;
    location?: string;
    registering_person: string;
    notes?: string;
    discount_rate: number;
    stock_type: StockType;
  }
  export interface ExpiredStock extends ProductStock{
    days_since_expiry: number;
    isExpired: boolean;
  }