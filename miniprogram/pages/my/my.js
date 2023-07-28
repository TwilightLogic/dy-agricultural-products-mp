// pages/my/my.js
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  // 我的地址
  myAddress() {
    let that = this;
    wx.chooseAddress({
      success(res) {
        console.log('我的地址', res);
      },
    });
  },

  // 注册
  register() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '你还未注册，是否注册',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.getUserProfile({
            desc: '用于完善个人资料',
            success: (userInfo) => {
              console.log(userInfo);
              wx.showLoading({
                title: '注册中...',
              });
              db.collection('user')
                .add({
                  data: {
                    userInfo: userInfo.userInfo,
                  },
                })
                .then((user) => {
                  wx.hideLoading();
                  wx.showToast({
                    title: '注册成功',
                  });
                  that.login();
                });
            },
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
    });
  },

  // 登录
  login() {
    let that = this;
    db.collection('user')
      .get()
      .then((res) => {
        if (res.data.length > 0) {
          that.setData({
            user: res.data[0],
          });
        } else {
          that.register();
        }
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.login();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
