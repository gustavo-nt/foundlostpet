import { useCallback, useState } from "react";
import { UserCircle } from "phosphor-react";

import { useToast } from "../../../../hooks/toast";

import api from "../../../../services/disappearanceApi";
import styles from "./styles.module.scss";
import { useAuth } from "../../../../hooks/auth";
import { Button } from "../../../../components/Button";

interface NewCommentProps {
  disappearanceId?: string;
  onCreateNewComment: () => void;
}

export function NewComment({
  disappearanceId,
  onCreateNewComment,
}: NewCommentProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelUpdate = useCallback(() => {
    setComment("");
  }, []);

  const handleCreateComment = useCallback(async () => {
    setIsLoading(true);

    try {
      await api.post(`comments`, {
        description: comment,
        disappearance_id: disappearanceId,
      });

      addToast({
        type: "success",
        title: "Atualizado",
        description: "Comentário criado com sucesso!",
      });

      setComment("");
      setIsLoading(false);

      onCreateNewComment();
    } catch (error) {
      addToast({
        type: "error",
        title: "Opps",
        description: "Ocorreu um erro durante a criação do comentário",
      });

      setIsLoading(false);
    }
  }, [addToast, disappearanceId, comment, onCreateNewComment]);

  return (
    <div className={styles.container}>
      <div className={styles.userImg}>
        <UserCircle size={28} />
      </div>

      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.info}>
            <strong>Novo comentário</strong>
            {user ? (
              <span>* Seu nome aparecerá como: {user.name}</span>
            ) : (
              <span>* Você precisa logar para comentar</span>
            )}
          </div>
        </div>

        <textarea
          className={styles.textarea}
          name="description"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <div className={styles.actions}>
          <Button
            type="button"
            title="Limpar"
            size="sm"
            variant="outline"
            onClick={handleCancelUpdate}
          />
          <Button
            type="button"
            title="Criar"
            size="sm"
            variant="filled"
            disabled={!comment || isLoading || !user}
            loading={isLoading}
            onClick={handleCreateComment}
          />
        </div>
      </div>
    </div>
  );
}
