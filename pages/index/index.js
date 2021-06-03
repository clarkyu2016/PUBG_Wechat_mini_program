// pages/index/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // player_id:"",
    player_name:"",
    // match_id:"",
    input_playername:"",
    input_matchid:"",
    // recent_match_list:[],
    player_data:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  PlayernameChange(event) {
    this.setData({
      player_name: event.detail
  })
      // app.globalData.player_name = event.detail;
  },


  searchPlayer:function(){
    wx.showLoading({
      title: '努力获取数据中!',
    })

    console.log(this.data.player_name)
    wx.cloud.callFunction({
      name:'pubgdata',
      data:{
        playername:this.data.player_name.value,
      }
    }).then(res =>{
      console.log(res); //还需要加一个是否有返回数据的判断
      if((JSON.stringify(res.result) != "null")){
        this.setData({
          // player_id: res.result.data[0].id,
          // recent_match_list:res.result.data[0].relationships.matches.data,
          player_data: res.result.data[0]
      });
        app.globalData.player_data = res.result.data[0];
        app.globalData.player_name = this.data.player_name;
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/matches/matches',
          success: function(res) {
            // console.log("定位成功")
          }
        });
        app.globalData.match_detail =  [];
      }else{
        wx.showToast({
          title: '无此账号信息',
          icon: 'error',
        })
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '查询失败，请重试',
        icon: 'error',
      })
    });
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