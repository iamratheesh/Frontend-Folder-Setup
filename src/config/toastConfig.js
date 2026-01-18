import toastdata from '@/assets/json/toastAssert.json';

export const getToastStyle = (type) => {
  switch (type) {
    case 'success':
      return {
        background: toastdata.data[0].success.bgcolor,
        icon: toastdata.data[0].success.icon,
        cancleIcon: toastdata.data[0].success.cancleIcon,
      };
    case 'error':
      return {
        background: toastdata.data[0].error.bgcolor,
        icon: toastdata.data[0].error.icon,
        cancleIcon: toastdata.data[0].error.cancleIcon,
      };
    default:
      return {
        background: toastdata.data[0].error.bgcolor,
        icon: toastdata.data[0].error.icon,
      };
  }
};
