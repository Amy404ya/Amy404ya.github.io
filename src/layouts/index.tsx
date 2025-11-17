import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useModel } from 'umi';
import styles from './index.less';
import Head from './head';
import Footer from './footer';

export default function Layout() {
  const { theme } = useModel('useCommonModel');
  const navsRef = useRef<HTMLDivElement>(null);
  const [showDailyQuote, setShowDailyQuote] = useState(true);
  // useEffect 本身在这里确实只会执行一次（因为依赖数组是空的），
  // 但在这个 effect 里，我们给 .navs 元素手动注册了一个原生的
  //  scroll 事件监听器。流程是这样的：
  // 1、首次渲染后 useEffect 运行，拿到 navsEl，定义 handleScroll，立即执行
  // 一次以同步初始状态，然后把 handleScroll 绑定到 navsEl 的 scroll 事件。
  // 2、之后用户每滚动一次 .navs，浏览器就触发 scroll 事件，调用我们注册的
  // handleScroll，从而根据 navsEl.scrollTop 更新 state。虽然 React 的 effect
  // 没有再次运行，但通过 DOM 事件监听器，滚动变化仍然能被捕获。
  // 组件卸载时，cleanup 会移除这个事件监听，避免内存泄漏。

  useEffect(() => {
    const navsEl = navsRef.current;
    if (!navsEl) {
      return;
    }

    const handleScroll = () => {
      // 每次滚动时实时读取.navs容器已滚动的垂直距离
      // 小于 300px 时展示 DailyQuote，超过则隐藏
      setShowDailyQuote(navsEl.scrollTop < 300);
    };

    // 初始化时立即执行一次，保证刷新后状态同步页面当前位置
    handleScroll();

    // 监听.navs的滚动事件并在组件卸载时清理
    navsEl.addEventListener('scroll', handleScroll);
    return () => {
      navsEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={navsRef}
      className={`${theme === 'light' ? styles.lightTheme : styles.darkTheme} ${
        theme === 'light' ? 'lightTheme' : 'darkTheme'
      } ${styles.navs}`}
    >
      <Head showDailyQuote={showDailyQuote} />
      <div className={styles.innerWrap}>
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}