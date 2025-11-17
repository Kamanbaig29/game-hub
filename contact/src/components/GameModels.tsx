// src/components/GameModels.tsx
import { useState, useEffect } from 'react';
import styles from '../assets/gameModels.module.css';

interface GameModelProps {
  type: 'controller' | 'dice' | 'coin' | 'trophy' | 'joystick' | 'headset' | 'keyboard' | 'mouse' | 'solana' | 'wallet' | 'nft' | 'blockchain' | 'crypto' | 'web3' | 'token' | 'gamepad';
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  className?: string;
}

export default function GameModel({ type, size = 'medium', interactive = true, className }: GameModelProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setRotation(prev => ({
          x: prev.x + 1,
          y: prev.y + 2
        }));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 5;
    const rotateY = (e.clientX - centerX) / 5;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const renderModel = () => {
    switch (type) {
      case 'controller':
        return (
          <div className={styles.controller}>
            <div className={styles.controllerBody}>
              <div className={styles.dpad}>
                <div className={styles.dpadBtn}></div>
                <div className={styles.dpadBtn}></div>
                <div className={styles.dpadBtn}></div>
                <div className={styles.dpadBtn}></div>
              </div>
              <div className={styles.buttons}>
                <div className={`${styles.actionBtn} ${styles.btnA}`}></div>
                <div className={`${styles.actionBtn} ${styles.btnB}`}></div>
                <div className={`${styles.actionBtn} ${styles.btnX}`}></div>
                <div className={`${styles.actionBtn} ${styles.btnY}`}></div>
              </div>
              <div className={styles.sticks}>
                <div className={styles.stick}></div>
                <div className={styles.stick}></div>
              </div>
            </div>
          </div>
        );
      
      case 'dice':
        return (
          <div className={styles.dice}>
            <div className={styles.diceFace} data-face="1">
              <div className={styles.dot}></div>
            </div>
            <div className={styles.diceFace} data-face="2">
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <div className={styles.diceFace} data-face="3">
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <div className={styles.diceFace} data-face="4">
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <div className={styles.diceFace} data-face="5">
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <div className={styles.diceFace} data-face="6">
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
        );
      
      case 'coin':
        return (
          <div className={styles.coin}>
            <div className={styles.coinSide} data-side="heads">
              <div className={styles.coinSymbol}>★</div>
            </div>
            <div className={styles.coinSide} data-side="tails">
              <div className={styles.coinSymbol}>♦</div>
            </div>
          </div>
        );
      
      case 'trophy':
        return (
          <div className={styles.trophy}>
            <div className={styles.trophyCup}></div>
            <div className={styles.trophyBase}></div>
            <div className={styles.trophyHandles}>
              <div className={styles.handle}></div>
              <div className={styles.handle}></div>
            </div>
          </div>
        );
      
      case 'joystick':
        return (
          <div className={styles.joystick}>
            <div className={styles.joystickBase}></div>
            <div className={styles.joystickStick}>
              <div className={styles.joystickBall}></div>
            </div>
          </div>
        );
      
      case 'headset':
        return (
          <div className={styles.headset}>
            <div className={styles.headband}></div>
            <div className={styles.earCups}>
              <div className={styles.earCup}></div>
              <div className={styles.earCup}></div>
            </div>
            <div className={styles.microphone}></div>
          </div>
        );
      
      case 'keyboard':
        return (
          <div className={styles.keyboard}>
            <div className={styles.keyboardBody}>
              {Array.from({length: 12}, (_, i) => (
                <div key={i} className={styles.key}></div>
              ))}
            </div>
          </div>
        );
      
      case 'mouse':
        return (
          <div className={styles.mouse}>
            <div className={styles.mouseBody}></div>
            <div className={styles.mouseButtons}>
              <div className={styles.mouseBtn}></div>
              <div className={styles.mouseBtn}></div>
            </div>
            <div className={styles.scrollWheel}></div>
          </div>
        );
      
      case 'solana':
        return (
          <div className={styles.solana}>
            <div className={styles.solanaLogo}>
              <div className={styles.solanaGradient}></div>
              <div className={styles.solanaSymbol}>◉</div>
            </div>
            <div className={styles.solanaRings}>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
            </div>
          </div>
        );
      
      case 'wallet':
        return (
          <div className={styles.wallet}>
            <div className={styles.walletBody}>
              <div className={styles.walletScreen}>
                <div className={styles.walletBalance}>SOL</div>
                <div className={styles.walletAmount}>12.45</div>
              </div>
              <div className={styles.walletButtons}>
                <div className={styles.walletBtn}></div>
                <div className={styles.walletBtn}></div>
              </div>
            </div>
          </div>
        );
      
      case 'nft':
        return (
          <div className={styles.nft}>
            <div className={styles.nftFrame}>
              <div className={styles.nftImage}>
                <div className={styles.nftPixel}></div>
                <div className={styles.nftPixel}></div>
                <div className={styles.nftPixel}></div>
                <div className={styles.nftPixel}></div>
              </div>
              <div className={styles.nftLabel}>#001</div>
            </div>
          </div>
        );
      
      case 'blockchain':
        return (
          <div className={styles.blockchain}>
            <div className={styles.blockchainChain}>
              <div className={styles.block}></div>
              <div className={styles.connector}></div>
              <div className={styles.block}></div>
              <div className={styles.connector}></div>
              <div className={styles.block}></div>
            </div>
          </div>
        );
      
      case 'crypto':
        return (
          <div className={styles.crypto}>
            <div className={styles.cryptoCoin}>
              <div className={styles.cryptoSymbol}>₿</div>
            </div>
            <div className={styles.cryptoGlow}></div>
          </div>
        );
      
      case 'web3':
        return (
          <div className={styles.web3}>
            <div className={styles.web3Cube}>
              <div className={styles.cubeFace}></div>
              <div className={styles.cubeFace}></div>
              <div className={styles.cubeFace}></div>
              <div className={styles.cubeFace}></div>
              <div className={styles.cubeFace}></div>
              <div className={styles.cubeFace}></div>
            </div>
            <div className={styles.web3Particles}>
              <div className={styles.particle}></div>
              <div className={styles.particle}></div>
              <div className={styles.particle}></div>
            </div>
          </div>
        );
      
      case 'token':
        return (
          <div className={styles.token}>
            <div className={styles.tokenBody}>
              <div className={styles.tokenSymbol}>T</div>
              <div className={styles.tokenValue}>100</div>
            </div>
            <div className={styles.tokenGlow}></div>
          </div>
        );
      
      case 'gamepad':
        return (
          <div className={styles.gamepad}>
            <div className={styles.gamepadBody}>
              <div className={styles.gamepadScreen}>
                <div className={styles.gamepadPixels}>
                  <div className={styles.pixel}></div>
                  <div className={styles.pixel}></div>
                  <div className={styles.pixel}></div>
                </div>
              </div>
              <div className={styles.gamepadControls}>
                <div className={styles.gamepadBtn}></div>
                <div className={styles.gamepadBtn}></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={`${styles.modelContainer} ${styles[size]} ${interactive ? styles.interactive : ''} ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
      }}
    >
      {renderModel()}
    </div>
  );
}