export const ss = {
  set(key, val) {
    return window.sessionStorage.setItem(key, JSON.stringify(val))
  },

  get(key) {
    var val = window.sessionStorage.getItem(key);
    return JSON.parse(val)
  },
  remove(key) {
    return window.sessionStorage.removeItem(key)
  },
  clear() {
    return window.sessionStorage.clear()
  }
};
