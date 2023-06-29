import '@u-wave/react-server-list/dist/u-wave-react-server-list.css';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Container } from '@u-wave/react-server-list';
import theme from '../muiTheme';
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
  // Would be nice for the frame to be a server component in the future
  return (
    <div className={styles.appWrapper}>
      <Header />

      <ThemeProvider theme={theme}>
        <main className={styles.main}>
          <Container hub={VITE_HUB_SERVER} />
          <footer className={styles.footer}>
            <Typography component="p">
              <a href="https://github.com/u-wave/hub/tree/default/client" className={styles.sourceLink}>view source</a>
            </Typography>
          </footer>
        </main>
      </ThemeProvider>
    </div>
  );
}

export default App;
