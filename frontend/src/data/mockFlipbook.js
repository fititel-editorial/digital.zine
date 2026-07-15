export const MOCK_FLIPBOOK_DATA = {
  24: {
    vol: 24,
    title: "Dados que Contam Histórias",
    pages: [
      { id: 1, type: "cover", image: "/images/revista-2025.png", num: null },
      {
        id: 2,
        type: "content",
        image: "https://placehold.co/800x1131/FFFFFF/333333?text=P%C3%A1gina+2",
        num: 2,
      },
      {
        id: 3,
        type: "content",
        image: "https://placehold.co/800x1131/FFFFFF/333333?text=P%C3%A1gina+3",
        num: 3,
      },
      {
        id: 4,
        type: "content",
        image: "https://placehold.co/800x1131/FFFFFF/333333?text=P%C3%A1gina+4",
        num: 4,
      },
      {
        id: 5,
        type: "content",
        image: "https://placehold.co/800x1131/FFFFFF/333333?text=P%C3%A1gina+5",
        num: 5,
      },
      {
        id: 6,
        type: "content",
        image: "https://placehold.co/800x1131/FFFFFF/333333?text=P%C3%A1gina+6",
        num: 6,
      },
      {
        id: 7,
        type: "content",
        image: "https://placehold.co/800x1131/FFFFFF/333333?text=P%C3%A1gina+7",
        num: 7,
      },
    ],
    comments: [
      {
        id: 101,
        pageId: 6,
        user: "Ana Costa",
        timeAgo: "há 3 min",
        text: "Adoro este parágrafo de abertura. Parece perfeito para destacar na versão mobile.",
        likes: 12,
        x: 10, // percentage
        y: 20,
      },
      {
        id: 102,
        pageId: 7,
        user: "João Silva",
        timeAgo: "há 18 min",
        text: "Talvez possamos animar este hotspot com um micro-efeito de brilho quando a página carrega.",
        likes: 5,
        x: 50,
        y: 50,
      },
      {
        id: 103,
        pageId: 7,
        user: "Equipa Editorial",
        timeAgo: "ontem",
        text: "Testar uma versão alternativa desta foto com mais contraste nas luzes da cidade.",
        likes: 8,
        x: 60,
        y: 75,
      },
    ],
  },
};
