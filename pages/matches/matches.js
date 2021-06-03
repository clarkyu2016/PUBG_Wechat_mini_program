const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    players_count:0,
    current_data: {},
    // match_detail: [],
    group_players_info:[],
    group_info_each_match:[],
    result: [],
    match_time:"",
    map_name:"",
    match_time_stamp:-1,
    // players_own_data:{},
  },



  onLoad: function (options) {
    wx.showLoading({
      title: '读取战绩中!',
    })
    // console.log(app.globalData.player_data)
    let promiseArr = [];
    for (let i = 0; i < app.globalData.player_data.relationships.matches.data.slice(0,15).length; i++){
      promiseArr.push(new Promise((reslove,reject) =>{
        let item = app.globalData.player_data.relationships.matches.data[i];
        wx.cloud.callFunction({
          name:'pubg_match',
          data:{
            match_id:item.id,
          }
        }).then(res=>{
          // this.setData({
          //   match_detail:this.data.match_detail.concat(res.result)
          // });
          app.globalData.match_detail = app.globalData.match_detail.concat(res.result)
          reslove();
        }).catch(err=>{
          console.log(err);
          wx.showToast({
            title: '发生错误，请稍后查询',
            icon: 'fail',
          })
        })

      }))
    }
    Promise.all(promiseArr).then(res =>{
      for(let j = 0; j < app.globalData.match_detail.length; j ++){
        // console.log(app.globalData.match_detail)
        let item_match = app.globalData.match_detail[j];
        this.convert_time(new Date(item_match.data.attributes.createdAt).getTime() + 8 *3600)
        this.extract_data(item_match.included)
        var map_name = ""
        if(item_match.data.attributes.mapName == "Desert_Main"){
          map_name = "米拉玛"
        }else if(item_match.data.attributes.mapName == "DihorOtok_Main"){
          map_name = "维寒迪"
        }else if(item_match.data.attributes.mapName == "Baltic_Main"){
          map_name = "艾伦格"
        }else if(item_match.data.attributes.mapName == "Savage_Main"){
          map_name = "萨诺"
        }

        for(let q = 0; q < app.globalData.group_players_info.length;q++)
        {
          if(app.globalData.group_players_info[q].stats.name == app.globalData.player_name.value){
            // this.setData({
            //   players_own_data :app.globalData.group_players_info[q].stats
            // })
            app.globalData.players_own_data = app.globalData.group_players_info[q].stats
            break; 
          }
        }
        this.setData({
            group_info_each_match:this.data.group_info_each_match.concat({
            group_info:app.globalData.group_players_info
            ,match_info:item_match.data.attributes
            ,match_id:item_match.data.id
            ,match_time:this.data.match_time
            ,map_name:map_name
            ,match_time_stamp:new Date(item_match.data.attributes.createdAt).getTime() + 8 *3600
            ,checked:false
            ,owner_kills:Math.round(app.globalData.players_own_data.kills)
            ,owner_damageDealt:Math.round(app.globalData.players_own_data.damageDealt)
            ,owner_assists:Math.round(app.globalData.players_own_data.assists)
          })
          });

        this.setData({
            group_info_each_match:this.data.group_info_each_match.sort(function(a, b){return b.match_time_stamp - a.match_time_stamp})
          });
          wx.hideLoading();
        }}).catch(err => {
          console.log(err);
          wx.hideLoading();
      });
  },

  checkboxChange(e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    const items = this.data.group_info_each_match
    const values = e.detail.value
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].match_id === values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    this.setData({
      group_info_each_match:items,
      players_count:this.data.group_info_each_match.filter(item => item.checked).length
    })
    
    //创建全局函数
    app.globalData.select_data = this.data.group_info_each_match.filter(item => item.checked);
  },

  extract_data: function(included){
    // console.log(included);
    var match_players_info = included.filter(item => item.type == "participant")
    var rosters = included.filter(item => item.type== "roster")
    var match_self_player = match_players_info.filter(item => item.attributes.stats.playerId == app.globalData.player_data.id)
    
    // console.log(rosters)
    // console.log(match_self_player)
    
    var roster_player_in = "";

    for (var i = 0; i <rosters.length; i++){
      var this_roster = rosters[i].relationships.participants.data
      for (var j = 0; j < this_roster.length; j++){
        if(this_roster[j].id == match_self_player[0].id){
          roster_player_in = rosters[i]
          break;
        }
      }
    };

    // console.log(roster_player_in)

    // 提取四个人的战绩
    var group_players_info = []
    for (var i = 0; i <match_players_info.length; i++){
      for (var j = 0; j < roster_player_in.relationships.participants.data.length; j++){
        if(match_players_info[i].id == roster_player_in.relationships.participants.data[j].id){
          group_players_info.push(match_players_info[i].attributes)
        }
      }
    };
    // this.setData({
    //   group_players_info:group_players_info
    // });
    app.globalData.group_players_info = group_players_info

  },
  
  convert_time: function(datestamp){
    var date = new Date(datestamp);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    this.setData({
      match_time:MM + DD +" "+hh + mm + ss
    });

  },


  calculate: function(e){
    wx.navigateTo({
      url: '/pages/calculate/calculate',
      success: function(res) {
        // console.log("定位成功")
      }
    });
  }

})