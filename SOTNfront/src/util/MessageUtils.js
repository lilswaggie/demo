// 页面离开时的确定信息
export const pageCloseTipMessage = '本页面还未保存，确定要离开吗？';

export const bindPageLeaveEvent = () => {
  window.onbeforeunload = e => {
    const msg = pageCloseTipMessage;
    e = e || window.event;
    // 兼容IE8和Firefox 4之前的版本
    if (e) {
      e.returnValue = msg;
    }
    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    return msg;
  };
};

export const unBindPageLeaveEvent = () => {
  window.onbeforeunload = e => {};
};
