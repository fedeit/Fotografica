import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';

import Photos from './components/Photos'
import Navbar from './components/Navbar'
import Albums from './components/Albums'

function App() {
  return (
    <div className="App">
        <main class="page lanidng-page">
          <Router>
            <Navbar />
            <Route path="/photos">
              <Photos/>
            </Route>
            <Route path="/albums">
              <Albums/>
            </Route>
          </Router>
          <script src="assets/js/jquery.min.js"></script>
          <script src="assets/bootstrap/js/bootstrap.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.min.js"></script>
          <script src="assets/js/script.min.js"></script>
        </main>
    </div>
  );
}

export default App;