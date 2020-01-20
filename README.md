## 1. 개요
배경화면 크롤링 사이트입니다. `alpacoders`라는 대형 Wallpaper 사이트를 자주 이용하는 편인데 키워드를 검색했을 때, 30개씩 정보를 보여주고 다음페이지를 클릭해서 넘어가야지만 다음 정보를 가져오는데에 불편함을 느껴 키워드를 검색했을 때 클릭하는 번거로움 없이 한눈에 이미지들을 보면 좋을 것 같다는 생각에 웹사이트를 기획해보았습니다. `전통적인 web게시판 -> SPA형태로 열람`
[깃허브링크](https://github.com/taenykim/smartwallpaperfinder)
[사이트링크](https://taenykim.github.io/smartwallpaperfinder/)

## 2. 주요기능

- 검색기능 (Searching)
- 무한 스크롤 (Infinity Scrolling)
	- 편한 데이터 열람
    - 스크롤이 바닥에 닿았을 때 데이터 재요청
- 보기방식 변경 버튼 (ImageView Control button)

## 3. 사용 라이브러리

- React (create-react-app)
- request
- cheerio
- mansory

## 4. 상세 페이지 및 코드리뷰

### 4-1. 메인 페이지

![image.png](https://taenykim.github.io/portfoliov2/static/media/wallpaperfinder1.b2010af4.png)

화면 중앙에 검색창과 우측상단에 해당 키워드의 이미지 개수와 현재 보여지는 이미지 개수정보, 하단에는 이미지 레이아웃 형태를 선택할 수 있는 3개의 버튼을 두었습니다. 검색창 하단에 "데스크탑 이용시 width를 1070이상을 유지"하라는 메시지를 적어놓았는데 `크롤링대상 사이트가 모바일버젼, 데스크탑버젼의 이미지 css선택자명이 달라서 데스크탑은 1070이상, 모바일은 1070이하일 때, 크롤링데이터를 정상적으로 받아올 수 있습니다.`(제 편의를 위해 만든 사이트다보니 모바일, 데스크탑 버젼을 따로 만들지는 않았습니다.
- TIP) 외국 사이트다보니 검색어는 영문을 입력해야합니다.

### 4-2. 결과 화면


![image.png](https://images.velog.io/post-images/kimtaeeeny/3ef90a90-3a98-11ea-b35a-6f8c6475ca8e/image.png)

captain america를 검색한 결과입니다. 이미지 레이아웃은 `벽돌형(pinterest같은 형태) 레이아웃`을 사용하고자 해서, Mansory 라이브러리를 사용하였습니다. 배경화면의 크기가 거의 일정해서 티는 안나지만 여러 형태의 이미지가 들어와도 잘 배치되게끔 설정하였습니다.

### 4-3. 무한스크롤

```javascript
  componentDidMount() {
    window.addEventListener('scroll', this._infiniteScroll, true)
  }
```
```javascript
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
```

검색키워드가 정보가 많을 경우도 있어서, 한꺼번에 모든 정보를 가져오는 방식이 아닌 스크롤을 밑으로 가져갔을 때, 데이터를 다시 리로드하는 무한스크롤 기능을 넣었습니다. 그리고 여기서 데이터를 가져오는 방식은 `콜백함수를 사용해 비동기처리`를 하였습니다.

### 4-4. 비동기 처리 (callback)
```javascript
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
````
이번에 개발을 하면서 가장 막히고 이해하려고 애썼던 부분이 javascript의 비동기방식이었습니다. 해당 이미지는 검색어를 입력하였을 때 크롤링 코드를 실행시키는 부분인데, 검색어를 state로 넘겨준 후 크롤링 코드를 실행하게끔 `setState부분에 콜백 함수를 넣어 구현하였습니다.` 이 프로젝트 당시 비동기처리를 하는 여러방식들(async await, 리덕스 사가) 등에 익숙치 않아서 콜백을 많이 사용하였습니다.

### 4-5. 비동기방식에 대한 이해 (요청, 응답)


![image.png](https://images.velog.io/post-images/kimtaeeeny/ab5b3f80-3a9a-11ea-ab81-53b8d46a1486/image.png)

무한스크롤이 발생하는 스크롤 이벤트 부분입니다. http 요청하는 부분과 json을 응답받는 부분을 콘솔창에 띄우는 코드를 작성해보았는데 `요청,응답,요청,응답 순이 아닌 요청,요청,응답,응답 순의 비동기 방식을 볼 수 있었습니다.` 그래서 마지막 페이지에 갔을 때 마지막페이지에 대한 요청을 여러번 응답해서 중복되는 경우가 발생했습니다. 그래서 `요청하는 부분이 아닌 응답하고 데이터를 넣는 과정에서 조건문을 넣어 이를 해결하였습니다.`


```javascript
// image_max_number : 총 이미지의 개수
// image_number : 현재 view로 보여지는 이미지의 개수

// image_number가 image_max_number를 넘었을 때, 요청은 이뤄지지만 state를 바꿀 순 없습니다.
   if (this.state.image_max_number >= this.state.image_number) {
        this.setState({
          result_arr: this.state.result_arr.concat(json),
          image_max_number: image_max_number,
          image_number: this.state.image_number + 30
        })
      }
```

### 4-6. 이미지 보기 방식
default는 4개씩 보기이고,
```javascript
state = {
	gridmode: 4
}
```
이미지 width정보를 css형태로 각각 저장해둔 후,
```javascript
const girdStyle2 = {
	width: '50%'
}
const girdStyle4 = {
	width: '25%'
}
const girdStyle10 = {
	width: '10%'
}
```
버튼을 클릭하면 state의 gridmode를 변경합니다.
```javascript
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
// ...
```
그리고 현재 state의 gridmode 에 따라 데이터의 레이아웃형태를 변경하게 하였습니다.
```javascript
   {this.state.gridmode === 2 &&
            this.state.result_arr.map(item => {
              return (
                <a href={'https://wall.alphacoders.com/' + item.link} target="_blank">
                  <img style={girdStyle2} src={item.img} className="grid-item"></img>
                </a>
              )
            })}
```

### 4-7. 크롤링 (request, cheerio)
```javascript
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
```

크롤링은 `request`와 `cheerio` 모듈을 사용하였습니다.

또한 크롤링을 하려면 해당 웹사이트의 선택자에 접근을 해야하는데 제가 크롤링한 alphacoder라는 사이트는 디바이스에 따라 선택자가 달랐습니다. 그래서 innerWidth가 1070보다 클 경우 데스크탑으로 인식하게끔 코드를 짜봤습니다. 즉, `데스크탑일 경우는 1070 이상 시 크롤링이 정상적으로 되고, 모바일일 경우는 1070 이하여야 크롤링이 정상적으로 이뤄집니다.` (해결하려면 크롤링사이트의 조건에 맞게 내 사이트도 조건을 맞춰줘야함.)

## 5. 후기
리액트를 접하고 처음 만들어본 정적 웹 사이트. 학교 과제나 프로젝트처럼 제출용이 아니라 개인적으로 조금 불편했던 점을 개선하려 만들어본 웹 페이지다보니 스스로 정보를 찾아보고 공부하고 직접 적용시켜보는 모든 과정이 정말 재미있었다.
