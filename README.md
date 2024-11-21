# WebSocket-TicTacToe

Um jogo da velha multiplayer em tempo real, desenvolvido com **Node.js**, **Socket.IO** e **React**.  

## 🚀 Funcionalidades  
- Multiplayer em tempo real para 2 jogadores.  
- Atribuição automática de símbolo (`X` ou `O`).  
- Atualização dinâmica do tabuleiro após cada jogada.  
- Detecção de vencedor ou empate.  
- Reinício do jogo quando necessário.  

## 📦 Tecnologias Utilizadas  
- **Node.js**: Backend para gerenciar a lógica do jogo.  
- **Socket.IO**: Comunicação em tempo real entre os jogadores e o servidor.  
- **React**: Frontend para exibir o jogo e interagir com o jogador. 

## 📖 Como Funciona  
### Conexão:  
- O jogador se conecta ao servidor e recebe um símbolo (`X` ou `O`).  

### Início do Jogo:  
- Assim que dois jogadores se conectam, o jogo começa. O jogador `X` sempre inicia.  

### Jogadas:  
- Cada jogador faz uma jogada alternadamente clicando no tabuleiro.  

### Detecção de Vencedor:  
- O servidor verifica após cada jogada se há um vencedor ou empate.  

## 🖼 Interface do Jogo  
O tabuleiro é renderizado com botões clicáveis representando as células. Cada botão:  
- Tem tamanho ajustado para facilitar a interação.  
- Mostra o símbolo (`X` ou `O`) do jogador que ocupou a célula.  

## 🛠 Eventos Socket.IO  

### Servidor para Cliente:  
- **`playerInfo`**: Informa ao jogador qual é o seu símbolo.  
- **`startGame`**: Inicia o jogo e compartilha o estado inicial.  
- **`moveMade`**: Atualiza o tabuleiro após cada jogada.  
- **`gameOver`**: Envia a mensagem de fim de jogo (vencedor ou empate).  
- **`playerLeft`**: Reinicia o jogo caso um jogador saia.  
- **`gameFull`**: Notifica que o jogo está cheio.  

### Cliente para Servidor:  
- **`makeMove`**: Envia a jogada do jogador com as coordenadas (`row`, `col`).