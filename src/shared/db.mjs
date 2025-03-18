const DB_NAME = "class-table";
const DB_VERSION = 1;

export const CLASS_STORE_NAME = "classes";
export const CLASS_STORE_KEY = "id";
export const TABLE_STORE_NAME = "table";
export const TABLE_STORE_KEY = "dayperiod";

class _DB {
  constructor() {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);
    openRequest.onupgradeneeded = (event) => {
      const db = /** @type {IDBDatabase} */ (event.target.result);
      console.log(db.objectStoreNames);
      if (!db.objectStoreNames.contains(CLASS_STORE_NAME)) {
        db.createObjectStore(CLASS_STORE_NAME, { keyPath: CLASS_STORE_KEY });
      }
      if (!db.objectStoreNames.contains(TABLE_STORE_NAME)) {
        db.createObjectStore(TABLE_STORE_NAME, { keyPath: TABLE_STORE_KEY });
      }
    };
  }

  async set(storeName, value) {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

      openRequest.onsuccess = (event) => {
        const db = /** @type {IDBDatabase} */ (event.target.result);
        db.onerror = reject;
        const transaction = db.transaction(storeName, "readwrite");
        transaction.onerror = reject;
        const store = transaction.objectStore(storeName);

        const putRequest = store.put(value);
        putRequest.onsuccess = () => resolve(true);
      };
    });
  }

  async delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

      openRequest.onsuccess = (event) => {
        const db = /** @type {IDBDatabase} */ (event.target.result);
        db.onerror = reject;
        const transaction = db.transaction(storeName, "readwrite");
        transaction.onerror = reject;
        const store = transaction.objectStore(storeName);

        const deleteRequest = store.delete(key);
        deleteRequest.onsuccess = () => resolve(true);
      };
    });
  }

  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

      openRequest.onsuccess = (event) => {
        const db = /** @type {IDBDatabase} */ (event.target.result);
        db.onerror = reject;
        const transaction = db.transaction(storeName, "readonly");
        transaction.onerror = reject;
        const store = transaction.objectStore(storeName);

        const getRequest = store.getAll();
        getRequest.onsuccess = () => resolve(getRequest.result);
      };
    });
  }

  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

      openRequest.onsuccess = (event) => {
        const db = /** @type {IDBDatabase} */ (event.target.result);
        db.onerror = reject;
        const transaction = db.transaction(storeName, "readonly");
        transaction.onerror = reject;
        const store = transaction.objectStore(storeName);

        const getRequest = store.get(key);
        getRequest.onsuccess = () => resolve(getRequest.result);
      };
    });
  }
}

export const DB = new _DB();
