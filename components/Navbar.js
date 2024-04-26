// components/Navbar.js

import { useState } from "react";
import { useRouter } from 'next/router';
import navbarStyles from "../styles/navbar.module.css";

const Navbar = ({ links, onClick }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const router = useRouter();

    return (
        <nav className={navbarStyles.navbar}>
            <ul className={navbarStyles.navList}>
                {links.map((link, index) => (
                    <li
                        key={index}
                        className={`${navbarStyles.navItem} ${selectedCategory === link.label
                            ? navbarStyles.selected // Apply selected style
                            : ""
                            }`}
                    >
                        <button
                            onClick={() => {
                                setSelectedCategory(link.label);
                                onClick(link.label);
                            }}
                        >
                            {link.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
