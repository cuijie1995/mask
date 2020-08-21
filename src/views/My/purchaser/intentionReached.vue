<template>
  <div class="no_confirmed">
    <div class="top">
      <van-nav-bar title="已达成的意向" left-text="返回" left-arrow @click-left="$router.push('/me')"></van-nav-bar>
    </div>
    <div class="wrapper">
      <bigImage v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImage>

      <div class="container" ref="wrapper">
        <div class="content" v-if="demandDatas.length > 0">
          <div class="content_item" v-for="(data,index) in demandDatas" :key="index">
            <el-row class="name">
              <el-col :span="4" style="padding-left:10px">
                <img
                  src="../../../assets/买.png"
                  alt
                  style="width:30px;height:30px;margin-top: 10px;"
                />
              </el-col>
              <el-col :span="14" style="height: 40px;line-height: 40px">
                <div class="item_layer">
                  <a @click="showSupplier(data.kzpurchaseoid)">{{data.purchaseName}}</a>
                </div>
              </el-col>
              <el-col
                :span="6"
                style="height: 40px;line-height: 40px;font-size:17px"
                v-if="data.purchaseconfirm == 0"
              >
                <el-button
                  type="success"
                  size="mini"
                  v-if="data.bondamt > 0"
                  @click="reached(data.kzpurchaseoid,1)"
                >达成一致</el-button>
                <el-button
                  type="success"
                  size="mini"
                  v-else
                  @click="reached(data.kzpurchaseoid,2)"
                >达成一致</el-button>
              </el-col>
            </el-row>
            <van-row type="flex">
              <van-col span="8">
                <div class="item_img">
                  <img v-if="data.productPublish.productimg==null " src alt />
                  <img
                    v-if="data.productPublish.productimg!=null"
                    :src="pictureserverurl+data.productPublish.productimg.thumbnailpath"
                    @click="clickImg(data.productPublish.productimg.fildpath)"
                  />
                </div>
              </van-col>
              <van-col span="16">
                <ul class="name_layer">
                  <li class="item_name" @click="onClickView(data.productPublish.kzproductoid)">
                    <a>{{data.productPublish.productname}}</a>
                  </li>
                  <li class="item_layer">{{data.productPublish.productspec}}</li>
                </ul>
                <div
                  class="price_section"
                  v-if="data.productPublish.maxprice==null || data.productPublish.maxprice==0"
                >单价：{{data.minprice | formatMoney}}</div>
                <div
                  class="price_section"
                  v-else
                >单价区间：{{data.productPublish.minprice | formatMoney}}-{{data.productPublish.maxprice | formatMoney}}</div>
                <div class="pay_type">付款方式：{{data.productPublish.paytype}}</div>
                <div v-if="data.productPublish.doctype == 1">
                  <div class="pay_type">订购数量：{{data.quantity}} {{data.company}}</div>
                </div>
                <div v-if="data.productPublish.doctype == 2">
                  <div class="pay_type">成团数量：{{data.productPublish.groupbuyqty}} {{data.company}}</div>
                  <div class="pay_type">参团数量：{{data.quantity}} {{data.company}}</div>
                </div>
                <div
                  class="pay_type"
                  v-if="data.bondamt > 0 && data.returnBond"
                  style="color:#67C23A;font-size:12px"
                >
                  保证金：￥{{data.bondamt}}
                  <span style="font-size:12px">已释放</span>
                </div>

                <div
                  class="pay_type"
                  v-if="data.bondamt > 0 && !data.returnBond"
                  style="color:#F56C6C;font-size:12px"
                >
                  保证金：￥{{data.bondamt}}
                  <span style="font-size:12px">冻结中</span>
                </div>

                <div class="pay_type">{{data.docno}}</div>

                <span v-if="data.purchaseconfirm == 0" style="font-size: 12px;">
                  <span class="error">
                    <i class="el-icon-warning"></i>买方待定
                  </span>
                  <span class="error" v-if="data.issuedbyconfirm == 0">
                    <i class="el-icon-warning"></i>卖方待定
                  </span>
                  <span class="success" v-if="data.issuedbyconfirm == 1">
                    <i class="el-icon-circle-check"></i>卖方达成一致
                  </span>
                  <span class="warn" v-if="data.issuedbyconfirm == 2">
                    <i class="el-icon-warning"></i>卖方未达成一致
                  </span>
                </span>
                <span v-if="data.purchaseconfirm == 1" style="font-size: 12px;">
                  <span class="success">
                    <i class="el-icon-circle-check"></i>买方达成一致
                  </span>
                  <span class="error" v-if="data.issuedbyconfirm == 0">
                    <i class="el-icon-warning"></i>卖方待定
                  </span>
                  <span class="success" v-if="data.issuedbyconfirm == 1">
                    <i class="el-icon-circle-check"></i>卖方达成一致
                  </span>
                  <span class="warn" v-if="data.issuedbyconfirm == 2">
                    <i class="el-icon-warning"></i>卖方未达成一致
                  </span>
                </span>
                <span v-if="data.purchaseconfirm == 2" style="font-size: 12px;">
                  <span class="warn">
                    <i class="el-icon-circle-check"></i>买方未达成一致
                  </span>
                  <span class="error" v-if="data.issuedbyconfirm == 0">
                    <i class="el-icon-warning"></i>卖方待定
                  </span>
                  <span class="success" v-if="data.issuedbyconfirm == 1">
                    <i class="el-icon-circle-check"></i>卖方达成一致
                  </span>
                  <span class="warn" v-if="data.issuedbyconfirm == 2">
                    <i class="el-icon-warning"></i>卖方未达成一致
                  </span>
                </span>
              </van-col>
            </van-row>
          </div>

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

