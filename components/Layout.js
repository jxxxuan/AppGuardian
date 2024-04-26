// components/Layout.js
import Sidebar from './Sidebar';
import layoutStyles from '../styles/layout.module.css';
import homeStyles from '../styles/Home.module.css';

export default function Layout({ children, showSidebar = false, showFooter = false }){
    return (
        <div>
            <div className={layoutStyles.container}>
                {showSidebar && <Sidebar />}
                <main className={layoutStyles.main}>
                    {children}
                </main>
                

            </div>
            {showFooter && (
                <footer className={layoutStyles.footer}>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Powered by{' '}
                        <img src="/vercel.svg" alt="Vercel" className={homeStyles.logo} />
                    </a>
                </footer>
            )}
              

            <style jsx global>{`
            html,
            body {
                height: 100%;
              padding: 0;
              margin: 0;
              font-family:
                -apple-system,
                BlinkMacSystemFont,
                Segoe UI,
                Roboto,
                Oxygen,
                Ubuntu,
                Cantarell,
                Fira Sans,
                Droid Sans,
                Helvetica Neue,
                sans-serif;
            }
            * {
              box-sizing: border-box;
            }
          `}</style>
        </div>
    );
};
