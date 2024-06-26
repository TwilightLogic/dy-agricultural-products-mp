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
    is_all: true,
  },

  // 提交订单
  submitOrder() {
    let that = this;
    if (that.data.select_result.length != 0) {
      wx.showLoading({
        title: '提交中...',
      });
      let goods = [];
      for (let i = 0; i < that.data.select_result.length; i++) {
        goods.push(that.data.product_list[that.data.select_result[i] * 1]);
        if (i + 1 == that.data.select_result.length) {
          wx.hideLoading();
          wx.setStorage({
            key: 'goods',
            data: goods,
          });
          wx.navigateTo({
            url: '../order/order?is_from_shopping_cart=true',
          });
        }
      }
    } else {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
      });
    }
  },

  // 长按删除购物车中的商品
  deleteProduct(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '是否删除该商品',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.showLoading({
            title: '删除中...',
          });
          db.collection('shopping_cart')
            .doc(id)
            .remove()
            .then((res) => {
              wx.hideLoading();
              wx.showToast({
                title: '删除成功',
              });
              that.getShoppingCart();
            });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
    });
  },

  // 选择购物车中的所有商品
  selectAllProducts(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    let result = [];

    console.log(name);

    if (name == '全选') {
      for (let i = 0; i < that.data.product_list.length; i++) {
        result.push(i + '');
        if (i + 1 == that.data.product_list.length) {
          that.getAllPrice(result);
          that.setData({
            select_result: result,
            is_all: false,
          });
        }
      }
    } else {
      that.setData({
        select_result: [],
        is_all: true,
        all_price: 0,
      });
    }
  },

  // 购物车页面选择商品数量
  selectProductNum(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;

    that.setData({
      ['product_list[' + index + '].product_num']: e.detail,
    });

    that.getAllPrice(that.data.select_result);

    // 同步更新数据库的product_num
    db.collection('shopping_cart')
      .doc(that.data.product_list[index]._id)
      .update({
        data: {
          product_num: e.detail,
        },
      });
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
        that.getAllPrice([]);
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this;
    that.getShoppingCart();
  },

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
