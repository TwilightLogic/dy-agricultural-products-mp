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
    express: ['顺丰快递', '京东快递'],
    select_express: '请选择快递',
  },

  // “立即发货”事件
  deliverGoods(id) {
    let that = this;
    wx.cloud.callFunction({
      name: 'order',
      data: {
        method: 'deliverGoods',
        id: '',
        logistics: '',
      },
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
    });
    // that.getOrder(order_stat);
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
