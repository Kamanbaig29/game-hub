import styles from '../assets/about.module.css';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
    return (
        <div className={styles.libraryFeatureHeader}>
            <h2 className={styles.libraryFeatureTitle}>{title}</h2>
            {subtitle && <p className={styles.libraryFeatureSubtitle}>{subtitle}</p>}
        </div>
    );
}
