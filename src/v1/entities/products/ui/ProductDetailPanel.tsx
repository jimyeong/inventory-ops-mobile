import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Product } from '../../products/models/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { imgServer } from '../../../../services/ApiService';
import { ProductStock } from '../../stocks/models/types';

interface DetailRowProps {
    icon: string;
    label: string;
    value: string | number | undefined;
    iconColor?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, iconColor = '#7f8c8d' }) => {

    if (value === undefined || value === null || value === '') return null;

    return (
        <View style={styles.detailRow}>
            <Icon name={icon} size={18} color={iconColor} style={styles.rowIcon} />
            <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{String(label)}</Text>
                <Text style={styles.rowValue}>{String(value)}</Text>
            </View>
        </View>
    );
};

export const ProductDetailPanel = ({ productDetail }: { productDetail: Product }) => {
    if (!productDetail) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>No product details available</Text>
            </View>
        );
    }

    const getTotalStock = () => {
        if (!productDetail.stock || productDetail.stock.length === 0) return 0;
        return productDetail.stock.reduce((total, stock) => {
            const box = parseInt(stock.box_number || '0', 10);
            const bundle = parseInt(stock.bundle_number || '0', 10);
            const pcs = parseInt(stock.pcs_number || '0', 10);
            return total + box + bundle + pcs;
        }, 0);
    };

    const displayName = productDetail.name_kor || productDetail.name_eng || productDetail.name || 'No Name';
    const totalStock = getTotalStock();


    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Product Image */}
            <View style={styles.imageSection}>
                {productDetail.image_path ? (
                    <Image
                        source={{ uri: imgServer + productDetail.image_path }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Icon name="image" size={64} color="#bdc3c7" />
                        <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                )}
            </View>

            {/* Product Name Section */}
            <View style={styles.section}>
                <Text style={styles.productName}>{displayName}</Text>

                {/* Availability Badge */}
                <View style={[
                    styles.availabilityBadge,
                    { backgroundColor: productDetail.available_for_order ? '#d4edda' : '#f8d7da' }
                ]}>
                    <Icon
                        name={productDetail.available_for_order ? 'check-circle' : 'cancel'}
                        size={16}
                        color={productDetail.available_for_order ? '#155724' : '#721c24'}
                    />
                    <Text style={[
                        styles.availabilityText,
                        { color: productDetail.available_for_order ? '#155724' : '#721c24' }
                    ]}>
                        {productDetail.available_for_order ? 'Available for Order' : 'Unavailable'}

                    </Text>
                </View>
            </View>

            {/* Product Names (Multiple Languages) */}
            {(productDetail.name_kor || productDetail.name_eng || productDetail.name_chi || productDetail.name_jap) && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product Names</Text>
                    {productDetail.name_kor && (
                        <View style={styles.nameRow}>
                            <Text style={styles.nameLabel}>Korean:</Text>
                            <Text style={styles.nameValue}>{productDetail.name_kor}</Text>
                        </View>
                    )}
                    {productDetail.name_eng && (
                        <View style={styles.nameRow}>
                            <Text style={styles.nameLabel}>English:</Text>
                            <Text style={styles.nameValue}>{productDetail.name_eng}</Text>
                        </View>
                    )}
                    {productDetail.name_chi && (
                        <View style={styles.nameRow}>
                            <Text style={styles.nameLabel}>Chinese:</Text>
                            <Text style={styles.nameValue}>{productDetail.name_chi}</Text>
                        </View>
                    )}
                    {productDetail.name_jap && (
                        <View style={styles.nameRow}>
                            <Text style={styles.nameLabel}>Japanese:</Text>
                            <Text style={styles.nameValue}>{productDetail.name_jap}</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Basic Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <DetailRow icon="qr-code" label="Product Code" value={productDetail.code || 'N/A'} />
                <DetailRow icon="qr-code-scanner" label="Barcode" value={productDetail.barcode || 'N/A'} />
                {productDetail.box_barcode && (
                    <DetailRow icon="qr-code-scanner" label="Box Barcode" value={productDetail.box_barcode || 'N/A'} />
                )}
                {productDetail.barcode_for_box && (
                    <DetailRow icon="qr-code-scanner" label="Barcode for Box" value={productDetail.barcode_for_box || 'N/A'} />
                )}
                <DetailRow icon="category" label="Type" value={productDetail.type || 'N/A'} />
            </View>

            {/* Pricing */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pricing</Text>
                <DetailRow
                    icon="money"
                    label="Unit Price"
                    value={productDetail.price ? `£${productDetail.price.toFixed(2)}` : "N/A"}
                    iconColor="#27ae60"
                />
                <DetailRow
                    icon="money"
                    label="Box Price"
                    value={productDetail.box_price ? `£${productDetail.box_price.toFixed(2)}` : "N/A"}
                    iconColor="#27ae60"
                />
                {/* <DetailRow
                    icon="attach-money"
                    label="Unit Price"
                    value={productDetail.price ? `£${productDetail.price.toFixed(2)}` : "0.00"}
                    iconColor="#27ae60"
                />
                {productDetail.box_price && (
                    <DetailRow
                        icon="inventory"
                        label="Box Price"
                        value={productDetail.box_price ? `£${productDetail.box_price.toFixed(2)}` : "0.00"}
                        iconColor="#27ae60"
                    />
                )} */}
            </View>

            {/* Stock Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stock Information</Text>
                <View style={styles.stockSummary}>
                    <Icon name="inventory-2" size={24} color="#3498db" />
                    <Text style={styles.stockSummaryText}>Total Stock: {totalStock} units</Text>
                </View>
                {productDetail.stock && productDetail.stock.length > 0 && (
                    <View style={styles.stockBreakdown}>
                        <Text style={styles.stockBreakdownTitle}>Stock Details:</Text>
                        {productDetail.stock.map((stock: ProductStock, index) => (
                            <View key={index} style={styles.stockItem}>
                                <Text style={styles.stockItemText}>
                                    {stock.stock_type.toUpperCase()} : {stock.stock_type.toUpperCase() === 'BOX' ? stock.box_number || 0 : stock.stock_type.toUpperCase() === 'BUNDLE' ? stock.bundle_number || 0 : stock.pcs_number || 0}
                                </Text>
                                {stock.location && (
                                    <Text style={styles.stockLocation}>📍 {stock.location}</Text>
                                )}
                                {stock.expiry_date && (
                                    <Text style={styles.stockExpiryDate}>Expiry Date: {new Date(stock.expiry_date).toLocaleDateString()}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Product Attributes */}
            {(productDetail.is_halal !== undefined || productDetail.has_beef !== undefined || productDetail.has_pork !== undefined) && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product Attributes</Text>
                    <View style={styles.attributesContainer}>
                        {productDetail.is_halal !== undefined && (
                            <View style={[styles.attributeBadge, productDetail.is_halal ? styles.positiveAttribute : styles.negativeAttribute]}>
                                <Icon
                                    name={productDetail.is_halal ? 'check-circle' : 'cancel'}
                                    size={16}
                                    color={productDetail.is_halal ? '#27ae60' : '#95a5a6'}
                                />
                                <Text style={styles.attributeText}>Halal</Text>
                            </View>
                        )}
                        {productDetail.has_beef !== undefined && (
                            <View style={[styles.attributeBadge, productDetail.has_beef ? styles.warningAttribute : styles.neutralAttribute]}>
                                <Icon
                                    name={productDetail.has_beef ? 'warning' : 'check'}
                                    size={16}
                                    color={productDetail.has_beef ? '#e67e22' : '#95a5a6'}
                                />
                                <Text style={styles.attributeText}>Beef</Text>
                            </View>
                        )}
                        {productDetail.has_pork !== undefined && (
                            <View style={[styles.attributeBadge, productDetail.has_pork ? styles.warningAttribute : styles.neutralAttribute]}>
                                <Icon
                                    name={productDetail.has_pork ? 'warning' : 'check'}
                                    size={16}
                                    color={productDetail.has_pork ? '#e74c3c' : '#95a5a6'}
                                />
                                <Text style={styles.attributeText}>Pork</Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* Ingredients */}
            {productDetail.ingredients && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    <Text style={styles.ingredientsText}>{productDetail.ingredients}</Text>
                    {productDetail.reasoning && (
                        <View style={styles.reasoningContainer}>
                            <Text style={styles.reasoningLabel}>Analysis:</Text>
                            <Text style={styles.reasoningText}>{productDetail.reasoning}</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Tags */}
            {productDetail.tags && productDetail.tags.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tags</Text>
                    <View style={styles.tagsContainer}>
                        {productDetail.tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Icon name="local-offer" size={12} color="#1976d2" />
                                <Text style={styles.tagText}>{tag.tag_name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Metadata */}
            <View style={[styles.section, styles.lastSection]}>
                <Text style={styles.sectionTitle}>Metadata</Text>
                <DetailRow icon="fingerprint" label="Product ID" value={productDetail.product_id} iconColor="#9b59b6" />
                {productDetail.created_at && (
                    <DetailRow
                        icon="event"
                        label="Created At"
                        value={new Date(productDetail.created_at).toLocaleDateString()}
                        iconColor="#9b59b6"
                    />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    emptyText: {
        fontSize: 16,
        color: '#95a5a6',
        textAlign: 'center',
        marginTop: 40,
    },
    imageSection: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    productImage: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    imagePlaceholder: {
        width: 200,
        height: 200,
        backgroundColor: '#ecf0f1',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 8,
        fontSize: 14,
        color: '#7f8c8d',
    },
    section: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    lastSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 12,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 12,
    },
    availabilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    availabilityText: {
        fontSize: 14,
        fontWeight: '600',
    },
    nameRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    nameLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7f8c8d',
        width: 80,
    },
    nameValue: {
        flex: 1,
        fontSize: 14,
        color: '#2c3e50',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rowIcon: {
        marginRight: 12,
    },
    rowContent: {
        flex: 1,
    },
    rowLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginBottom: 2,
    },
    rowValue: {
        fontSize: 14,
        color: '#2c3e50',
        fontWeight: '500',
    },
    stockSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        gap: 12,
    },
    stockSummaryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1976d2',
    },
    stockBreakdown: {
        marginTop: 8,
    },
    stockBreakdownTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7f8c8d',
        marginBottom: 8,
    },
    stockItem: {
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 6,
        marginBottom: 6,
    },
    stockItemText: {
        fontSize: 13,
        color: '#2c3e50',
    },
    stockLocation: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 4,
    },
    stockExpiryDate: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 4,
    },
    attributesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    attributeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    positiveAttribute: {
        backgroundColor: '#d4edda',
    },
    negativeAttribute: {
        backgroundColor: '#f8f9fa',
    },
    warningAttribute: {
        backgroundColor: '#fff3cd',
    },
    neutralAttribute: {
        backgroundColor: '#f8f9fa',
    },
    attributeText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#2c3e50',
    },
    ingredientsText: {
        fontSize: 14,
        color: '#2c3e50',
        lineHeight: 20,
    },
    reasoningContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#3498db',
    },
    reasoningLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7f8c8d',
        marginBottom: 4,
    },
    reasoningText: {
        fontSize: 13,
        color: '#2c3e50',
        lineHeight: 18,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    tagText: {
        fontSize: 12,
        color: '#1976d2',
        fontWeight: '500',
    },
});

export default ProductDetailPanel;