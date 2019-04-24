// pages/posts/post-detail/post-detail.js
var postData = require('../../../data/post-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collected: false,
    postDetail: {},
    id: '',
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    postData.postList.forEach(item => {
      if (item.postId === Number(options.id)) {
        this.setData({postDetail: item, id: options.id})
      }
    })
    this.getCollected()
  },
  getCollected: function() {
    var postsCollected = wx.getStorageSync('postsCollected')
    if (postsCollected) {
      var postCollected = postsCollected[this.data.id]
      this.setData({
        collected: postCollected ? true : false
      })
    }
  },
  setCollected: function () {
    var postsCollected = wx.getStorageSync('postsCollected')
    if (postsCollected) {
      postsCollected[this.data.id] = !postsCollected[this.data.id]
      wx.setStorageSync('postsCollected', postsCollected)
    } else {
      var postsCollected = {}
      postsCollected[this.data.id] = true 
      wx.setStorageSync('postsCollected', postsCollected)
    }
    this.setData({
      collected: !this.data.collected
    })  
    wx.showToast({
      title: this.data.collected ? '收藏成功！' : '取消收藏',
    })
  },
  onShareTap: function (event) {
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function () {
        console.log('cancel')
      }
    })
  },
  onMusicTap (event) {
    const isPlayingMusic = this.data.isPlayingMusic
    if (isPlayingMusic) {
      wx.stopBackgroundAudio()
      this.data.isPlayingMusic = false
    } else {
      wx.playBackgroundAudio({
        dataUrl: 'http://music.163.com/song/media/outer/url?id=142604.mp3',
        title: '夜夜夜夜-齐秦',
        coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000001TEc6V0kjpVC.jpg?max_age=2592000'
      })
      this.isPlayingMusic = true
    }
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