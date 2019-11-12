export const ls = {
  set(key, val) {
    //Null undefined '' 这些不让传进来了
    if (!val && (val != 0 || val != false)) return false;
    return window.localStorage.setItem(key, JSON.stringify(val))
  },

  get(key) {
    var val = window.localStorage.getItem(key);
    if (!val) return false;
    try {
      return JSON.parse(val)
    } catch (e) {
      return false;
    }

  },
  remove(key) {
    return window.localStorage.removeItem(key)
  },
  clear() {
    return window.localStorage.clear()
  }
};

export const ss = {
  set(key, val,req:boolean = false) {
    //Null undefined '' 这些不让传进来了
    if (!req && !val && (val != 0 || val != false)) return false;
    return window.sessionStorage.setItem(key, JSON.stringify(val))
  },

  get(key) {
    var val = window.sessionStorage.getItem(key);
    if (!val) return false;
    try {
      return JSON.parse(val)
    } catch (e) {
      return false;
    }

  },
  remove(key) {
    return window.sessionStorage.removeItem(key)
  },
  clear() {
    return window.sessionStorage.clear()
  }
};


