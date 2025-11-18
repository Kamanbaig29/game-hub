// src/components/Arena.tsx
import { Link } from 'react-router-dom';
import GameModel from './GameModels';
import styles from '../assets/home.module.css';
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const gameImages = [
  'basket-ball-physics.png',
  'Block-Sort-Puzzle.png',
  'DIY-popit.png',
  'Draw-To-Save.png',
  'drunken-wrestler.png',
  'Fish-Eat-Fish.png',
  'little-right-organizer.png',
  'Magnet-world.png',
  'Nut&bolt.png',
  'pc-simulator.png',
  'Pixel-Art-Book.png',
  'Princes-Room-Cleanup.png',
  'Robo-Sumo-Wrestler.png',
  'Tap-Away-3D.png',
  'Traffic-jam.png',
  'tug-the-table.png',
  'world-builder.png'
];

const firstRow = gameImages.slice(0, Math.ceil(gameImages.length / 2));
const secondRow = gameImages.slice(Math.ceil(gameImages.length / 2));

const GameImageCard = ({ img }: { img: string }) => {
  return (
    <div className={cn(
      "relative h-32 w-32 cursor-pointer overflow-hidden rounded-xl border",
      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      "flex items-center justify-center p-2"
    )}>
      <img 
        src={`/icons-coming-soon/${img}`} 
        alt={img.replace('.png', '')}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default function Arena() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Marquee Background with Images */}
        <div className={styles.heroMarquee}>
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((img, index) => (
              <GameImageCard key={`${img}-${index}`} img={img} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((img, index) => (
              <GameImageCard key={`${img}-${index}`} img={img} />
            ))}
          </Marquee>
        </div>
        
        {/* Black Opacity Overlay */}
        <div className={styles.heroOverlay}></div>

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Welcome to <span className={styles.gradient}>Cryptoverse</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Play Web3 games, earn Solana rewards, and experience the future of decentralized gaming
            </p>
            <div className={styles.heroButtons}>
              <Link to="/" className={styles.primaryBtn}>
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
              <p>Fast-paced adventures with instant rewards for achievements</p>
            </div>
            <div className={styles.web3Card}>
              <GameModel type="keyboard" size="medium" />
              <h3>Strategy Games</h3>
              <p>Test your skills in puzzle and strategy games while playing on Solana</p>
            </div>
            <div className={styles.web3Card}>
              <GameModel type="trophy" size="medium" />
              <h3>Tournaments</h3>
              <p>Compete in daily tournaments and win prizes using Solana</p>
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
            <Link to="/" className={styles.ctaBtn}>
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

