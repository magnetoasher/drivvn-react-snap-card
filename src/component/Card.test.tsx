import { render } from "@testing-library/react";
import Card from "./Card";

const cardData = {
  code: "2C",
  image: "https://deckofcardsapi.com/static/img/2C.png",
  images: {
    svg: "https://deckofcardsapi.com/static/img/2C.svg",
    png: "https://deckofcardsapi.com/static/img/2C.png",
  },
  value: "2",
  suit: "CLUBS",
};

describe("Card component", () => {
  it("renders the card with the correct image and alt text", () => {
    const { getByRole } = render(<Card card={cardData} />);

    const cardImage = getByRole("img");
    expect(cardImage).toHaveAttribute("src", cardData.image);
    expect(cardImage).toHaveAttribute(
      "alt",
      `${cardData.value} of ${cardData.suit}`
    );
  });
});
