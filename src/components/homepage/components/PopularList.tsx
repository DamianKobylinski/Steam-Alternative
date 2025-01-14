import { Game } from "@/interfaces/game";

interface PopularListProps {
  active: Game;
  popular: Game[];
  handlePopular: (game: Game) => void;
}

const PopularList: React.FC<PopularListProps> = ({ active, popular, handlePopular }) => {

  return (
    <ul className="flex justify-center ">
      {popular.map((game) => (
        <li
          key={game.game_id}
          style={{
            boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
          className={`min-w-4 min-h-4 ${
            game.game_id === active.game_id ? "bg-[#3A506B]" : "bg-white"
          }  mr-2 rounded-full cursor-pointer transition-colors duration-700`}
          onClick={() => {handlePopular(game)}}
        ></li>
      ))}
    </ul>
  );
};
export default PopularList;
