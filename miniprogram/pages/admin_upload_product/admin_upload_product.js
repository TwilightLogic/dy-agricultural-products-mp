// pages/admin_upload_product/admin_upload_product.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    original_price: 0,
    price: 0,
    input_specs: '',
    specs: [],
  },

  addSpecs(e) {
    let that = this;
    if (that.data.input_specs) {
      let specs = that.data.specs;
      specs.push(that.data.input_specs);
      that.setData({
        specs: specs,
        input_specs: '',
      });
    } else {
      wx.showToast({
        title: '请输入商品的规格',
        icon: 'none',
      });
    }
  },

  // 商品信息——输入事件
  inputMsg(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    console.log(e);

    if (name == 'orginal_price' || name == 'price') {
      that.setData({
        [name]: parseFloat((e.target.value * 1).toFixed(2)),
      });
    } else {
      that.setData({
        [name]: e.detail,
      });
    }
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
