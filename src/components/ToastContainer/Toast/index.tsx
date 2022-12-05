import { useEffect } from "react";
import { animated } from "react-spring";

import { Info, XCircle, Warning, CheckCircle } from "phosphor-react";

import { ToastMessage, useToast } from "../../../hooks/toast";

import styles from "./styles.module.scss";

interface ToastProps {
  message: ToastMessage;
  style?: object;
}

const icons = {
  info: <Info size={24} />,
  success: <CheckCircle size={24} />,
  error: <Warning size={24} />,
};

const Toast = ({ message, style }: ToastProps) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  return (
    <animated.div
      style={style}
      data-type={message.type}
      className={`${styles.container} ${
        !!message.description && "hasDescription"
      }`}
    >
      {icons[message.type || "info"]}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button
        type="button"
        title="Fechar"
        onClick={() => removeToast(message.id)}
      >
        <XCircle size={18} />
      </button>
    </animated.div>
  );
};

export default Toast;
