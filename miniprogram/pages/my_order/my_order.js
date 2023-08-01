// pages/my_order/my_order.js
const db = wx.cloud.database();

const timeConverter = require('../../utils/time.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '已付款',
    order: [],
  },

  // 确认收货
  confirmReceipt(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否收货',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '确认收货中',
          });
          db.collection('order')
            .doc(id)
            .update({
              data: {
                type: '已完成',
              },
            })
            .then((order) => {
              console.log(order);
              wx.hideLoading();
              that.getOrder(that.data.title);
            });
        }
        if (res.cancel) {
        }
      },
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

  // 获取订单
  // 👉🏻 根据订单类型获取
  getOrder(type) {
    let that = this;
    wx.showLoading({
      title: '获取订单中',
    });
    db.collection('order')
      .where({
        type: type,
      })
      .orderBy('time', 'desc')
      .get()
      .then((res) => {
        wx.hideLoading();
        that.setData({
          order: that.convertTime(res.data),
        });
        console.log('订单详情页——获取订单成功', res.data);
      })
      .catch((err) => {
        console.log('订单详情页——获取订单失败', err);
      });
  },

  // 订单——标题栏选择
  selectTitle(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      title: name,
    });
    that.getOrder(name);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.setData({
      title: options.type,
    });
    that.getOrder(options.type);
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
