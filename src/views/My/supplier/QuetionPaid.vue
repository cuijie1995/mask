<template>
  <div class="quetion_paid">
    <div class="top">
      <van-nav-bar title="待提交报价" left-text="返回" left-arrow @click-left="$router.push('/me')"></van-nav-bar>
    </div>
    <div class="wrapper">
      <div class="container" ref="wrapper">
        <div class="content" v-if="demandDatas.length > 0">
          <div class="content_item" v-for="(data,index) in demandDatas" :key="index">
            <van-row type="flex">
              <van-col span="8">
                <div class="item_img">
                  <img v-if="data.order.maxFile==null " src alt />
                  <img
                    v-if="data.order.maxFile!=null"
                    :src="pictureserverurl+data.order.maxFile.thumbnailpath"
                    :large="pictureserverurl+data.order.maxFile.fildpath"
                    :preview="index"
                    preview-text="产品图片"
                    class="avatar"
                    alt
                  />
                </div>
              </van-col>
              <van-col span="10">
                <ul class="name_layer">
                  <li class="item_name" @click="viewDetails(data.kzjjlistoid)">
                    <a>{{data.order.spmc}}</a>
                  </li>
                  <li class="item_layer">{{data.order.spgg}}</li>
                </ul>
                <div
                  class="item_delivery"
                  v-if=" data.order.dhrq == data.order.maxdhrq "
                >交货：{{data.order.dhrq|formatDate}}</div>
                <div
                  class="item_delivery"
                  v-else
                >交货：{{data.order.dhrq|formatDate}}~{{data.order.maxdhrq|formatDate}}</div>
                <div class="price_section">抢单价格：{{data.jbdj | formatMoney}}</div>
                <div class="price_section">抢单数量：{{data.jjsl}}{{data.company}}</div>
                <div class="price_section" style="color:red">保证金：￥{{data.bondamt | formatMoney}}</div>
              </van-col>

              <van-col span="4">
                <el-button type="primary" size="mini" @click="submit(data.kzjjlistoid)">提交</el-button>
                <el-button type="danger" size="mini" @click="cancel(data.kzjjlistoid)">取消</el-button>
              </van-col>
            </van-row>
          </div>

          <!-- 底部提示信息 -->
          <div class="bottom-tip" v-if="bottom">
            <span>这是底线</span>
          </div>
        </div>

        <div class="show_i" v-else style="margin-top: 100px;text-align: center;">
          <i class="iconfont icon-icon" style="color:#2fa3df;font-size: 80px;"></i>
          <div style="margin-top: 20px;">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let self;
import BScroll from "better-scroll";
import { formatDate, formatMoney } from "../../DataFormator";
import axios from "axios";
import Notify from "vant/lib/notify";
import "vant/lib/notify/style";

import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";

