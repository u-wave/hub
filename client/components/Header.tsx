import logo from '../assets/logo-white.png';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.appBar}>
      <a href="https://u-wave.net/" className={styles.logo}>
        <img alt="üWave" src={logo} height={48} />
      </a>
      <a href="/" className={styles.link}>
        Join
      </a>
      <a href="https://u-wave.net/install" className={styles.link}>
        Install
      </a>
    </header>
  );
}

export default Header;
