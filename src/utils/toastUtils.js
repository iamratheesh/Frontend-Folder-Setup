import toast from 'react-hot-toast';

export const showToast = ({message, severity = 'default', duration = 4000}) => {
    toast(message, {
        duration,
        type: severity,
      });
};
