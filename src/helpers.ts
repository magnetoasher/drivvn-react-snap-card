import { IResponse, ICard } from "./types"

interface IData extends IResponse {
  cards: ICard[]
};

export async function getDeckId(): Promise<IResponse>  {
  const response = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  );

  return response.json();
};

export async function getCard(deckId: string): Promise<IData> {
  const data = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
  );

  return data.json();
};
