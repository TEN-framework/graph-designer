import Header from "@/components/header";
import Editor from "@/components/editor";
import Sidebar from "@/components/sidebar";

import styles from "./index.module.scss"

export default function Home() {

  return (
    <main className={styles.main}>
      <Header></Header>
      <div className={styles.body}>
        <Sidebar></Sidebar>
        <Editor></Editor>
      </div>
    </main>
  );
}
