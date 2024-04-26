import '../styles/globals.css'; // 导入其他全局 CSS 文件
import ProgressBar from 'nextjs-progressbar';
import 'nprogress/nprogress.css'; // 引入样式文件
import Router from 'next/router';
import NProgress from 'nprogress';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
function MyApp({ Component, pageProps }) {
    return (
        <>
            <ProgressBar color="#29D" startPosition={0.5} stopDelayMs={500} height={2} showOnShallow={true} />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;

