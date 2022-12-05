import { NavLink } from "react-router-dom";
import { Chats, GlobeSimple, MapPin, Table, Timer } from "phosphor-react";
import { TagWithIcon } from "../../../../components/TagWithIcon";

import homeImg from "../../../../assets/home-img.png";
import styles from "./styles.module.scss";

const highlights = [
  {
    iconBg: "#c47f17",
    text: "Registro do desaparecimento",
    icon: <Timer size={16} weight="fill" />,
  },
  {
    iconBg: "#574f4d",
    text: "Interatividade da comunidade",
    icon: <Chats size={16} weight="fill" />,
  },
  {
    iconBg: "#dbac2c",
    text: "Mapa para auxilio de buscas",
    icon: <MapPin size={16} weight="fill" />,
  },
  {
    iconBg: "#8047f8",
    text: "Lista de últimos registros",
    icon: <Table size={16} weight="fill" />,
  },
];

export function Intro() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.info}>
          <div>
            <h1>Encontre seu pet a qualquer hora do dia</h1>
            <p>
              Com o FoundLostPet, você pode registrar o desaparecimento do seu
              pet, e interagir com a comunidade.
            </p>
          </div>

          <div className={styles.highlights}>
            {highlights.map((item) => (
              <TagWithIcon
                key={item.text}
                icon={item.icon}
                iconBg={item.iconBg}
                text={item.text}
              />
            ))}
          </div>

          <NavLink to="/map" className={styles.anchorMap}>
            <GlobeSimple size={22} />
            <span>Acessar mapa</span>
          </NavLink>
        </div>

        <div className={styles.image}>
          <img
            src={homeImg}
            title="Autor: Iryna Zaichenko"
            aria-label="Autor: Iryna Zaichenko"
            alt="Cão com pelagem amarela e branca"
          />
          <a
            target="_blank"
            rel="noreferrer"
            href="https://thumbs.dreamstime.com/z/welsh-corgi-retrato-de-ra%C3%A7a-c%C3%A3o-pembroke-isolado-em-branco-ilustra%C3%A7%C3%A3o-arte-digital-desenho-aquarela-animal-desenhado-%C3%A0-m%C3%A3o-159585667.jpg"
          >
            Iryna Zaichenko
          </a>
        </div>
      </div>
    </div>
  );
}
