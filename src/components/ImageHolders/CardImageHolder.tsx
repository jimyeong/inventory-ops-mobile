import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Item } from '../../models/Item';
import { imgServer } from '../../services/ApiService';
import { cardImageHolderStyles } from './styles';

const CardImageHolder = ({ item }: { item: Item }) => {
  let url = item.image_path || "image_holder.jpg";
  const path = imgServer + url;
  return (
    <React.Fragment>
    <View style={cardImageHolderStyles.itemImageContainer}>
      {path ? (
        <Image
          source={{ uri: path }}
          style={cardImageHolderStyles.itemImage}
          resizeMode="cover"
        />
      ) : (
        <View style={cardImageHolderStyles.imagePlaceholder}>
          <Icon name="image" size={28} color="#bdc3c7" />
        </View>
      )}
    </View>
    </React.Fragment>
  );
};

export default CardImageHolder;