export default {
  filters: {
    formatDate(time) {
      let date = new Date(time);

      return formatDate(date, "M月d日");
    },
    formatMoney(data) {
      return formatMoney(data);
    },
    formatstatus(str) {
      switch (str) {
        case 0:
          return "待支付";
          break;
        case 1:
          return "已付保证金";
          break;
        case 2:
          return "已达成订单";
          break;
        case 3:
          return "已完成";
          break;
        case 4:
          return "已取消";
          break;
        default:
          return "待支付";
      }
    }
  },
  usertype: "",
  name: "QuetionPaid",
  data: function() {
    return {
      options: [
        {
          value: "1",
          label: "提交"
        },
        {
          value: "2",
          label: "取消"
        }
      ],
      value: "操作",
      checked: false,
      demandDatas: [],
      maxResultCount: 10,
      skipCount: 0,
      count: 0,
      lastPage: "",
      pulldownMsg: "下拉刷新",
      pullupMsg: "加载更多",
      alertHook: "none",
      bottom: false,
      show: true,
      //控制全选
      allChecked: true,
      //存放被选择的数据
      allSelectedGoods: [],
      dataId: "",
      dataIndex: "",
      orderId: ""
    };
  },
  mounted() {
    self = this;
    self.usertype = localStorage.getItem("loginLx");

    self.getDemandDatas();

    self.$nextTick(() => {
      self.scroll = new BScroll(self.$refs.wrapper, {
        probeType: 1,
        click: true,
        pullUpLoad: {
          threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        }
      });

      // 监听滚动结束
      self.scroll.on("pullingUp", () => {
        self.scroll.finishPullUp();
        self.scroll.finishPullDown();
        self.scroll.refresh();
        if (self.skipCount >= self.lastPage) {
          self.bottom = true;
        }
        if (!self.show) return;
        else {
          self.show = false;

          if (self.skipCount < self.lastPage) {
            var token = localStorage.getItem("loginToken");
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios.defaults.headers.common["Accept"] = "text/plain";

            self.$axios
              .post(self.url + "/api/Quotation/GetAllPage", {
                maxResultCount: self.maxResultCount,
                skipCount: self.skipCount,
                jjzt: 0
              })
              .then(res => {
                self.demandDatas = self.demandDatas.concat(res.data.data);
                self.lastPage = res.data.toletCount;
                self.skipCount += res.data.data.length;
                self.scroll.refresh();

                self.show = true;
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.down = false;
          }
        }
      });
    });
  },
  methods: {
    getDemandDatas() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.defaults.headers.common["accept"] = "text/plain";

      self.$axios
        .post(
          self.url + "/api/Quotation/GetAllPage",
          // "/api/RequestPublish/GetMyPage"
          {
            maxResultCount: self.maxResultCount,
            skipCount: self.skipCount,
            jjzt: 0
          },
          {
            headers: {
              "Content-Type": "application/json-patch+json"
            }
          }
        )
        .then(res => {
          for (let index = 0; index < res.data.data.length; index++) {
            const item = res.data.data[index];

            self.demandDatas.push(item);
            self.demandDatas[index].isSelected = true;
          }
          self.lastPage = res.data.toletCount;
          self.skipCount += res.data.data.length;
          self.show = true;
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
            self.$axios
              .post(
                self.url +
                  "/api/Quotation/BacthSubmitQuotation?input=" +
                  self.orderId
              )
              .then(res => {

                if (res.data.statusCode == 0) {
                  self.refreshData();
                }
              })
              .catch(err => {
              });
          }
        }
      );
    },
    refreshData() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.defaults.headers.common["accept"] = "text/plain";

      self.$axios
        .post(
          self.url + "/api/Quotation/GetAllPage",
          {
            maxResultCount: self.maxResultCount,
            skipCount: 0,
            jjzt: 0
          },
          {
            headers: {
              "Content-Type": "application/json-patch+json"
            }
          }
        )
        .then(res => {
          self.demandDatas = res.data.data;
          self.lastPage = res.data.toletCount;
          self.skipCount += res.data.data.length;
          self.show = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    viewDetails(id) {
      localStorage.setItem("supOrdId", id);
      self.$router.push("supViewRelease");
    },
    submit(id) {
      // this.allSelectedGoods.push(id);
      Dialog.confirm({
        title: "提示",
        message: "确定要提交吗"
      })
        .then(() => {
          this.$axios
            .post(this.url + "/api/Quotation/BacthSubmitQuotation?input=" + id)
            .then(res => {
              if (res.data.statusCode == 9) {
                Notify({
                  type: "warning",
                  message: res.data.resultMsg
                });
              }
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
                        document.attachEvent(
                          "WeixinJSBridgeReady",
                          onBridgeReady
                        );
                        document.attachEvent(
                          "onWeixinJSBridgeReady",
                          onBridgeReady
                        );
                      }
                    } else {
                      this.onBridgeReady(pay_params);
                    }
                  } else {
                    window.location.href = res.data.data.mWebUrl;
                  }
                }

                self.orderId = res.data.data.billId;
              }
              this.refreshData();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    cancel(id) {
      Dialog.confirm({
        title: "提示",
        message: "确定要取消吗"
      })
        .then(() => {
          self.$axios
            .get(self.url + "/api/Quotation/CancelQuotation?id=" + id)
            .then(res => {
              this.refreshData();
              Notify({ type: "success", message: res.data.resultMsg });
            })
            .catch(err => {});
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
.quetion_paid {
  height: 100%;
}

.wrapper {
  width: 100%;
  height: calc(100% - 46px);
  padding-bottom: 0px;
}

.container {
  height: calc(100% - 60px);
  overflow: hidden;
}

.content {
  padding: 4% 2% 0% 2%;
  min-height: 100%;
  position: relative;
  overflow-y: scroll;
}

.content_item {
  padding: 5px 0;
  border-bottom: 1px solid #dbd8d8;
  background: #ffffff;
  margin-bottom: 10px;
}

.item_img {
  width: 100px;
  height: 100px;
}

h4 {
  margin: 0;
}

.item_name,
.item_layer {
  font-weight: bold;
  font-size: 13px;
}

ul {
  width: 100%;
}

ul .item_name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #409eff;
}

.item_price {
  color: red;
  font-size: 13px;
  font-weight: bold;
}

.item_delivery,
.item_hq,
.price_section,
.pay_type {
  font-size: 12px;
}

.bottom-tip {
  bottom: -15px;
  height: 20px;
  width: 100%;
  text-align: center;
}
a {
  text-decoration: underline;
}
</style>

<style>
.van-popup--top {
  top: 300px;
}

.quetion_paid .el-button + .el-button {
  margin-left: 0;
  margin-top: 10px;
}
</style>
