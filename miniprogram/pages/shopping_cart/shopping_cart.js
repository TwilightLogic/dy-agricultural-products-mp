// pages/shopping_cart/shopping_cart.js
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    product_list: [],
    all_price: 0,
    select_result: [],
  },

  // 计算总价
  getAllPrice(product) {
    let that = this;
    let all_price = 0;
    let product_list = that.data.product_list;

    if (product.length == 0) {
      that.setData({
        all_price: 0,
      });
    }

    for (let i = 0; i < product.length; i++) {
      let index = parseInt(product[i]);
      all_price =
        all_price +
        product_list[index].product_num * product_list[index].product_price;

      if (i + 1 == product.length) {
        that.setData({
          all_price: parseFloat((all_price * 100).toFixed(2)),
        });
      }
    }
  },

  // 购物车选择商品
  selectProduct(e) {
    let that = this;
    let select_product = e.detail;
    that.setData({
      select_result: select_product,
    });
    that.getAllPrice(select_product);
  },

  // 获取购物车
  getShoppingCart() {
    let that = this;
    wx.showLoading({
      title: '获取中...',
    });
    db.collection('shopping_cart')
      .orderBy('time', 'desc')
      .get()
      .then((res) => {
        wx.hideLoading();
        console.log('获取购物车', res);
        that.setData({
          product_list: res.data,
        });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.getShoppingCart();
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
