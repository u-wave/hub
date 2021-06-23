import { Container } from '@u-wave/react-server-list';
import Layout from '../components/Layout';

const { HUB_SERVER } = process.env;

function App() {
  return (
    <Layout>
      <Container hub={HUB_SERVER} />
    </Layout>
  );
}

export default App;
