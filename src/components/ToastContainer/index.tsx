import { useTransition } from "react-spring";

import { ToastMessage } from "../../hooks/toast";
import styles from "./styles.module.scss";

import Toast from "./Toast";

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer = ({ messages }: ToastContainerProps) => {
  const messagesWithTransitions = useTransition(
    messages,
    (message: ToastMessage) => message.id,
    {
      from: { right: "-120%", opacity: 0 },
      enter: { right: "0%", opacity: 1 },
      leave: { right: "-120%", opacity: 0 },
    },
  );

  return (
    // <div className={styles.container}>
    //   {messagesWithTransitions.map(({ item, key, props }) => (
    //     <Toast key={key} message={item} style={props} />
    //   ))}
    // </div>

    <div className={styles.container}>
      {messages.map((item) => (
        <Toast key={item.id} message={item} style={{}} />
      ))}
    </div>
  );
};

export default ToastContainer;
