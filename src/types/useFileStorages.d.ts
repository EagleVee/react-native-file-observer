export interface IUseFilesStorage {
  store: Object;
  emitStore: (value: Object) => Promise;
  clearStore: () => Promise;
}
