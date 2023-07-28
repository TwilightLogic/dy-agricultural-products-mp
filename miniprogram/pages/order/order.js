// pages/order/order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    goods: {},
    remarks: '',
    all_price: 0,
  },

  // 备注
  inputRemarks(e) {
    this.setData({
      remarks: e.detail.value,
    });
  },

  // 获取地址
  getAddress() {
    let that = this;
    wx.chooseAddress({
      success(res) {
        console.log('我的地址', res);
        that.setData({
          address: res,
        });
      },
    });
  },

  // 获取商品
  getGoods() {
    let that = this;
    wx.getStorage({
      key: 'goods',
      success(res) {
        console.log('商品', res.data);
        that.setData({
          goods: res.data,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.getGoods();
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
