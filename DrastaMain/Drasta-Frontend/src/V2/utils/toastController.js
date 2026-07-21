let showToastGlobal;

export const setToast = (fn) => {
  showToastGlobal = fn;
};

export const getToast = () => showToastGlobal;