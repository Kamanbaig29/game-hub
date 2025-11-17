import GameModels from "./GameModels";
import styles from "../assets/about.module.css";

export default function About() {
  return (
    <div className={styles.aboutPage}>
      {/* Background Models */}
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
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>About Cryptoverse</h1>
            <p className={styles.subtitle}>
              In-App Purchases Powered by Solana Blockchain
            </p>
          </div>
          <div className={styles.heroModels}>
            <GameModels type="solana" className={styles.heroModel1} />
            <GameModels type="nft" className={styles.heroModel2} />
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.missionSection}>
          <div className={styles.missionContent}>
            <h2>Our Mission</h2>
            <p>
              To revolutionize gaming by bringing fast, secure, and low-cost
              in-app purchases to players using the power of the Solana
              blockchain.
            </p>
          </div>
          <GameModels type="trophy" className={styles.missionModel} />
        </section>

        {/* Features Grid */}
        <section className={styles.featuresSection}>
          <h2>Why Choose Cryptoverse?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <GameModels
                type="wallet"
                size="small"
                className={styles.featureIcon}
              />
              <h3>Instant Solana Payments</h3>
              <p>
                Buy in-game items in seconds using SOL or any Solana token no
                waiting, no high fees
              </p>
            </div>

            <div className={styles.featureCard}>
              <GameModels
                type="coin"
                size="small"
                className={styles.featureIcon}
              />
              <h3>Lightning-Fast & Cheap</h3>
              <p>
                Powered by Solana: transactions cost fractions of a cent and
                confirm instantly
              </p>
            </div>

            <div className={styles.featureCard}>
              <GameModels
                type="web3"
                size="small"
                className={styles.featureIcon}
              />
              <h3>True Web3 Wallet Connect</h3>
              <p>
                Connect Phantom, Solflare, Backpack, or any Solana wallet with
                one click
              </p>
            </div>

            <div className={styles.featureCard}>
              <GameModels
                type="gamepad"
                size="small"
                className={styles.featureIcon}
              />
              <h3>Secure & Non-Custodial</h3>
              <p>
                You keep full control of your funds we never hold your SOL or
                tokens
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>8,500+</h3>
              <p>Active Players</p>
            </div>
            <div className={styles.statCard}>
              <h3>$180k+</h3>
              <p>In-App Purchases Processed</p>
            </div>
            <div className={styles.statCard}>
              <h3>100+</h3>
              <p>Countries</p>
            </div>
            <div className={styles.statCard}>
              <h3>15+</h3>
              <p>Games Available</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.teamSection}>
          <h2>Built by Gamers, for Gamers</h2>
          <p>
            Our team consists of passionate gamers, blockchain developers, and
            Web3 enthusiasts who believe in the power of decentralized gaming to
            change the industry forever.
          </p>
          <div className={styles.teamModels}>
            <GameModels type="controller" className={styles.teamModel1} />
            <GameModels type="headset" className={styles.teamModel2} />
            <GameModels type="keyboard" className={styles.teamModel3} />
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Ready to Join the Revolution?</h2>
            <p>Start your Web3 gaming journey today with instant, low-cost in-app purchases on Solana</p>
            <a
              href="https://cryptoverse.games"
              target="_blank"
              className={styles.ctaBtn}
            >
              Start Playing Now
            </a>
          </div>
          <GameModels type="blockchain" className={styles.ctaModel} />
        </section>
      </div>
    </div>
  );
}
