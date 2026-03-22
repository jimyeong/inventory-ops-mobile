import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Item, ItemStock } from '../../models/Item';
import EditScannedItemStockContainer from './containers/EditScannedItemStockContainer';
import { useRoute } from '@react-navigation/native';


const EditItemStockScreen = () => {
    const { itemId, barcode } = useRoute().params as { itemId?: string, barcode?: string };

  if(itemId){
    return <EditScannedItemStockContainer itemId={itemId}/>
  }
  if(barcode){
    return <EditScannedItemStockContainer barcode={barcode} />
  }
}

export default EditItemStockScreen;