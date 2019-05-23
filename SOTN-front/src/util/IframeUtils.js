// 执行iframe里的方法
export const processIframeMethod = (name, iframeName = 'iframe') => (
  ...params
) => {
  const iframe = window.frames[iframeName];
  if (iframe && iframe.gis) {
    iframe.gis[name](...params);
  }
};
