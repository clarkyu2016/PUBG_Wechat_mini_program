const app = getApp()

// pages/calculate/calculate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.select_data)
    let stat_data = {};
    let select_matches = app.globalData.select_data;

    for (let i = 0; i < select_matches.length; i++){
      const group_info = select_matches[i].group_info;
      for(let j=0; j < group_info.length; j++){
        const player_stat = group_info[j].stats;
        // console.log(player_stat)
        // console.log(stat_data)
        // console.log(stat_data.hasOwnProperty(stat_data[player_stat.name]))
        if(!stat_data.hasOwnProperty(player_stat.name)){
          stat_data[player_stat.name] = {"damageDealt":Math.round(player_stat.damageDealt)
                                  ,"assists":player_stat.assists
                                  ,"headshotKills":player_stat.headshotKills
                                  ,"heals":player_stat.heals
                                  ,"kills":player_stat.kills
                                  ,"match_cnt":1
                                  ,"avg_damageDealt":player_stat.damageDealt
          }
        } else{
          stat_data[player_stat.name].damageDealt += Math.round(player_stat.damageDealt)
          stat_data[player_stat.name].assists += player_stat.assists
          stat_data[player_stat.name].headshotKills += player_stat.headshotKills
          stat_data[player_stat.name].heals += player_stat.heals
          stat_data[player_stat.name].kills += player_stat.kills
          stat_data[player_stat.name].match_cnt += 1
          stat_data[player_stat.name].avg_damageDealt = Math.round((stat_data[player_stat.name].damageDealt + player_stat.damageDealt)/(stat_data[player_stat.name].match_cnt+1))
        }
      }
    }
    
        //计算最大输出伤害

        var max_damageDealt = 0
        var max_damageDealt_player = ""
        var max_avg_damageDealt = 0
        var max_avg_damageDealt_player = ""
        var min_avg_damageDealt = 100000
        var min_avg_damageDealt_player = ""
        var max_kills = 0
        var max_kills_player = ""
        var max_heals = 0
        var max_heals_player = ""
        var max_assists = 0
        var max_assists_player = ""
        
        for (var prop in stat_data) {
          if(stat_data[prop].avg_damageDealt >= max_avg_damageDealt){
            max_avg_damageDealt_player = prop
            max_avg_damageDealt = stat_data[prop].avg_damageDealt
          }

          if(stat_data[prop].damageDealt >= max_damageDealt){
            max_damageDealt_player = prop
            max_damageDealt = stat_data[prop].damageDealt
          }
          
          if(stat_data[prop].avg_damageDealt <= min_avg_damageDealt){
              min_avg_damageDealt_player = prop
              min_avg_damageDealt = stat_data[prop].avg_damageDealt
          }
          
          if(stat_data[prop].kills >= max_kills){
            max_kills_player = prop
            max_kills = stat_data[prop].kills
          }

          if(stat_data[prop].heals >= max_heals){
            max_heals_player = prop
            max_heals = stat_data[prop].heals
          }

          if(stat_data[prop].assists >= max_assists){
            max_assists_player = prop
            max_assists = stat_data[prop].assists
          }
        }

        var final = []
        for (var prop in stat_data) {
          var new_arry = {
             "name":prop
            ,"damageDealt":stat_data[prop].damageDealt
            ,"assists":stat_data[prop].assists
            ,"headshotKills":stat_data[prop].headshotKills
            ,"heals":stat_data[prop].heals
            ,"kills":stat_data[prop].kills
            ,"match_cnt":stat_data[prop].match_cnt
            ,"avg_damageDealt":stat_data[prop].avg_damageDealt
          }
          final.push(new_arry)
      }

      this.setData({
        max_damageDealt_player:max_damageDealt_player,
        max_avg_damageDealt_player:max_avg_damageDealt_player,
        max_kills_player:max_kills_player,
        max_heals_player:max_heals_player,
        max_assists_player:max_assists_player,
        player_data : final,
        min_avg_damageDealt_player:min_avg_damageDealt_player,
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