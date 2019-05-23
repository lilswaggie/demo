import { Modal } from 'antd';

const confirmDangerModal = (
  msg,
  okFun = () => {},
  cancelFun = () => {},
  okText = '删除',
  cancelText = '取消'
) => {
  Modal.confirm({
    title: msg,
    content: '',
    okText: okText,
    okType: 'danger',
    cancelText: cancelText,
    onOk: okFun,
    onCancel: cancelFun
  });
};

export default {
  confirmDangerModal
};
