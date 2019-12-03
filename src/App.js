import React, { Component, Fragment } from "react";
import "./App.css";
import search_icon from "./search_icon.png";

class App extends Component {
  state = {
    searching_name: "",
    searching_result: "",
    result_arr: [],
    page: "",
    i: 1,
    image_num: 0
  };

  componentDidMount() {
    window.addEventListener("scroll", this._infiniteScroll, true);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState(
      {
        searching_result: this.state.searching_name
      },
      () => {
        this.crawling();
      }
    );
  };

  crawling = async () => {
    const request = require("request");
    const cheerio = require("cheerio");
    console.log(this.state.searching_result);
    const options =
      "https://cors-anywhere.herokuapp.com/https://wall.alphacoders.com/search.php?search=" +
      this.state.searching_result +
      this.state.page;
    const callback = await ((error, respons, body) => {
      if (error) throw error;
      const $ = cheerio.load(body);
      let json = [],
        title,
        id,
        category,
        img;

      $("#page_container > div:nth-child(6) > div.thumb-container-big").each(
        function(i, elem) {
          title = $(this)
            .find("div.thumb-container > div.boxcaption > span.thumb-info-big")
            .text()
            .split("\n")[3];
          id = i;
          category = $(this)
            .find("div.thumb-container > div.boxcaption > span.thumb-info-big")
            .text()
            .split("\n")[2];
          img = $(this)
            .find("div.thumb-container > div.boxgrid > a > img")
            .attr("data-src");
          json.push({ title: title, id: id, category: category, img: img });
        }
      );
      console.log("json: ", json);
      this.setState({
        result_arr: this.state.result_arr.concat(json)
      });
    });
    request(options, callback);
  };

  _infiniteScroll = () => {
    let scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    let scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    let clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight + 100 > scrollHeight) {
      this.setState(
        {
          i: this.state.i + 1,
          page: this.state.page + "&page=" + String(this.state.i)
        },
        () => this.crawling()
      );
      console.log(this.state);
    }
    // console.log(scrollTop, clientHeight, scrollHeight);
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
        {/* <div className="contents">{JSON.stringify(this.state.result_arr)}</div> */}
        <div className="grid">
          {this.state.result_arr.map(item => {
            return <img src={item.img} className="grid-item"></img>;
          })}
        </div>
      </div>
    );
  }
}

export default App;
