// pages/admin_upload_product/admin_upload_product.js
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    product_types: [],
    product_types_selected: '',
    name: '',
    original_price: 0,
    price: 0,
    input_specs: '',
    specs: [],
    img_swiper: [],
    img_detail: [],
  },

  // 提交
  async submit() {
    let that = this;
    let img_swiper = that.data.img_swiper;
    let img_detail = that.data.img_detail;

    wx.showLoading({
      title: '上传中',
    });

    for (let i = 0; i < img_swiper.length; i++) {
      let timestamp = new Date().getTime();
      await wx.cloud
        .uploadFile({
          cloudPath: 'products_detail/' + timestamp + '' + i + '' + '.jpg',
          filePath: img_swiper[i], // 文件路径
        })
        .then(async (res) => {
          // get resource ID
          console.log(res.fileID);
          img_swiper[i] = res.fileID;
          if (i + 1 == img_swiper.length) {
            for (let j = 0; j < img_detail.length; j++) {
              let timestamp_1 = new Date().getTime();
              await wx.cloud
                .uploadFile({
                  cloudPath:
                    'products_detail/' + timestamp_1 + '' + j + '' + '.jpg',
                  filePath: img_detail[j], // 文件路径
                })
                .then((res_1) => {
                  // get resource ID
                  console.log(res_1.fileID);
                  img_detail[j] = res_1.fileID;
                  if (j + 1 == img_detail.length) {
                    wx.cloud
                      .callFunction({
                        name: 'product',
                        data: {
                          product_types_selected:
                            that.data.product_types_selected,
                          name: that.data.name,
                          original_price: that.data.original_price,
                          price: that.data.price,
                          specs: that.data.specs,
                          img_swiper: img_swiper,
                          img_detail: img_detail,
                        },
                      })
                      .then((res) => {
                        wx.hideLoading();
                        console.log(res);
                      });
                  }
                })
                .catch((error) => {
                  // handle error
                  console.log(error);
                });
            }
          }
        })
        .catch((error) => {
          // handle error
        });
    }
  },

  // 获取分类集合
  getProductTypes() {
    let that = this;
    db.collection('product_types')
      .get()
      .then((res) => {
        console.log('获取分类集合', res.data);
        that.setData({
          product_types: res.data,
        });
      });
  },

  // 删除规格
  deleteSpecs(e) {
    console.log(e);
    let that = this;
    let index = e.currentTarget.dataset.index;
    let specs = that.data.specs;

    wx.showModal({
      title: '提示',
      content: '是否删除此规格',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确认');
          specs.splice(index, 1);
          that.setData({
            specs: specs,
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
    });
  },

  // 删除图片
  deleteImg(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    if (name == 'img_swiper') {
      let img = that.data.img_swiper;
      wx.showModal({
        title: '提示',
        content: '是否删除此图片',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确认');
            img.splice(index, 1);
            that.setData({
              img_swiper: img,
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    } else if (name == 'img_detail') {
      let img = that.data.img_detail;
      wx.showModal({
        title: '提示',
        content: '是否删除此图片',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确认');
            img.splice(index, 1);
            that.setData({
              img_detail: img,
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    }
  },

  // 添加图片
  addImg(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    if (name == 'img_swiper') {
      let img = that.data.img_swiper;
      wx.chooseMedia({
        count: 9 - img.length,
        mediaType: ['image', 'video'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success(res) {
          let tempFilePaths = [];
          res.tempFiles.forEach((tempFile) => {
            tempFilePaths.push(tempFile.tempFilePath);
            console.log(tempFilePaths);
          });
          that.setData({
            img_swiper: img.concat(tempFilePaths),
          });
        },
      });
    } else if (name == 'img_detail') {
      let img = that.data.img_detail;
      wx.chooseMedia({
        count: 9 - img.length,
        mediaType: ['image', 'video'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success(res) {
          let tempFilePaths = [];
          res.tempFiles.forEach((tempFile) => {
            tempFilePaths.push(tempFile.tempFilePath);
            console.log(tempFilePaths);
          });
          that.setData({
            img_detail: img.concat(tempFilePaths),
          });
        },
      });
    }
  },

  // 添加规格
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

    if (name == 'original_price' || name == 'price') {
      console.log(name);
      console.log(e.detail);
      that.setData({
        [name]: parseFloat((e.detail * 1).toFixed(2)),
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
  onLoad(options) {
    let that = this;
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
