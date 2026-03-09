import React, { useState, useEffect } from 'react';
import './index.css';
import cardBackImg from '../img/backImg/cardBack.jpg';
import { AiFillCheckCircle } from 'react-icons/ai';
import { colors } from './colors';

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context('../img', false, /\.(png|jpe?g|svg)$/)
).slice(0, 8);

// Prefetch all card images into browser cache
images.forEach(src => {
  new Image().src = src;
});

const imagesWithCodes = images.map((el, index) => ({
  image: el,
  code: index,
}));

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const isMatch = touchedList =>
  touchedList[0].code === touchedList[1].code &&
  touchedList[0].index !== touchedList[1].index;

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Timer = ({ count, setCount, endGame }) => {
  useEffect(() => {
    if (endGame) return;
    const id = setTimeout(() => setCount(count + 1000), 1000);
    return () => clearTimeout(id);
  }, [count, endGame]);

  return <>{count / 1000}s</>;
};

const Backdrop = ({ open, count, handleGameStart }) =>
  open ? (
    <div className="backdrop">
      <div className="endgame">
        <h1>FIM DE JOGO</h1>
        <h2>Seu tempo foi:</h2>
        <h1>{count / 1000} segundos</h1>
        <button onClick={handleGameStart}>Jogar Novamente</button>
      </div>
    </div>
  ) : null;

const createDeck = () => shuffle(imagesWithCodes.concat(imagesWithCodes));

export const Game = () => {
  const [touched, setTouched] = useState([]);
  const [list, setList] = useState(createDeck);
  const [matchedDoggos, setMatchedDoggos] = useState([]);
  const [color, setColor] = useState('white');
  const [check, setCheck] = useState(false);
  const [count, setCount] = useState(0);
  const [gameId, setGameId] = useState(0);

  const endGame = matchedDoggos.length === 16;

  const handleGameStart = () => {
    setMatchedDoggos([]);
    setTouched([]);
    setCount(0);
    setList(createDeck());
    setGameId(prev => prev + 1);
  };

  const isAlreadyMatched = index =>
    matchedDoggos.some(el => el.index === index);

  const handleSelect = ({ index, code }) => {
    if (isAlreadyMatched(index)) return;

    const _touched = [...touched, { index, code }];
    if (_touched.length > 2) {
      setTouched([{ index, code }]);
    } else {
      setTouched(_touched);
    }
  };

  useEffect(() => {
    if (touched.length === 2) {
      if (isMatch(touched)) {
        setCheck(true);
        setMatchedDoggos([...matchedDoggos, ...touched]);
      }
    }
  }, [touched]);

  useEffect(() => {
    if (!check) return;
    const id = setTimeout(() => setCheck(false), 800);
    return () => clearTimeout(id);
  }, [check]);

  useEffect(() => {
    setColor(randomColor());
  }, [matchedDoggos]);

  return (
    <>
      <Backdrop
        open={endGame}
        count={count}
        handleGameStart={handleGameStart}
      />
      {check ? (
        <div className="check">
          <AiFillCheckCircle size={75} />
        </div>
      ) : null}
      <div className="header">
        <h1>
          Acertos:{' '}
          <span style={{ color }}>
            {matchedDoggos.length ? matchedDoggos.length / 2 : 0}/8
          </span>
        </h1>
        <h1>
          Tempo:{' '}
          <strong>
            <Timer count={count} setCount={setCount} endGame={endGame} />
          </strong>
        </h1>
      </div>
      <div className="cardsGrid" key={gameId}>
        {list.map((image, index) => {
          const isTouched = touched.some(el => el.index === index);
          const isMatched = isAlreadyMatched(index);
          const isFlipped = isTouched || isMatched;
          return (
            <div
              key={index}
              onClick={() => handleSelect({ index: index, code: image.code })}
              className="card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`card-inner${isFlipped ? ' flipped' : ''}${isMatched ? ' matched' : ''}`}>
                <div className="card-front" style={{ backgroundImage: `url(${cardBackImg})` }}></div>
                <div className="card-back" style={{ backgroundImage: `url(${image.image})` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
