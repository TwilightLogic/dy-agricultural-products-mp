// pages/product_detail/product_detail.js

const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    select_num: 1,
  },

  // 立即购买
  buyNow() {
    let that = this;
    let product = that.data.product;
    let goods = [];
    if (that.data.select_specs == '') {
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
      });
    } else {
      let goods_list = {
        product_id: product._id,
        product_img: product.img_swiper[0],
        product_name: product.name,
        product_price: product.price,
        product_specs: that.data.select_specs,
        product_num: that.data.select_num,
      };
      goods.push(goods_list);
      wx.setStorage({
        key: 'goods',
        data: goods,
      });
      wx.navigateTo({
        url: '../order/order',
      });
    }
  },

  // 规格选择
  selectSpecs(e) {
    let that = this;
    let specs = e.currentTarget.dataset.specs;
    that.setData({
      select_specs: specs,
    });
  },

  // 选择商品数量
  changeSelectNum(e) {
    let that = this;
    that.setData({
      select_num: e.detail,
    });
  },

  // 添加到购物车
  addToCart() {
    let that = this;
    let product = that.data.product;

    wx.showLoading({
      title: '添加中',
    });
    // 这里做了一个检查用户是否重复添加商品的操作
    db.collection('shopping_cart')
      .where({
        product_id: product._id,
      })
      .get()
      .then((res) => {
        if (res.data.length > 0) {
          wx.hideLoading();
          wx.showToast({
            title: '商品已存在',
            icon: 'none',
          });
        } else {
          db.collection('shopping_cart')
            .add({
              data: {
                product_id: product._id,
                product_img: product.img_swiper[0],
                product_name: product.name,
                product_price: product.price,
                product_num: that.data.select_num,
                time: db.serverDate(),
              },
            })
            .then((res) => {
              wx.hideLoading();
              wx.showToast({
                title: '添加成功',
              });
              console.log('添加购物车', res);
            });
        }
      });
  },

  // 获取商品详情信息
  get_product(id) {
    let that = this;
    wx.showLoading({
      title: '加载中',
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
