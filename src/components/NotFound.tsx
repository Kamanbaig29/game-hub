// src/components/NotFound.tsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import GameModels from './GameModels';
import styles from '../assets/about.module.css';
import notFoundStyles from '../assets/notFound.module.css';

export default function NotFound() {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const wordsearchRef = useRef<HTMLDivElement>(null);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // Set up square dimensions
    const updateDimensions = () => {
      if (liRefs.current[0]) {
        const liWidth = window.getComputedStyle(liRefs.current[0]).width;
        liRefs.current.forEach(li => {
          if (li) {
            li.style.height = liWidth;
            li.style.lineHeight = liWidth;
          }
        });
      }
      if (wordsearchRef.current) {
        const totalHeight = window.getComputedStyle(wordsearchRef.current).width;
        wordsearchRef.current.style.height = totalHeight;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Animation sequence
    const classes = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex < classes.length) {
        const delay = currentIndex === 0 ? 1500 : 500;
        setTimeout(() => {
          setSelectedClasses(prev => [...prev, classes[currentIndex]]);
          currentIndex++;
          if (currentIndex < classes.length) {
            animate();
          }
        }, delay);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const letters = [
    'k', 'v', 'n', 'z', 'i', 'x', 'm', 'e', 't', 'a', 'x', 'l',
    { class: 'one', letter: '4' },
    { class: 'two', letter: '0' },
    { class: 'three', letter: '4' },
    'y', 'y', 'w', 'v', 'b', 'o', 'q', 'd', 'y', 'p', 'a',
    { class: 'four', letter: 'p' },
    { class: 'five', letter: 'a' },
    { class: 'six', letter: 'g' },
    { class: 'seven', letter: 'e' },
    'v', 'j', 'a',
    { class: 'eight', letter: 'n' },
    { class: 'nine', letter: 'o' },
    { class: 'ten', letter: 't' },
    's', 'c', 'e', 'w', 'v', 'x', 'e', 'p', 'c', 'f', 'h', 'q', 'e',
    { class: 'eleven', letter: 'f' },
    { class: 'twelve', letter: 'o' },
    { class: 'thirteen', letter: 'u' },
    { class: 'fourteen', letter: 'n' },
    { class: 'fifteen', letter: 'd' },
    's', 'w', 'q', 'v', 'o', 's', 'm', 'v', 'f', 'u'
  ];

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

      <div className={notFoundStyles.wrap}>
        <div ref={wordsearchRef} className={notFoundStyles.wordsearch}>
          <ul>
            {letters.map((item, index) => {
              const isObject = typeof item === 'object';
              const letter = isObject ? item.letter : item;
              const className = isObject ? item.class : '';
              const isSelected = selectedClasses.includes(className);

              return (
                <li
                  key={index}
                  ref={el => { liRefs.current[index] = el; }}
                  className={`${className} ${isSelected ? notFoundStyles.selected : ''}`}
                >
                  {letter}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={notFoundStyles.mainContent}>
          <h1>We couldn't find what you were looking for.</h1>
          <p>
            Unfortunately the page you were looking for could not be found. It may be
            temporarily unavailable, moved or no longer exist.
          </p>
          <p>
            Check the URL you entered for any mistakes and try again. Alternatively, search
            for whatever is missing or take a look around the rest of our site.
          </p>

          <div className={notFoundStyles.navigation}>
            <Link to="/" className={notFoundStyles.navLink}>Home</Link>
            <Link to="/about" className={notFoundStyles.navLink}>About Us</Link>
            <Link to="/arena" className={notFoundStyles.navLink}>Arena</Link>
            <Link to="/privacy" className={notFoundStyles.navLink}>Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
