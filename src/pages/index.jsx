import React, { useState, useEffect } from 'react';
import './index.css';
import cardBackImg from '../img/backImg/cardBack.jpg';
import { AiFillCheckCircle } from 'react-icons/ai';
import { colors } from './colors';

function importAll(r) {
  return r.keys().map(r);
}

function random(mn, mx) {
  return Math.random() * (mx - mn) + mn;
}

const images = importAll(
  require.context('../img', false, /\.(png|jpe?g|svg)$/)
).slice(0, 8);

const imagesWithCodes = images.map((el, index) => ({
  image: el,
  code: index,
}));

const doggoList = shuffle(imagesWithCodes.concat(imagesWithCodes));

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const isMacth = touchedList =>
  touchedList[0].code === touchedList[1].code &&
  touchedList[0].index !== touchedList[1].index;

const Timer = ({ count, setCount, endGame }) => {
  useEffect(() => {
    if (!endGame) {
      setTimeout(() => {
        setCount(count + 1000);
      }, 1000);
    }
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

export const Game = () => {
  const [touched, setTouched] = useState([]);
  const [list, setList] = useState(doggoList);
  const [matchedDoggos, setMatchedDoggos] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [color, setColor] = useState('white');
  const [check, setCheck] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [count, setCount] = useState(0);

  const handleGameStart = () => {
    setMatchedDoggos([]);
    setTouched([]);
    setOpenBackdrop(false);
    setEndGame(false);
    setCount(0);
    setList(shuffle(doggoList));
  };

  const handleSelect = ({ index, code }) => {
    const _touched = [...touched, { index, code }];
    if (_touched.length > 2) {
      setTouched([{ index, code }]);
    } else {
      setTouched(_touched);
    }
  };

  useEffect(() => {
    if (touched.length === 2) {
      if (isMacth(touched)) {
        setCheck(true);
        setMatchedDoggos([...matchedDoggos, touched].flat());
      }
    }
  }, [touched]);

  useEffect(() => {
    if (check) {
      setTimeout(() => setCheck(false), 800);
    }
  }, [check]);

  useEffect(() => {
    setColor(colors[Math.floor(random(1, colors.length)) - 1]);
    if (matchedDoggos.length === 16) {
      setEndGame(true);
    }
  }, [matchedDoggos]);

  useEffect(() => {
    if (endGame) {
      setOpenBackdrop(true);
    }
  }, [endGame]);

  return (
    <>
      <Backdrop
        open={openBackdrop}
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
          <span style={{ color: color }}>
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
      <div className="cardsGrid">
        {list.map((image, index) => (
          <div
            onClick={() => handleSelect({ index: index, code: image.code })}
            className="card"
            style={
              touched.filter(el => el.index === index).length ||
              matchedDoggos.filter(el => el.index === index).length
                ? {
                    backgroundImage: `url(${image.image})`,
                    borderColor: matchedDoggos.filter(el => el.index === index)
                      .length
                      ? 'gold'
                      : 'white',
                  }
                : { backgroundImage: `url(${cardBackImg})` }
            }
          ></div>
        ))}
      </div>
    </>
  );
};
