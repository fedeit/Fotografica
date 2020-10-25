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
import PhotosGoogleMaps from './components/PhotosGoogleMaps'

import { LoadScript } from '@react-google-maps/api'

// Get API Key for Google Maps
require('dotenv').config()
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY

function App() {
  return (
    <div className="App">
        <main class="page lanidng-page">
          <LoadScript googleMapsApiKey={ apiKey }>
            <Router>
              <Navbar />
              <Route path="/photos">
                <Photos/>
              </Route>
              <Route path="/albums">
                <Albums/>
              </Route>
              <Route path="/map">
                <PhotosGoogleMaps/>
              </Route>
            </Router>
          </LoadScript>
          <script src="assets/js/jquery.min.js"></script>
          <script src="assets/bootstrap/js/bootstrap.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.min.js"></script>
          <script src="assets/js/script.min.js"></script>
        </main>
    </div>
  );
}

export default App;
