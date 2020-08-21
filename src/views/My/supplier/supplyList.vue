<template>
  <div class="supply_list">
    <div class="top">
      <van-nav-bar
        title="供应列表"
        left-text="返回"
        left-arrow
        @click-left="$router.push('/me')"
        @click-right="onClickPlus"
      >
        <template #right>
          <van-icon name="plus" size="18" />
        </template>
      </van-nav-bar>
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
                <ul class="name_layer">
                  <li class="item_price" v-if="data.bondamt">保证金：￥{{data.bondamt | formatMoney}}</li>
                </ul>
              </van-col>
              <van-col span="6">
                <div class="button">
                  <div class="status" @click="purchaserJournal(data.kzproductoid)">
                    <el-button size="mini" type="success" round>{{data.status|formatstatus}}</el-button>
                  </div>
                  <div v-if="data.doctype == 2">
                    <div v-if="data.issuccess" style="color:#67C23A;font-size:12px;padding:10px">已成团</div>
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
import { formatDate, formatMoney } from "../../DataFormator.js";
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
        case 1:
          return "待发布";
          break;
        case 2:
          return "发布中";
          break;
        case 3:
          return "已完成";
          break;
        case 4:
          return "已取消";
          break;
        default:
          return "待发布";
      }
    }
  },
  components: { bigImage },

  name: "supplyList",
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
              .post(self.url + "/api/ProductPublish/GetMyPage", {
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
    getDemandDatas() {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .post(self.url + "/api/ProductPublish/GetMyPage", {
          maxResultCount: self.maxResultCount,
          skipCount: self.skipCount
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

    onClickPlus() {
      var token = localStorage.getItem("loginToken");
      if (token) {
        this.$router.push("addReach");
      } else {
        Dialog.confirm({
          title: "提示",
          message: "您还没有登录，请先去登录"
        })
          .then(() => {
            // this.$router.push("/login");
            let currentUrl = encodeURIComponent(
              "http://www.qqr.world/m/#/login"
            );

            window.location.href =
              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb78fc8385b943fd8&redirect_uri=" +
              currentUrl +
              "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
          })
          .catch(() => {
            this.$router.push("/");
          });
      }
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
    purchaserJournal(id) {
      localStorage.setItem("logId", id);
      this.$router.push("supplierJournal");
    }
  }
};
</script>
<style scoped>
.supply_list {
  height: calc(100% - 65px);
}

.wrapper {
  width: 100%;
  height: 100%;
  /* padding-top: 10%; */
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
  padding: 5px 0;
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
  text-align: center;
}
.el-button--mini {
  padding: 5px 10px;
}
.el-button {
  margin-left: 0 !important;
}
a {
  text-decoration: underline;
}
</style>
