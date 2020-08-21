<template>
  <div class="reach_purpose">
    <div class="top">
      <van-nav-bar title="已达成意向" left-text="返回" left-arrow @click-left="$router.push('/me')"></van-nav-bar>
    </div>
    <div class="wrapper">
      <bigImage v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImage>

      <div class="container" ref="wrapper">
        <div class="content" v-if="demandDatas.length > 0">
          <div class="content_item" v-for="(data,index) in demandDatas" :key="index">
            <el-row class="name">
              <el-col :span="4" style="padding-left:10px">
                <img
                  src="../../../assets/供货.png"
                  alt
                  style="width:30px;height:30px;margin-top: 10px;"
                />
              </el-col>
              <el-col :span="14" style="height: 40px;line-height: 40px">
                <div class="item_layer">
                  <a
                    class="item_name"
                    @click="showPurchaser(data.kzpurchaseoid)"
                  >{{data.purchaseName}}</a>
                </div>
              </el-col>
              <el-col
                :span="6"
                style="height: 40px;line-height: 40px;font-size:17px"
                v-if="data.issuedbyconfirm == 0"
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
                >单价：{{data.productPublish.minprice | formatMoney}}</div>
                <div
                  class="price_section"
                  v-else
                >单价区间：{{data.productPublish.minprice | formatMoney}}-{{data.productPublish.maxprice | formatMoney}}</div>
                <div class="pay_type">付款方式：{{data.productPublish.paytype}}</div>
                <div class="pay_type" v-if="data.productPublish.doctype == 1">订购数量：{{data.quantity}}</div>
                <div class="pay_type" v-if="data.productPublish.doctype == 2">团购数量：{{data.quantity}}</div>
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

                <span v-if="data.issuedbyconfirm == 0" style="font-size: 12px;">
                  <span class="error">
                    <i class="el-icon-warning"></i> 卖方待定
                  </span>
                  <span class="success" v-if="data.purchaseconfirm == 1">
                    <i class="el-icon-circle-check"></i>买方达成一致
                  </span>
                  <span class="error" v-if="data.purchaseconfirm == 0">
                    <i class="el-icon-warning"></i>买方待定
                  </span>
                  <span class="error" v-if="data.purchaseconfirm == 2">
                    <i class="el-icon-warning"></i>买方未达成一致
                  </span>
                </span>

                <span v-if="data.issuedbyconfirm == 1" style="font-size: 12px;">
                  <span class="success">
                    <i class="el-icon-circle-check"></i>卖方达成一致
                  </span>
                  <span class="success" v-if="data.purchaseconfirm == 1">
                    <i class="el-icon-circle-check"></i>买方达成一致
                  </span>
                  <span class="error" v-if="data.purchaseconfirm == 0">
                    <i class="el-icon-warning"></i>买方待定
                  </span>
                  <span class="warn" v-if="data.purchaseconfirm == 2">
                    <i class="el-icon-warning"></i>买方未达成一致
                  </span>
                </span>

                <span v-if="data.issuedbyconfirm == 2" style="font-size: 12px;">
                  <span class="warn">
                    <i class="el-icon-circle-check"></i>卖方未达成一致
                  </span>
                  <span class="success" v-if="data.purchaseconfirm == 1">
                    <i class="el-icon-circle-check"></i>买方达成一致
                  </span>
                  <span class="error" v-if="data.purchaseconfirm == 0">
                    <i class="el-icon-warning"></i>买方待定
                  </span>
                  <span class="warn" v-if="data.purchaseconfirm == 2">
                    <i class="el-icon-warning"></i>买方未达成一致
                  </span>
                </span>
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
import { formatDate, formatMoney } from "../../DataFormator.js";
import bigImage from "../../../components/bigImage";
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
    }
  },
  components: { bigImage },

  name: "reachPurpose",
  data() {
    return {
      showImg: false,
      imgSrc: "",
      demandDatas: [],
      ghkzlxFk: "",
      ghspmc: "",
      ghspgg: "",
      maxResultCount: 10,
      skipCount: 0,
      count: 0,
      lastPage: "",
      pulldownMsg: "下拉刷新",
      pullupMsg: "加载更多",
      alertHook: "none",
      bottom: false,
      show: true,
      inputShow: "",
      usertype: "",
      userId: ""
    };
  },
  mounted() {
    self = this;
    self.usertype = localStorage.getItem("loginLx");
    self.userId = localStorage.getItem("loginId");

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

        if (self.skipCount >= self.lastPage) {
          self.bottom = true;
        }

        if (!self.show) return;
        else {
          self.show = false;
          if (self.skipCount < self.lastPage) {
            var token = localStorage.getItem("loginToken");
            this.$axios.defaults.headers.common["Authorization"] =
              "Bearer " + token;
            self.$axios
              .post(self.url + "/api/Pruchase/GetByOrderReachPage", {
                maxResultCount: self.maxResultCount,
                skipCount: self.skipCount,
                status: 3
                // isConfirm:true
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
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .post(self.url + "/api/Pruchase/GetByOrderReachPage", {
          maxResultCount: self.maxResultCount,
          skipCount: self.skipCount,
          status: 3
          // isConfirm:true
        })
        .then(res => {
          self.demandDatas = res.data.data;
          self.lastPage = res.data.toletCount;
          self.skipCount += res.data.data.length;
          self.scroll.refresh();
          self.show = true;
        })
        .catch(err => {
          console.log(err);
        });
    },

    OnQuote(id) {
      localStorage.setItem("ViewReachOID", id);
      self.$router.push("orderViewReach");
    },
    clickImg(src, index) {
      this.imgSrc = this.pictureserverurl + src;
      this.showImg = true; // 获取当前图片地址
    },
    viewImg() {
      this.showImg = false;
    },
    onClickView(id) {
      localStorage.setItem("orderViewReachOID", id);
      self.$router.push("orderViewReach");
    },
    // notReached(id) {
    //   Dialog.confirm({
    //     title: "提示",
    //     message: "此意向未和采购商达成订单"
    //   })
    //     .then(() => {
    //       var token = localStorage.getItem("loginToken");
    //       self.$axios.defaults.headers.common["Authorization"] =
    //         "Bearer " + token;
    //       self.$axios
    //         .get(
    //           self.url +
    //             "/api/Pruchase/ReachPurchase?id=" +
    //             id +
    //             "&confirm=" +
    //             "2"
    //         )
    //         .then(res => {
    //           self.refresh();
    //         })
    //         .catch(err => {
    //           console.log(err);
    //         });
    //     })
    //     .catch(() => {
    //       // on cancel
    //     });
    // },
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
                self.refresh();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            // on cancel
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
                self.refresh();
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
    refresh() {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .post(self.url + "/api/Pruchase/GetByOrderReachPage", {
          maxResultCount: self.maxResultCount,
          skipCount: 0,
          status: 3
          // isConfirm:true
        })
        .then(res => {
          self.demandDatas = res.data.data;
          // self.lastPage = res.data.toletCount;
          // self.skipCount += res.data.data.length;
          // self.scroll.refresh();
          // self.show = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showPurchaser(id) {
      localStorage.setItem("showPurchaserId", id);
      localStorage.setItem("showTwo", 1);
      self.$router.push("showPurchaser");
    }
  }
};
</script>
<style scoped>
.reach_purpose {
  height: calc(100% - 65px);
}

.wrapper {
  width: 100%;
  height: 100%;
  padding-bottom: 0px;
}

.container {
  height: 100%;
  overflow: hidden;
}

.content {
  padding: 4% 2% 0% 2%;
  min-height: 100%;
  padding-top: 40px;
  position: relative;
  overflow-y: scroll;
}

.content_item {
  padding: 0 0 5px 0;

  border-bottom: 1px solid #dbd8d8;
  background: #ffffff;
  margin-bottom: 10px;
  border-radius: 20px;
}

.item_img {
  width: 100px;
  height: 100px;
  margin-left: 10px;
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
.button {
  height: 100%;
  line-height: 100%;
}
.already i {
  color: red;
  font-size: 12px;
}
.el-button {
  margin-left: 0 !important;
}
a {
  text-decoration: underline;
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
.name {
  background: #ecebeb;
  /* border-bottom: 1px solid rosybrown; */
  margin-bottom: 10px;
}
.name .item_layer {
  font-size: 15px !important;
}
</style>
