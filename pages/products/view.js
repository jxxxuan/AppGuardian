// ViewProduct.js
import React, { useState, useEffect } from 'react';
import firebase from '../../config/firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import productViewStyles from '../../styles/productView.module.css';
import Layout from '../../components/Layout';
import { SlArrowRight } from "react-icons/sl";
import { useRouter } from 'next/router';

export default function ViewProducts() {
    const router = useRouter();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore(firebase);
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productList = [];
                querySnapshot.forEach((doc) => {
                    productList.push({ id: doc.id, ...doc.data() });
                });
                setProducts(productList);
            } catch (error) {
                console.error('Failed to fetch product information', error);
            }
        };

        fetchData();
    }, [router]);

    return (
        <Layout showSidebar={true}>
            <div className={productViewStyles.container}>
                <div>
                    {products.map((product, index) => (
                        <div className={productViewStyles.product_container}>
                            <p className={productViewStyles.app_name}>{product.product_name}</p>
                            <button className={productViewStyles.more_button} onClick={() => router.push(`/products/details/${product.id}`)}>
                                <p>more</p> <SlArrowRight />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
