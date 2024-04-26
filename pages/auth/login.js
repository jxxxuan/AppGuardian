// pages/login.js
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import homeStyles from '../../styles/Home.module.css';
import { signInWithEmailAndPassword, onAuthStateChanged,getAuth } from "firebase/auth";
import authStyles from '../../styles/auth.module.css';
import Layout from '../../components/Layout';
import { auth } from '../../config/firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [alertShown, setAlertShown] = useState(false); // New state variable

    useEffect(() => {
        if (auth.currentUser && !alertShown) {
            router.push('/logs/viewMonthLogs');
            alert('You are login');
            setAlertShown(true); // Set the state to true after showing the alert
        }
    }, [router, alertShown]);

    const handleLogin = async () => {
        if (email == '' || password == '') {
            alert('Please fill up the password and email');
            return;
        }

        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                router.push('/logs/viewMonthLogs');
            })
            .catch((error) => {
                console.error('Login failed', error);
                if (error.code === 'auth/invalid-login-credentials') {
                    alert('Invalid login credentials. Please check your email and password.');
                } else {
                    alert('An error occurred during login. Please try again later.');
                }
            });
    };

    const handlerKeyDown = (event) => {
        if (event.key == 'Enter') {
            handleLogin();
        }
    }

    return (
        <Layout showFooter={true}>
            <div className={authStyles.container}>
                <Head>
                    <title>Login</title>
                </Head>

                <h1 className={homeStyles.header1}>Login Page</h1>
                <div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handlerKeyDown}
                            className={authStyles.input}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handlerKeyDown}
                            className={authStyles.input}
                        />
                    </div>
                    <button className={authStyles.auth_button} onClick={handleLogin}>
                        Login
                    </button>
                </div>

            </div>

        </Layout>
    );
}
