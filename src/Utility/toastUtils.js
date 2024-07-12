// toastUtils.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastUtils.css';
const toastOptions = {
    position: 'top-right',
    draggable: true,
    autoClose: 8000,
    pauseOnHover: true,
    theme: 'colored',
  };
export const showErrorToast = (message) => {
  toast.error(message,toastOptions)
};

export const showSuccessToast = (message) => {
  toast.success(message,toastOptions);
};
export const showInfoToast=(message)=>{
    toast.info(message,toastOptions)
}
