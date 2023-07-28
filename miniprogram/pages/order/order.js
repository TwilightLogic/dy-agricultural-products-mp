// pages/order/order.js
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    goods: [],
    remarks: '',
    all_price: 0,
  },

  // 下单
  // TODO: 支付功能还没实现
  buyNow() {
    let that = this;
    if (that.data.address == {} || that.data.goods.length == 0) {
      wx.showToast({
        title: '请填写地址',
        icon: 'none',
      });
    } else {
      wx.showLoading({
        title: '下单中',
      });
      db.collection('order')
        .add({
          data: {
            address: that.data.address,
            goods: that.data.goods,
            remarks: that.data.remarks,
            all_price: that.data.all_price,
            time: db.serverDate(),
          },
        })
        .then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: '下单成功',
          });
          // 成功后清除缓存
          wx.removeStorage({
            key: 'goods',
          });
          // 成功后回退到购物车页面
          wx.navigateBack({
            delta: 1,
          });
          console.log('下单成功', res);
        })
        .catch((err) => {
          wx.hideLoading();
          wx.showToast({
            title: '下单失败',
            icon: 'error',
          });
          console.log('下单失败', err);
        });
    }
  },

  // 购物车页面选择商品数量
  selectProductNum(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;

    that.setData({
      ['goods[' + index + '].product_num']: e.detail,
    });

    that.getAllPrice(that.data.goods);
  },

  // 计算总价
  getAllPrice(product) {
    let that = this;
    let all_price = 0;
    let product_list = product;

    for (let i = 0; i < product_list.length; i++) {
      all_price =
        all_price + product_list[i].product_num * product_list[i].product_price;

      if (i + 1 == product_list.length) {
        that.setData({
          all_price: parseFloat(all_price.toFixed(2)),
        });
      }
    }
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
        that.getAllPrice(res.data);
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