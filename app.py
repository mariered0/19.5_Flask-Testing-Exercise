from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret_boggle"
debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

boggle_game = Boggle()


@app.route('/')
def display_board():
    """Display the Boggle board and set up session."""
    # global game_played, best_score
    board = boggle_game.make_board()
    game_played = session.get('game_played', 0)
    best_score = session.get('best_score', 0)
    score = 0
    session['board'] = board
    return render_template('board.html', board=board, game_played=game_played, best_score=best_score, score=score)


@app.route('/check-word')
def check_word():
    """Get post request data and check if it's valid."""
    word = request.args['word']
    board = session.get("board")
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})


@app.route('/get-stats', methods=['POST'])
def get_data():
    """Receive stats data from the front-end (sendStats())."""
    score = request.json['score']
    # updating best_score and game_played
    best_score = session.get('best_score', 0)
    game_played = session.get('game_played', 0)
    session['game_played'] = game_played + 1
    session['best_score'] = max(score, best_score)
    return jsonify({'game_played':game_played })
