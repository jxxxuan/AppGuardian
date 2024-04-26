// pages/logs/viewMonthLogs.js

import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import firebase from '../../config/firebase'; // Please adjust the import path as needed
import Layout from '../../components/Layout';
import Link from "next/link";
import logStyles from '../../styles/logView.module.css';

function ViewMonthLogsPage() {
    const router = useRouter();
    const [logYears, setlogYears] = useState([]);
    const [logMonths, setlogMonths] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const yearsMonths = await getAllYearsAndMonths();
            if (yearsMonths) {
                setlogYears(yearsMonths.years);
                setlogMonths(yearsMonths.months);
            }
        };
        fetchData();
    }, []);

    // Process the timestamps retrieved from Firestore
    const getAllYearsAndMonths = async () => {
        const timestamps = await fetchLogsDatetime();
        if (timestamps) {
            const years = new Set();
            const months = new Set([1,2,3,4,5,6,7,8,9,10,11,12]);
            timestamps.map((timestamp) => {
                const date = new Date(timestamp.seconds * 1000); // Convert to JavaScript Date object
                years.add(date.getFullYear());
            });
            return { years: [...years], months: [...months] };
        }
        return null;
    }

    const fetchLogs = async () => {
        const db = getFirestore(firebase);
        try {
            const logsRef = collection(db, "logs");
            const fd = new Date(`${router.query.year}-${router.query.month}`);
            const ld = new Date(fd.getFullYear(), fd.getMonth() + 1, 0);
            const q = query(logsRef, where("executed_datetime", ">=", fd), where("executed_datetime", "<=", ld));
            const querySnapshot = await getDocs(q);

            const logPromises = querySnapshot.docs.map(async (document) => {
                var log = { id: document.id, ...document.data() };
                return log;
            });

            const logsList = await Promise.all(logPromises);
            setLogs(logsList);
        } catch (error) {
            console.error('fail to get log info', error);
        }
    };

    // Get all the years and months fetched from Firestore
    const fetchLogsDatetime = async () => {
        try {
            const db = getFirestore(firebase);
            const logsRef = collection(db, 'logs');
            const querySnapshot = await getDocs(logsRef);

            const fieldValueList = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const fieldValue = data.executed_datetime; // Replace with the field name you want to retrieve
                fieldValueList.push(fieldValue);
            });

            return fieldValueList;
        } catch (error) {
            console.error('Failed to retrieve log information', error);
        }
    };

    // Generate links based on items
    const generateLinks = (items) => {
        const links = items.map((item) => ({ label: item, url: `` }));
        return links;
    }

    const handleNavMonthClick = (month) => {
        router.push(`/logs/viewMonthLogs/${router.query.year}/${month}`);
    }

    const handleNavYearClick = (year) => {
        router.push(`/logs/viewMonthLogs/${year}/${router.query.month}`);
    }

    useEffect(() => {
        fetchLogs();
    }, [router.query]);

    return (
        <Layout showSidebar={true} >
            <div className={logStyles.container}>
                <Navbar links={generateLinks(logYears)} onClick={handleNavYearClick} />
                <Navbar links={generateLinks(logMonths)} onClick={handleNavMonthClick} />
                <table className={logStyles.logTable}>
                    <thead>
                        <tr>
                            <th>Executed Date</th>
                            <th>Executed Time</th>
                            <th>App Store Hits</th>
                            <th>Play Store Hits</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td>{log.executed_datetime.toDate().toLocaleDateString()}</td>
                                <td>{log.executed_datetime.toDate().toLocaleTimeString()}</td>
                                <td>{log.app_store_hits}</td>
                                <td>{log.google_play_hits}</td>
                                <td>
                                    <Link href={`/logs/${log.id}`}>
                                        View Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default ViewMonthLogsPage;
