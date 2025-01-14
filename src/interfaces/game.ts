export interface Game {
  game_id: number;
  title: string;
  description: string | null;
  release_date: Date | null;
  developer: string | null;
  publisher: string | null;
  price: number;
  platform: string | null;
  genre: string | null;
  image_url: string;
  bg_image: string;
  take_a_look: boolean | null;
}
