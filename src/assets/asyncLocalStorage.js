const asyncLocalStorage = {
  setItem: async function (key, value) {
    return Promise.resolve().then(function () {
      localStorage.setItem(key, value);
    });
  },
  getItem: async function (key) {
    return Promise.resolve().then(function () {
      return localStorage.getItem(key);
    });
  }
};

export default asyncLocalStorage