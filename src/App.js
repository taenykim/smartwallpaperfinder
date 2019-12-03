import React, { Component, Fragment } from "react";
import "./App.css";
import search_icon from "./search_icon.png";

class App extends Component {
  state = {
    searching_name: "",
    searching_result: "",
    result_arr: [],
    page: "&page=",
    image_number: 0,
    page_number: 1,
    image_max_number: 0
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
        searching_result: this.state.searching_name,
        result_arr:[],
        page: "&page=",
        image_number: 0,
        page_number: 1,
        image_max_number: 0
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
      (await "https://cors-anywhere.herokuapp.com/https://wall.alphacoders.com/search.php?search=") +
      this.state.searching_result +
      this.state.page;
    console.log(options);
    const callback = async (error, respons, body) => {
      console.log(this.state.page);
      if (error) throw error;
      const $ = await cheerio.load(body);
      let json = [],
        title,
        id,
        category,
        img;
      const image_max_number = Number(
        await $("#page_container > h1")
          .text()
          .split(" ")[8]
      );

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
      console.log(this.state.page);

      this.setState({
        result_arr: this.state.result_arr.concat(json),
        image_max_number: image_max_number,
        // image_number: this.state.image_number + json.length
      });
    };
    request(options, callback);
    console.log("이미지맥스넘버", this.state.image_max_number);
    console.log("이미지넘버", this.state.image_number);
    console.log("페이지넘버", this.state.page_number);
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
    if (
      scrollTop + clientHeight + 100 > scrollHeight &&
      this.state.image_max_number > this.state.image_number+30
    ) {
      this.setState(
        {
          page_number: this.state.page_number + 1,
          page:
            this.state.page.substring(0, 6) +
            String(this.state.page_number + 1),
          image_number: this.state.image_number + 30
        },
        () => this.crawling()
      );
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
