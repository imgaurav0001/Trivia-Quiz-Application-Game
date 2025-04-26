import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
// import { useLocation } from 'react-router-dom';
interface allPlayersType {
  name: string;
  roomId: number;
  role: string;
  id: string;
  category?: string;
  question?: number;
}
interface LobbyProps {
  allPlayer: allPlayersType[];
  socket: Socket | null;
  host: boolean;
}
export default function Lobby({ allPlayer, socket, host }: LobbyProps) {
  const [allPlayers, setAllPlayers] = useState<allPlayersType[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<{
    id: string | null;
    roomId: number | null;
  }>({ id: null, roomId: null });

  function onDelete() {
    console.log(selectedPlayer);
    if (socket) {
      console.log("inside socket");
      socket.emit("delete_players", selectedPlayer);
    }
  }

  // Update allPlayers when location.state changes
  useEffect(() => {
    if (allPlayer) {
      setAllPlayers(allPlayer);
    }
    console.log(allPlayers.length);
    console.log("allPlayers", allPlayers);
    console.log("host:", host);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPlayer]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-5 rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-200 mb-4">
        Player Lobby
      </h2>
      <ul className="space-y-3">
        {allPlayers.length > 0 ? (
          allPlayers.map((player, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-3 rounded-md shadow-md text-white transition-colors border border-gray-500 border-opacity-5 hover:border-opacity-100 hover:border-gray-400 duration-300 hover:cursor-pointer"
              onClick={() =>
                host &&
                setSelectedPlayer({ id: player.id, roomId: player.roomId })
              }
            >
              <div className="flex flex-col w-full">
                <div className="flex justify-between w-full">
                  <span className="font-semibold">{player.name}</span>
                  <span className="text-sm text-gray-300">{player.role}</span>
                </div>
                {host &&
                  selectedPlayer.id === player.id &&
                  player.role !== "Host" && (
                    <button
                      className="w-2/5 md:w-1/6 mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md self-end"
                      onClick={onDelete}
                    >
                      remove
                    </button>
                  )}
              </div>
            </li>
          ))
        ) : (
          <div className="text-center text-gray-400">
            No player is connected
          </div>
        )}
      </ul>
    </div>
  );
}
