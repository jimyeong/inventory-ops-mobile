export const TOAST_MESSAGE = {
    PRODUCT_REFRESHED_SUCCESSFULLY: 'Product fetched successfully ✅ ',
    PRODUCT_REFRESHED_FAILED: 'Failed to refresh product ❌',
    STOCK_ADDED_SUCCESSFULLY: 'Stock has been added successfully!✅ ',
    STOCK_ADDED_FAILED: 'Failed to add stock!❌',
    STOCK_UPDATED_SUCCESSFULLY: 'Stock has been updated successfully!✅ ',
    STOCK_UPDATED_FAILED: 'Failed to update stock!❌',
    STOCK_DELETED_SUCCESSFULLY: 'Stock has been deleted successfully!✅ ',
    STOCK_DELETED_FAILED: 'Failed to delete stock!❌',
    STOCK_SOLD_SUCCESSFULLY: 'Sold stock has been removed successfully!✅ ',
    STOCK_SOLD_FAILED: 'Failed to remove sold stock!❌',
    STOCK_EXPIRED_SUCCESSFULLY: 'Expired stock has been removed successfully!✅ ',
    STOCK_EXPIRED_FAILED: 'Failed to remove expired stock!❌',
    PRODUCT_NOT_FOUND: 'Product not found ❌',
    PRODUCT_INFO_UPDATED_SUCCESSFULLY: 'Product info updated successfully!✅ ',
    PRODUCT_INFO_UPDATED_FAILED: 'Failed to update product info!❌',
};

export const TOAST_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
};

export const TOAST_EVENT_TYPE = {
    STOCK_UPDATE: 'STOCK_UPDATE',
    PRODUCT_REFRESH: 'PRODUCT_REFRESH',
    PRODUCT_INFO_UPDATE: 'PRODUCT_INFO_UPDATE',
};

export const VALIDATION_ERROR_TYPE = {
    QUANTITY_REQUIRED: 'QUANTITY_REQUIRED',
    REGISTERING_PERSON_REQUIRED: 'REGISTERING_PERSON_REQUIRED',
    EXPIRY_DATE_REQUIRED: 'EXPIRY_DATE_REQUIRED',
    LOCATION_REQUIRED: 'LOCATION_REQUIRED',
    NOTES_REQUIRED: 'NOTES_REQUIRED',
    DISCOUNT_RATE_REQUIRED: 'DISCOUNT_RATE_REQUIRED',
    STOCK_TYPE_REQUIRED: 'STOCK_TYPE_REQUIRED',
    STOCK_TYPE_INVALID: 'STOCK_TYPE_INVALID',
}
export const VALIDATION_ERROR_MESSAGE = {
    QUANTITY_REQUIRED: 'Please enter a valid quantity',
    REGISTERING_PERSON_REQUIRED: 'Registering person is required',
    EXPIRY_DATE_REQUIRED: 'Expiry date is required',
    LOCATION_REQUIRED: 'Location is required',
    NOTES_REQUIRED: 'Notes are required',
    DISCOUNT_RATE_REQUIRED: 'Discount rate is required',
    STOCK_TYPE_REQUIRED: 'Stock type is required',
    STOCK_TYPE_INVALID: 'Invalid stock type',
}

export const SCREEN_TYPES = {
    EXPIRY_STOCK_SCREEN: "ExpiryStockScreen",
    PRODUCT_DETAIL_SCREEN: "ProductDetailScreen",
    STOCK_SCREEN: "StockScreen",
}
export const EVENT_TYPE = {
    CARD_CLICK: "CARD_CLICK",
}
export const EVENT_MESSAGE = {
    CARD_CLICK: "click event from expired product manager widget",
}


export const DISCOUNT_RATES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];