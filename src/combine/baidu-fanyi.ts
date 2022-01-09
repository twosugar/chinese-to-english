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

    constructor() {
        this.sign = '';
        this.appid = "20220109001051245";
        this.secret = '0Yz3IQkCX4J8Wusgy8TX';
        this.salt = '';
        this.text = '';
    }

    setSign(text: string) {
        this.salt = "92746" || String(Math.floor(Math.random() * 100000));
        this.text = text;
        this.sign = md5(`${this.appid}${this.text}${this.salt}${this.secret}`);
        this.translate();
    }

    translate() {
          axios({
            method: "GET",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            url: `https://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURI(
              this.text
            )}&from=zh&to=en&appid=${this.appid}&salt=${this.salt}&sign=${
              this.sign
            }`,
          })
            .then((res) => {
              console.log(9993, res);
            })
            .catch((err) => {
              console.log("错误", err);
            });
    }
}

export default new BaiduFanyi();