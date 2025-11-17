// src/components/Home.tsx
import { Link } from 'react-router-dom';
import GameModel from './GameModels';
import styles from '../assets/home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Welcome to <span className={styles.gradient}>Cryptoverse</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Play Web3 games, earn Solana rewards, and experience the future of decentralized gaming
            </p>
            <div className={styles.heroButtons}>
              <Link to="/library" className={styles.primaryBtn}>
                Explore Games
              </Link>
              <Link to="/about" className={styles.secondaryBtn}>
                Learn More
              </Link>
            </div>
          </div>
          
          <div className={styles.heroModels}>
            <div className={styles.heroModelsRow}>
              <GameModel type="solana" size="large" />
              <GameModel type="gamepad" size="large" />
            </div>
            <div className={styles.heroModelsRow}>
              <GameModel type="wallet" size="medium" />
              <GameModel type="dice" size="medium" />
              <GameModel type="web3" size="medium" />
            </div>
            <div className={styles.heroModelsRow}>
              <GameModel type="blockchain" size="medium" />
              <GameModel type="token" size="small" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Cryptoverse?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <GameModel type="solana" size="small" />
              <h3>Solana Payments</h3>
              <p>Fast, secure transactions with minimal fees using Solana blockchain</p>
            </div>
            <div className={styles.featureCard}>
              <GameModel type="nft" size="small" />
              <h3>Buy Digital Assets</h3>
              <p>Purchase exclusive assets and in-game items using Solana cryptocurrency</p>
            </div>
            <div className={styles.featureCard}>
              <GameModel type="wallet" size="small" />
              <h3>Solana Marketplace</h3>
              <p>Trade and buy gaming assets with fast, low-cost Solana transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* Web3 Gaming Section */}
      <section className={styles.web3Gaming}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Gaming Experience</h2>
          <div className={styles.web3Grid}>
            <div className={styles.web3Card}>
              <GameModel type="controller" size="medium" />
              <h3>Action Games</h3>
              <p>Fast-paced adventures with instant Solana rewards for achievements</p>
            </div>
            <div className={styles.web3Card}>
              <GameModel type="keyboard" size="medium" />
              <h3>Strategy Games</h3>
              <p>Test your skills in puzzle and strategy games while earning crypto</p>
            </div>
            <div className={styles.web3Card}>
              <GameModel type="trophy" size="medium" />
              <h3>Tournaments</h3>
              <p>Compete in daily tournaments and win exclusive NFT prizes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solana Ecosystem Section */}
      <section className={styles.solanaEcosystem}>
        <div className={styles.container}>
          <div className={styles.ecosystemContent}>
            <div className={styles.ecosystemText}>
              <h2>Powered by Solana</h2>
              <p>Experience lightning-fast transactions and minimal fees with Solana's high-performance blockchain.</p>
              <ul className={styles.ecosystemFeatures}>
                <li>Sub-second transaction finality</li>
                <li>Fees under $0.01</li>
                <li>Eco-friendly proof-of-stake</li>
                <li>Seamless wallet integration</li>
              </ul>
            </div>
            <div className={styles.ecosystemModels}>
              <div className={styles.heroModelsRow}>
                <GameModel type="solana" size="large" />
                <GameModel type="controller" size="large" />
              </div>
              <div className={styles.heroModelsRow}>
                <GameModel type="wallet" size="medium" />
                <GameModel type="nft" size="medium" />
                <GameModel type="joystick" size="medium" />
              </div>
              <div className={styles.heroModelsRow}>
                <GameModel type="blockchain" size="medium" />
                <GameModel type="coin" size="small" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Start Your Gaming Journey</h2>
          <p>Join thousands of players in the ultimate Web3 gaming experience</p>
          <div className={styles.ctaButtons}>
            <Link to="/library" className={styles.ctaBtn}>
              Start Playing Now
            </Link>
            <Link to="/about" className={styles.secondaryBtn}>
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}