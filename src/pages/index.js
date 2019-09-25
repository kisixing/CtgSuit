import { NavLink } from 'umi';
import styles from './index.css';

export default function() {
  return (
    <div className={styles.normal}>
      hi！ this is umi electron
      <NavLink to="/list">list</NavLink>
    </div>
  );
}
