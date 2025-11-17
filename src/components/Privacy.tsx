import GameModels from "./GameModels";
import styles from "../assets/about.module.css"; // Reuse the same CSS

export default function Privacy() {
  return (
    <div className={styles.aboutPage}>
      {/* Floating Background Models - Same as About page */}
      <div className={styles.backgroundModels}>
        <GameModels type="blockchain" className={styles.model1} />
        <GameModels type="crypto" className={styles.model2} />
        <GameModels type="web3" className={styles.model3} />
        <GameModels type="nft" className={styles.model4} />
        <GameModels type="solana" className={styles.model5} />
        <GameModels type="token" className={styles.model6} />
        <GameModels type="wallet" className={styles.model7} />
        <GameModels type="gamepad" className={styles.model8} />
        <GameModels type="dice" className={styles.model9} />
        <GameModels type="coin" className={styles.model10} />
        <GameModels type="trophy" className={styles.model11} />
        <GameModels type="controller" className={styles.model12} />
        <GameModels type="headset" className={styles.model13} />
        <GameModels type="keyboard" className={styles.model14} />
        <GameModels type="mouse" className={styles.model15} />
        <GameModels type="joystick" className={styles.model16} />
      </div>

      <div className={styles.container}>
        <section className={styles.hero} style={{ minHeight: "20vh", paddingTop: "120px" }}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.subtitle}>
              Your trust and security are our top priority
            </p>
          </div>
        </section>

        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(153, 69, 255, 0.2)",
          borderRadius: "20px",
          padding: "50px 40px",
          margin: "40px 0",
          backdropFilter: "blur(10px)",
          lineHeight: "1.8",
          color: "#e0e0e0",
          fontSize: "1.1rem"
        }}>
          <p><strong>Effective From:</strong> November, 2025</p>
          <br />

          <p>
            At <strong>Cryptoverse</strong>, we respect your privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
          </p>

          <h2 style={{ color: "#14f195", marginTop: "2rem" }}>1. Information We Collect</h2>
          <ul>
            <li><strong>Wallet Address:</strong> When you connect your Solana wallet (e.g., Phantom, Solflare), we only access your public wallet address for transaction purposes.</li>
            <li><strong>Transaction Data:</strong> We record on-chain purchases and in-game transactions made through our platform.</li>
            <li><strong>Usage Data:</strong> Anonymous analytics about how you interact with our games and website (via privacy-first tools).</li>
          </ul>

          <h2 style={{ color: "#14f195", marginTop: "2rem" }}>2. Information We Do NOT Collect</h2>
          <p>We <strong>never</strong> ask for or store:</p>
          <ul>
            <li>Your private keys or seed phrases</li>
            <li>Personal information (name, email, phone, KYC)</li>
            <li>IP address logging (unless required for fraud prevention)</li>
            <li>Off-chain payment details</li>
          </ul>

          <h2 style={{ color: "#14f195", marginTop: "2rem" }}>3. How We Use Your Data</h2>
          <p>Your wallet and transaction data is used solely to:</p>
          <ul>
            <li>Process in-app purchases on the Solana blockchain</li>
            <li>Deliver purchased digital items to your wallet</li>
            <li>Improve game performance and user experience</li>
            <li>Prevent fraud and ensure platform security</li>
          </ul>

          <h2 style={{ color: "#14f195", marginTop: "2rem" }}>4. Non-Custodial & Decentralized</h2>
          <p>
            Cryptoverse is <strong>100% non-custodial</strong>. We never hold your funds or private keys. 
            All transactions occur directly between your wallet and the Solana blockchain.
          </p>

          <h2 style={{ color: "#14f195", marginTop: "2rem" }}>5. Cookies & Analytics</h2>
          <p>
            We use <strong>privacy-first, cookieless analytics</strong> that do not track you across sites or sell your data.
          </p>

          <h2 style={{ color: "#14f195", marginTop: "2rem" }}>6. Third-Party Services</h2>
          <p>
            We integrate with trusted Solana ecosystem partners (wallet providers, RPC nodes) that follow strict privacy standards.
          </p>

          <h2 style={{ color: "#14f195", marginTop: "2rem" }}>7. Your Rights</h2>
          <p>
            Since we collect minimal data and nothing personally identifiable, you have full control:
          </p>
          <ul>
            <li>Disconnect your wallet at any time</li>
            <li>No account deletion needed just stop using the site</li>
            <li>All your purchases are permanently recorded on Solana (transparent & immutable)</li>
          </ul>

          <h2 style={{ color: "#14f195", marginTop: "2rem" }}>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <a href="https://contact.cryptoverse.games" target="_blank" rel="noopener" style={{ color: "#9945ff" }}>
              contact.cryptoverse.games
            </a>
          </p>

          <br />
          <p style={{ fontSize: "0.95rem", color: "#999", marginTop: "3rem" }}>
            We reserve the right to update this policy. Changes will be posted here with the updated effective date.
          </p>
        </div>
      </div>
    </div>
  );
}