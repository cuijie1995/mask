<template>
  <div class="home">
    <div class="top">
      <van-nav-bar title="需求" v-if="usertype == 1" @click-left="onClickSearch">
        <template #left>
          <van-icon name="search" size="18" />
        </template>
      </van-nav-bar>
      <van-nav-bar title="需求" v-else @click-left="onClickSearch" @click-right="onClickPlus">
        <template #right>
          <van-icon name="plus" size="18" />
        </template>
        <template #left>
          <van-icon name="search" size="18" />
        </template>
      </van-nav-bar>
    </div>

    <div class="wrapper_top">
      <van-notice-bar left-icon="volume-o">
        <span v-for="(item,index) in carousels" :key="index" style="margin-right:10px">{{item}}</span>
      </van-notice-bar>
    </div>
    <div class="wrapper">
      <bigImage v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImage>

      <div class="container" ref="wrapper">
        <div class="content" v-if="demandDatas.length > 0">
          <div v-if="showTop">
            <i class="el-icon-loading"></i>
            {{pulldownMsg}}
          </div>
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
                    <a>
                      <span>{{data.spmc}}</span>
                    </a>
                  </li>
                  <li class="item_layer">
                    <span>{{data.spgg}}</span>
                  </li>
                </ul>
                <div
                  class="item_delivery"
                  v-if=" data.dhrq == data.maxdhrq "
                >交货：{{data.dhrq|formatDate}}</div>
                <div
                  class="item_delivery"
                  v-else
                >交货：{{data.dhrq|formatDate}}~{{data.maxdhrq|formatDate}}</div>
                <div class="item_delivery">需求数量：{{data.sl}}{{data.company}}</div>
                <div
                  class="price_section"
                  v-if="data.maxdj==null || data.maxdj==0"
                >单价：{{data.cgj | formatMoney}}</div>
                <div
                  class="price_section"
                  v-else
                >单价区间：{{data.cgj | formatMoney}}-{{data.maxdj | formatMoney}}</div>
                <div class="pay_type">付款方式：{{data.fkfs}}</div>
                <ul class="name_layer">
                  <li class="item_price" v-if="data.bondamt">保证金：￥{{data.bondamt | formatMoney}}</li>
                </ul>
              </van-col>
              <van-col span="6">
                <div class="button_i" v-if="usertype == 1">
                  <div v-if="!data.isAccept">
                    <el-button
                      size="mini"
                      type="danger"
                      round
                      v-if="data.jszt == 1 "
                      @click="OnQuote(data.kzxqorderoid)"
                    >
                      <i class="el-icon-shopping-cart-1">抢单</i>
                    </el-button>
                    <div class="pay" style="padding:10px 0 10px 0">
                      <i class="iconfont icon-iconfabuzhong" v-if="data.jszt == 1"></i>
                      <i class="iconfont icon-icon-dachengfuwu" v-if="data.jszt == 2"></i>
                      {{data.jszt|formatstatus}}
                    </div>
                    <i
                      style="color:green;font-size: 14px;"
                      class="el-icon-finished"
                      v-if="data.bondamt > 0"
                    >保证金</i>

                    <i
                      style="color:red;font-size: 12px;"
                      class="el-icon-warning-outline"
                      v-else
                    >未支付保证金</i>
                  </div>
                  <div v-else>
                    <div v-if="data.jszt == 1" class="already">
                      <i class="el-icon-circle-check">已抢单</i>
                    </div>

                    <div class="pay" style="padding:10px 0 10px 0">
                      <i class="iconfont icon-iconfabuzhong" v-if="data.jszt == 1"></i>
                      <i class="iconfont icon-icon-dachengfuwu" v-if="data.jszt == 2"></i>
                      {{data.jszt|formatstatus}}
                    </div>
                    <i
                      style="color:green;font-size: 14px;"
                      class="el-icon-finished"
                      v-if="data.bondamt > 0"
                    >保证金</i>
                    <i
                      style="color:red;font-size: 12px;"
                      class="el-icon-warning-outline"
                      v-else
                    >未支付保证金</i>
                  </div>
                </div>
                <div class="button" v-else>
                  <div v-if="userToken == null ">
                    <el-button size="mini" type="danger" round @click="goLogin()">
                      <i class="el-icon-shopping-cart-1">抢单</i>
                    </el-button>
                  </div>
                  <div class="pay">
                    <i class="iconfont icon-iconfabuzhong" v-if="data.jszt == 1"></i>
                    <i class="iconfont icon-dachengfuwu" v-if="data.jszt == 2"></i>
                    {{data.jszt|formatstatus}}
                  </div>
                  <i
                    style="color:green;margin-top: 20px;font-size: 14px;"
                    class="el-icon-finished"
                    v-if="data.bondamt > 0"
                  >保证金</i>
                  <i
                    style="color:red;font-size: 12px;"
                    class="el-icon-warning-outline"
                    v-else
                  >未支付保证金</i>
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

    <div class="side" v-if="isShow">
      <div class="search">
        <div class="search_content">
          <div class="search_big" v-if="goodType.length > 0">
            <el-radio-group
              v-model="bigRadio"
              v-for="(item,index) in goodType"
              :key="index"
              size="small"
            >
              <el-radio-button :label="item.Lm" :value="item.Kzghlxoid">
                <span @click="BigRadio(item.Lm,item.Kzghlxoid)">{{item.Lm}}</span>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="search_min" v-if="minType.length > 0">
            <el-radio-group v-model="minRadio" v-for="(item,i) in minType" :key="i" size="small">
              <el-radio-button :label="item.name" :value="item.kzlxoid">
                <span @click="MinRadio(item.name,item.kzlxoid)">{{item.name}}</span>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="search_sma" v-if="smoType.length > 0">
            <el-checkbox-group v-model="limit" @change="SmoRadio" size="small">
              <el-checkbox-button v-for="data in smoType" :key="data.kzcpzloid" :label="data.cpmc"></el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>

        <div class="footer">
          <el-button size="mini" @click="reset()">重置</el-button>
          <el-button type="primary" size="mini" @click="confirm()">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let self;
