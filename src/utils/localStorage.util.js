export function getLocalStorageItem(key) {
    let localStorageItem = localStorage.getItem(key);

    if (!localStorageItem) {
        return null;
    }

    let parsedLsItem;

    try {
        parsedLsItem = JSON.parse(localStorageItem);
    }
    catch (e) {
        parsedLsItem = localStorageItem;
    }
    return parsedLsItem;
}