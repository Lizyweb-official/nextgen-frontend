let showMessageFn = null;

export const setShowMessage = (fn) => {
  showMessageFn = fn;
};

export const showWebMessage = (msg) => {
  if (showMessageFn) {
    showMessageFn(msg);
  } else {
    console.warn("WebMessage not initialized yet");
  }
};