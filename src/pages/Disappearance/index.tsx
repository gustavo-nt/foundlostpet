import { Marker } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { Comment } from "./components/Comment";
import { Header } from "../../components/Header";
import { InputField } from "../../components/InputField";
import { LeafletMap } from "../../components/LeafletMap";
import { TextareaField } from "../../components/TextareaField";

import { useLocationContext } from "../../hooks/location";
import { useAuth, User } from "../../hooks/auth";

import { DisappearanceProps, LinkEnum, SituationEnum } from "../../types";

import api from "../../services/disappearanceApi";
import { PencilLine, Warning } from "phosphor-react";
import mapIcon from "../../utils/mapIcon";
import styles from "./styles.module.scss";
import { Loading } from "../../components/Loading";

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
  const [isLoading, setIsLoading] = useState(true as boolean);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [disappearance, setDisappearance] = useState({} as DisappearanceProps);

  const { geoLocation } = useLocationContext();
  const { user } = useAuth();
  const { id } = useParams();

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
      const { data } = await api.get(`/disappearances/${id}`);
      setDisappearance(data);
    }
  }, [id]);

  useEffect(() => {
    getComments();
  }, [id, getComments]);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.wrapper}>
        <div className={styles.content}>
          {/* {user.id === disappearance.user.id && (
            <Link
              to={`/update-disappearance/${disappearance.id}`}
              className={styles.edit}
            >
              <PencilLine size={28} weight="fill" />
            </Link>
          )} */}

          <div className={styles.image}>
            <img
              // src={`/animals/${disappearance.image}`}
              src={`/animals/dog.png`}
              aria-label="Autor: Iryna Zaichenko"
              title="Autor: Iryna Zaichenko"
              alt={disappearance.type}
            />

            <a
              href={LinkEnum[disappearance.type]}
              target="_blank"
              rel="noreferrer"
            >
              Iryna Zaichenko
            </a>
          </div>

          <div className={styles.details}>
            <div className={styles.box}>
              <h2>Informações</h2>

              <div className={styles.situation}>
                {/* <span data-situation={disappearance.situation.toLowerCase()}>
                  {SituationEnum[disappearance.situation]}
                </span> */}

                <span data-situation="sighted">Atualizado</span>
              </div>
            </div>

            <InputField
              id="name"
              disabled
              name="name"
              type="text"
              value={disappearance.name}
              label="O animal atende por"
            />

            <InputField
              disabled
              type="text"
              id="species"
              name="species"
              label="Espécie"
              value={disappearance.type}
            />

            <div className={styles.fieldGroup}>
              <InputField
                disabled
                id="whatsapp"
                type="number"
                name="whatsapp"
                label="Whatsapp"
                value={disappearance.phone}
              />

              <InputField
                id="email"
                disabled
                name="email"
                type="email"
                label="Email"
                value={disappearance.email}
              />
            </div>

            <TextareaField
              disabled
              id="about"
              name="about"
              label="Sobre"
              value={disappearance.description}
            />
          </div>

          <div className={styles.details}>
            <h2>Endereço</h2>

            <div className={styles.mapContainer}>
              <div className={styles.mapContent}>
                <LeafletMap
                  isCentered
                  position={[geoLocation.latitude, geoLocation.longitude]}
                  // position={[
                  //   Number(disappearance.latitude),
                  //   Number(disappearance.longitude),
                  // ]}
                >
                  <Marker
                    icon={mapIcon}
                    position={[geoLocation.latitude, geoLocation.longitude]}
                    // position={[
                    //   Number(disappearance.latitude),
                    //   Number(disappearance.longitude),
                    // ]}
                  />
                </LeafletMap>
              </div>

              <div className={styles.mapFooter}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://maps.google.com/mobile?q=${disappearance.latitude},${disappearance.longitude}&z=15`}
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
                value={disappearance.city}
              />

              <InputField
                id="uf"
                name="uf"
                disabled
                type="text"
                label="Estado(UF)"
                value={disappearance.uf}
              />
            </div>
          </div>

          <div className={styles.details}>
            <h2>Comentários</h2>

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
