// pages/admin_manage_order/admin_manage_order.js
const db = wx.cloud.database();
const timeConverter = require('../../utils/time.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    order_stat: '已付款',
    order_skip: 0,
    order_id: '',
    show_logistics: false,
    order: [],
    express: ['顺丰快递', '京东快递', '圆通快递'],
    select_express: '请选择快递',
    express_id: '',
    is_submit: false,
  },

  // 取消订单事件
  // - 因为点击“取消订单”后会将商品的type变成“售后”
  cancelOrder(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定');
          that.setData({
            order_skip: 0,
          });
          wx.showLoading({
            title: '取消订单中',
          });
          wx.cloud
            .callFunction({
              name: 'order',
              data: {
                method: 'cancelOrder',
                id,
              },
            })
            .then((order) => {
              console.log(order);
              wx.hideLoading();
              that.getOrder(that.data.order_stat, that.data.order_skip);
            });
        } else if (res.cancel) {
        }
      },
    });
  },

  // “立即发货”事件
  deliverGoods() {
    let that = this;
    if (that.data.select_express == '请选择快递' || !that.data.express_id) {
      wx.showToast({
        title: '请完善快递信息',
        icon: 'none',
      });
    } else {
      wx.showLoading({
        title: '发货中',
      });
      that.setData({
        is_submit: true,
      });
      wx.cloud
        .callFunction({
          name: 'order',
          data: {
            method: 'deliverGoods',
            id: that.data.order_id,
            logistics: {
              select_express: that.data.select_express,
              express_id: that.data.express_id,
            },
          },
        })
        .then((res) => {
          wx.hideLoading();
          that.setData({
            select_express: '请选择快递',
            express_id: '',
            show_logistics: false,
            order_skip: 0,
            is_submit: false,
          });
          that.getOrder('已付款', 0);
        });
    }
  },

  // 输入快递单号
  inputExpressId(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]: e.detail,
    });
  },

  // 选择快递公司
  selectExpress(e) {
    let that = this;
    let index = parseInt(e.detail.value);
    that.setData({
      select_express: that.data.express[index],
    });
  },

  // 关闭物流信息
  closeLogistics(e) {
    this.setData({
      show_logistics: false,
    });
  },

  // 物流信息展示
  showLogistics(e) {
    let that = this;
    that.setData({
      order_id: e.currentTarget.dataset.id,
      show_logistics: true,
    });
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

  // 获取order数据
  getOrder(stat, skip) {
    let that = this;
    wx.showLoading({
      title: '获取中',
    });
    wx.cloud
      .callFunction({
        name: 'order',
        data: {
          method: 'getOrderInStatBar',
          stat,
          skip,
        },
      })
      .then((res) => {
        wx.hideLoading();
        console.log('获取order数据', res.result.data);
        that.setData({
          order: that.convertTime(res.result.data),
        });
      });
  },

  // 选择订单状态
  selectOrderStat(e) {
    let that = this;
    let order_stat = e.currentTarget.dataset.name;
    that.setData({
      order_stat,
      order_id: 0,
    });
    that.getOrder(order_stat, 0);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.getOrder(that.data.order_stat, that.data.order_skip);
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
