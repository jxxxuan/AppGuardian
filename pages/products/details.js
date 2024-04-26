// details.js
import React from "react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebase from '../../config/firebase';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import productViewStyles from '../../styles/productView.module.css';
import Layout from '../../components/Layout';

export default function DetailsProduct() {
	const [product, setProduct] = useState();
	const router = useRouter();
	const { productId } = router.query;
	
	useEffect(() => {
		const fetchProduct = async () => {
			const db = getFirestore(firebase);
			try {
				const productDoc = await getDoc(doc(db, "products", productId));
				if (productDoc.exists()) {
					setProduct({ id: productDoc.id, ...productDoc.data() });
				} else {
					console.error('Product not found');
				}
			} catch (error) {
				console.error('Failed to fetch product information', error);
			}
		};

		fetchProduct();
	}, [productId,router]);

	const handleEditClick = () => {
		router.push(`/products/edit/${product.id}`);
	};

	const handleDeleteClick = async () => {
		const db = getFirestore(firebase);
		const productRef = doc(db, 'products', product.id);

		try {
			await deleteDoc(productRef);
			// Update the interface after successful deletion
			setProduct(null); // Assuming you want to clear the product after deletion
		} catch (error) {
			console.error('Failed to delete product', error);
		}
	};

	return (
		<Layout showSidebar={true}>
			<div className={productViewStyles.container}>
				{product ? (
					<div className={productViewStyles.product_container}>
						<p className={productViewStyles.app_name}>{product.product_name}</p>
						<p className={productViewStyles.app_info}>App ID: {product.app_id}</p>
						<p className={productViewStyles.app_info}>Play ID: {product.play_id}</p>
						<p className={productViewStyles.app_info}>App Store developer name: {product.app_dev}</p>
						<p className={productViewStyles.app_info}>Google Play developer name: {product.play_dev}</p>
						<button className={productViewStyles.action_button} onClick={handleEditClick}>Edit</button>
						<button className={productViewStyles.action_button} onClick={handleDeleteClick}>Delete</button>
					</div>
				) : (
					<p>Loading product information...</p>
				)}
			</div>
		</Layout>
	);
}
