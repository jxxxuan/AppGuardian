// pages/search.js
import Layout from '../components/Layout';
import searchViewStyles from '../styles/search.module.css';
import productViewStyles from '../styles/productView.module.css';
import { FaEnvelope } from 'react-icons/fa'; // Import icons
import { useState,useEffect } from 'react';
import NProgress from 'nprogress';
import { auth } from '../config/firebase';
import { useRouter } from 'next/router';

export default function SearchPage() {
    const router = useRouter();
    const [results, setResults] = useState([]);
    const [key, setKey] = useState([]);
    const [alertShown, setAlertShown] = useState(false); // New state variable

    useEffect(() => {
        if (!auth.currentUser && !alertShown) {
            router.push('/');
            alert('Please login first');
            setAlertShown(true); // Set the state to true after showing the alert
        }
    }, [router, alertShown]);

    const handleSearch = async () => {
        NProgress.start();
        try {
            // 使用 fetch 或其他 HTTP 请求库调用 API
            const response = await fetch(`/api/search/${key}`);
            const data = await response.json();
            setResults(JSON.parse(data));
        } catch (error) {
            console.error('Error fetching search results', error);
        } finally {
            NProgress.done();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (    
        <Layout showSidebar={true}>
            <div className={searchViewStyles.container}>
                <div className={searchViewStyles.input}>
                    <input
                        type="text"
                        id="key"
                        placeholder="Search..."
                        onChange={(e) => setKey(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                {results.length > 0 ? (results.map((result, index) => (
                    <div key={index} className={searchViewStyles.result_container}>
                        {result.app_name.length > 50 ? (
                            <p className={productViewStyles.app_name}><a href={result.app_link}>{result.app_name.slice(0, 50)}...</a></p>
                        ) : (
                            <p className={productViewStyles.app_name}><a href={result.app_link}>{result.app_name}</a></p>
                        )}
                        
                        <p className={productViewStyles.dev_name}><a href={result.dev_link}> {result.dev_name}</a></p>

                        <p className={productViewStyles.app_info}>Similarity result: <span className={searchViewStyles.alert}>{result.similarity_result} %</span></p>

                        {result.platform === "app store" ? (
                            <p className={productViewStyles.ios_platform}>App store</p>
                        ) : (
                            <p className={productViewStyles.android_platform}>Google Play</p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaEnvelope />
                            {result.dev_email === "" ? (
                                <p className={productViewStyles.dev_email}>: Email not found</p>
                            ) : (
                                <p className={productViewStyles.dev_email}>: {result.dev_email}</p>
                            )}
                        </div>
                    </div>
                    ))
                ) : (
                    <div></div>
                )}
                
            </div>
        </Layout>
    );
};
