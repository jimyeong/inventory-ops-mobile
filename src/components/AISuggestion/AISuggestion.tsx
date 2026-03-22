import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const AISuggestion = ({ koreanName, japaneseName, chineseName, englishName }: { koreanName: string, japaneseName: string, chineseName: string, englishName: string }) => {
  return (
    <View>
    <Text>{koreanName}</Text>
      <Text>{japaneseName}</Text>
      <Text>{chineseName}</Text>
      <Text>{englishName}</Text>
    </View>
  );
};

export default AISuggestion;   