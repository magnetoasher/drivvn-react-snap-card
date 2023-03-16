import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("Snap card", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          deck_id: "deck123",
          remaining: 51,
          cards: [
            {
              code: "AS",
              image: "https://deckofcardsapi.com/static/img/AS.png",
              value: "ACE",
              suit: "SPADES",
            },
          ],
        }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", async () => {
    render(<App />);

    const drawButton = screen.getByText("Draw Card");
    expect(drawButton).toBeInTheDocument();

    const cardsRemaining = await screen.findByText("Cards Remaining: 52");
    expect(cardsRemaining).toBeInTheDocument();
  });

  it("draws a card and updates the state", async () => {
    render(<App />);
    const drawButton = screen.getByText("Draw Card");
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          deck_id: "deck123",
          remaining: 51,
          cards: [
            {
              code: "AS",
              image: "https://deckofcardsapi.com/static/img/AS.png",
              value: "ACE",
              suit: "SPADES",
            },
          ],
        }),
    });

    fireEvent.click(drawButton);
    expect(mockFetch).toHaveBeenCalled();

    await waitFor(() => screen.getByText("Cards Remaining: 51"));

    const cardsRemaining = await screen.findByText("Cards Remaining: 51");
    expect(cardsRemaining).toBeInTheDocument();

    const probabilityValue = screen.getByText(
      "Probability of Value Match: 0.00"
    );
    expect(probabilityValue).toBeInTheDocument();
  });

  it("shows the correct snap message", async () => {
    render(<App />);
    const mockResponse1 = {
      deck_id: "deck123",
      remaining: 51,
      cards: [
        {
          code: "AH",
          image: "https://deckofcardsapi.com/static/img/AH.png",
          value: "ACE",
          suit: "HEARTS",
        },
      ],
    };
    const mockResponse2 = {
      deck_id: "deck123",
      remaining: 50,
      cards: [
        {
          code: "AS",
          image: "https://deckofcardsapi.com/static/img/AS.png",
          value: "ACE",
          suit: "SPADES",
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse1),
    });
    const drawButton = screen.getByText("Draw Card");
    fireEvent.click(drawButton);
    await waitFor(() => {
      screen.getByAltText("ACE of HEARTS");
    });

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse2),
    });
    fireEvent.click(drawButton);
    await waitFor(() => {
      screen.getByAltText("ACE of SPADES");
    });

    const snapMessage = await screen.findByText("Snap Value!");
    expect(snapMessage).toBeInTheDocument();
  });

  it("shows the correct statistics message", async () => {
    render(<App />);

    const drawButton = screen.getByText("Draw Card");
    fireEvent.click(drawButton);

    const probabilityValue = await screen.findByText(
      "Probability of Value Match: 0.00"
    );
    expect(probabilityValue).toBeInTheDocument();

    const probabilitySuit = screen.getByText("Probability of Suit Match: 0.00");
    expect(probabilitySuit).toBeInTheDocument();
  });

  it("shows the matching results when there are no cards remaining", async () => {
    render(<App />);

    const drawButton = screen.getByText("Draw Card");

    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          deck_id: "deck123",
          remaining: 0,
          cards: [
            {
              code: "AS",
              image: "https://deckofcardsapi.com/static/img/AS.png",
              value: "ACE",
              suit: "SPADES",
            },
          ],
        }),
    });

    fireEvent.click(drawButton);
    expect(mockFetch).toHaveBeenCalled();

    await waitFor(() => screen.getByText("Total Suit Matches: 0"));

    const matchingResults = await screen.findByText("Total Suit Matches: 0");
    expect(matchingResults).toBeInTheDocument();
  });
});
