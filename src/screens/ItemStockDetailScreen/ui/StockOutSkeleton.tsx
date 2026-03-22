import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const ShimmerComponent = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={{ overflow: 'hidden' }}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const SkeletonBlock = ({ width, height, style }: { width: number | string, height: number, style?: any }) => {
  return (
    <View style={[styles.skeletonBlock, { width, height }, style]}>
      <ShimmerComponent />
    </View>
  );
};

const StockCardSkeleton = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <SkeletonBlock width={100} height={16} />
        <SkeletonBlock width={120} height={14} />
      </View>
      
      <View style={styles.cardDetailsRow}>
        <View style={styles.cardDetailsItem}>
          <SkeletonBlock width={24} height={24} style={styles.iconSkeleton} />
          <SkeletonBlock width={60} height={16} />
        </View>
        
        <View style={styles.cardDetailsItem}>
          <SkeletonBlock width={24} height={24} style={styles.iconSkeleton} />
          <SkeletonBlock width={70} height={16} />
        </View>
        
        <View style={styles.cardDetailsItem}>
          <SkeletonBlock width={24} height={24} style={styles.iconSkeleton} />
          <SkeletonBlock width={65} height={16} />
        </View>
      </View>
      
      <View style={styles.expiryContainer}>
        <SkeletonBlock width="100%" height={30} />
      </View>
      
      <View style={styles.infoRows}>
        <View style={styles.infoRow}>
          <SkeletonBlock width={24} height={24} style={styles.iconSkeleton} />
          <SkeletonBlock width={160} height={16} />
        </View>
        <View style={styles.infoRow}>
          <SkeletonBlock width={24} height={24} style={styles.iconSkeleton} />
          <SkeletonBlock width={120} height={16} />
        </View>
      </View>
      
      <View style={styles.buttonSkeleton}>
        <SkeletonBlock width="100%" height={40} />
      </View>
    </View>
  );
};

const StockOutSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="qr-code-scanner" size={30} color="#3498db" />
        <Text style={styles.title}>Fetching Item Data</Text>
      </View>
      
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <View style={styles.itemImageContainer}>
            <SkeletonBlock width={80} height={80} style={styles.imageBlock} />
          </View>
          <View style={styles.itemInfo}>
            <SkeletonBlock width={180} height={22} style={{ marginBottom: 8 }} />
            <SkeletonBlock width={150} height={16} />
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.sectionHeader}>
          <Icon name="assignment" size={20} color="#34495e" />
          <Text style={styles.sectionTitle}>Loading Stock Information</Text>
        </View>
        
        <StockCardSkeleton />
        <StockCardSkeleton />
      </View>
      
      <Text style={styles.loadingMessage}>
        Please wait while we retrieve the item information...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34495e',
    marginLeft: 12,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImageContainer: {
    marginRight: 16,
  },
  imageBlock: {
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e1e8ed',
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    marginLeft: 8,
  },
  skeletonBlock: {
    backgroundColor: '#e1e8ed',
    borderRadius: 4,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ translateX: -width }],
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  cardDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSkeleton: {
    borderRadius: 12,
    marginRight: 8,
  },
  expiryContainer: {
    marginVertical: 8,
  },
  infoRows: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonSkeleton: {
    marginTop: 12,
  },
  loadingMessage: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 14,
    marginTop: 10,
  },
});

export default StockOutSkeleton;