import BScroll from "better-scroll";
import { formatDate, formatMoney } from "./DataFormator.js";
import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";
import bigImage from "../components/bigImage";
import search from "../components/search";
import bus from "../bus";

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
          return "待发布";
          break;
        case 1:
          return "发布中";
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
          return "待发布";
      }
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
  components: { bigImage, search },
  name: "Release",
  data() {
    return {
      dataTop: [],
      showTop: false,
      limit: [],
      bigRadio: "",
      minRadio: "",
      smoRadio: "",
      goodType: [],
      minType: [],
      smoType: [],
      bigValue: "",
      minValue: "",
      smoValue: [],
      bigId: "",
      minId: "",
      smoId: "",
      isShow: false,
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
      showContent: false,
      userId: "",
      usertype: "",
      userToken: "",
      carousels: [],
      tip: 1
    };
  },
  mounted() {
    self = this;
    self.usertype = localStorage.getItem("loginLx");
    self.userId = localStorage.getItem("loginId");
    self.userToken = localStorage.getItem("loginToken");

    if (localStorage.getItem("isTrue")) {
      setTimeout(() => {
        localStorage.setItem("isTip", self.tip);
      }, 3000);
    }

    self.getDemandDatas();
    self.getTop();
    self.getTopData();

    this.$nextTick(() => {
      self.scroll = new BScroll(self.$refs.wrapper, {
        probeType: 1,
        click: true,
        pullUpLoad: {
          threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        pullDownRefresh: {
          threshold: 50 // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          // stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        }
      });
      self.scroll.on("pullingDown", () => {
        self.showTop = true;
        // 刷新数据的过程中，回弹停留在距离顶部还有20px的位置
        // this.goods = []; // 重置数据
        // this.searchCondition.pageNo = 1; // 重置分页数
        self.getDemandDatas(); //获取数据方法
      });
      // 监听滚动结束
      self.scroll.on("pullingUp", pos => {
        // console.log(pos)
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
            self.$axios
              .post(self.url + "/api/RequestPublish/GetAllPage", {
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
    OnQuote(oid) {
      localStorage.setItem("viewType", "Quote");
      localStorage.setItem("viewRelaseID", oid);
      this.$router.push("robViewRelease");
    },
    getDemandDatas() {
      self.$axios
        .post(self.url + "/api/RequestPublish/GetAllPage", {
          maxResultCount: self.maxResultCount,
          skipCount: self.skipCount,
          userId: self.userId
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
          self.showTop = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    onClickPlus() {
      var token = localStorage.getItem("loginToken");
      if (token) {
        this.$router.push("addRelease");
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
    onClickView(viewoid) {
      this.$router.push("robViewRelease");
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
    },
    goLogin() {
      Dialog.confirm({
        title: "提示",
        message: "您还没有登录，登录后才能抢单"
      })
        .then(() => {
          let currentUrl = encodeURIComponent("http://www.qqr.world/m/#/login");

          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb78fc8385b943fd8&redirect_uri=" +
            currentUrl +
            "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
        })
        .catch(() => {
          // on cancel
          self.$router.push("/");
        });
    },
    onClickSearch() {
      self.$axios
        .get(self.url + "/api/BaseData/GetGoodsType")
        .then(res => {
          self.goodType = res.data.Value.Data;
        })
        .catch(err => {
          console.log(err);
        });
      self.isShow = true;
    },
    BigRadio(value, id) {
      self.bigValue = value;
      self.bigId = id;
      self.minRadio = null;

      self.$axios
        .get(self.url + "/api/BaseData/GetGoodsMidType?id=" + self.bigId)
        .then(res => {
          self.minType = res.data.data;
          self.smoType = [];
          self.limit = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    MinRadio(value, id) {
      self.minValue = value;
      self.minId = id;
      self.$axios
        .get(self.url + "/api/BaseData/GetGoodsSmoType?id=" + self.minId)
        .then(res => {
          self.smoType = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    SmoRadio(value) {
      self.smoValue = value;
    },
    reset() {
      self.$axios
        .get(self.url + "/api/BaseData/GetGoodsType")
        .then(res => {
          self.goodType = res.data.Value.Data;
          self.minType = [];
          self.smoType = [];
          self.bigValue = null;
          self.minValue = null;
          self.smoValue = [];
          self.bigRadio = null;
          self.limit = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirm() {
      self.$axios
        .post(self.url + "/api/RequestPublish/GetAllPage", {
          maxResultCount: self.maxResultCount,
          skipCount: 0,
          userId: self.userId,
          bigType: self.bigValue,
          minType: self.minValue,
          smoType: self.smoValue
        })
        .then(res => {
          self.demandDatas = res.data.data;

          self.isShow = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTopData() {
      self.$axios
        .get(self.url + "/api/BaseData/GetTopMsg")
        .then(res => {
          self.dataTop = res.data;
          if (res.data.length > 0) {
            self.carousels = [];
            self.dataTop.forEach(element => {
              self.carousels.push(element);
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTop() {
      self.carousels = [
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",

        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易",
        "全球人防疫物资全产业链整合",
        "源头厂家",
        "一手订单",
        "诚信交易"
      ];
    }
  }
};
</script>
<style scoped>
.home {
  height: calc(100% - 65px);
}

.wrapper {
  width: 100%;
  height: 100%;
  padding-bottom: 0px;
  margin-top: 90px;
}

.container {
  height: 100%;
  overflow: hidden;
}

.content {
  padding: 4% 2% 0% 2%;
  min-height: 100%;
  padding-top: 10px;
  position: relative;
  overflow-y: scroll;
}
.carouselitem {
  color: rgb(233, 150, 122);
  background-color: lightblue;
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
  width: 100%;
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
  text-align: center;
}
.button {
  height: 100%;
  line-height: 100%;
  text-align: center;
}
.pay {
  color: #e6a23c;
  font-size: 14px;
  margin-top: 15px;
}
.already i {
  color: red;
  background-color: floralwhite;
  font-size: 12px;
}
a {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #409eff;
  text-decoration: underline;
}
.top {
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 10;
}
.wrapper_top {
  position: fixed;
  width: 100%;
  top: 50px;
  z-index: 10;
}
.side {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
}
.search {
  width: 80%;
  background: #ffffff;
  height: 100%;
}
.footer {
  position: absolute;
  bottom: 50px;
  left: 70px;
}
.search_content {
  padding-top: 20px;
  padding-left: 20px;
}

.search_big,
.search_min,
.search_sma {
  padding-bottom: 10px;
  border-bottom: 1px solid #dbd8d8;
}
</style>
<style>
.search_content span.el-radio-button__inner,
.search_content .el-checkbox-button__inner {
  border-radius: 20px !important;
}
.search_content .el-radio-group {
  margin-right: 10px;
  margin-top: 10px;
}
.search_content label.el-checkbox-button.el-checkbox-button--small {
  margin-top: 10px;
  margin-right: 10px;
}
.search_content .el-checkbox-group {
  display: inline;
}
</style>