const typeToValue = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}



let calls = 0

const evaluate = square => {
    if (square == null) {
        return 0
    }
    return (square.color === 'w' ? 1 : -1) * typeToValue[square.type]

}




const heuristic = chess => {
    let value = 0
    for (let i = 97; i <= 104; i++) {
        for (let j = 1; j <= 8; j++) {
            value += evaluate(chess.get(String.fromCharCode(i) + j))
        }
    }
    return value
}


function maximize(chess, depth, alpha, beta) {
    calls++
    if (chess.in_draw() || chess.in_stalemate()) {
        return {
            move: null,
            value: 0
        }
    }
    if (chess.in_checkmate()) {
        return {
            move: null,
            value: -10000000
        }
    }
    if (depth === 0) {
        return {
            move: null,
            value: heuristic(chess)
        }
    }
    let maxValue = {
        move: null,
        value: -100000000000
    }
    const possibleMoves = shuffle(chess.moves())
    for (let i = 0; i < possibleMoves.length; i++) {
        // const nextStepChess = new Chess(chess.fen())
        // nextStepChess.move(possibleMoves[i])
        chess.move(possibleMoves[i])
        const value = minimize(chess, depth - 1, alpha, beta)
        chess.undo()
        alpha = Math.max(alpha, value.value)
        if (value.value > maxValue.value) {
            maxValue = {
                move: possibleMoves[i],
                value: value.value
            }
        }
        if (value.value >= beta) {
            break
        }
    }
    return maxValue
}

function minimize(chess, depth, alpha, beta) {
    calls++
    if (chess.in_draw() || chess.in_stalemate()) {
        return {
            move: null,
            value: 0
        }
    }
    if (chess.in_checkmate()) {
        return {
            move: null,
            value: 10000000
        }
    }
    if (depth === 0) {
        return {
            move: null,
            value: heuristic(chess)
        }
    }
    let minValue = {
        move: null,
        value: 100000000000
    }
    const possibleMoves = shuffle(chess.moves())
    for (let i = 0; i < possibleMoves.length; i++) {
        // const nextStepChess = new Chess(chess.fen())
        // nextStepChess.move(possibleMoves[i])
        chess.move(possibleMoves[i])
        const value = maximize(chess, depth - 1, alpha, beta)
        chess.undo()
        beta = Math.min(beta, value.value)
        if (value.value < minValue.value) {
            minValue = {
                move: possibleMoves[i],
                value: value.value
            }
        }
        if (value.value <= alpha) {
            break
        }
    }
    return minValue
}

function getAiMove(chess, player) {
    console.log(player)
    let move = null
    if (player === 'w') {
        move = maximize(new Chess(chess.fen()), 3, -1000000000000000, 10000000000000000)
    } else {
        move = minimize(new Chess(chess.fen()), 3, -1000000000000000, 10000000000000000)
    }
    console.log('calls', calls)
    calls = 0
    console.log(move)
    return move.move
}