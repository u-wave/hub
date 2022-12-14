import { createRoot } from 'react-dom/client';
import App from './pages/_app';
import Index from './pages/index';

const root = createRoot(document.querySelector('#app'));
root.render(<App Component={Index} pageProps={{}} />);
