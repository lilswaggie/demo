const isIe = () => {
  return navigator.userAgent.indexOf('MSIE') > 0;
};

const getIEversion = () => {
  /^.*MSIE\s(\d+)\.(\d+).*$/.exec(navigator.userAgent);
  return Number(RegExp.$1);
};

const isTooLowIeVersion = () => {
  return isIe() && getIEversion() < 9;
};

const addIframeOnloadEvent = (iframe, event) => {
  if (iframe.attachEvent) {
    iframe.attachEvent('onload', event);
  } else {
    iframe.onload = event;
  }
};

export { isIe, getIEversion, isTooLowIeVersion, addIframeOnloadEvent };
