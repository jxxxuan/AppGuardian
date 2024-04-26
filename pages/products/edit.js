// pages/products/edit.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from '../../config/firebase';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import productViewStyles from '../../styles/productView.module.css';
import Layout from "../../components/Layout";

export default function EditProduct() {
    const [editedProduct, setEditedProduct] = useState([]);
    const router = useRouter();
    const { productId } = router.query;

    useEffect(() => {
        const fetchProduct = async () => {
            const db = getFirestore(firebase);
            try {
                const docSnap = await getDoc(doc(db, "products", productId));
                setEditedProduct(docSnap.data());
            } catch (error) {
                console.error('Failed to fetch product information', error);
            }
        };
        fetchProduct();
    }, [router]);

    const handleEditProduct = async () => {
        if (!editedProduct.product_name || !editedProduct.play_dev || !editedProduct.play_id || !editedProduct.app_dev || !editedProduct.app_id) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const db = getFirestore(firebase);
            const productRef = doc(db, 'products', productId);

            await updateDoc(productRef, editedProduct);
            router.push('/products/view'); // Return to the product list page after editing
        } catch (error) {
            console.error('Failed to edit product', error);
        }
    };

    return (
        <Layout showSidebar={true }>
            <div className={productViewStyles.container}>
                <div className={productViewStyles.product_edit_form}>

                    <div className={productViewStyles.product_form_item}>

                        <label htmlFor="editedProductName">Product Name: </label>
                        <input
                            type="text"
                            id="editedProductName"
                            value={editedProduct.product_name}
                            onChange={(e) =>
                                setEditedProduct({
                                    ...editedProduct,
                                    product_name: e.target.value,
                                })
                            }
                            className={productViewStyles.input}
                        />
                    </div>
                    <div className={productViewStyles.product_form_item}>

                        <label htmlFor="editedDevName">Google Play ID: </label>
                        <input
                            type="text"
                            id="editedPlayID"
                            value={editedProduct.play_id}
                            onChange={(e) =>
                                setEditedProduct({
                                    ...editedProduct,
                                    play_id: e.target.value,
                                })
                            }
                            className={productViewStyles.input}
                        />
                    </div>
                    <div className={productViewStyles.product_form_item}>

                        <label htmlFor="editedDevName">Google Play developer name: </label>
                        <input
                            type="text"
                            id="editedPlayDevName"
                            value={editedProduct.play_dev}
                            onChange={(e) =>
                                setEditedProduct({
                                    ...editedProduct,
                                    play_dev: e.target.value,
                                })
                            }
                            className={productViewStyles.input}
                        />
                    </div>
                    <div className={productViewStyles.product_form_item}>

                        <label htmlFor="editedDevName">App store ID: </label>
                        <input
                            type="text"
                            id="editedAppID"
                            value={editedProduct.app_id}
                            onChange={(e) =>
                                setEditedProduct({
                                    ...editedProduct,
                                    app_id: e.target.value,
                                })
                            }
                            className={productViewStyles.input}
                        />
                    </div>
                    <div className={productViewStyles.product_form_item}>

                        <label htmlFor="editedDevName">App store developer name: </label>
                        <input
                            type="text"
                            id="editedAppDevName"
                            value={editedProduct.app_dev}
                            onChange={(e) =>
                                setEditedProduct({
                                    ...editedProduct,
                                    app_dev: e.target.value,
                                })
                            }
                            className={productViewStyles.input}
                        />
                    </div>
                    <button className={productViewStyles.action_button} onClick={handleEditProduct}>Save Changes</button>
                </div>
            </div>
        </Layout>
    );
}
