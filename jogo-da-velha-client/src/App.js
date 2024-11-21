import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Container } from "./App.css";

const socket = io("http://localhost:3001");

const Game = () => {
  const [board, setBoard] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [playerSymbol, setPlayerSymbol] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("playerInfo", ({ symbol }) => {
      setPlayerSymbol(symbol);
    });

    socket.on("startGame", ({ message, currentPlayer, board }) => {
      setMessage(message);
      setCurrentPlayer(currentPlayer);
      setBoard(board);
    });

    socket.on("moveMade", ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
    });

    socket.on("gameOver", (message) => {
      alert(message);
      setMessage(message);
    });

    socket.on("playerLeft", (message) => {
      alert(message);
      window.location.reload();
    });

    socket.on("gameFull", (message) => {
      alert(message);
    });

    return () => {
      socket.off("playerInfo");
      socket.off("startGame");
      socket.off("moveMade");
      socket.off("gameOver");
      socket.off("playerLeft");
      socket.off("gameFull");
    };
  }, []);

  const handleMove = (row, col) => {
    if (board[row][col] === null && playerSymbol === currentPlayer) {
      socket.emit("makeMove", { row, col });
    }
  };

  const renderCell = (row, col) => (
    <button
      style={{
        width: "100px", // Aumenta a largura
        height: "100px", // Aumenta a altura
        fontSize: "32px", // Texto maior
        border: "2px solid #000", // Borda mais grossa
        borderRadius: "8px", // Bordas arredondadas
      }}
      onClick={() => handleMove(row, col)}
    >
      {board[row][col]}
    </button>
  );

  return (
    <div className="Container">
      <h1>Jogo da Velha</h1>
      <p>{message}</p>
      <div className="grid">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {renderCell(i, j)}
            </div>
          ))
        )}
      </div>

      <p style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0" }}>
        Você é: {playerSymbol}
      </p>
      <p style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0" }}>
        Jogador atual: {currentPlayer}
      </p>
    </div>
  );
};

export default Game;
