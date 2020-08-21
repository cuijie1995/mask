<template>
  <div class="bidding_list">
    <div class="top">
      <van-nav-bar title="正在发布中的需求" left-text="返回" left-arrow @click-left="$router.push('/me')"></van-nav-bar>
    </div>
    <div class="wrapper">
      <bigImage v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImage>

      <div class="container" ref="wrapper">
        <div class="content" v-if="demandDatas.length > 0">
          <div class="content_item" v-for="(data,index) in demandDatas" :key="index">
            <van-row type="flex">
              <van-col span="8">
                <div class="item_img">
                  <img v-if="data.maxFile==null " src alt />
                  <img
                    v-if="data.maxFile!=null"
                    :src="pictureserverurl+data.maxFile.thumbnailpath"
                    @click="clickImg(data.maxFile.fildpath)"
                  />
                </div>
              </van-col>

              <van-col span="10">
                <ul class="name_layer">
                  <li class="item_name" @click="onClickView(data.kzxqorderoid)">
                    <a>{{data.spmc}}</a>
                  </li>
                  <li class="item_layer">{{data.spgg}}</li>
                </ul>
                <div
                  class="item_delivery"
                  v-if=" data.dhrq == data.maxdhrq "
                >交货：{{data.dhrq|formatDate}}</div>
                <div
                  class="item_delivery"
                  v-else
                >交货：{{data.dhrq|formatDate}}~{{data.maxdhrq|formatDate}}</div>
                <div class="item_delivery">数量：{{data.sl}}{{data.company}}</div>

                <div class="price_section" v-if="data.maxdj==null || data.maxdj==0">
                  <ul class="section_baojia">
                    <li>单价：{{data.cgj | formatMoney}}</li>
                  </ul>
                </div>
                <div class="price_section" v-else>
                  <ul class="section_baojia">
                    <li>单价区间：{{data.cgj | formatMoney}}-{{data.maxdj | formatMoney}}</li>
                  </ul>
                </div>
                <div class="pay_type">
                  <ul>
                    <li>付款方式：{{data.fkfs}}</li>
                    <li v-if="data.docno">{{data.docno}}</li>
                  </ul>
                </div>
                <ul class="name_layer">
                  <li class="item_price" v-if="data.bondamt">保证金：￥{{data.bondamt}}</li>
                </ul>
              </van-col>
              <van-col span="6">
                <div class="button">
                  <el-button
                    @click="ViewQutoe(1,data.kzxqorderoid)"
                    size="mini"
                    type="warning"
                    round
                    v-if="data.reachQuotationCount > 0"
                  >未确认:{{data.reachQuotationCount}}</el-button>

                  <el-button
                    @click="ViewQutoe(3,data.kzxqorderoid)"
                    size="mini"
                    type="primary"
                    round
                    v-if="data.totalQuotationCount > 0"
                  >报价笔数:{{data.totalQuotationCount}}</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="termination(data.kzxqorderoid)"
                    v-if="data.jszt == 0 || data.jszt == 1"
                  >停止发布</el-button>
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
import { formatDate, formatMoney } from "../../../DataFormator.js";
import axios from "axios";
import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";
import Notify from "vant/lib/notify";
import "vant/lib/notify/style";
import bigImage from "../../../../components/bigImage";

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
  components: { bigImage },
  name: "BiddingList",
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
      show: true,
      quotedPrice: 3,
      usertype: ""
    };
  },
  mounted() {
    self = this;
    self.usertype = localStorage.getItem("loginLx");

    self.getDemandDatas();

    this.$nextTick(() => {
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
            self.$axios
              .post(self.url + "/api/RequestPublish/GetMyPayedPage", {
                maxResultCount: self.maxResultCount,
                skipCount: self.skipCount
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
    ViewQutoe(type, oid) {
      if (type == "1") {
        localStorage.setItem("viewType", "UnConfirm");
        localStorage.setItem("viewRelaseID", oid);
        this.$router.push("quotedPricePurchaser");
      }
      if (type == "3") {
        localStorage.setItem("viewType", "all");
        localStorage.setItem("viewRelaseID", oid);
        this.$router.push("quotedPricePurchaser");
      }
    },
    getDemandDatas() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .post(self.url + "/api/RequestPublish/GetMyPayedPage", {
          maxResultCount: self.maxResultCount,
          skipCount: self.skipCount
          // jszt: 1
        })
        .then(res => {
          for (let index = 0; index < res.data.data.length; index++) {
            const item = res.data.data[index];

            self.demandDatas.push(item);
          }
          self.lastPage = res.data.toletCount;
          self.skipCount += res.data.data.length;
          self.scroll.refresh();
          self.show = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    termination(id) {
      Dialog.confirm({
        title: "提示",
        message: "确定取消吗"
      })
        .then(() => {
          var token = localStorage.getItem("loginToken");
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          this.$axios
            .get(
              this.url +
                "/api/RequestPublish/TerminationRequestPublish?id=" +
                id
            )
            .then(res => {
              Notify({ type: "warning", message: res.data.resultMsg });

              var token = localStorage.getItem("loginToken");
              axios.defaults.headers.common["Authorization"] =
                "Bearer " + token;
              self.$axios
                .post(self.url + "/api/RequestPublish/GetMyPayedPage", {
                  maxResultCount: 10,
                  skipCount: 0
                })
                .then(res => {
                  self.demandDatas = res.data.data;
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    onClickView(viewoid) {
      this.$router.push("viewRelese");
      localStorage.setItem("viewRelaseID", viewoid);
      localStorage.setItem("viewType", "View");
    },
    clickImg(src, index) {
      this.imgSrc = this.pictureserverurl + src;
      this.showImg = true; // 获取当前图片地址
      // this.imgSrc = e.currentTarget.src;
    },
    viewImg() {
      this.showImg = false;
    }
  }
};
</script>
<style scoped>
.bidding_list {
  height: 100%;
}
.top {
  height: 46px;
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
  /* padding-top: 40px; */
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
  /* border: palegoldenrod 1px solid; */
}

h4 {
  margin: 0;
}

.item_name {
  font-weight: bold;
  font-size: 13px;
}

ul {
  width: 100%;
  text-align: left;
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

.el-button--mini {
  padding: 5px 10px;
  margin-bottom: 10px;
  font-size: 11px;
}
.button {
  text-align: center;
}
.el-button + .el-button {
  margin-left: 0px;
}
a {
  text-decoration: underline;
}
.item_name,
.item_layer {
  font-weight: bold;
  font-size: 13px;
}
</style>