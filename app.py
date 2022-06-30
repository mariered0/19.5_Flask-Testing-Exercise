from boggle import Boggle
from flask import Flask, request, render_template, session,redirect
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret_boggle"
debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

boggle_game = Boggle()

@app.route('/')
def display_board():
    """Display the Boggle board."""
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('board.html', board=board)

@app.route('/submit', methods=["POST"])
def check_guess():
    """Submit a guess without refreshing the screen."""
    guess = request.args.get('guess')
    print(guess)
    return redirect('/')


