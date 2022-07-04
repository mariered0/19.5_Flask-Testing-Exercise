from boggle import Boggle
from flask import Flask, request, redirect, render_template, session, jsonify, flash
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret_boggle"
debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

boggle_game = Boggle()
game_played = 0
best_score = 0

@app.route('/', methods=['POST', 'GET'])
def display_board():
    """Display the Boggle board."""
    board = boggle_game.make_board()
    global game_played, best_score
    # res = request.get_json()
    print('exist?', session.get('game_played'))
    # print('bestScore received', res[best_score])
    if session.get('game_played') == True:
        game_played = session['game_played']
    else:
        session['game_played'] = game_played

    if session.get('best_score') == True:
        # best_score = res[best_score]
        best_score = session['best_score']
    else:
        session['best_score'] = best_score

    session['board'] = board
    return render_template('board.html', board=board)


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


@app.route('/stats', methods=['POST'])
def display_stats():
    """Display game stats."""
    post = request.get_json()
    print('post', post)
    global game_played
    global best_score
    if game_played >= 1:
        game_played += 1
    session['game_played'] = game_played
    session['best_score'] = best_score
    if post['score'] > best_score:
        session['best_score'] = post['score']
    print('gamePlayed', session['game_played'])
    return jsonify({'gamePlayed': game_played, 'bestScore': best_score})
