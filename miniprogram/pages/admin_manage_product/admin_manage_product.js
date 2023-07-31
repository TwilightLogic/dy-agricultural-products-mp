// pages/admin_manage_product/admin_manage_product.js
const db = wx.cloud.database();
const timeConverter = require('../../utils/time.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    product_types: '全部',
    product_types_list: [{ name: '全部' }],
    products: [],
  },

  // 选择商品类型
  selectProductType(e) {
    let that = this;
    let product_type_selected =
      that.data.product_types_list[e.detail.value * 1].name;
    that.setData({
      product_types: product_type_selected,
    });

    if (product_type_selected == '全部') {
      that.getProducts();
    } else {
      wx.showLoading({
        title: '获取商品类型中',
      });
      console.log(product_type_selected);
      wx.cloud
        .callFunction({
          name: 'product_manage',
          data: {
            method: 'selectProductType',
            product_types: product_type_selected,
          },
        })
        .then((res) => {
          wx.hideLoading();
          console.log('获取搜索商品', res.result.data);
          that.setData({
            products: that.convertTime(res.result.data),
          });
        });
    }
  },

  // 获取分类
  getProductTypes() {
    let that = this;
    db.collection('product_types')
      .get()
      .then((res) => {
        that.setData({
          product_types_list: that.data.product_types_list.concat(res.data),
        });
      });
  },

  // 搜索事件
  search(e) {
    let that = this;
    console.log(e.detail);

    if (e.detail) {
      wx.showLoading({
        title: '搜索中',
      });
      wx.cloud
        .callFunction({
          name: 'product_manage',
          data: {
            method: 'search',
            name: e.detail,
          },
        })
        .then((res) => {
          wx.hideLoading();
          console.log('获取搜索商品', res.result.data);
          that.setData({
            products: that.convertTime(res.result.data),
          });
        });
    } else {
      that.getProducts();
    }
    console.log(e);
  },

  // 时间转换器
  convertTime(list) {
    if (list.length == 0) {
      return list;
    } else {
      for (let i = 0; i < list.length; i++) {
        list[i].time = timeConverter.formatTime(new Date(list[i].time));
        if (i + 1 == list.length) {
          return list;
        }
      }
    }
  },

  // 获取商品
  getProducts() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.cloud
      .callFunction({
        name: 'product_manage',
        data: {
          method: 'getProducts',
        },
      })
      .then((res) => {
        wx.hideLoading();
        console.log('获取商品', res.result.data);
        that.setData({
          products: that.convertTime(res.result.data),
        });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.getProducts();
    that.getProductTypes();
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
