export interface ICard {
  code: string
  image: string
  images: {
    svg: string
    png: string
  }
  value: string
  suit: string
};

export interface IResponse {
  success: boolean
  deck_id: string
  shuffled: boolean
  remaining: number
}
