import Container from './Container';
import Header from './Header';
import styles from './App.module.css';

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
