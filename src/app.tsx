import React, { useMemo } from 'react'
import { useLocale } from "@/tools";
import styles from './app.less'

// 根据不同运行时环境解析出初始语言
// 1. SSR 场景：优先读取服务端注入的 injectLocale
// 2. CSR 场景：依次读取全局注入值和 URL 查询参数（?locale=）
// 3. 若都不存在，回退到中文
const getInitialLocale = () => {
  if (typeof window === 'undefined') {
    return (global as any).injectLocale || 'zh-CN';
  }

  const injected = (global as any).injectLocale;
  if (injected) return injected;

  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('locale') || 'zh-CN';
}

// 负责完成语言初始化的包装组件：
// - 仅在 React 组件上下文内调用 useMemo/useLocale
// - 在文案尚未加载完成时渲染空壳，避免界面闪烁
const LocaleBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialLocale = useMemo(getInitialLocale, []);
  const { loaded } = useLocale(initialLocale);

  if (!loaded) {
    return <div className={styles.appWrapper} />;
  }

  return (
    <div className={styles.appWrapper}>
      {children}
    </div>
  );
}

// Umi 会调用 rootContainer 注入自定义根节点，这里包一层语言环境组件
export function rootContainer(container: React.ReactNode) {
  return <LocaleBootstrap>{container}</LocaleBootstrap>;
}



