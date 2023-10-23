const app = getApp();
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiper: [], // 轮播图是一个数组
    product_list: [],
    search_list: [],
    is_show_search_box: false,
  },

  close_search_box() {
    this.setData({
      is_show_search_box: false,
    });
  },

  show_search_box() {
    this.setData({
      is_show_search_box: true,
    });
  },

  // 搜索框事件
  search(e) {
    let that = this;
    if (e.detail) {
      db.collection('products')
        .where({
          name: db.RegExp({
            regexp: e.detail,
            options: 'i',
          }),
        })
        .get()
        .then((res) => {
          console.log('搜索', res);
          that.setData({
            search_list: res.data,
          });
        });
    } else {
      that.setData({
        search_list: [],
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    // 获取轮播图
    db.collection('swiper').get({
      success: (res) => {
        console.log('轮播图获取成功', res);
        that.setData({
          swiper: res.data,
        });
      },
      fail: (err) => {
        console.log('轮播图获取失败', err);
      },
    });
    // 获取商品列表
    db.collection('products').get({
      success: (res) => {
        console.log('商品获取成功', res);
        that.setData({
          product_list: res.data,
        });
      },
      fail: (err) => {
        console.log('商品获取失败', err);
      },
    });
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
