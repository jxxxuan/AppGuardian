import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebase from '../../config/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import productViewStyles from '../../styles/productView.module.css';
import logViewStyles from '../../styles/logView.module.css';
import Layout from "../../components/Layout"
import * as XLSX from 'xlsx';

export default function ViewLogApps() {
    const [appDetails, setAppDetails] = useState([]); // Use an array to store application details
    const [appGroups, setAppGroups] = useState([]);
    const [log, setLog] = useState([]); // Use an array to store application details
    const router = useRouter();
    const { logId } = router.query; // Get logId from router parameters

    const fetchAppDetail = async () => {
        const appDetailsArray = [];
        const product_ids = Object.keys(log['app_docs']);

        for (const product_id of product_ids) {
            const appDocs = log['app_docs'][product_id];

            for (const app_id of appDocs) {
                try {
                    const x = await getDoc(app_id);
                    if (x.exists()) {
                        appDetailsArray.push(x.data());
                    } else {
                        console.error(`Application document not found: ${app_id}`);
                    }
                } catch (error) {
                    console.error('Failed to retrieve application details', error);
                }
            }
        }

        setAppDetails(appDetailsArray);
    };


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

    const exportToExcel = () => {
        fetchAppDetail();
        console.log(log['executed_datetime'].toDate().toLocaleDateString());
        appDetails.forEach((app_detail) => {
            app_detail['Date'] = log['executed_datetime'].toDate().toLocaleDateString();
            app_detail['Time'] = log['executed_datetime'].toDate().toLocaleTimeString();
        })

        const ws = XLSX.utils.json_to_sheet(appDetails);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Log Details');
        XLSX.writeFile(wb, 'log detail.xlsx');
    };

    useEffect(() => {
        try {
            fetchLog();
        } catch (error) {
            console.error('Error fetching log', error);
        }
    }, [logId]);

    useEffect(() => {
        setAppGroups(log['compare_with']);
    }, [log]);

    return (
        <Layout showSidebar={true}>
            <div className={logViewStyles.log_details_container}>
                
                {appGroups ? (
                    <div>
                        <button className={logViewStyles.refresh_button} onClick={exportToExcel}>Download</button>

                        {Object.keys(appGroups).map((group_name, index) => (
                            <div key={index} className={productViewStyles.product_container}>
                                <p className={productViewStyles.app_name}><a href={`/logs/${logId}/${appGroups[group_name]['product id']}`}>{group_name}</a></p>
                                <p className={productViewStyles.app_info}>App store hits: <span className={logViewStyles.alert}>{appGroups[group_name]['app store hits']}</span></p>
                                <p className={productViewStyles.app_info}>Google play hits: <span className={logViewStyles.alert}>{appGroups[group_name]['google play hits']}</span></p>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </Layout>
    );
}
