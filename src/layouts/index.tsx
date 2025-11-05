import { Link, Outlet } from 'umi';
import styles from './index.less';
import Routes from './compontents/Routes';
import Logo from './compontents/Logo';
import { useModel } from 'umi'
import Head from './head';

export default function Layout() {
  const {theme,setTheme} = useModel('useCommonModel')

  return (
    <div className={`${theme === 'light' ? styles.lightTheme : styles.darkTheme } ${theme === 'light' ? 'lightTheme' : 'darkTheme'} ${styles.navs}`}>
      <Head />
      <Outlet />
    </div>
  );
}
  