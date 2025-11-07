import { useEffect, useMemo, useState } from "react";
import intl from "react-intl-universal";

// 定义应用内支持的语言列表，使用 const 断言保证类型推断为只读字面量
const SUPPORTED_LOCALES = ["en-US", "ja-JP", "ko-KR", "zh-CN"] as const;

// LocaleKey 表示 SUPPORTED_LOCALES 中的任意一项
type LocaleKey = (typeof SUPPORTED_LOCALES)[number];

// 默认兜底语言，当传入语言不在白名单中时使用
const fallbackLocale: LocaleKey = "zh-CN";

// 将任意来源的语言值（可能是 URL、全局变量等）转换为合法语言码
// 如果未传或传入不合法的语言，返回 fallbackLocale
const resolveLocale = (locale?: string | null): LocaleKey => {
    if (!locale) return fallbackLocale;
    return SUPPORTED_LOCALES.includes(locale as LocaleKey)
        ? (locale as LocaleKey)
        : fallbackLocale;
};

// 动态加载某种语言的文案文件
// 兼容 CommonJS 和 ES Module 的 default 导出
const loadLocaleMessages = (locale: LocaleKey) => {
    const module = require(`@/locales/${locale}`);
    return module.default ?? module;
};

export default function useLocale(initialLocale?: string) {
    // 当前文案是否加载完成
    const [loaded, setLoaded] = useState(false);
    // 当前正在使用的语言码，初始值由入参决定
    const [locale, setLocale] = useState<LocaleKey>(() => resolveLocale(initialLocale));

    // 语言改变时重新加载对应的文案文件
    const messages = useMemo(() => loadLocaleMessages(locale), [locale]);

    useEffect(() => {
        // 切换时先标记为未加载，避免界面在旧文案下闪烁
        setLoaded(false);
        intl
            .init({
                currentLocale: locale,
                locales: {
                    [locale]: messages
                }
            })
            .then(() => {
                // 将当前语言写入全局，供其他运行期逻辑复用
                (global as any).injectLocale = locale;
            })
            .finally(() => {
                // 文案加载完成，允许渲染 UI
                setLoaded(true);
            });
    }, [locale, messages]);

    return {
        loaded,
        locale,
        setLocale,
    } as const;
}
