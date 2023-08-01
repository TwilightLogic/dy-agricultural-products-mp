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
  } else if (event.method == 'showLogistics') {
    return await db
      .collection('order')
      .doc(event.id)
      .update({
        data: {
          logistics: event.logistics,
        },
      });
  }
};
