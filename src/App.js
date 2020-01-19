import React, { Component } from 'react'
import './App.css'
import search_icon from './search_icon.png'

class App extends Component {
  state = {
    searching_name: '',
    searching_result: '',
    result_arr: [],
    page: '&page=',
    image_number: 0,
    page_number: 1,
    image_max_number: 0,
    gridmode: 4
  }

  componentDidMount() {
    window.addEventListener('scroll', this._infiniteScroll, true)
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState(
      {
        searching_result: this.state.searching_name,
        result_arr: [],
        page: '&page=',
        image_number: 0,
        page_number: 1,
        image_max_number: 0
      },
      () => {
        this.crawling()
      }
    )
  }

  crawling = () => {
    const request = require('request')
    const cheerio = require('cheerio')
    // console.log(this.state.searching_result)
    const options =
      'https://cors-anywhere.herokuapp.com/https://wall.alphacoders.com/search.php?search=' +
      this.state.searching_result +
      this.state.page
    // console.log(options)
    const callback = (error, respons, body) => {
      // console.log(this.state.page)
      if (error) throw error
      const $ = cheerio.load(body)
      let json = [],
        id,
        link,
        img
      const image_max_number = Number(
        $('#page_container > h1')
          .text()
          .split(' ')[8]
      )
      if (window.innerWidth < 1070) {
        $('#page_container > div:nth-child(6) > div.thumb-container').each(function(i, elem) {
          id = i
          link = $(this)
            .find('div.thumb-container > a')
            .attr('href')
          img = $(this)
            .find('div.thumb-container > a.wallpaper-thumb > img')
            .attr('data-src')
          json.push({ id: id, link: link, img: img })
        })
      } else {
        $('#page_container > div:nth-child(6) > div.thumb-container-big').each(function(i, elem) {
          id = i
          link = $(this)
            .find('div.thumb-container > div.boxgrid > a')
            .attr('href')
          img = $(this)
            .find('div.thumb-container > div.boxgrid > a > img')
            .attr('data-src')
          json.push({ id: id, link: link, img: img })
        })
      }

      // console.log('json: ', json)
      // console.log(this.state.page)
      if (this.state.image_max_number >= this.state.image_number) {
        this.setState({
          result_arr: this.state.result_arr.concat(json),
          image_max_number: image_max_number,
          image_number: this.state.image_number + 30
        })
      }
    }
    request(options, callback)
    // console.log('이미지맥스넘버', this.state.image_max_number)
    // console.log('이미지넘버', this.state.image_number)
    // console.log('페이지넘버', this.state.page_number)
  }

  _infiniteScroll = () => {
    let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
    let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
    let clientHeight = document.documentElement.clientHeight
    if (
      scrollTop + clientHeight + 100 > scrollHeight &&
      this.state.image_max_number >= this.state.image_number
    ) {
      this.setState(
        {
          page_number: this.state.page_number + 1,
          page: this.state.page.substring(0, 6) + String(this.state.page_number + 1)
        },
        () => this.crawling()
      )
    }
    // console.log(scrollTop, clientHeight, scrollHeight);
  }

  render() {
    const girdStyle2 = {
      width: '50%'
    }
    const girdStyle4 = {
      width: '25%'
    }
    const girdStyle10 = {
      width: '10%'
    }

    return (
      <div className="full_container">
        <div className="page_view">
          {this.state.image_number <= this.state.image_max_number &&
            this.state.image_number + '/' + this.state.image_max_number}
          {this.state.image_number > this.state.image_max_number && 'Last'}
        </div>
        <div className="main">
          <div className="button_container">
            <div
              className="button"
              onClick={() => {
                this.setState({
                  gridmode: 2
                })
              }}
            >
              2개씩보기
            </div>
            <div
              className="button"
              onClick={() => {
                this.setState({
                  gridmode: 4
                })
              }}
            >
              4개씩보기
            </div>
            <div
              className="button"
              onClick={() => {
                this.setState({
                  gridmode: 10
                })
              }}
            >
              10개씩보기
            </div>
          </div>
          <div className="main_title">SMART WALLPAPER FINDER</div>
          <div className="main_subtitle">
            FROM{' '}
            <a className="main_site_link" href="https://wall.alphacoders.com/" target="_blank">
              alphacoders.com
            </a>
          </div>
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
          <div className="dev-ment">
            데스크탑 이용 시, width가 1070 이상이어야 원활한 사용이 가능합니다.
          </div>
        </div>
        {/* <div className="contents">{JSON.stringify(this.state.result_arr)}</div> */}
        <div className="grid">
          {this.state.gridmode === 2 &&
            this.state.result_arr.map(item => {
              return (
                <a href={'https://wall.alphacoders.com/' + item.link} target="_blank">
                  <img style={girdStyle2} src={item.img} className="grid-item"></img>
                </a>
              )
            })}
          {this.state.gridmode === 4 &&
            this.state.result_arr.map(item => {
              return (
                <a href={'https://wall.alphacoders.com/' + item.link} target="_blank">
                  <img style={girdStyle4} src={item.img} className="grid-item"></img>
                </a>
              )
            })}
          {this.state.gridmode === 10 &&
            this.state.result_arr.map(item => {
              return (
                <a href={'https://wall.alphacoders.com/' + item.link} target="_blank">
                  <img style={girdStyle10} src={item.img} className="grid-item"></img>
                </a>
              )
            })}
        </div>
      </div>
    )
  }
}

export default App
