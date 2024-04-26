// components/Sidebar.js
import Link from 'next/link';
import { FaHome, FaChartBar, FaUser, FaPlus, FaSearch } from 'react-icons/fa'; // Import icons
import sidebarStyles from "../styles/sidebar.module.css";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const Sidebar = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    const currentYear = currentDate.getFullYear();
    const targetMonth = {
        year: parseInt(currentYear),
        month: parseInt(currentMonth),
    };
    const router = useRouter();
    
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // User has successfully signed out
                // You can perform actions like clearing user session and redirection here
                console.log('User signed out');
                router.push('/');
                // Redirect the user to the root path
            })
            .catch((error) => {
                // An error occurred during sign-out
                console.error('Sign out error', error);
            });
    };

    return (
        <div className={sidebarStyles.sidebar}>
            <ul>
                <li>
                    <Link href={`/logs/viewMonthLogs/${targetMonth.year}/${targetMonth.month}`}>
                        <FaHome />
                        Logs
                    </Link>
                </li>
                <li className={sidebarStyles.productItem}>
                    <div className={sidebarStyles.productItemContent}>
                        <Link href="/products/view">
                            <FaChartBar />
                            Products
                        </Link>
                        <Link legacyBehavior href={`/products/add`}>
                            <div className={sidebarStyles.addProductButton}>
                                <FaPlus />
                                Add
                            </div>
                        </Link>
                    </div>
                </li>
                <li>
                    <Link href={`/search`}>
                        <FaSearch />
                        Search
                    </Link>
                </li>
                <li>
                    <a onClick={handleSignOut}>
                        <FaUser />
                        Sign out
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
