// pages/movies/movie-detail/movie-detail.js
var app = getApp()
import { Movie } from './class/Movie.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.id
    var url = app.globalData.doubanBase + '/v2/movie/subject/'+movieId
    var movie = new Movie(url)
    movie.getMovieData((movie) => {
      this.setData({movie: movie})
    })
  },
  getMovieDetail: function (data) {
    if (!data) {
      return ;
    }
    var director = {
      avatar: '',
      name: '',
      id: ''
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name
      director.id = data.directors[0].id
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      director,
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join('、'),
      stars: util.convertToStarsArray(data.rating.stars),
      average: data.rating.average,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({
      movie: movie
    })
  },
  viewMoviePostImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src],
    })
  }
})