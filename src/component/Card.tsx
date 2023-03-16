import { ICard } from "../types";

type Props = {
  card: ICard;
};

const Card = ({ card }: Props) => {
  const imageUrl = card.image ? card.image : "/card-back.jpg";
  const altText = card.image ? `${card.value} of ${card.suit}` : "card back";

  return (
    <div className="card">
      <img className="card-image" src={imageUrl} alt={altText} />
    </div>
  );
};

export default Card;
