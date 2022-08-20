export default function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
};