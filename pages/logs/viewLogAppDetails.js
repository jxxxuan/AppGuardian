import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebase from '../../config/firebase';
import { getFirestore, doc, getDoc} from 'firebase/firestore';
import productViewStyles from '../../styles/productView.module.css';
import logViewStyles from '../../styles/logView.module.css';
import Layout from "../../components/Layout"
import { FaEnvelope } from 'react-icons/fa';

export default function ViewLogAppDetails() {
    const [appDetails, setAppDetails] = useState([]);
    const [log, setLog] = useState([]);
    const router = useRouter();
    const { logId, productId } = router.query; // Get logId from router parameters

    const fetchLog = async () => {
        if (logId) {
            const db = getFirestore(firebase);
            const logDocRef = doc(db, 'logs', logId);

            try {
                const logDocSnap = await getDoc(logDocRef);
                if (logDocSnap.exists()) {
                    await setLog(logDocSnap.data());
                } else {
                    console.error('Log information not found');
                }
            } catch (error) {
                console.error('Failed to retrieve log details', error);
            }
        }

    };

    const fetchAppDetails = async () => {
        const apps = [];
        try {
            const apps_docs = await log['app_docs'];
            await Promise.all(apps_docs[productId].map(async (appRef) => {
                const docsnap = await getDoc(appRef);
                apps.push(docsnap.data());
            }));
            setAppDetails(apps);
        } catch (error) {
            console.error('Failed to retrieve log details', error);
        }
    }

    useEffect(() => {
        if (logId) {
            fetchLog();
        }
    }, [logId]);

    useEffect(() => {
        if (productId) {
            fetchAppDetails();
        }
    }, [productId,log['app_docs']]);

    return (
        <Layout showSidebar={true}>
            <div className={logViewStyles.log_details_container}>
                {appDetails.length > 0 ? (appDetails.map((appDetail, index) => (
                    <div key={index} className={logViewStyles.log_container}>
                        <p className={productViewStyles.app_name}><a href={appDetail.app_link}> {appDetail.app_name}</a></p>
                        <p className={productViewStyles.dev_name}><a href={appDetail.dev_link}> {appDetail.dev_name}</a></p>
                        <p className={productViewStyles.app_info}>App name similarity: <span className={logViewStyles.alert}>{appDetail.app_name_similarity} %</span></p>
                        <p className={productViewStyles.dev_info}>Dev name similarity: <span className={logViewStyles.alert}>{appDetail.dev_name_similarity} %</span></p>

                        {appDetail.platform === "app store" ? (
                            <p className={productViewStyles.ios_platform}>App store</p>
                        ) : (
                                <p className={productViewStyles.android_platform}>Google Play</p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaEnvelope />
                            {appDetail.dev_email === "" ? (
                                <p className={productViewStyles.dev_email}>: Email not found</p>
                            ) : (
                                    <p className={productViewStyles.dev_email}>: {appDetail.dev_email}</p>
                            )}
                        </div>
                    </div>
                    ))
                ) : (
                    <p>loading</p>
                )}
            </div>
        </Layout>
    );
}
