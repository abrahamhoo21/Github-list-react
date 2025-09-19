import styles from './Header.module.scss';
import { Github, Star, Calendar } from 'lucide-react'

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.topline}>
                <Github size={40} strokeWidth={2}></Github>
                <h1 className={styles.title}>GitHub Trending</h1>
            </div>  

            <div className={styles.subline}>
                <span className={styles.badge}>
                    <Star className={styles.icon}></Star>
                    <span>Most starred repositories</span>
                </span>     

                <span className={styles.badge}>
                    <Calendar className={styles.icon}></Calendar>
                    <span>Created since September 18, 2025</span>
                </span>
            </div>
        </header>
    );
}


