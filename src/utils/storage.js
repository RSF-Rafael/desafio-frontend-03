export function setItem(key, valor) {
    localStorage.setItem(key, valor);
};

export function getItem(key) {
    return localStorage.getItem(key);
};

export function removeItem(key) {
    localStorage.removeItem(key);
};

export function clear() {
    localStorage.clear();
};

