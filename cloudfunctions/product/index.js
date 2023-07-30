// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  return await db.collection('products').add({
    data: {
      time: db.serverDate(),
      product_types_selected: event.product_types_selected,
      name: event.name,
      original_price: event.original_price,
      price: event.price,
      specs: event.specs,
      img_swiper: event.img_swiper,
      img_detail: event.img_detail,
    },
  });
};
