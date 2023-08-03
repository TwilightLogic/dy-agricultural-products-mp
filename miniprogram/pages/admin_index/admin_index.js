// pages/admin_index/admin_index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
  },

  // 获取后台数据
  getData() {
    let that = this;
    wx.cloud
      .callFunction({
        name: 'order',
        data: {
          method: 'getData',
        },
      })
      .then((res) => {
        console.log('后台数据', res);
        that.setData({
          data: res.result,
        });
      });
  },

  navigateToOrder() {
    wx.navigateTo({
      url: '../admin_manage_order/admin_manage_order',
    });
  },

  navigateToManage() {
    wx.navigateTo({
      url: '../admin_manage_product/admin_manage_product',
    });
  },

  navigateToUpLoad() {
    wx.navigateTo({
      url: '../admin_upload_product/admin_upload_product',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.getData();
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
