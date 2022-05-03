// import React, { useState } from "react";
// import './Deck.css';



// function Deck(){
//     const [deck, setDeck] = useState(null);
//     const [drawn, setDrawn] = useState([]);

//     let deckData = await $.getJSON(`${baseURL}/new/shuffle/`);
//     $btn.show().on('click', async function() {
//       let cardData = await $.getJSON(`${baseURL}/${deckData.deck_id}/draw/`);
//       let image = cardData.cards[0].image;

//       if (cardData.remaining === 0) $btn.remove();
//     });
// }

import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const baseURL = 'https://deckofcardsapi.com/api/deck';
/** GitHub Profile Component --- shows info from GH API */

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);

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
  async function fetchCard() {
    let { deck_id } = deck;
    try{
        let cardData = await axios.get(`${baseURL}/${deck_id}/draw/`);

        if (cardData.data.remaining === 0){
            throw new Error("no cards remaining!");
        }

        let card = cardData.data.cards[0];

        // d signifies "drawn"
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
  // useEffect(() => {
  //   async function fetchCard() {
  //       try{
  //           let cardData = await axios.get(
  //               `${baseURL}/${deck.deck_id}/draw/`);
  //           if (cardData.data.remaining === 0){
  //               throw new Error("no cards remaining!");
  //           }
  //           let card = cardData.data.cards[0];

  //           setDrawn(d => [
  //           ...d,
  //           {
  //               id: card.code,
  //               name: card.suit + " " + card.value,
  //               image: card.image
  //           }
  //           ]);
  //       } catch(err){
  //           alert(err);
  //       }

  //   }
  //   fetchCard();
  // }, [deck]);

  const cards = drawn.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">

        <button className="Deck-button" onClick={fetchCard}>GIMME A CARD!</button>
        <div className="Deck-cardarea">
            {cards}
        </div>
    </div>
  );
};

export default Deck