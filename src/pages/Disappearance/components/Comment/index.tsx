import { useCallback, useState } from "react";
import { Pencil, UserCircle } from "phosphor-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useAuth, User } from "../../../../hooks/auth";
import { useToast } from "../../../../hooks/toast";

import api from "../../../../services/disappearanceApi";
import styles from "./styles.module.scss";

interface CommentProps {
  data: {
    id: string;
    description: string;
    updated_at: string;
    disappearance: {
      id: string;
    };
    user: User;
  };
  onUpdateComment: () => void;
}

export function Comment({
  data: { description, id, updated_at, user, disappearance },
  onUpdateComment,
}: CommentProps) {
  const { user: userAuth } = useAuth();

  const { addToast } = useToast();
  const [comment, setComment] = useState(description);
  const [isEnabled, setIsEnabled] = useState(false);

  const commentedDateRelativeToNow = formatDistanceToNow(new Date(updated_at), {
    locale: ptBR,
    addSuffix: true,
  });

  const handleEnableEdit = () => {
    setIsEnabled(true);
  };

  const handleCancelUpdate = useCallback(() => {
    setIsEnabled(false);
    setComment(description);
  }, [description]);

  const handleUpdateComment = useCallback(async () => {
    try {
      await api.put(`comments/${id}`, {
        description: comment,
        disappearance_id: disappearance.id,
      });

      addToast({
        type: "success",
        title: "Atualizado",
        description: "Comentário atualizado com sucesso!",
      });

      onUpdateComment();
      setIsEnabled(false);
    } catch (error) {
      addToast({
        type: "error",
        title: "Opps",
        description: "Ocorreu um erro durante a atualização do comentário",
      });
    }
  }, [addToast, comment, id, disappearance.id, onUpdateComment]);

  return (
    <div className={styles.container}>
      <div className={styles.userImg}>
        <UserCircle size={28} />
      </div>

      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.info}>
            <strong>{user.name}</strong>
            <span>{commentedDateRelativeToNow}</span>
          </div>

          {!isEnabled && user && userAuth && user.id === userAuth.id && (
            <button className={styles.edit} title="Editar">
              <Pencil size={22} weight="fill" onClick={handleEnableEdit} />
            </button>
          )}
        </div>

        {isEnabled ? (
          <>
            <textarea
              className={styles.textarea}
              name="description"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className={styles.actions}>
              <button
                type="button"
                title="Cancelar"
                onClick={handleCancelUpdate}
              >
                Cancelar
              </button>
              <button
                type="button"
                title="Alterar"
                onClick={handleUpdateComment}
              >
                Alterar
              </button>
            </div>
          </>
        ) : (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
}
