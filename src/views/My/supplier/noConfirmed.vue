<template>
  <div class="no_confirmed">
    <div class="top">
      <van-nav-bar title="发布中的供货" left-text="返回" left-arrow @click-left="$router.push('/me')"></van-nav-bar>
    </div>
    <div class="wrapper">
      <bigImage v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImage>

      <div class="container" ref="wrapper">
        <div class="content" v-if="demandDatas.length > 0">
          <div class="content_item" v-for="(data,index) in demandDatas" :key="index">
            <van-row type="flex">
              <van-col span="8">
                <div class="item_img">
                  <img v-if="data.productimg==null " src alt />
                  <img
                    v-if="data.productimg!=null"
                    :src="pictureserverurl+data.productimg.thumbnailpath"
                    @click="clickImg(data.productimg.fildpath)"
                  />
                </div>
              </van-col>
              <van-col span="10">
                <ul class="name_layer">
                  <li class="item_name" @click="onClickView(data.kzproductoid)">
                    <a>{{data.productname}}</a>
                  </li>
                  <li class="item_layer">{{data.productspec}}</li>
                </ul>
                <div
                  class="price_section"
                  v-if="data.maxprice==null || data.maxprice==0"
                >单价：{{data.minprice | formatMoney}}</div>
                <div
                  class="price_section"
                  v-else
                >单价区间：{{data.minprice | formatMoney}}-{{data.maxprice | formatMoney}}</div>
                <div class="pay_type">付款方式：{{data.paytype}}</div>
                <div v-if="data.doctype == 1">
                  <div class="pay_type">每份数量:{{data.startqty}}{{data.company}}</div>
                  <div class="pay_type">供应数量:{{data.groupbuyqty}}{{data.company}}</div>
                </div>
                <div v-if="data.doctype == 2">
                  <div class="pay_type">成团数量：{{data.groupbuyqty}}{{data.company}}</div>
                  <div class="pay_type">参团数量：{{data.quantityordered}}{{data.company}}</div>
                </div>
                <div class="pay_type" style="color:red">保证金：￥{{data.bondamt | formatMoney}}</div>
              </van-col>
              <van-col span="6">
                <div class="button">
                  <div v-if="data.doctype == 2 ">
                    <div v-if="data.issuccess" class="yi">已成团</div>
                    <el-button
                      @click="agglomeration(data.kzproductoid)"
                      v-else
                      size="mini"
                      type="warning"
                      round
                    >成团</el-button>
                  </div>
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="termination(data.kzproductoid)"
                    v-if="data.status == 1 || data.status == 2"
                  >关闭</el-button>
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
import axios from "axios";
import { formatMoney } from "../../DataFormator";
import Notify from "vant/lib/notify";
import "vant/lib/notify/style";

import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";

import bigImage from "../../../components/bigImage";

export default {
  filters: {
    formatMoney(data) {
      return formatMoney(data);
    }
  },
  name: "NoConfirmed",
  components: { bigImage },

  data: function() {
    return {
      showImg: false,
      imgSrc: "",
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
              .post(self.url + "/api/ProductPublish/GetMyPage", {
                maxResultCount: self.maxResultCount,
                skipCount: self.skipCount,
                status: 2
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
          self.url + "/api/ProductPublish/GetMyPage",
          {
            maxResultCount: self.maxResultCount,
            skipCount: self.skipCount,
            status: 2
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
          self.url + "/api/ProductPublish/GetMyPage",
          {
            maxResultCount: self.maxResultCount,
            skipCount: 0,
            status: 2
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
    termination(id) {
      Dialog.confirm({
        title: "提示",
        message: "确定要关闭吗"
      })
        .then(() => {
          var token = localStorage.getItem("loginToken");
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          self.$axios
            .post(self.url + "/api/ProductPublish/ReachOrder?id=" + id)
            .then(res => {
              Notify({ type: "warning", message: res.data.resultMsg });

              self.refreshData();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    agglomeration(id) {
      Dialog.confirm({
        title: "提示",
        message: "确定要成团吗"
      })
        .then(() => {
          var token = localStorage.getItem("loginToken");
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          self.$axios
            .post(self.url + "/api/ProductPublish/ManualReach?id=" + id)
            .then(res => {
              Notify({ type: "warning", message: res.data.resultMsg });

              self.refreshData();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          // on cancel
        });
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
.el-icon-finished {
  margin-top: 28px;
}

.button {
  height: 100%;
  line-height: 100%;
  text-align: center;
}
.el-button {
  margin-left: 0 !important;
  margin-bottom: 10px;
}

.el-select {
  width: 70px;
  text-align: center;
}
a {
  text-decoration: underline;
}
.yi {
  font-size: 12px;
  padding: 10px;
  color: #67c23a;
}
</style>

<style>
.van-popup--top {
  top: 300px;
}
</style>
