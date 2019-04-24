// pages/movies/more-movie/more-movie.js
var app = getApp()
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    pageTitle: '',
    start: 0,
    url: '',
    count: 14,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var moviesType = options.moviesType
    var category = options.category
    var url = app.globalData.doubanBase + '/v2/movie/' + moviesType
    this.setData({
      pageTitle: category,
      url
    })
    util.http(url, this.processDoubanData)
  },
  processDoubanData: function (res, type, movieTitle) {
    var movies = this.data.movies
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
      movies
    })
    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: that.data.pageTitle,
    })
  },
  onScrollLower: function (event) {
    let {start, url,count, total} = this.data
    start++
    this.setData({
      start
    })
    if ((start*14) < parseInt(total)) {
      wx.showNavigationBarLoading()
      util.http(url + '?start='+start+'&count=14', this.processDoubanData)
    }
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId
    wx.navigateTo({
      url: '/pages/movies/movie-detail/movie-detail?id=' + movieId
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})