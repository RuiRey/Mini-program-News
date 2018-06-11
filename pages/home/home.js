var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";

Page({
  data: {
    newsType: 'gn',
    newsList: [],
    typeList: ['国内', '国际', '财经', '娱乐', '军事', '体育', '其他'],
    newsTypeList: ['gn', 'gj', 'cj', 'yl', 'js', 'ty', 'other'],
    hotNews:{},
    newsTypeMap : {
      '国内': 'gn',
      '国际': 'gj',
      '财经': 'cj',
      '娱乐': 'yl',
      '军事': 'js',
      '体育': 'ty',
      '其他': 'other'
    },
  },

  onLoad: function (options) {
    this.getNews();
  },
  // 刷新页面
  onPullDownRefresh() {
    this.getNews(() => wx.stopPullDownRefresh())
  },
  getNews(callback) {
    let that = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.newsType,
      },
      success: function (res) {
        let list = res.data.result;
        that.setNewsList(list);
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  setNewsList(list){
    let hotNews = {
      id: list[0].id,
      title: list[0].title,
      time: list[0].date.slice(11, 16),
      source: list[0].source,
      firstImage: list[0].firstImage
    };

    let newsList = [];
    for (let i = 1; i < list.length; i++) {
      newsList.push({
        id: list[i].id,
        title: list[i].title,
        time: list[i].date.slice(11, 16),
        source: list[i].source,
        firstImage: list[i].firstImage
      })
    }
    this.setData({
      newsList: newsList,
      hotNews: hotNews,
    })
  },
  //选择新闻类型
  onTapType: function(event){
    let newsTypeMap = this.data.newsTypeMap;
    let type = newsTypeMap[event.target.dataset.hi];
    if(this.data.newsType != type){
      this.setData({
        newsType: type,
        // state: event.currentTarget.dataset.key,
      })
      this.getNews();
    }
  },
  //点击单个新闻
  onTapDetail(event){
    let id = event.currentTarget.dataset.hi;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    let newsType = this.data.newsType;
    let newsTypeList = this.data.newsTypeList;
    let index = newsTypeList.indexOf(newsType);
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10 ) {
      //console.log("向左滑动");
      if(index < newsTypeList.length - 1){
        this.setData({
          newsType: newsTypeList[index+1],
        })
        this.getNews();
      }
    }
    // 向右滑动   
    if (touchMove - touchDot >= 40 && time < 10) {
      //console.log("向右滑动");
      if (index > 0) {
        this.setData({
          newsType: newsTypeList[index - 1],
        })
        this.getNews();
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  }
})