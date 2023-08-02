// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const _ = db.command;

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
          afterSalesStat: '售后中',
        },
      });
  } else if (event.method == 'getData') {
    let date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    // 待发货
    const waitForDeliver = await db
      .collection('order')
      .where({
        type: '已付款',
      })
      .count();
    // 待售后
    const waitForAfterSales = await db
      .collection('order')
      .where({
        type: '售后',
        afterSalesStat: '待售后',
      })
      .count();
    // 当日订单量
    const salesToday = await db
      .collection('order')
      .where({
        time: _.gte(new Date(year, month, day)),
      })
      .count();
    // 当月订单量
    const salesMonth = await db
      .collection('order')
      .where({
        time: _.gte(new Date(year, month, 1)),
      })
      .count();

    return { waitForDeliver, waitForAfterSales, salesToday, salesMonth };
  }
};
