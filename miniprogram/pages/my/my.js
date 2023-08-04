// pages/my/my.js
const db = wx.cloud.database();
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    show_login: false,
    username: '',
    password: '',
    is_login: false,
  },

  loginAdmin() {
    let that = this;
    wx.showToast({
      title: '登录中',
    });
    if (that.data.username == '' || that.data.password == '') {
      wx.showToast({
        title: '请输入帐号或密码',
        icon: 'none',
      });
    } else {
      that.setData({
        is_login: true,
      });
      db.collection('admin')
        .where({
          username: that.data.username,
          password: that.data.password,
        })
        .get()
        .then((res) => {
          console.log('管理员登录', res);
          that.setData({
            is_login: false,
          });
          wx.hideLoading();
          if (res.data.length == 0) {
            wx.showToast({
              title: '账号或密码错误',
              icon: 'none',
            });
          } else {
            app.globalData.admin = res.data[0];
            wx.navigateTo({
              url: '../admin_index/admin_index',
            });
          }
        });
    }
  },

  // 后台管理——输入用户信息
  inputMsg(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]: e.detail.value,
    });
  },

  // 显示登录框
  showLoginBox() {
    this.setData({
      show_login: true,
    });
    wx.hideTabBar();
  },

  // 关闭登录框
  closeLoginBox() {
    this.setData({
      show_login: false,
    });
    wx.showTabBar();
  },

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
        console.log(res);
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
