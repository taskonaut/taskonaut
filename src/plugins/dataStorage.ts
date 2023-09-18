const DataStorage = {
    get(key: string) {
        return localStorage.getItem(key);
    },
    save(key: string, accessCategory: string) {
        localStorage.setItem(key, accessCategory);
    },
};

export { DataStorage };
