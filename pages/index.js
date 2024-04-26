import Head from 'next/head';
import homeStyles from '../styles/Home.module.css';
import authStyles from '../styles/auth.module.css';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { auth } from "../config/firebase";
import { useState, useEffect } from 'react';

const Home = () => {
    const router = useRouter();
    const [alertShown, setAlertShown] = useState(false); // New state variable

    useEffect(() => {
        if (auth.currentUser && !alertShown) {
            router.push('/logs/viewMonthLogs');
            alert('You are login');
            setAlertShown(true); // Set the state to true after showing the alert
        }
    }, [router, alertShown]);

    return (
        <Layout showSidebar={false} showFooter={true }>
            <div className={authStyles.container}>
                <Head>
                <title>App Guardian</title>
                </Head>

                <h1 className={homeStyles.title}>
                    Welcome to <span>App Guardian!</span>
                </h1>

                <p className={homeStyles.description}>
                    Search for Similar Software with App Guardian
                </p>

                <div className={authStyles.buttons}>
                    <Link href="/auth/login">
                                <button className={authStyles.auth_button}>Login</button>
                    </Link>
                    <Link href="/auth/signup">
                                <button className={authStyles.auth_button}>Sign Up</button>
                    </Link>
                </div>
            </div>
        </Layout>
  );
}

export default Home;