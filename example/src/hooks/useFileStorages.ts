import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import RNFS from 'react-native-fs';

const { FileObserverModule } = NativeModules;

const useFileStorages = (): {
  store: Object;
  emitStore: (value: Object) => Promise<void>;
  clearStore: () => Promise<void>;
} => {
  const [store, setStore] = useState({});
  const STORE_PATH = RNFS.TemporaryDirectoryPath + '/store.json';
  useEffect(() => {
    RNFS.exists(STORE_PATH).then(async (result) => {
      if (result) {
        const storeParse = await parseData(STORE_PATH);
        setStore(storeParse);
      }
    });
  }, [STORE_PATH]);

  useEffect(() => {
    FileObserverModule.initWatchFile(STORE_PATH, 'STORE_CHANGE');
    const eventEmitter = new NativeEventEmitter(FileObserverModule);
    console.log('add listener');
    const sub = eventEmitter.addListener('STORE_CHANGE', async (data) => {
      console.log('data: ', data);
      try {
        Platform.OS === 'ios' ? setStore(data) : setStore(JSON.parse(data));
      } catch (error) {
        setStore({});
      }
    });
    FileObserverModule.onStartListenerObserver();
    return () => {
      console.log('remove listener');
      sub?.remove();
      
      FileObserverModule.onStopListenerObserver();
    };
  }, [STORE_PATH]);

  const parseData = async (storePath: string) => {
    try {
      const read = await RNFS.readFile(storePath);
      return JSON.parse(read);
    } catch (ex) {
      return {};
    }
  };

  const emitStore = async (value: Object) => {
    if (typeof value !== 'object') {
      throw new Error('Must be emit object');
    }
   try {
    const exists = await RNFS.exists(STORE_PATH);
    if (exists) {
      const storeParse = await parseData(STORE_PATH);
     
      if (storeParse) {
        console.log('start ',STORE_PATH,storeParse);
        await RNFS.writeFile(
          STORE_PATH,
          JSON.stringify({ ...storeParse, ...value })
        );
        console.log('end ',STORE_PATH,storeParse);
      }
    } else {
      await RNFS.writeFile(STORE_PATH, JSON.stringify({ ...value }));
    }
   } catch (error) {
     console.log(error);
   }
  };

  const clearStore = async () => {
    await FileObserverModule.clearFileToEmptyObject(STORE_PATH);
    setStore({});
  };

  return { store, emitStore, clearStore };
};

export default useFileStorages;
