import Container from './Container';
import Header from './Header';
import * as styles from './App.module.css';

declare global {
  interface ImportMeta {
    env: {
      VITE_HUB_SERVER: string,
    },
  }
}

const { VITE_HUB_SERVER } = import.meta.env;

function App() {
  return (
    <div className={styles.appWrapper}>
      <Header />

      <main className={styles.main}>
        <Container hub={VITE_HUB_SERVER} />
        <footer className={styles.footer}>
          <p className={styles.typography}>
            <a href="https://github.com/u-wave/hub/tree/default/client" className={styles.sourceLink}>view source</a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
