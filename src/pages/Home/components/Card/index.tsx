import { NavLink } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Calendar, SignOut } from "phosphor-react";
import { DisappearanceProps, LinkEnum, SituationEnum } from "../../../../types";

import styles from "./styles.module.scss";

interface CardProps {
  disappearance: Omit<
    DisappearanceProps,
    "latitude" | "longitude" | "created_at" | "user"
  >;
}

export function Card({ disappearance }: CardProps) {
  const {
    id,
    name,
    type,
    situation,
    updated_at,
    description,
    image,
    city,
    uf,
  } = disappearance;

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img
          src={`/animals/${image}`}
          aria-label="Autor: Iryna Zaichenko"
          title="Autor: Iryna Zaichenko"
          height={75}
          width={75}
          alt={name}
        />

        <a href={LinkEnum[type]} target="_blank">
          Iryna Zaichenko
        </a>
      </div>

      <div className={styles.situation}>
        <span data-situation={situation.toLowerCase()}>
          {SituationEnum[situation]}
        </span>
      </div>

      <h1 className={styles.title}>{name}</h1>
      <p className={styles.description}>{description}</p>
      <span className={styles.region}>
        {city}, {uf}
      </span>

      <div className={styles.footer}>
        <div className={styles.update}>
          <Calendar size={20} weight="fill" />
          <strong>
            {formatDistanceToNow(new Date(updated_at), {
              addSuffix: true,
              locale: ptBR,
            })}
          </strong>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => console.log(id)}>
            <SignOut size={22} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}
