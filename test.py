from unittest import TestCase
from app import app
from flask import session, jsonify
from boggle import Boggle


app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class FlaskTests(TestCase):
    """unit tests for app.py."""

    def setUp(self):
        """Stuff to do before every test."""
        self.client = app.test_client()
        app.config['TESTING'] = True

    # TODO -- write tests for every view function / feature!

    def test_display(self):
        with self.client:
            """Checking the response from the route('/') by the text we get"""
            res = self.client.get('/')
            html = res.get_data(as_text=True)

            # Checking if the status code returned is 200.
            self.assertEqual(res.status_code, 200)
            # Checking if the root route is rendered.
            self.assertIn('<h1>Boggle</h1>', html)
            self.assertIn('<b id="best_score">0</b>', html)
            self.assertIn('<b id="score">0</b>', html)
            self.assertIn('<b id="game_played">0</b>', html)

    def test_valid_word(self):
        """Checking the check_word rout with valid word."""
        with self.client:
            self.client.get('/')
            with self.client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"],
                ["C", "A", "T", "T", "T"]]
           
            res = self.client.get('/check-word?word=cat')
            self.assertEqual(res.json['result'], 'ok')

    def test_invalid_word(self):
        """Checking the check_word rout with invalid word."""
        self.client.get('/')
        res = self.client.get('/check-word?word=bat')
        self.assertEqual(res.json['result'], 'not-on-board')

    def test_not_word(self):
        """Checking the check_word rout with non-English word."""
        self.client.get('/')
        res = self.client.get('/check-word?word=jfdhdkaffh')
        self.assertEqual(res.json['result'], 'not-word')










            


