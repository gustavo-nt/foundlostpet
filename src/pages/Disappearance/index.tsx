import { Marker } from "react-leaflet";
import { PencilLine, Warning } from "phosphor-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";

import { Comment } from "./components/Comment";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { NewComment } from "./components/NewComment";
import { InputField } from "../../components/InputField";
import { LeafletMap } from "../../components/LeafletMap";
import { TextareaField } from "../../components/TextareaField";

import mapIcon from "../../utils/mapIcon";
import phoneMask from "../../utils/phoneMask";
import { useAuth, User } from "../../hooks/auth";
import api from "../../services/disappearanceApi";
import { DisappearanceProps, LinkEnum, SituationEnum } from "../../types";

import styles from "./styles.module.scss";

interface CommentProps {
  id: string;
  description: string;
  updated_at: string;
  user: User;
  disappearance: {
    id: string;
  };
}

export function Disappearance() {
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [disappearance, setDisappearance] = useState<
    DisappearanceProps | undefined
  >(undefined);

  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const getComments = useCallback(async () => {
    const { data } = await api.get(`/comments`, {
      params: {
        disappearanceId: id,
      },
    });

    setComments(data);
    setIsLoading(false);
  }, [id]);

  const handleUpdateComment = useCallback(() => {
    setIsLoading(true);
    getComments();
  }, [getComments]);

  useEffect(() => {
    getDisappearance();

    async function getDisappearance() {
      try {
        const { data } = await api.get(`/disappearances/${id}`);
        setDisappearance(data);
      } catch (error) {
        navigate("/404");
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    getComments();
  }, [id, getComments]);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.wrapper}>
        <div className={styles.content}>
          {user && user.id === disappearance?.user.id && (
            <Link
              to={`/update-disappearance/${disappearance.id}`}
              className={styles.edit}
            >
              <PencilLine size={28} weight="fill" />
            </Link>
          )}

          {disappearance && (
            <div className={styles.image}>
              <img
                src={`/animals/${disappearance.image}`}
                aria-label="Autor: Iryna Zaichenko"
                title="Autor: Iryna Zaichenko"
                alt={disappearance?.type}
              />

              <a
                href={LinkEnum[disappearance.type]}
                target="_blank"
                rel="noreferrer"
              >
                Iryna Zaichenko
              </a>
            </div>
          )}

          <div className={styles.details}>
            <div className={styles.box}>
              <h2>Informações</h2>

              <div className={styles.situation}>
                <span data-situation={disappearance?.situation.toLowerCase()}>
                  {disappearance ? SituationEnum[disappearance.situation] : ""}
                </span>
              </div>
            </div>

            <InputField
              id="name"
              disabled
              name="name"
              type="text"
              value={disappearance?.name}
              label="O animal atende por"
            />

            <InputField
              disabled
              type="text"
              id="species"
              name="species"
              label="Espécie"
              value={disappearance?.type}
            />

            <div className={styles.fieldGroup}>
              <InputField
                disabled
                id="whatsapp"
                type="number"
                name="whatsapp"
                label="Whatsapp"
                value={phoneMask(disappearance?.phone)}
              />

              <InputField
                id="email"
                disabled
                name="email"
                type="email"
                label="Email"
                value={disappearance?.email}
              />
            </div>

            <TextareaField
              disabled
              id="about"
              name="about"
              label="Sobre"
              value={disappearance?.description}
            />
          </div>

          <div className={styles.details}>
            <h2>Endereço</h2>

            <div className={styles.mapContainer}>
              <div className={styles.mapContent}>
                {disappearance && (
                  <LeafletMap
                    isCentered
                    position={[
                      Number(disappearance?.latitude),
                      Number(disappearance?.longitude),
                    ]}
                  >
                    <Marker
                      icon={mapIcon}
                      position={[
                        Number(disappearance?.latitude),
                        Number(disappearance?.longitude),
                      ]}
                    />
                  </LeafletMap>
                )}
              </div>

              <div className={styles.mapFooter}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://maps.google.com/mobile?q=${disappearance?.latitude},${disappearance?.longitude}&z=15`}
                >
                  <strong>Veja a localização no Google Maps</strong>
                </a>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <InputField
                id="city"
                disabled
                name="city"
                type="text"
                label="Cidade"
                value={disappearance?.city}
              />

              <InputField
                id="uf"
                name="uf"
                disabled
                type="text"
                label="Estado(UF)"
                value={disappearance?.uf}
              />
            </div>
          </div>

          <div className={styles.details}>
            <h2>Comentários</h2>

            <NewComment
              onCreateNewComment={getComments}
              disappearanceId={disappearance?.id}
            />

            {isLoading ? (
              <div className={styles.loadingComments}>
                <Loading />
              </div>
            ) : !comments.length ? (
              <div className={styles.emptyComments}>
                <Warning size={32} weight="fill" />
                <strong>
                  Ops...Infelizmente não temos atualizações sobre o caso.
                </strong>
              </div>
            ) : (
              comments.map((comment) => (
                <Comment
                  data={comment}
                  key={comment.id}
                  onUpdateComment={handleUpdateComment}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
