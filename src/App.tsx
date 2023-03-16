import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Card from "./component/Card";
import "./App.css";

import { ICard } from "./types";
import { getCard, getDeckId } from "./helpers";

const App = () => {
  const [deckId, setDeckId] = useState<string>("");
  const [currentCard, setCurrentCard] = useState<ICard | null>(null);
  const [prevCard, setPrevCard] = useState<ICard | null>(null);
  const [valueMatches, setValueMatches] = useState(0);
  const [suitMatches, setSuitMatches] = useState(0);
  const [cardsRemaining, setCardsRemaining] = useState(52);
  const [probability, setProbability] = useState<{
    value: number;
    suit: number;
  }>({
    value: 0,
    suit: 0,
  });
  const [drawnCards, setDrawnCards] = useState<ICard[]>([]);
  const [snapMessage, setSnapMessage] = useState<string>("");

  useEffect(() => {
    getDeckId().then((deck) => {
      setDeckId(deck.deck_id);
    });
  }, []);

  const drawCard = async () => {
    if (cardsRemaining === 0) {
      return;
    }

    getCard(deckId).then((data) => {
      const newCard: ICard = {
        code: data.cards[0].code,
        image: data.cards[0].image,
        images: data.cards[0].images,
        value: data.cards[0].value,
        suit: data.cards[0].suit,
      };
      setCardsRemaining(data.remaining);
      if (currentCard) {
        if (currentCard.value === newCard.value) {
          setValueMatches((prevValueMatches) => prevValueMatches + 1);
          setSnapMessage("Snap Value!");
        } else if (currentCard.suit === newCard.suit) {
          setSuitMatches((prevSuitMatches) => prevSuitMatches + 1);
          setSnapMessage("Snap Suit!");
        } else {
          setSnapMessage("");
        }
      }
      setPrevCard(currentCard);
      setCurrentCard(newCard);
      setDrawnCards([...drawnCards, newCard]);
    });
    setProbability({
      value: cardsRemaining > 50 ? 0 : valueMatches / (52 - cardsRemaining),
      suit: cardsRemaining > 50 ? 0 : suitMatches / (52 - cardsRemaining),
    });
  };

  return (
    <>
      <Helmet>
        <title>Snap Card</title>
        <meta name="description" content="This is my page description" />
        {/* Add more meta tags here if needed */}
      </Helmet>

      <div className="deck-container">
        <span className="snap-message">{snapMessage}</span>
        <div className="card-slots">
          <div className="card-slot left">
            {prevCard ? (
              <Card card={prevCard} />
            ) : (
              <div className="empty-slot"></div>
            )}
          </div>
          <div className="card-slot right">
            {currentCard ? (
              <Card card={currentCard} />
            ) : (
              <div className="empty-slot"></div>
            )}
          </div>
        </div>
        {cardsRemaining > 0 && (
          <React.Fragment>
            <button className="draw-button" onClick={drawCard}>
              Draw Card
            </button>
            <div className="stats-message">
              <span>Cards Remaining: {cardsRemaining}</span>
              <span>
                Probability of Value Match: {probability.value.toFixed(2)}
              </span>
              <span>
                Probability of Suit Match: {probability.suit.toFixed(2)}
              </span>
            </div>
          </React.Fragment>
        )}

        {cardsRemaining === 0 && (
          <div className="matching">
            <span>Total Value Matches: {valueMatches}</span>
            <span>Total Suit Matches: {suitMatches}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
