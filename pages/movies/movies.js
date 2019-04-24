// pages/video/video.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    in_theaters: {},
    coming_soon: {},
    top250: {},
    containerShow: true,
    searchPannelShow: false,
    searchResult:[],
    start: 0,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage()
  },
  initPage(){
    var doubanBase = app.globalData.doubanBase
    var inTheatersUrl = doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingSoonUrl = doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250Url = doubanBase + '/v2/movie/top250' + '?start=0&count=3';
    this.getMovieListData(inTheatersUrl, 'in_theaters', '正在热映')
    this.getMovieListData(comingSoonUrl, 'coming_soon', '即将上映')
    this.getMovieListData(top250Url, 'top250', '豆瓣Top250')
  },
  getMovieListData: function (url, type, moviesTitle) {
    util.http(url, this.processDoubanData, type, moviesTitle)
  },
  processDoubanData: function (moviesDouban, type, moviesTitle) {
    var movies = []
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx]
      var title = subject.title
      var starArray = util.convertToStarsArray(subject.rating.stars)
      if (title.length >= 6) {
        title= title.substring(0,6) + '...'
      }
      var temp = {
        title, 
        rating: {average: subject.rating.average,starArray},
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      movies.push(temp)
    }
    var readyData = {}
    readyData[type] = {movies, moviesTitle, type}
    this.setData(readyData)
  },
  onMoreTap: function (event) {
    var moviesType = event.currentTarget.dataset.type
    var moviesTitle = event.currentTarget.dataset.category
    wx.navigateTo({
      url: '/pages/movies/more-movie/more-movie?moviesType=' + moviesType + '&category=' + moviesTitle,
    })
  },
  onCancelImageTap: function () {
    this.initPage()
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      searchResult: [],
      inputValue: ''
    })
  },
  onBindFocus: function (event) {
    var text = event.detail.value
    this.setData({
      containerShow: false,
      searchPannelShow: true,
      start: 0,
      searchResult: []
    })
    util.http(app.globalData.doubanBase + '/v2/movie/search?q=' + text,  this.getSearchMovieData)
    wx.showNavigationBarLoading()
  },
  getSearchMovieData: function(res){
    var movies = this.data.searchResult
    var start = this.data.start
    if (!start) {
      this.setData({
        total: res.total
      })
    }
    for (var idx in res.subjects) {
      var subject = res.subjects[idx]
      var title = subject.title
      var starArray = util.convertToStarsArray(subject.rating.stars)
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...'
      }
      var temp = {
        title,
        rating: { average: subject.rating.average, starArray },
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      movies.push(temp)
    }
    this.setData({
      searchResult: movies
    })
    wx.hideNavigationBarLoading()
  },
  onBindChange: function (event) {
    this.setData({
      searchResult: []
    })
    var text = event.detail.value
    util.http(app.globalData.doubanBase + '/v2/movie/search?q='+text, this.getSearchMovieData)
    wx.showNavigationBarLoading()
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId
    wx.navigateTo({
      url: '/pages/movies/movie-detail/movie-detail?id=' + movieId
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})