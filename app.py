from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret_boggle"
debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

boggle_game = Boggle()
game_played = 0
best_score = 0


@app.route('/', methods=['GET'])
def display_board():
    """Display the Boggle board and set up session."""
    global game_played, best_score
    board = boggle_game.make_board()

    # print('exist?', session.get('game_played'))

    if session.get('game_played') == True:
        game_played = session['game_played']
    else:
        session['game_played'] = game_played

    if session.get('best_score') == True:
        best_score = session['best_score']
    else:
        session['best_score'] = best_score

    session['board'] = board
    return render_template('board.html', board=board)


@app.route('/stats', methods=['POST'])
def display_stats():
    """Send and receive game stats."""

    global game_played, best_score
    post = request.get_json()
    print('data from /stats', post)
    print('game_played in /stats', session['game_played'])
    # if game_played >= 1:
    session['game_played'] = game_played
    session['best_score'] = best_score
    if post['score'] > best_score:
        session['best_score'] = post['score']
    print('session[game_played] in /stats', session['game_played'])
    return jsonify({'game_played': game_played, 'best_score': best_score})

@app.route('/check-word', methods=['POST'])
def check_word():
    """Get post request data and check if it's valid."""
    post = request.get_json()
    word = post['word']
    board = session["board"]
    # game_played = post['gamePlayed']
    # print('gameplayed', game_played)
    response = boggle_game.check_valid_word(board, word)
    return jsonify({'result': response})


@app.route('/get-stats', methods=['POST'])
def get_data():
    """Receive stats data from the front-end (sendStats())."""
   
    global best_score, game_played
    res = request.get_json()
    print('bestScore received from sendStats()', res)
    best_score = res['best_score']
    game_played = res['game_played']
    # updating best_score
    session['best_score'] = best_score
    session['game_played'] = game_played
    print('gamePlayed in get-stats', session['game_played'])
    return jsonify({'best_score': best_score})

