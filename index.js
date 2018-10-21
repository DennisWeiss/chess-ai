(() => {

    const chess = new Chess()
    let player = chess.WHITE

    const statusEl = $('#status')

    const switchPlayer = () => {
        player = player === chess.WHITE ? chess.BLACK : chess.WHITE
    }


    // do not pick up pieces if the game is over
    // only pick up pieces for the side to move
    const onDragStart = function (source, piece, position, orientation) {
        if (chess.game_over() === true ||
            (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false
        }
    }

    const onDrop = function (source, target) {
        // see if the move is legal
        const move = chess.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) return 'snapback'

        switchPlayer()
        updateStatus()
        setTimeout(() => {
            doAiMove(chess, board, player)
            updateStatus()
        }, 300)

    }

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    const onSnapEnd = function () {
        board.position(chess.fen())
    }

    const updateStatus = function () {
        let status = ''

        let moveColor = 'White'
        if (chess.turn() === 'b') {
            moveColor = 'Black'
        }

        // checkmate?
        if (chess.in_checkmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.'
        }

        // draw?
        else if (chess.in_draw()) {
            status = 'Game over, drawn position'
        }

        // game still on
        else {
            status = moveColor + ' to move'

            // check?
            if (chess.in_check()) {
                status += ', ' + moveColor + ' is in check'
            }
        }

        statusEl.html(status)
    }

    const chessboardCfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    }


    const doRandomMove = (chess, board, player) => {
        const moves = chess.moves()
        chess.move(moves[Math.floor(moves.length * Math.random())])
        board.position(chess.fen(), true)
    }

    const doAiMove = (chess, board, player) => {
        chess.move(getAiMove(chess, player))
        board.position(chess.fen(), true)
        switchPlayer()
    }

    const board = ChessBoard('board', chessboardCfg)

    updateStatus()

    // document.getElementById('next').onclick = () => {
    //     doAiMove(chess, board, player)
    //     switchPlayer()
    //     updateStatus()
    // }


})()

