import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Item, SearchResultItem } from "../../../../../models/Item";
import { imgServer } from "../../../../../services/ApiService";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./style";   

interface SearchedItemCardProps {
    item: SearchResultItem;
    handleSelectSearchResult: (item: Item) => void;
}

const SearchedItemCard = ({ item, handleSelectSearchResult }: SearchedItemCardProps) => {
    const price = item.item.price == 0 ? 'N/A' : String(item.item.price) + ' p/unit';
    const box_price = item.item.box_price == 0 ? 'N/A' : String(item.item.box_price) + ' p/box';
    const image_path = item.item.image_path || 'image_holder.jpg';

    return (
        <TouchableOpacity
            style={styles.SearchItemCardcontainer}
            onPress={() => handleSelectSearchResult(item.item)}
            activeOpacity={0.7}
        >
            <View style={styles.SearchItemCardcontent}>
                <View style={styles.SearchItemCardimageContainer}>
                        <Image
                            source={{ uri: imgServer +  image_path }}
                            style={styles.SearchItemCardimage}
                            resizeMode="cover"
                        />
                </View>

                <View style={styles.SearchItemCardinfo}>
                    <View style={styles.SearchItemCardheader}>
                        <Text style={styles.SearchItemCardname} numberOfLines={2}>
                            {item.item.name || 'No Name'}
                        </Text>
                    </View>

                    <View style={styles.SearchItemCarddetails}>
                        <View style={styles.SearchItemCarddetailRow}>
                            <View style={styles.SearchItemCardcodeBadge}>
                                <Icon name="qr-code" size={12} color="#6c757d" />
                                <Text style={styles.SearchItemCardcodeText}>Code: {item.item.code || 'N/A'}</Text>
                            </View>
                            <View style={styles.SearchItemCardtypeBadge}>
                                <Icon name="category" size={12} color="#6c757d" />
                                <Text style={styles.SearchItemCardtypeText}>Type: {item.item.type || 'N/A'}</Text>
                            </View>
                        </View>
                        {item.item.barcode && (
                            <View style={styles.SearchItemCardbarcodeRow}>
                                <Icon name="qr-code" size={14} color="#6c757d" />
                                <Text style={styles.SearchItemCardbarcodeText}>Barcode: {item.item.barcode}</Text>
                            </View>
                        )}

                        <View style={styles.SearchItemCardpriceRow}>
                            <Text style={styles.SearchItemCardpriceLabel}>PRICE</Text>
                            <Text style={styles.SearchItemCardpriceText}>{price}</Text>
                        </View>
                        <View style={styles.SearchItemCardboxPriceRow}>
                            <Text style={styles.SearchItemCardboxPriceLabel}>PRICE</Text>
                            <Text style={styles.SearchItemCardboxPriceText}>{box_price}</Text>
                        </View>

                        {item.tag_names && item.tag_names.length > 0 && (
                            <View style={styles.SearchItemCardtagsContainer}>
                                {item.tag_names.slice(0, 3).map((tag, index) => (
                                    <View key={index} style={styles.SearchItemCardtag}>
                                        <Text style={styles.SearchItemCardtagText}>{tag}</Text>
                                    </View>
                                ))}
                                {item.tag_names.length > 3 && (
                                    <Text style={styles.SearchItemCardmoreTagsText}>+{item.tag_names.length - 3}</Text>
                                )}
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.SearchItemCardchevronContainer}>
                    <Icon name="chevron-right" size={20} color="#94a3b8" />
                </View>
            </View>
        </TouchableOpacity>
    )
}
export default SearchedItemCard;