export const ls = {
  set(key, val) {
    //Null undefined '' 这些不让传进来了
    if(!val && (val!=0 || val!= false))return false;
    return window.localStorage.setItem(key, JSON.stringify(val))
  },

  get(key) {
    var val = window.localStorage.getItem(key);
    if(!val) return false;
    try{
      return JSON.parse(val)
    }catch (e) {
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
