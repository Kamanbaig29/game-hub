import { Link } from 'react-router-dom';
import styles from '../assets/k6Report.module.css';

export default function K6Report() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>← Back to Dashboard</Link>
        <h1>Server Performance Report</h1>
      </div>
      
      <div className={styles.report}>
        <section className={styles.section}>
          <h2>Overview</h2>
          <p>
            This report shows how well our server handles different numbers of users at the same time. 
            We tested the server with 100, 500, 1000, and 2000 concurrent users to see how it performs.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Test Results</h2>
          
          <div className={styles.resultCard}>
            <div className={styles.statusGood}>✅</div>
            <div className={styles.resultContent}>
              <h3>100 Users - Excellent</h3>
              <p><strong>Status:</strong> All tests passed</p>
              <p><strong>Success Rate:</strong> 100% of requests succeeded</p>
              <p><strong>Response Time:</strong> Very fast (under 1 second)</p>
              <p><strong>Verdict:</strong> Server works perfectly at this level</p>
            </div>
          </div>

          <div className={styles.resultCard}>
            <div className={styles.statusWarning}>⚠️</div>
            <div className={styles.resultContent}>
              <h3>500 Users - Acceptable</h3>
              <p><strong>Status:</strong> Partially passing</p>
              <p><strong>Success Rate:</strong> 75% of requests succeeded</p>
              <p><strong>Response Time:</strong> Moderate (2-7 seconds)</p>
              <p><strong>Error Rate:</strong> 25% failures</p>
              <p><strong>Verdict:</strong> Server works but struggles under heavy load. Most features work (99% success for games, categories), but admin features have issues.</p>
            </div>
          </div>

          <div className={styles.resultCard}>
            <div className={styles.statusBad}>❌</div>
            <div className={styles.resultContent}>
              <h3>1000 Users - Poor</h3>
              <p><strong>Status:</strong> Server struggling</p>
              <p><strong>Success Rate:</strong> Very low</p>
              <p><strong>Response Time:</strong> Very slow</p>
              <p><strong>Verdict:</strong> Server cannot handle this many users reliably</p>
            </div>
          </div>

          <div className={styles.resultCard}>
            <div className={styles.statusBad}>❌</div>
            <div className={styles.resultContent}>
              <h3>2000 Users - Failed</h3>
              <p><strong>Status:</strong> Server overwhelmed</p>
              <p><strong>Success Rate:</strong> Only 29% of requests succeeded</p>
              <p><strong>Response Time:</strong> Extremely slow (up to 60 seconds)</p>
              <p><strong>Error Rate:</strong> 71% failures</p>
              <p><strong>Verdict:</strong> Server completely overwhelmed. Most requests fail or timeout.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Recommended Capacity</h2>
          <div className={styles.capacityTable}>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}><strong>User Count</strong></div>
              <div className={styles.tableCell}><strong>Performance</strong></div>
              <div className={styles.tableCell}><strong>Recommendation</strong></div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>1-100</div>
              <div className={styles.tableCell}>Excellent</div>
              <div className={styles.tableCell}>✅ Perfect for production</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>100-250</div>
              <div className={styles.tableCell}>Good</div>
              <div className={styles.tableCell}>✅ Recommended maximum</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>250-500</div>
              <div className={styles.tableCell}>Acceptable</div>
              <div className={styles.tableCell}>⚠️ Works but with issues</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>500+</div>
              <div className={styles.tableCell}>Poor</div>
              <div className={styles.tableCell}>❌ Not recommended</div>
            </div>
          </div>
          <p className={styles.recommendation}>
            <strong>Best Practice:</strong> Keep concurrent users under <strong>250</strong> for best performance.
          </p>
        </section>

        <section className={styles.section}>
          <h2>What This Means</h2>
          <div className={styles.summary}>
            <p><strong>Current Status:</strong> Server works great for normal traffic (up to 250 users). May struggle during traffic spikes (500+ users). Cannot handle very high traffic (1000+ users).</p>
            <p><strong>For Normal Use:</strong> Current setup is fine.</p>
            <p><strong>For High Traffic:</strong> Consider server upgrades or optimizations.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

