import { Card } from "../../../../components/Card";
import { useEffect, useState } from "react";
import { Skeleton } from "../../../../components/Skeleton";
import { DisappearanceProps } from "../../../../types";

import styles from "./styles.module.scss";
import api from "../../../../services/disappearanceApi";
import { AddCard } from "../../../../components/AddCard";

export function Registers() {
  const [isLoading, setIsLoading] = useState(false);
  const [disappearances, setDisappearances] = useState<DisappearanceProps[]>(
    [],
  );

  useEffect(() => {
    // getDisappearances();

    async function getDisappearances() {
      const { data } = await api.get(`/disappearances`, {
        params: {
          limit: 9,
        },
      });
      setDisappearances(data);
      setIsLoading(false);
    }
  }, []);

  return (
    <div className={styles.container}>
      <h2>Últimos registros</h2>
      {disappearances.length === 0 && !isLoading && (
        <p className={styles.noDataMessage}>
          Oba!!! Nós temos nenhum pet desaparecido.
        </p>
      )}

      <section className={styles.grid}>
        {isLoading ? (
          new Array(9).fill("").map((_, index) => <Skeleton key={index} />)
        ) : (
          <>
            {disappearances.length > 0 ? (
              disappearances.map((disappearance: DisappearanceProps) => (
                <Card key={disappearance.id} disappearance={disappearance} />
              ))
            ) : (
              <>
                <AddCard />
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
