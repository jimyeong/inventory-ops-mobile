import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainSplash from '../../../shared/ui/Splash/MainSplash';

export default function SplashScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <MainSplash
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});