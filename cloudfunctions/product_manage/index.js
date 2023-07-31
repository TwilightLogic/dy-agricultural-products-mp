// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  if (event.method == 'getProducts') {
    return await db.collection('products').orderBy('time', 'desc').get();
  } else if (event.method == 'search') {
    return await db
      .collection('products')
      .where({
        name: db.RegExp({
          regexp: event.name,
          options: 'i',
        }),
      })
      .orderBy('time', 'desc')
      .get();
  } else if (event.method == 'selectProductType') {
    console.log(event.product_types);
    return await db
      .collection('products')
      .where({
        product_types_selected: event.product_types,
      })
      .orderBy('time', 'desc')
      .get();
  }
};
