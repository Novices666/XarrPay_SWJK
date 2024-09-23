import axios from "axios";


// https://xiandan.apifox.cn/

export async function url_get_uid(Base64Text: string): Promise<any> {
  try {
    const res = await axios.post('/api/WeChat_Pc/CreateID?data=' + Base64Text);
    console.log(res);
    if (res.data.code === '1') {
      console.log("axios:" + res.data.uid);
      return res.data.uid; // 此处返回 uid
    } else {
      console.log('通道创建失败，请重试');
      return undefined; // 返回 undefined 表示失败
    }
  } catch (err) {
    console.log(err);
    console.log('通道创建失败，请重试');
    return undefined; // 返回 undefined 表示异常
  }
}


export async function url_get_qrCode(uid: string): Promise<any> {
  try {
    const res = await axios.post('/api/WeChat_Pc/QRCode?uid=' + uid);
    console.log(res);
    if (res.data.code === '1') {
      console.log(res.data.url);
      return res.data.url; // 返回生成的二维码 URL
    } else {
      console.log('二维码生成失败，请重试');
      return undefined; // 返回 undefined 表示失败
    }
  } catch (err) {
    console.log(err);
    console.log('二维码生成失败，请重试');
    return undefined; // 返回 undefined 表示异常
  }
}


export async function url_get_qrCode_status(uid: string): Promise<any> {
  try {
    const res = await axios.post('/api/WeChat_Pc/IsLoginStatus?uid=' + uid);
    console.log(res);
    return res.data.code; // 返回登录状态代码
  } catch (err) {
    console.log(err);
    console.log('登录状态获取失败，请重试');
    return undefined; // 返回 undefined 表示异常
  }
}



