// pages/category/category.js
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    product_types: [{ name: '当季推荐' }],
    select_product_type: '当季推荐',
  },

  // 获取对应商品
  getGoods(select_product_type) {
    let that = this;
    if (select_product_type == '全部') {
      db.collection('products')
        .get()
        .then((res) => {
          console.log('分类页面获取商品', res.data);
        });
    } else {
      db.collection('products')
        .where({
          product_types_selected: select_product_type,
        })
        .get()
        .then((res) => {
          console.log('分类页面获取商品', res.data);
        });
    }
  },

  // 选择商品类型
  selectProductType(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    that.setData({
      select_product_type: name,
    });
    that.getGoods(name);
  },

  // 获取云端数据库的商品类型
  getProductTypes() {
    let that = this;
    let product_type = that.data.product_types;

    db.collection('product_types')
      .orderBy('_id', 'asc')
      .get()
      .then((res) => {
        console.log('获取分类', res.data);
        that.setData({
          product_types: product_type.concat(res.data),
        });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.getProductTypes();
    that.getGoods('当季推荐');
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
