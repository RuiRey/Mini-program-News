// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    time: '',
    source: '',
    content: [],
    readCount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = Number(options.id);
    this.getNewsDetail(id);
  },
  getNewsDetail(id){
    let that = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data:{
        id:id,
      },
      success:function(res){
        let result = res.data.result;
        that.setData({
          title: result.title,
          time: result.date.slice(11, 16),
          source: result.source,
          content: result.content,
          readCount: result.readCount
        })
      }
    })
  },

})