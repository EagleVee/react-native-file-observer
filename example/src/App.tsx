import * as React from 'react';

import {
  View,
  Text,
  Button,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { useFileStorages } from 'react-native-file-observer';

const { FileObserverModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(FileObserverModule);
console.log('Event emitter', eventEmitter);
console.log('File observer module', FileObserverModule);
//
// const useFileStorages = () => {
//   const [store, setStore] = useState({});
//   const STORE_PATH = RNFS.TemporaryDirectoryPath + 'store.json';
//   useEffect(() => {
//     RNFS.exists(STORE_PATH).then((result) => {
//       if (result) {
//         const storeParse = parseData(STORE_PATH);
//         setStore(storeParse);
//       }
//     });
//   }, [STORE_PATH]);
//
//   useEffect(() => {
//     // FileObserverModule.initWatchFile(STORE_PATH, 'STORE_CHANGE');
//     // const eventEmitter = new NativeEventEmitter(FileObserverModule);
//     // const sub = eventEmitter.addListener('STORE_CHANGE', async (data) => {
//     //   console.log('data: ', data);
//     //   try {
//     //     Platform.OS === 'ios' ? setStore(data) : setStore(JSON.parse(data));
//     //   } catch (error) {
//     //     setStore({});
//     //   }
//     // });
//     // return () => {
//     //   sub?.remove();
//     // };
//   }, [STORE_PATH]);
//
//   const parseData = async (storePath: string) => {
//     try {
//       const read = await RNFS.readFile(storePath);
//       return JSON.parse(read);
//     } catch (ex) {
//       return {};
//     }
//   };
//
//   const emitStore = async (value: Object) => {
//     if (typeof value !== 'object') {
//       throw new Error('Must be emit object');
//     }
//     const exists = await RNFS.exists(STORE_PATH);
//     if (exists) {
//       const storeParse = parseData(STORE_PATH);
//       if (storeParse) {
//         await RNFS.writeFile(
//           STORE_PATH,
//           JSON.stringify({ ...storeParse, ...value })
//         );
//       }
//     } else {
//       await RNFS.writeFile(STORE_PATH, JSON.stringify({ ...value }));
//     }
//   };
//
//   const clearStore = async () => {
//     await FileObserverModule.clearFileToEmptyObject(STORE_PATH);
//     setStore({});
//   };
//
//   return { store, emitStore, clearStore };
// };

export default function App() {
  const { emitStore, store, clearStore } = {
    emitStore: (data: any) => {
      console.log('Data', data);
    },
    store: {},
    clearStore: () => {},
  };
  // const { emitStore, store, clearStore } = useFileStorages();
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
