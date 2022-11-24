import { Card } from "../Card";
import { useEffect, useState } from "react";
import { Skeleton } from "../../../../components/Skeleton";
import { DisappearanceProps } from "../../../../types";

import styles from "./styles.module.scss";
import api from "../../../../services/dissapearanceApi";

const disappearances = [
  {
    id: "1",
    type: "horse",
    situation: "MISSING",
    name: "Fulano de Animal",
    latitude: "-29.7402368",
    longitude: "-50.8493824",
    description: "O tradicional café feito com água quente e grãos moídos",
    user: {
      id: "2",
      name: "Ciclano de Gente",
      email: "ciclano@gmail.com",
      created_at: "2022-11-14T23:08:28.161Z",
      password: "clicano",
    },
    created_at: "2022-11-14T23:08:28.161Z",
    updated_at: "2022-11-14T23:08:28.161Z",
    image: "horse.png",
    city: "Taquara",
    uf: "RS",
  },
  {
    id: "2",
    type: "bird",
    situation: "SIGHNED",
    name: "Fulano de Animal",
    latitude: "-29.7402368",
    longitude: "-50.8493824",
    description: "O tradicional café feito com água quente e grãos moídos",
    user: {
      id: "2",
      name: "Ciclano de Gente",
      email: "ciclano@gmail.com",
      created_at: "2022-11-14T23:08:28.161Z",
      password: "clicano",
    },
    created_at: "2022-11-14T23:08:28.161Z",
    updated_at: "2022-11-14T23:08:28.161Z",
    image: "bird.png",
    city: "Taquara",
    uf: "RS",
  },
  {
    id: "3",
    type: "rodent",
    situation: "FOUND",
    name: "Fulano de Animal",
    latitude: "-29.7402368",
    longitude: "-50.8493824",
    description: "O tradicional café feito com água quente e grãos moídos",
    user: {
      id: "2",
      name: "Ciclano de Gente",
      email: "ciclano@gmail.com",
      created_at: "2022-11-14T23:08:28.161Z",
      password: "clicano",
    },
    created_at: "2022-11-14T23:08:28.161Z",
    updated_at: "2022-11-14T23:08:28.161Z",
    image: "rodent.png",
    city: "Taquara",
    uf: "RS",
  },
  {
    id: "4",
    type: "cow",
    situation: "MISSING",
    name: "Fulana de Animal",
    latitude: "-29.7402368",
    longitude: "-50.8493824",
    description: "O tradicional café feito com água quente e grãos moídos",
    user: {
      id: "2",
      name: "Ciclano de Gente",
      email: "ciclano@gmail.com",
      created_at: "2022-11-14T23:08:28.161Z",
      password: "clicano",
    },
    created_at: "2022-11-14T23:08:28.161Z",
    updated_at: "2022-11-14T23:08:28.161Z",
    image: "cow.png",
    city: "Taquara",
    uf: "RS",
  },
  {
    id: "5",
    type: "dog",
    situation: "SIGHNED",
    name: "Fulano de Animal",
    latitude: "-29.7402368",
    longitude: "-50.8493824",
    description: "O tradicional café feito com água quente e grãos moídos",
    user: {
      id: "2",
      name: "Ciclano de Gente",
      email: "ciclano@gmail.com",
      created_at: "2022-11-14T23:08:28.161Z",
      password: "clicano",
    },
    created_at: "2022-11-14T23:08:28.161Z",
    updated_at: "2022-11-13T23:08:28.161Z",
    image: "dog.png",
    city: "Taquara",
    uf: "RS",
  },
  {
    id: "6",
    type: "cat",
    situation: "FOUND",
    name: "Fulano de Animal",
    latitude: "-29.7402368",
    longitude: "-50.8493824",
    description: "O tradicional café feito com água quente e grãos moídos",
    user: {
      id: "2",
      name: "Ciclano de Gente",
      email: "ciclano@gmail.com",
      created_at: "2022-11-14T23:08:28.161Z",
      password: "clicano",
    },
    created_at: "2022-11-14T23:08:28.161Z",
    updated_at: "2022-11-14T23:08:28.161Z",
    image: "cat.png",
    city: "Taquara",
    uf: "RS",
  },
];

export function Registers() {
  const [isLoading, setIsLoading] = useState(true as boolean);
  const [disappearances, setDisappearances] = useState(
    [] as DisappearanceProps[]
  );

  useEffect(() => {
    getDisappearances();

    async function getDisappearances() {
      const res = await api.get(`/disappearances`);
      setDisappearances(res.data);
      setIsLoading(false);
    }
  }, []);

  return (
    <div className={styles.container}>
      <h2>Últimos registros</h2>

      <section className={styles.grid}>
        {isLoading
          ? new Array(9)
              .fill("")
              .map((value, index) => <Skeleton key={index} />)
          : disappearances.map((disappearance: DisappearanceProps) => (
              <Card key={disappearance.id} disappearance={disappearance} />
            ))}
      </section>
    </div>
  );
}
