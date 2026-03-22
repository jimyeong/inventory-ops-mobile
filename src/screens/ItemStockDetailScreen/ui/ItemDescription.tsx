import { View, Text, Image } from 'react-native';
import React from 'react';
import { Item } from '../../../models/Item';
import { imgServer } from '../../../services/ApiService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ItemDescription = ({item, styles}: {item: Item, styles: any}) => {
  const formatPrice = (price: number | undefined) => {
    if (!price) return 'N/A';
    return `$${price.toFixed(2)}`;
  };
  const image_path = item.image_path || '/image_holder.jpg';

  const InfoRow = ({ icon, iconColor, label, value, isPrice = false }: {
    icon: string;
    iconColor: string;
    label: string;
    value: string | undefined;
    isPrice?: boolean;
  }) => (
    <View style={isPrice ? styles.priceInfoRow : styles.itemInfoRow}>
      <Icon name={icon} size={16} color={iconColor} style={styles.itemInfoIcon} />
      <Text style={styles.itemInfoLabel}>{label}</Text>
      <Text style={[styles.itemInfoValue, isPrice && styles.priceValue]}>
        {value || 'N/A'}
      </Text>
    </View>
  );
  return (
    <View style={styles.itemDescriptionContainer}>
      <View style={styles.itemHeaderRow}>
        {/* Enhanced Image Section */}
        
        
        <Image
            source={{ uri: imgServer + image_path }}
            style={styles.enhancedItemImage}
            resizeMode="cover"
          />

        {/* Enhanced Item Information */}
        <View style={styles.itemHeaderInfo}>
          <Text style={styles.enhancedItemName}>{item.name}</Text>
          
          {/* Item Details with Icons */}
          <InfoRow 
            icon="identifier" 
            iconColor="#3498db" 
            label="Code" 
            value={item.code} 
          />
          
          <InfoRow 
            icon="barcode" 
            iconColor="#9b59b6" 
            label="Barcode" 
            value={item.barcode} 
          />
          
          {item.box_barcode && (
            <InfoRow 
              icon="package-variant" 
              iconColor="#f39c12" 
              label="Box Code" 
              value={item.box_barcode} 
            />
          )}
          
          {/* Enhanced Price Display */}
          <InfoRow 
            icon="currency-usd" 
            iconColor="#27ae60" 
            label="Price" 
            value={formatPrice(item.price)} 
            isPrice={true}
          />
        </View>
      </View>
      
      {/* Additional Item Properties */}
      {(item.name_kor || item.name_eng || item.name_chi) && (
        <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e9ecef' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="translate" size={16} color="#6c757d" />
            <Text style={{ fontSize: 12, color: '#6c757d', fontWeight: '600', marginLeft: 6 }}>
              MULTILINGUAL NAMES
            </Text>
          </View>
          
          {item.name_kor && (
            <InfoRow 
              icon="ideogram-cjk" 
              iconColor="#e74c3c" 
              label="Korean" 
              value={item.name_kor} 
            />
          )}
          
          {item.name_eng && (
            <InfoRow 
              icon="alphabetical" 
              iconColor="#2ecc71" 
              label="English" 
              value={item.name_eng} 
            />
          )}
          
          {item.name_chi && (
            <InfoRow 
              icon="ideogram-cjk-variant" 
              iconColor="#f39c12" 
              label="Chinese" 
              value={item.name_chi} 
            />
          )}
        </View>
      )}
    </View>
  )
}

export default ItemDescription;