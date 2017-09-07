function checkIfWon(arr) {
  const winners = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9],  // horizontal
    [1, 4, 7], [2, 5, 8], [3, 6, 9],  // vertical
    [1, 5, 9], [7, 5, 3]  // diagonal
  ]
  return winners.some(winner => winner.every(pos => arr.includes(pos)))
}

function getNextRandomMove(crosses = [], noughts = []) {
  const all = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const taken = Array.from(new Set([...crosses, ...noughts]))
  const available = all.filter(pos => !taken.includes(pos))
  return available[Math.floor(Math.random()*available.length)]
}

export function emptyGame() {
  return {crosses: [], noughts: []}
}

export function runGame(currentGame, command) {
  const {crosses, noughts} = currentGame
  
  if (command === 'reset') return emptyGame()
  if (currentGame.winner) return currentGame // do not update finished game
  if (noughts.includes(command)) return currentGame // prevent x and o in same position
      
  // crosses wins  
  if (checkIfWon([...crosses, command])) {
    return {
      crosses: [...crosses, command],
      noughts,
      winner: 'Crosses'
    }
  }
  
  // computer plays with noughts
  const nextNought = getNextRandomMove([...crosses, command], noughts)

  // ran out of available positions --> draw
  if (nextNought === undefined) {
    return {
      ...currentGame, 
      crosses: [...crosses, command], 
      winner: 'Neither'
    }
  }
  
  // noughts wins
  if (checkIfWon([...noughts, nextNought])) {
    return {
      crosses: [...crosses, command],
      noughts: [...noughts, nextNought],
      winner: 'Noughts'
    }
  }
  
  // update game --> game continues
  return {
    crosses: [...crosses, command],
    noughts: [...noughts, nextNought]
  }
}
