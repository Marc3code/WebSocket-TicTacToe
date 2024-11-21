const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

let players = [];
let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];
let currentPlayer = 'X'; // O jogador 'X' começa

io.on('connection', (socket) => {
    console.log('Novo jogador conectado:', socket.id);

    if (players.length < 2) {
        players.push({ id: socket.id, symbol: players.length === 0 ? 'X' : 'O' });

        // Envia para o jogador qual símbolo ele será
        socket.emit('playerInfo', { symbol: players[players.length - 1].symbol });

        // Inicia o jogo quando dois jogadores se conectarem
        if (players.length === 2) {
            io.emit('startGame', {
                message: 'Jogo iniciado! Jogador X começa.',
                currentPlayer,
                board,
            });
        }
    } else {
        socket.emit('gameFull', 'O jogo já está cheio.');
    }

    // Evento de jogada
    socket.on('makeMove', ({ row, col }) => {
        const player = players.find((p) => p.id === socket.id);

        if (!player || player.symbol !== currentPlayer) {
            return; // Bloqueia jogadas de jogadores não autorizados
        }

        if (board[row][col] === null) {
            board[row][col] = player.symbol;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Alterna o turno

            // Envia o estado atualizado do tabuleiro para todos os clientes
            io.emit('moveMade', { board, currentPlayer });

            // Verifica vencedor
            const winner = checkWinner(board);
            if (winner) {
                io.emit('gameOver', `Jogador ${winner} venceu!`);
                resetGame();
            } else if (isBoardFull()) {
                io.emit('gameOver', 'Empate!');
                resetGame();
            }
        }
    });

    // Quando um jogador desconectar
    socket.on('disconnect', () => {
        console.log('Jogador desconectado:', socket.id);
        players = players.filter((p) => p.id !== socket.id);
        io.emit('playerLeft', 'Um jogador saiu. O jogo foi reiniciado.');
        resetGame();
    });
});

// Função para verificar se há um vencedor
function checkWinner(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];
    return null;
}

// Função para verificar se o tabuleiro está cheio
function isBoardFull() {
    return board.every((row) => row.every((cell) => cell !== null));
}

// Função para reiniciar o jogo
function resetGame() {
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];
    currentPlayer = 'X';
    players = [];
}

// Iniciar o servidor
server.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});
