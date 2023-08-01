// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  if (event.method == 'getOrderInStatBar') {
    return await db
      .collection('order')
      .where({
        type: event.stat,
      })
      .orderBy('time', 'desc')
      .skip(event.skip)
      .get();
  } else if (event.method == 'deliverGoods') {
    return await db
      .collection('order')
      .doc(event.id)
      .update({
        data: {
          logistics: event.logistics,
          type: '运输中',
          logistics_time: db.serverDate(),
        },
      });
  } else if (event.method == 'cancelOrder') {
    return await db
      .collection('order')
      .doc(event.id)
      .update({
        data: {
          type: '售后',
          afterSalesStat: '售后成功',
        },
      });
  }
};
