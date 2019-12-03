import React, { Component } from "react";
import "./App.css";
import search_icon from "./search_icon.png";

class App extends Component {
  state = {
    searching_name: "",
    searching_result: ""
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      searching_result: this.state.searching_name
    });
    this.crawling();
  };

  crawling = async() => {
    const request = require("request");
    const cheerio = require("cheerio");
    console.log(this.state.searching_result);
    const options = "https://cors-anywhere.herokuapp.com/https://wall.alphacoders.com/search.php?search="+this.state.searching_result;
    const callback = await ((error, respons, body) => {
      if (error) throw error;
      const $ = cheerio.load(body);
      let json = [],
        title,
        id,
        desc,
        img;
      $("#page_container > div:nth-child(6) > div.thumb-container-big").each(
        function(i, elem) {
          title = "Polar bear";
          id = 1;
          desc = $(this)
            .find("div.thumb-container > div.boxgrid > a")
            .attr("title");
          img = $(this)
            .find("div.thumb-container > div.boxgrid > a > img")
            .attr("data-src");
          json.push({ title: title, id: id, desc: desc, img: img });
        }
      );
      console.log("json: ", json);
    });
    request(options, callback);
  };

  render() {
    return (
      <div className="full_container">
        <div className="main">
          <div className="main_title">SMART WALLPAPER FINDER</div>
          <div className="main_subtitle">FROM alphacoders</div>
          <div className="search_container">
            <img src={search_icon} id="search_icon"></img>
            <form className="search_form" onSubmit={this.handleSubmit}>
              <input
                className="search_input"
                autoFocus
                name="searching_name"
                type="text"
                placeholder="Enter the keyword to find"
                onChange={this.handleChange}
                value={this.state.searching_name}
              ></input>
            </form>
          </div>
        </div>
        <div className="contents">{this.state.searching_result}</div>
      </div>
    );
  }
}

export default App;
