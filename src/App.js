import React, { Component } from "react";
import "./App.css";
import search_icon from "./search_icon.png";

class App extends Component {
  render() {
    return (
      <div className="full_container">
        <div className="main">
        <div className="main_title">SMART WALLPAPER FINDER</div>
        <div className="main_subtitle">FROM alphacoders</div>
          <div className="search_container">
            <img src={search_icon} id="search_icon"></img>
            <input className="search"></input>
          </div>
        </div>
        <div className="contents">dd</div>
      </div>
    );
  }
}

export default App;
