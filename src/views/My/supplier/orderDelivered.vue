<template>
  <div class="home">
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
                  <a
                    class="item_name"
                    @click="showPurchaser(data.kzjjlistoid)"
                  >{{data.quotationName}}</a>
                </div>
              </el-col>
              <el-col
                :span="6"
                style="height: 40px;line-height: 40px;font-size:17px"
                v-if="data.gyshzt == 0"
              >
                <el-button
                  type="success"
                  size="mini"
                  v-if="data.bondamt > 0"
                  @click="reached(data.kzjjlistoid,1)"
                >达成一致</el-button>
                <el-button
                  type="success"
                  size="mini"
                  v-else
                  @click="reached(data.kzjjlistoid,2)"
                >达成一致</el-button>
              </el-col>
            </el-row>
            <van-row type="flex">
              <van-col span="8">
                <div class="item_img">
                  <img v-if="data.order.maxFile==null " src alt />
                  <img
                    v-if="data.order.maxFile!=null"
                    :src="pictureserverurl+data.order.maxFile.thumbnailpath"
                    @click="clickImg(data.order.maxFile.fildpath)"
                  />
                </div>
              </van-col>
              <van-col span="16">
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
                <div class="price_section">抢单数量：{{data.jjsl}} {{data.company}}</div>
                <div class="price_section">{{data.docno}}</div>
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

                <span class="success" v-if="data.gyshzt == 1">
                  <i class="el-icon-circle-check"></i>卖方达成一致
                </span>
                <span class="success" v-if="data.gyshzt == 2">
                  <i class="el-icon-circle-check"></i>卖方未达成一致
                </span>
                <span class="error" v-if="data.gyshzt == 0">
                  <i class="el-icon-warning"></i>卖方待定
                </span>
                <span class="success" v-if="data.cgshzt == 1">
                  <i class="el-icon-circle-check"></i>买方达成一致
                </span>
                <span class="error" v-if="data.cgshzt == 2">
                  <i class="el-icon-warning"></i>买方未达成一致
                </span>
                <span class="error" v-if="data.cgshzt == 0">
                  <i class="el-icon-warning"></i>买方待定
                </span>
              </van-col>
              <van-col span="6"></van-col>
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
    }
  },
  components: { bigImage },
  name: "OrderReached",
  data: function() {
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
              .post(self.url + "/api/Quotation/GetMyReachPage")
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
            self.down = false;
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
        .post(self.url + "/api/Quotation/GetMyReachPage", {
          headers: {
            "Content-Type": "application/json-patch+json"
          }
        })
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
    reached(id, index) {
      if (index == 1) {
        Dialog.confirm({
          title: "请确认",
          message: "双方达成一致，保证金退回"
        })
          .then(() => {
            var token = localStorage.getItem("loginToken");
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            self.$axios
              .get(self.url + "/api/Quotation/FinishQuotationOfSeller?id=" + id)
              .then(res => {
                if (res.data.statusCode == 9) {
                  Notify({ type: "warning", message: res.data.resultMsg });
                }
                self.refreshDatas();
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
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            self.$axios
              .get(self.url + "/api/Quotation/FinishQuotationOfSeller?id=" + id)
              .then(res => {
                if (res.data.statusCode == 9) {
                  Notify({ type: "warning", message: res.data.resultMsg });
                }
                self.refreshDatas();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            //   // on cancel
          });
      }
    },
    refreshDatas() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.defaults.headers.common["accept"] = "text/plain";

      self.$axios
        .post(self.url + "/api/Quotation/GetMyReachPage", {
          headers: {
            "Content-Type": "application/json-patch+json"
          }
        })
        .then(res => {
          self.demandDatas = res.data.data;
          // self.lastPage = res.data.toletCount;
          // self.skipCount += res.data.data.length;
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
    clickImg(src, index) {
      this.imgSrc = this.pictureserverurl + src;
      this.showImg = true; // 获取当前图片地址
      // this.imgSrc = e.currentTarget.src;
    },
    viewImg() {
      this.showImg = false;
    },
    showPurchaser(id) {
      localStorage.setItem("showPurchaserId", id);
      localStorage.setItem("showTwo", 2);

      self.$router.push("showPurchaser");
    }
  }
};
</script>
<style scoped>
.home {
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

.item_name {
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
.item_delivery,
.price_section {
  font-size: 12px;
}

.bottom-tip {
  bottom: -15px;
  height: 20px;
  width: 100%;
  text-align: center;
}

.el-button {
  padding: 7px 10px;
  margin-left: 0 !important;
}
button.el-button.el-button--success.el-button--mini {
  margin-top: 5px;
}
.el-icon-finished {
  margin-top: 28px;
}

.van-col--6 {
  text-align: center;
}

.success {
  color: #67c23a;
  font-size: 12px;
}
.error {
  color: #e6a23c;
  font-size: 12px;
}
a {
  text-decoration: underline;
}
.item_name,
.item_layer {
  font-weight: bold;
  font-size: 13px;
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
