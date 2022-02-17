import * as React from 'react';

import { View, Text, Button } from 'react-native';
import { useFileStorages } from 'react-native-file-observer';

export default function App() {
  const { emitStore, store, clearStore } = useFileStorages();

  const onPress1 = async () => {
    try {
      const data = {
        menu: {
          id: 1,
          value: 'value1',
        },
      };
      await emitStore(data);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const onPress2 = async () => {
    try {
      const data = {
        menu: {
          id: 2,
          value: 'value2',
        },
      };
      await emitStore(data);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <View>
      <Button title="Update 1" color="#841584" onPress={onPress1} />
      <Button title="Update 2" color="#841584" onPress={onPress2} />
      <Button
        title="Clear"
        color="#841584"
        onPress={async () => {
          await clearStore();
        }}
      />
      <View style={{ width: '100%', height: 100, alignSelf: 'center' }}>
        <Text>{JSON.stringify(store)}</Text>
      </View>
    </View>
  );
}
