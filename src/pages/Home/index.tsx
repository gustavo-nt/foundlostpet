import { Header } from "../../components/Header";
import { Intro } from "./components/Intro";
import { Registers } from "./components/Registers";

import styles from "./styles.module.scss";

export function Home() {
  return (
    <>
      <Header />

      <main className={styles.wrapper}>
        <Intro />
        <Registers />
      </main>
    </>
  );
}