import bigImage from "../../../components/bigImage";

export default {
  filters: {
    formatDate(time) {
      let date = new Date(time);

      return formatDate(date, "M月d日");
    },
    formatMoney(data) {
      return formatMoney(data);
    }
  },
  usertype: "",
  name: "IntentionReached",
  components: { bigImage },

  data() {
    return {
      showImg: false,
      imgSrc: "",
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
      show: true
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
              .post(self.url + "/api/Pruchase/GetPurchaserReachPage", {
                maxResultCount: self.maxResultCount,
                skipCount: self.skipCount,
                status: 3
                // isConfirm: true
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
          self.url + "/api/Pruchase/GetPurchaserReachPage",
          {
            maxResultCount: self.maxResultCount,
            skipCount: self.skipCount,
            status: 3
            // isConfirm: true
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
    refreshData() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.defaults.headers.common["accept"] = "text/plain";

      self.$axios
        .post(
          self.url + "/api/Pruchase/GetPurchaserReachPage",
          {
            maxResultCount: self.maxResultCount,
            skipCount: 0,
            status: 3
          },
          {
            headers: {
              "Content-Type": "application/json-patch+json"
            }
          }
        )
        .then(res => {
          self.demandDatas = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    reached(id, index) {
      if (index == 1) {
        Dialog.confirm({
          title: "请确认",
          message: "双方达成一致，保证金退回"
        })
          .then(() => {
            var token = localStorage.getItem("loginToken");
            self.$axios.defaults.headers.common["Authorization"] =
              "Bearer " + token;
            self.$axios
              .get(
                self.url +
                  "/api/Pruchase/ReachPurchase?id=" +
                  id +
                  "&confirm=" +
                  "1"
              )
              .then(res => {
                self.refreshData();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            //   // on cancel
          });
      }
      if (index == 2) {
        Dialog.confirm({
          title: "请确认",
          message: "确认达成一致"
        })
          .then(() => {
            var token = localStorage.getItem("loginToken");
            self.$axios.defaults.headers.common["Authorization"] =
              "Bearer " + token;
            self.$axios
              .get(
                self.url +
                  "/api/Pruchase/ReachPurchase?id=" +
                  id +
                  "&confirm=" +
                  "1"
              )
              .then(res => {
                self.refreshData();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    showSupplier(id) {
      localStorage.setItem("showSupplierId", id);
      localStorage.setItem("showOne", 1);
      self.$router.push("showsSupplier");
    },
    onClickView(id) {
      localStorage.setItem("orderViewReachOID", id);
      self.$router.push("orderViewReach");
    }
  }
};
</script>
<style scoped>
.no_confirmed {
  height: 100%;
}

.wrapper {
  width: 100%;
  height: calc(100% - 46px);
  padding-bottom: 0px;
}

.container {
  height: 100%;
  overflow: hidden;
}

.content {
  padding: 4% 2% 0% 2%;
  min-height: 100%;
  position: relative;
  overflow-y: scroll;
}

.content_item {
  padding: 0 0 5px 0;
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

.button_i {
  height: 100%;
  line-height: 100%;
}
.button_i .el-button {
  margin-top: 20px;
}
.el-icon-finished {
  margin-top: 28px;
}

.button {
  height: 100%;
  line-height: 100%;
  margin-top: 50px;
}
.footer {
  height: 60px;
  line-height: 60px;
  background: #ffffff;
  overflow: hidden;
}
.footer ul li {
  float: left;
}
.all {
  width: 50%;
  padding-left: 20px;
}
.sum {
  margin-left: 20px;
}
.sum .el-button {
  padding: 10px 20px;
}
.el-select {
  width: 70px;
  text-align: center;
}
.success {
  color: #67c23a;
}
.error {
  color: #e6a23c;
}
.warn {
  color: red;
}
.el-button {
  padding: 7px 10px;
  margin-left: 0 !important;
}
button.el-button.el-button--success.el-button--mini {
  margin-top: 5px;
}
a {
  text-decoration: underline;
}
.name {
  background: #ecebeb;
  /* border-bottom: 1px solid rosybrown; */
  margin-bottom: 10px;
}
.name .item_layer {
  font-size: 15px !important;
}
</style>

<style>
.van-popup--top {
  top: 300px;
}
.sum i.el-select__caret.el-input__icon.el-icon-arrow-up {
  display: none;
}
.sum .el-input--suffix .el-input__inner {
  padding-right: 0px;
}
.sum .el-input__inner {
  padding: 0;
  text-align: center;
  background: #409eff;
  color: #ffffff;
  height: 30px;
  line-height: 30px;
  padding: 0px 5px;
}
</style>
