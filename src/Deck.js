import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";
// import TimerWithRef from "../../react-effects-refs-demo/refs-app/src/TimerWithRef";

const baseURL = 'https://deckofcardsapi.com/api/deck';
/** GitHub Profile Component --- shows info from GH API */

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);

  const timerRef = useRef();
  const [autoDraw, setAutoDraw] = useState(false);
  // let [count, setCount] = useState(0);

  // this is called *after* component first added to DOM
//   getting deck information
  useEffect(() => {
    async function fetchDeck() {
        let deck = await axios.get(`${baseURL}/new/shuffle/`);
        setDeck(deck.data);
    }
    fetchDeck();
  }, [setDeck]);

//   get information from deck to draw card
  // async function fetchCard() {
  //   let { deck_id } = deck;
  //   try{
  //       let cardData = await axios.get(`${baseURL}/${deck_id}/draw/`);

  //       if (cardData.data.remaining === 0){
  //           throw new Error("no cards remaining!");
  //       }

  //       let card = cardData.data.cards[0];

  //       // d signifies "drawn"
  //       setDrawn(d => [
  //       ...d,
  //       {
  //           id: card.code,
  //           name: card.suit + " " + card.value,
  //           image: card.image
  //       }
  //       ]);
  //   } catch(err){
  //       alert(err);
  //   }

  // }
  useEffect(() => {
    async function fetchCard() {
        try{
            let cardData = await axios.get(
                `${baseURL}/${deck.deck_id}/draw/`);
            if (cardData.data.remaining === 0){
                setAutoDraw(false);
                throw new Error("no cards remaining!");
            }
            let card = cardData.data.cards[0];

            setDrawn(d => [
            ...d,
            {
                id: card.code,
                name: card.suit + " " + card.value,
                image: card.image
            }
            ]);
        } catch(err){
            alert(err);
        }

    }

    if(autoDraw && !timerRef.current){
      timerRef.current = setInterval(async() => {
        await fetchCard();
      }, 1000);
    }
  
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);

  const toggle = () => {
    setAutoDraw(auto => !auto);
  };

  const cards = drawn.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">
        {deck ? (
          <button className="Deck-button" onClick={toggle}>
            {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
          </button>
        ) : null}

        {/* <button className="Deck-button" onClick={toggle}>GIMME A CARD!</button> */}
        <div className="Deck-cardarea">
            {cards}
        </div>
    </div>
  );
};

export default Deck