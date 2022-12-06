import { useNavigate } from "react-router-dom";
import { Plus } from "phosphor-react";

import styles from "./styles.module.scss";

export function AddCard() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Seu pet está desaparecido?</h1>
      <p className={styles.description}>
        Clique no botão abaixo para registrar o desaparecimento do seu
        animalzinho.
      </p>

      <div className={styles.footer}>
        <button
          type="button"
          title="Criar desaparecimento"
          onClick={() => navigate(`/create-disappearance`)}
        >
          <Plus size={20} weight="bold" />
          <span>criar registro</span>
        </button>
      </div>
    </div>
  );
}
