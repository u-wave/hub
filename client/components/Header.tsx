import Button from '@mui/material/Button';
import logo from '../assets/logo-white.png';
import * as styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.appBar}>
      <a href="https://u-wave.net/" className={styles.logo}>
        <img alt="üWave" src={logo} height={48} />
      </a>
      <Button href="/" variant="text" color="inherit">
        Join
      </Button>
      <Button href="https://u-wave.net/install" variant="text" color="inherit">
        Install
      </Button>
    </header>
  );
}

export default Header;
