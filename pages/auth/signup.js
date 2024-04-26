// pages/login.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import homeStyles from '../../styles/Home.module.css';
import { onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import authStyles from '../../styles/auth.module.css';
import Layout from '../../components/Layout';
import { auth } from '../../config/firebase';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const [alertShown, setAlertShown] = useState(false); // New state variable

    useEffect(() => {
        if (auth.currentUser && !alertShown) {
            router.push('/logs/viewMonthLogs');
            alert('You are login');
            setAlertShown(true); // Set the state to true after showing the alert
        }
    }, [router, alertShown]);

    const handleSignUp = async () => {
        if (password == '' || confirmPassword == '' || email == '') {
            alert('Please fill up all the fields');
            return;
        }
        if (password !== confirmPassword) {
            alert('Password and Confirm Password do not match!');
            return;
        }

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                router.push('/auth/login');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                console.error('Sign Up failed', error);
                alert('Sign Up failed');
            });
    };

    const handlerKeyDown = (event) => {
        if (event.key == 'Enter') {
            handleSignUp();
        }
    }

    return (
        <Layout showFooter={true}>
            <div className={authStyles.container}>
                <Head>
                    <title>Sign Up</title>
                </Head>

                <h1 className={homeStyles.header1}>Sign Up Page</h1>
                <div>
                    <div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handlerKeyDown }
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
                        <div>
                            <label htmlFor="confirm_password">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirm_password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={handlerKeyDown}
                                className={authStyles.input}
                            />
                        </div>
                        <button className={authStyles.auth_button} onClick={handleSignUp}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>


        </Layout>

    );
}

        