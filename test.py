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
            # Checking the response from the route('/') by the text we get
            res = self.client.get('/')
            html = res.get_data(as_text=True)

            # Checking if the status code returned is 200.
            self.assertEqual(res.status_code, 200)
            # Checking if the root route is rendered.
            self.assertIn('<h1>Boggle</h1>', html)

    def test_board_content(self):
        with self.client:
            # Checking if score data of 3 is sent, it can be received correctly.
            
            res = self.client.post('/stats', data={'best_score': 0})
            data = res.get_data(as_text=True)
            print('data', data)
            self.assertEqual(read_status(json.dumps(data)), res.data)


            # self.assertEqual(res.status_code, 200)


