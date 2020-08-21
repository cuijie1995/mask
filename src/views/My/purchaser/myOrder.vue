<template>
  <div class="no_confirmed">
    <div class="top">
      <van-nav-bar title="我的订货" left-text="返回" left-arrow @click-left="$router.push('/me')"></van-nav-bar>
    </div>
    <div class="wrapper">
      <bigImage v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImage>

      <div class="container" ref="wrapper">
        <div class="content" v-if="demandDatas.length > 0">
          <div class="content_item" v-for="(data,index) in demandDatas" :key="index">
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
              <van-col span="10">
                <ul class="name_layer">
                  <li class="item_name" @click="onClickView(data.productPublish.kzproductoid)">
                    <a>{{data.productPublish.productname}}</a>
                  </li>
                  <li class="item_layer">{{data.productPublish.productspec}}</li>
                </ul>
                <div
                  class="price_section"
                  v-if="data.productPublish.maxprice==null || data.productPublish.maxprice==0"
                >单价：{{data.productPublish.minprice | formatMoney}}</div>
                <div
                  class="price_section"
                  v-else
                >单价区间：{{data.productPublish.minprice | formatMoney}}-{{data.productPublish.maxprice | formatMoney}}</div>
                <div class="pay_type">付款方式：{{data.productPublish.paytype}}</div>
                <div v-if="data.productPublish.doctype == 1">
                  <div class="pay_type">每份数量:{{data.productPublish.startqty}} {{data.productPublish.company}}</div>
                  <div class="pay_type">订购数量：{{data.quantity}} {{data.productPublish.company}}</div>
                </div>
                <div v-if="data.productPublish.doctype == 2">
                  <div class="pay_type">每份数量：{{data.productPublish.startqty}} {{data.productPublish.company}}</div>
                  <div class="pay_type">成团数量：{{data.productPublish.groupbuyqty}} {{data.productPublish.company}}</div>
                  <div class="pay_type">参团数量：{{data.quantity}} {{data.productPublish.company}}</div>
                </div>
               
                <div class="pay_type" style="color:red">保证金：￥{{data.bondamt | formatMoney}}</div>
                 <div class="pay_type">{{data.docno}}</div>
              </van-col>
              <van-col span="6">
                <div class="button">
                  <div v-if="data.productPublish.doctype == 2">
                    <div
                      v-if="data.productPublish.issuccess"
                      style="color:#67C23A;font-size:12px;padding:10px"
                    >已成团</div>
                    <div
                      v-if="!data.productPublish.issuccess"
                      style="color:red;font-size:12px;padding:10px"
                    >待成团</div>
                  </div>
                   <div v-if="data.productPublish.doctype == 1">
                    <div
                      v-if="data.productPublish.issuccess"
                      style="color:#67C23A;font-size:12px;padding:10px"
                    >订购成功</div>
                   
                  </div>

                  <div class="status" @click="supplierJournal(data.productPublish.kzproductoid)">
                    <el-button size="mini" type="warning" round>操作记录</el-button>
                  </div>
                </div>
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

import bigImage from "../../../components/bigImage";

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
  name: "MyOrder",
  components: { bigImage },

  data: function() {
    return {
      showImg: false,
      imgSrc: "",
      value: "操作",
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
              .post(self.url + "/api/Pruchase/GetPurchaserAllPage", {
                maxResultCount: self.maxResultCount,
                skipCount: self.skipCount
                // status: 2
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
          self.url + "/api/Pruchase/GetPurchaserAllPage",
          {
            maxResultCount: self.maxResultCount,
            skipCount: self.skipCount
            // status: 2
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
    supplierJournal(id) {
      localStorage.setItem("logId", id);
      this.$router.push("supplierJournal");
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

.el-icon-finished {
  margin-top: 28px;
}

.button {
  height: 100%;
  line-height: 100%;
  /* margin-top: 50px; */
  text-align: center;
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
a {
  text-decoration: underline;
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
