/*
 * @Description:  百度翻译接入
 * @FilePath: /chinese-to-english/src/combine/baidu-fanyi.ts
 */
const md5 = require("js-md5");
import axios from "axios";

class BaiduFanyi {
  sign: string;
  appid: string;
  secret: string;
  salt: string;
  text: string;
  translateText: string;
  loading: boolean;
  soure: any;

  constructor() {
    this.sign = '';
    this.appid = "20220109001051245";
    this.secret = '0Yz3IQkCX4J8Wusgy8TX';
    this.salt = '';
    this.text = '';
    this.translateText = '';
    this.loading = false;
  }

  setSign(text: string) {
    this.salt = String(Math.floor(Math.random() * 100000));
    this.text = text;
    this.sign = md5(`${this.appid}${this.text}${this.salt}${this.secret}`);
  }

  async getTranslateRes(text: string) {
    if (this.loading) {
      this.soure.cancel('关闭前一次请求');
    }
    this.setSign(text);
    await this.translate();
    return {
      translateTool: '百度翻译',
      translateString: this.translateText, //翻译结果
      isZH: /[\u4e00-\u9fa5]/.test(this.text), //是否中文
      humpResult: this.getHumpResult(this.translateText)
    };
  }

  /**
   * @description: 驼峰命名
   * @Date: 2022-01-13 16:55:09
   * @Author: ytang5
   * @LastEditors: ytang5
   */
  getHumpResult(str: string) {
    if (!str) {
      return '';
    }
    const res = str.replace(/[^\d|^a-zA-Z|^\s]/g, '');
    const arr = res.split(' ');
    let result = '';
    for (let i = 0; i < arr.length; i++) {
      let itemEn = '';
      if (i > 0) {
        itemEn = arr[i].slice(0, 1)?.toUpperCase() + arr[i].slice(1, arr[i].length);
      } else {
        itemEn = arr[i].slice(0, 1)?.toLowerCase() + arr[i].slice(1, arr[i].length);
      }
      result = result + itemEn;
    }

    return result;
  }

  translate() {
    const axiosCancelToken = axios.CancelToken;
    const source = axiosCancelToken.source();
    this.loading = true;
    this.soure = source;
    const params = {
      from: 'en',
      to: 'zh'
    };
    if (/[\u4e00-\u9fa5]/.test(this.text)) { //中文
      params.from = 'zh';
      params.to = 'en';
    }
    return axios.get(`https://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURI(
      this.text
    )}&from=${params.from}&to=${params.to}&appid=${this.appid}&salt=${this.salt}&sign=${this.sign
      }`,
      {
        cancelToken: source.token
      }
    )
      .then((res) => {
        const data = res?.data?.trans_result?.[0];
        if (!data) {
          this.translateText = '';
          return;
        }
        this.translateText = data?.dst || data?.src;
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('axioserr', err);
        }
        console.log("错误", err);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}

export default new BaiduFanyi();