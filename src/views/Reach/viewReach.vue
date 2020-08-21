<template>
  <div class="view_reach">
    <div class="top">
      <van-nav-bar title="产品供应信息" left-text="返回" left-arrow @click-left="$router.go('-1')" />
    </div>
    <div class="wrapper">
      <div class="container">
        <div class="content">
          <el-divider content-position="center">产品信息</el-divider>
          <ul class="good_top">
            <li>
              <el-row>
                <el-col :span="6">
                  <span class="li_name">商品名称：</span>
                </el-col>
                <el-col :span="16">{{reachForm.productname}}</el-col>
              </el-row>
            </li>
            <li>
              <el-row>
                <el-col :span="6">
                  <span class="li_name">商品规格：</span>
                </el-col>
                <el-col :span="16">{{reachForm.productspec}}</el-col>
              </el-row>
            </li>
            <li>
              <el-row>
                <el-col :span="6">
                  <span class="li_name">订单单号：</span>
                </el-col>
                <el-col :span="16">{{reachForm.docno}}</el-col>
              </el-row>
            </li>
          </ul>

          <div class="goods-area">
            <ul v-if="reachForm.productimgs || reachForm.qualifications">
              <li class="item_img" v-if="reachForm.productimgs">
                <div v-if="reachForm.productimgs.length > 0">
                  <el-divider content-position="center">产品图片</el-divider>
                  <el-row>
                    <div v-for="(item,index) in reachForm.productimgs" :key="index">
                      <el-col :span="8">
                        <div class="item_img">
                          <img
                            :src="pictureserverurl+item.thumbnailpath"
                            :large="pictureserverurl+item.fildpath"
                            preview="1"
                            preview-text="产品图片"
                            class="avatar"
                          />
                        </div>
                      </el-col>
                    </div>
                  </el-row>
                </div>
              </li>

              <li class="item_img" v-if="reachForm.qualifications">
                <div v-if="reachForm.qualifications.length > 0">
                  <el-divider content-position="center">资质证书</el-divider>
                  <el-row>
                    <div v-for="(item,index) in reachForm.qualifications" :key="index">
                      <el-col :span="8">
                        <div class="item_img">
                          <img
                            :src="pictureserverurl+item.thumbnailpath"
                            :large="pictureserverurl+item.fildpath"
                            preview="2"
                            preview-text="资质证书"
                            class="avatar"
                          />
                        </div>
                      </el-col>
                    </div>
                  </el-row>
                </div>
              </li>
            </ul>

            <el-divider v-if="reachForm.doctype==1" content-position="center">供应信息</el-divider>
            <el-divider v-if="reachForm.doctype==2" content-position="center">团购信息</el-divider>
            <ul>
              <li v-if="reachForm.doctype==2">
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">成团数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{reachForm.groupbuyqty|formatNumber}} {{reachForm.company}}</el-col>
                </el-row>
              </li>

              <li v-if="reachForm.doctype==2">
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">参团数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{reachForm.quantityordered|formatNumber}} {{reachForm.company}}</el-col>
                </el-row>
              </li>

              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">价格区间：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{reachForm.minprice | formatMoney}}~{{reachForm.maxprice | formatMoney}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">交期天数：</span>
                  </el-col>
                  <el-col :span="16" style="color:red">{{reachForm.deliverydays|formatNumber}}天</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">税 率：</span>
                  </el-col>
                  <el-col :span="16">{{reachForm.taxrate|formatsuilv}}</el-col>
                </el-row>
              </li>

              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">付款方式：</span>
                  </el-col>
                  <el-col :span="16">{{reachForm.paytype}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">物流费用：</span>
                  </el-col>
                  <el-col :span="16">{{reachForm.undertaker}}</el-col>
                </el-row>
              </li>

              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">每份数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{reachForm.startqty | formatNumber}} {{reachForm.company}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">供应数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                  >{{reachForm.groupbuyqty | formatNumber}}{{reachForm.company}} / {{reachForm.copies}} 份</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">剩余数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{reachForm.groupbuyqty - reachForm.quantityordered | formatNumber}}{{reachForm.company}} / {{reachForm.copies - reachForm.copiesOrdered}}份</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">保证金：</span>
                  </el-col>
                  <el-col :span="16" style="color:red">{{reachForm.bondamt}}</el-col>
                </el-row>
              </li>

              <li v-if="reachForm.doctype==2">
                <el-row
                  v-if="reachForm.dd>0 || reachForm.hh >'00' || reachForm.mm>'00' || reachForm.ss>'00'"
                >
                  <el-col :span="6">
                    <div class="li_name">拼团倒计时：</div>
                  </el-col>
                  <el-col :span="16">
                    <div
                      class="pay_type"
                      style="color:red"
                    >{{reachForm.dd}}天 {{reachForm.hh}}:{{reachForm.mm}}:{{reachForm.ss}}</div>
                  </el-col>
                </el-row>
              </li>

              <el-divider content-position="right"></el-divider>

              <li v-if="reachForm.doctype==1">
                <el-row>
                  <el-col :span="6" style="height: 38px;line-height: 38px;">
                    <span class="li_name">订购份数：</span>
                  </el-col>
                  <el-col :span="16">
                    <el-input-number
                      v-model="num"
                      :min="1"
                      :max="orderable"
                      label="订购份数"
                      :step="1"
                      step-strictly
                    ></el-input-number>
                  </el-col>
                </el-row>
                <el-row style="height: 38px;line-height: 38px;">
                  <el-col :span="6">
                    <span class="li_name">订购数量：</span>
                  </el-col>
                  <el-col :span="16">{{quantity}} {{reachForm.company}}</el-col>
                </el-row>
                <el-row style="height: 38px;line-height: 38px;">
                  <el-col :span="6">
                    <span class="li_name">应付保证金：</span>
                  </el-col>
                  <el-col :span="16">{{bondamt}}</el-col>
                </el-row>

                <el-row>
                  <el-col :span="6">
                    <span class="li_name">余额：</span>
                  </el-col>
                  <el-col :span="8" v-if="purchaserForm.zfzye == null">0.00</el-col>
                  <el-col :span="8" v-else>{{purchaserForm.zfzye }}</el-col>
                </el-row>

                <el-row>
                  <el-col :span="6">
                    <span class="li_name">可用余额：</span>
                  </el-col>

                  <el-col :span="16">{{ money }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">本次应支付：</span>
                  </el-col>

                  <el-col :span="16" style="color:red">{{ PayMoney }}</el-col>
                </el-row>

                <div style="text-align: center;margin-top: 20px;">
                  <el-button
                    icon="el-icon-shopping-bag-1"
                    type="primary"
                    round
                    @click="putorder(1)"
                  >抢购</el-button>
                </div>
              </li>

              <li v-if="reachForm.doctype==2">
                <el-row style="height: 38px;line-height: 38px;">
                  <el-col :span="6">
                    <span class="li_name">参团份数：</span>
                  </el-col>
                  <el-col :span="16">
                    <el-input-number
                      v-model="purform.quantity"
                      :max="reachForm.copies"
                      :min="1"
                      label="参团份数"
                      :step="1"
                      step-strictly
                    ></el-input-number>
                  </el-col>
                </el-row>
                <el-row style="height: 38px;line-height: 38px;">
                  <el-col :span="6">
                    <span class="li_name">参团数量：</span>
                  </el-col>
                  <el-col :span="16">{{groupQuantity}}</el-col>
                </el-row>
                <el-row style="height: 38px;line-height: 38px;">
                  <el-col :span="6">
                    <span class="li_name">应付保证金：</span>
                  </el-col>
                  <el-col :span="16">{{bondAmt}}</el-col>
                </el-row>

                <el-row>
                  <el-col :span="6">
                    <span class="li_name">余额：</span>
                  </el-col>
                  <el-col :span="8" v-if="purchaserForm.zfzye == null">0.00</el-col>
                  <el-col :span="8" v-else>{{purchaserForm.zfzye }}</el-col>
                </el-row>

                <el-row>
                  <el-col :span="6">
                    <span class="li_name">可用余额：</span>
                  </el-col>

                  <el-col :span="16">{{ money }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">本次应支付：</span>
                  </el-col>

                  <el-col :span="16" style="color:red">{{ payMoney }}</el-col>
                </el-row>

                <div style="text-align: center;margin-top: 20px;">
                  <el-button
                    icon="el-icon-shopping-bag-1"
                    type="primary"
                    round
                    @click="putorder(2)"
                  >参团</el-button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let self;
import axios from "axios";
import { formatMoney } from "../DataFormator.js";
import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";
export default {
  computed: {
    orderable() {
      var orderable = this.reachForm.copies - this.reachForm.copiesOrdered;

      return orderable;
    },
    quantity() {
      var quantity = this.reachForm.startqty * this.num;
      return quantity;
    },
    bondamt() {
      var bondamt = (this.num / this.reachForm.copies) * this.reachForm.bondamt;
      return bondamt.toFixed(2);
    },
    bondAmt() {
      var bondAmt =
        (this.purform.quantity / this.reachForm.copies) *
        this.reachForm.bondamt;
      return bondAmt.toFixed(2);
    },
    groupQuantity() {
      var groupQuantity = this.purform.quantity * this.reachForm.startqty;
      return groupQuantity;
    },
    payMoney() {
      if (this.bondAmt < this.money || this.bondAmt == this.money) {
        var payMoney = 0.0;
      }
      if (this.bondAmt > this.money) {
        var payMoney = this.bondAmt - this.money;
      }

      return payMoney.toFixed(2);
    },
    PayMoney() {
      if (this.bondamt < this.money || this.bondamt == this.money) {
        var PayMoney = 0.0;
      }
      if (this.bondamt > this.money) {
        var PayMoney = this.bondamt - this.money;
      }
      return PayMoney.toFixed(2);
    }
  },
  filters: {
    formatsuilv(val) {
      if (val == 0.13) {
        return "含税13%";
      } else {
        return "不含税";
      }
    },
    formatMoney(data) {
      return formatMoney(data);
    },
    formatNumber(num) {
      var num = (num || 0).toString(),
        result = "";
      while (num.length > 3) {
        result = "," + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
      }
      if (num) {
        result = num + result;
      }
      return result;
    }
  },
  viewType: "",
  name: "viewReach",
  data() {
    return {
      reachForm: { dd: "00", hh: "00", mm: "00", ss: "00" },
      purform: {
        quantity: "1"
      },
      viewType: "",
      num: 1,
      orderId: "",
      purchaserForm: null,
      money: ""
      // payMoney:""
    };
  },
  rules: {
    quantity: [{ required: true, message: "请录入数量", trigger: "blur" }]
  },
  mounted() {
    self = this;
    self.viewType = localStorage.getItem("viewType");
    self.countTime();
    self.getViewReach();
    self.getPurchaser();
  },
  methods: {
    getViewReach() {
      var ViewReachOID = localStorage.getItem("ViewReachOID");
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      self.$axios
        .get(self.url + "/api/ProductPublish/GetOrder?id=" + ViewReachOID)
        .then(res => {
          // console.log(res.data.data);
          res.data.data.dd = "0";
          res.data.data.hh = "00";
          res.data.data.mm = "00";
          res.data.data.ss = "00";

          self.reachForm = res.data.data;

          self.countTime();
        })
        .catch(err => {
          console.log(err);
        });
    },
    onBridgeReady(params) {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: params.appId, //公众号名称，由商户传入
          timeStamp: params.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: params.nonceStr, //随机串
          package: params.package,
          signType: params.signType, //微信签名方式：
          paySign: params.paySign //微信签名
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // Notify({ type: "success", message: "支付成功！" });

            self.$axios
              .post(
                self.url +
                  "/api/Pruchase/BatchSubmitPurchase?batchOperationDto=" +
                  self.orderId,

                {
                  headers: {
                    "Content-Type": "application/json-patch+json"
                  }
                }
              )
              .then(res => {
                if (res.data.statusCode == 0) {
                  // self.refreshData();
                  self.$router.push("myOrder");
                }
              })
              .catch(() => {
                self.$router.push("noSubmit");
              });
          }
        }
      );
    },
    submitGroup() {
      var token = localStorage.getItem("loginToken");
      self.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      self.$axios
        .post(
          self.url + "/api/Pruchase/SubmitPurchase",
          {
            kzproductFk: self.reachForm.kzproductoid,
            copies: self.purform.quantity
          },
          {
            headers: {
              "Content-Type": "application/json-patch+json"
            }
          }
        )
        .then(res => {
          if (res.data.statusCode == 1) {
            if (res.data.statusCode == 1) {
              var ua = window.navigator.userAgent.toLowerCase();

              if (ua.match(/MicroMessenger/i) == "micromessenger") {
                const pay_params = res.data.data;

                if (typeof WeixinJSBridge == "undefined") {
                  if (document.addEventListener) {
                    document.addEventListener(
                      "WeixinJSBridgeReady",
                      onBridgeReady,
                      false
                    );
                  } else if (document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                    document.attachEvent(
                      "onWeixinJSBridgeReady",
                      onBridgeReady
                    );
                  }
                } else {
                  self.onBridgeReady(pay_params);
                }
              } else {
                window.location.href = res.data.data.mWebUrl;
              }
              self.$router.push("myOrder");
            }

            self.orderId = res.data.data.billId;
          }
          if (res.data.statusCode == 0) {
            self.$message({
              message: res.data.resultMsg,
              type: "success"
            });
            self.$router.push("myorder");
          } else {
            self.$message({
              message: res.data.resultMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submit() {
      var token = localStorage.getItem("loginToken");
      self.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      self.$axios
        .post(
          self.url + "/api/Pruchase/SubmitPurchase",
          {
            kzproductFk: self.reachForm.kzproductoid,
            copies: self.num
          },
          {
            headers: {
              "Content-Type": "application/json-patch+json"
            }
          }
        )
        .then(res => {
          if (res.data.statusCode == 1) {
            if (res.data.statusCode == 1) {
              var ua = window.navigator.userAgent.toLowerCase();

              if (ua.match(/MicroMessenger/i) == "micromessenger") {
                const pay_params = res.data.data;

                if (typeof WeixinJSBridge == "undefined") {
                  if (document.addEventListener) {
                    document.addEventListener(
                      "WeixinJSBridgeReady",
                      onBridgeReady,
                      false
                    );
                  } else if (document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                    document.attachEvent(
                      "onWeixinJSBridgeReady",
                      onBridgeReady
                    );
                  }
                } else {
                  self.onBridgeReady(pay_params);
                }
              } else {
                window.location.href = res.data.data.mWebUrl;
              }

              // self.$router.push("myOrder");
            }

            self.orderId = res.data.data.billId;
          }
          if (res.data.statusCode == 0) {
            self.$message({
              message: res.data.resultMsg,
              type: "success"
            });
            self.$router.push("myorder");
          }
          if (res.data.statusCode == 9) {
            self.$message({
              message: "用户信息正在审核，您暂时还不能订购",
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    putorder(type) {
      if (type == 2) {
        if (self.payMoney > 0) {
          Dialog.confirm({
            title: "提示",
            message: "本次要支付" + self.payMoney + "，确认要支付吗？"
          })
            .then(() => {
              self.submitGroup();
            })
            .catch(() => {});
        } else {
          Dialog.confirm({
            title: "提示",
            message: "确认要订购吗？"
          })
            .then(() => {
              self.submitGroup();
            })
            .catch(() => {});
        }
      }

      if (type == 1) {
        if (self.PayMoney > 0) {
          Dialog.confirm({
            title: "提示",
            message: "本次要支付" + self.PayMoney + "，确认要支付吗？"
          })
            .then(() => {
              self.submit();
            })
            .catch(() => {});
        } else {
          Dialog.confirm({
            title: "提示",
            message: "确认要订购吗？"
          })
            .then(() => {
              self.submit();
            })
            .catch(() => {});
        }
      }
    },
    countTime() {
      setInterval(self.countTimes, 1000);
    },
    countTimes() {
      if (self.reachForm.doctype == 2) {
        // 获取当前时间
        let date = new Date();
        let now = date.getTime();
        // 设置截止时间
        let endDate = new Date(self.reachForm.groupendtime); // self.curStartTime需要倒计时的日期
        let end = endDate.getTime();
        // 时间差
        let leftTime = end - now;
        // 定义变量 d,h,m,s保存倒计时的时间
        if (leftTime >= 0) {
          // 天
          self.reachForm.dd = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          // 时
          let h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
          self.reachForm.hh = h < 10 ? "0" + h : h;
          // 分
          let m = Math.floor((leftTime / 1000 / 60) % 60);
          self.reachForm.mm = m < 10 ? "0" + m : m;
          // 秒
          let s = Math.floor((leftTime / 1000) % 60);
          self.reachForm.ss = s < 10 ? "0" + s : s;
        } else {
          self.reachForm.dd = 0;
          self.reachForm.hh = "00";
          self.reachForm.mm = "00";
          self.reachForm.ss = "00";
        }
      }
    },
    getPurchaser() {
      var token = localStorage.getItem("loginToken");
      self.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios.defaults.headers.common["Accept"] = "text/plain";
      self.$axios
        .post(
          self.url +
            "/api/User/GetPurchaserEdit?id=" +
            localStorage.getItem("loginId")
        )
        .then(res => {
          self.purchaserForm = res.data.data;
          self.getMoney();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoney() {
      self.money = self.purchaserForm.zfzye - self.purchaserForm.bondamt;
      self.money = self.money.toFixed(2);
    }
  }
};
</script>

<style  scoped>
.view_reach {
  height: 100%;
}
.top {
  height: 46px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
}
.wrapper {
  height: calc(100% - 46px);
  margin-top: 70px;
}
.container {
  height: 100%;
}
ul {
  background: #ffffff;
  margin: 30px 0;
  width: 98%;
  margin-left: 1%;
  border-radius: 20px;
  padding-top: 10px;
  font-size: 14px;
}
ul li {
  /* height: 40px; */
  padding: 5px 0;
  color: black;
  margin-left: 10px;
}
.el-divider {
  height: 2px;
  margin: 16px 0;
}
.li_name {
  color: gray;
}
.el-col.el-col-6 {
  text-align: right;
}
.attribute .el-row {
  padding-left: 10px;
}
</style>
<style>
.view_reach .item_img .el-divider__text.is-center {
  background: #409eff;
  font-size: 10px;
  padding: 4px 10px;
}
.view_reach .el-divider__text.is-center {
  background: #67c23a;
  color: #ffffff;
  padding: 6px 20px;
}
.view_reach .el-input__inner {
  height: 38px !important;
  line-height: 38px !important;
}
</style>