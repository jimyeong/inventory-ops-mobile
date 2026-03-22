import { View, Text } from 'react-native';
import React from 'react';
import { Item } from '../../../models/Item';

const ItemStockComponent = ({item}: {item: Item}) => {
  return (
    <View>
      <Text>ItemStockComponent</Text>
    </View>
  )
}

export default ItemStockComponent;