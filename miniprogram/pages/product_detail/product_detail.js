// pages/product_detail/product_detail.js

const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    product: {},
  },

  // 获取商品详情信息
  get_product(id) {
    let that = this;
    wx.showLoading({
      title: 'Loading...',
    });
    db.collection('products')
      .doc(id)
      .get()
      .then((res) => {
        wx.hideLoading();
        console.log('获取商品详情', res);
        that.setData({
          product: res.data,
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: '获取失败',
          icon: 'error',
        });
        console.log('获取商品失败', err);
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.get_product(options.id);
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
