// 云函数代码
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    body: '广州康盛农业科技',
    outTradeNo: '121775' + new Date().getTime(),
    spbillCreateIp: '127.0.0.1',
    subMchId: '1654142664',
    totalFee: 1,
    envId: 'cloud1-9g7ndjtrbeb3a024',
    functionName: 'pay_cb',
  });
  return res;
};

// 小程序代码
wx.cloud.callFunction({
  name: '函数名',
  data: {
    // ...
  },
  success: (res) => {
    const payment = res.result.payment;
    wx.requestPayment({
      ...payment,
      success(res) {
        console.log('pay success', res);
      },
      fail(err) {
        console.error('pay fail', err);
      },
    });
  },
  fail: console.error,
});
