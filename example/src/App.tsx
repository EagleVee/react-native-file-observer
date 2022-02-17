import * as React from 'react';

import { View, Text, Button, SafeAreaView, Modal } from 'react-native';
import useFileStorages from './hooks/useFileStorages';

export default function App() {
  const [show, setShow] = React.useState(false);
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
    <SafeAreaView style={{ flex: 1 }}>
      <Button
        title="Show"
        color="#841584"
        onPress={() => {
          setShow(true);
        }}
      />
      <Modal animationType="slide" visible={show}>
        <Button title="Update 1" color="#841584" onPress={onPress1} />
        <Button title="Update 2" color="#841584" onPress={onPress2} />
        <Button
          title="Clear"
          color="#841584"
          onPress={async () => {
            await clearStore();
          }}
        />
        <Button
          title="Close"
          color="#841584"
          onPress={async () => {
            setShow(false);
          }}
        />
        <View style={{ width: '100%', height: 100, alignSelf: 'center' }}>
          <Text>{JSON.stringify(store)}</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
