import React from "react";
import { HeaderFlow } from "../../components/HeaderFlow";

import styles from "./styles.module.scss";
import notFoundImg from "../../assets/reset-password-img.png";
import { Footer } from "../../components/Footer";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className={styles.container}>
      <HeaderFlow />

      <div className={styles.content}>
        <h1>Página não encontrada</h1>
        <span>Ops, não foi possível encontrar seu registro.</span>

        <Link to="/">ir para início</Link>
        <div className={styles.image}>
          <img
            src={notFoundImg}
            title="Autor: Iryna Zaichenko"
            aria-label="Autor: Iryna Zaichenko"
            alt="Cão com pelagem amarela e branca"
          />
          <a
            href="https://thumbs.dreamstime.com/b/hound-istriano-istarski-kratkodlaki-%E2%80%94-ilustra%C3%A7%C3%A3o-digital-de-arte-can%C3%B4nica-isolada-em-fundo-branco-origem-croata-cro%C3%A1cia-253964504.jpg"
            target="_blank"
            rel="noreferrer"
          >
            Iryna Zaichenko
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
