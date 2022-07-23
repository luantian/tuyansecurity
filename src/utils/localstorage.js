//封装处理localstorage缓存的工具, 并导出模块为db
let db = {
    save (key, value) {
      localStorage.setItem(key, JSON.stringify(value))
    },
    get (key) {
      return JSON.parse(localStorage.getItem(key)) 
    },
    remove (key) {
      localStorage.removeItem(key)
    },
    clear () {
      localStorage.clear()
    }
  };
  
  export default db