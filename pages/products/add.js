// pages/products/add.js
import { useState } from 'react';
import firebase from '../../config/firebase';
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import productViewStyles from '../../styles/productView.module.css';
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function AddProduct() {
    const [product_name, setProductName] = useState('');
    const [playDev, setPlayDeveloper] = useState('');
    const [appDev, setAppDeveloper] = useState('');
    const [appID, setAppID] = useState(''); // New product code field
    const [playID, setPlayID] = useState(''); // New product code field
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product_name || !playDev || !playID || !appDev || !appID) { // Check if all fields are filled
            alert('Please fill in all fields');
            return;
        }

        // Submit product information to Firestore
        const db = getFirestore(firebase);
        try {
            await setDoc(doc(collection(db, "products")), {
                product_name: product_name,
                play_dev: playDev,
                play_id: playID,
                app_dev: appDev,
                app_id: appID, // Add product code to Firestore
            });
            alert('Product information has been successfully submitted!');
            router.push(`/products/view`);
        } catch (error) {
            console.error('Failed to submit product information', error);
            alert('Failed to submit product information');
        }
    };

    return (
        <Layout showSidebar={true}>
            <div className={productViewStyles.container}>
                <form className={productViewStyles.product_edit_form} onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="product_name">Product Name:</label>
                        <input
                            type="text"
                            id="product_name"
                            value={product_name}
                            onChange={(e) => setProductName(e.target.value)}
                            className={productViewStyles.input}
                        />
                    </div>
                    <div className={productViewStyles.platform_container}>
                        
                        <div>
                            <label htmlFor="play_id">Google play store ID:</label>
                            <input
                                type="text"
                                id="play_id"
                                placeholder=''
                                value={playID}
                                onChange={(e) => setPlayID(e.target.value)}
                                className={productViewStyles.input}
                            />
                        </div>
                        <div>
                            <label htmlFor="play_dev">Developer Name:</label>
                            <input
                                type="text"
                                id="play_dev"
                                value={playDev}
                                onChange={(e) => setPlayDeveloper(e.target.value)}
                                className={productViewStyles.input}
                            />
                        </div>

                    </div>
                    <div className={productViewStyles.platform_container}>
                        <div>
                            <label htmlFor="app_id">Apple app store ID:</label>
                            <input
                                type="text"
                                id="app_id"
                                placeholder = ''
                                value={appID}
                                onChange={(e) => setAppID(e.target.value)}
                                className={productViewStyles.input}
                            />
                        </div>
                        <div>
                            <label htmlFor="app_dev">Developer Name:</label>
                            <input
                                type="text"
                                id="app_dev"
                                value={appDev}
                                onChange={(e) => setAppDeveloper(e.target.value)}
                                className={productViewStyles.input}
                            />
                        </div>
                    </div>
                    <button className={productViewStyles.action_button} type="submit">Submit</button>
                </form>
                
            </div>
        </Layout>
    );
}
