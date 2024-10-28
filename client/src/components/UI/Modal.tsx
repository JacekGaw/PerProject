import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import closeIcon from "../../assets/img/close.svg"
import { motion } from 'framer-motion';



interface ModalProps {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export interface ModalRef {
  open: () => void;
  close: () => void;
}

const Modal = forwardRef<ModalRef, ModalProps>(({ className = '', children, onClose }, ref) => {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open() {
      if (dialog.current) {
        dialog.current.showModal();
      }
    },
    close() {
      if (dialog.current) {
        dialog.current.close();
      }
    }
  }));

  const handleClose = () => {
    if (onClose) onClose();
    if (dialog.current) dialog.current.click();
  };

  return createPortal(
    <dialog ref={dialog} className={`${className} backdrop:bg-slate-900/80 p-10 bg-dark-blue text-slate-200 rounded-xl shadow-lg relative`}>
      {children}
      <form method='dialog' className='absolute right-2 top-2 flex justify-end'>
        <motion.button
        initial={{ x: 0, y: 0}}
        whileHover={{ x: -2, y: 2}}
          onClick={handleClose}
          className='p-2 z-50 border rounded-full border-slate-600'
        >
          <img src={closeIcon} alt='Close Modal' className='w-4 h-4' />
        </motion.button>
      </form>
    </dialog>,
    document.getElementById('modal-root') as HTMLElement
  );
});

export default Modal;
