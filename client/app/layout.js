import createCache from '@emotion/cache';
import AppBar from '../components/AppBar';
import styles from './layout.module.css';
import '@u-wave/react-server-list/dist/u-wave-react-server-list.css';
import './global.css';

export const cache = createCache({ key: 'css', prepend: true });

export default function AppLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>üWave</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className={styles.wrapper}>

          <AppBar />

          <main className={styles.main}>
            {children}
            <footer className={styles.footer}>
              <p>
                <a className={styles.sourceLink} href="https://github.com/u-wave/hub/tree/default/client">view source</a>
              </p>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
