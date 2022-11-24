import { Footer } from "../../components/Footer";
import { LeafletMap } from "../../components/LeafletMap";
import { HeaderFlow } from "../../components/HeaderFlow";
import { InputField } from "../../components/InputField";
import { TextareaField } from "../../components/TextareaField";

import styles from "./styles.module.scss";

export function SignUp() {
  return (
    <div className={styles.container}>
      <HeaderFlow />

      <div className={styles.content}>
        <form>
          <h1>Cadastro de um animal</h1>

          <fieldset>
            <legend>
              <h2>Informações</h2>
            </legend>

            <InputField
              id="name"
              name="name"
              type="text"
              label="O animal atende por"
            />

            <InputField
              id="species"
              name="species"
              type="text"
              label="Espécie"
            />

            <div className={styles.fieldGroup}>
              <InputField
                id="whatsapp"
                name="whatsapp"
                type="number"
                label="Whatsapp"
              />

              <InputField id="email" name="email" type="email" label="Email" />
            </div>

            <TextareaField id="about" name="about" label="Sobre" />
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
            </legend>

            <div className={styles.mapContainer}>
              <div className={styles.mapContent}>
                <LeafletMap />
              </div>

              <div className={styles.mapFooter}>
                <strong>Clique no mapa para adicionar a localização</strong>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <InputField
                id="uf"
                name="uf"
                disabled
                type="text"
                label="Estado(UF)"
              />

              <InputField
                id="city"
                disabled
                name="city"
                type="text"
                label="Cidade"
              />
            </div>
          </fieldset>

          <button type="submit">Cadastrar</button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
