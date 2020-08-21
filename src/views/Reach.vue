<template>
  <div class="reach">
    <div class="top">
      <van-nav-bar title="供应" v-if="usertype == 2" @click-left="onClickSearch">
        <template #left>
          <van-icon name="search" size="18" />
        </template>
      </van-nav-bar>
      <van-nav-bar title="供应" v-else @click-left="onClickSearch" @click-right="onClickPlus">
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
          <div class="content_item" v-for="(data,index) in demandDatas" :key="index">
            <el-row class="name">
              <el-col :span="3" style="padding-left:10px;text-align: center;">
                <img src="../assets/供货.png" alt style="width:30px;height:30px;margin-top: 5px;" />
              </el-col>
              <el-col :span="21" style="height: 40px;line-height: 40px">
                <div class="item_layer">{{data.suppliername}}</div>
              </el-col>
            </el-row>
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
                <div class="price_section" v-if="data.maxprice==null || data.maxprice==0">
                  <span v-if="data.maxprice==0">单价：登录会员后查看</span>
                  <span v-else>单价：{{data.minprice | formatMoney}}</span>
                </div>
                <!-- <div class="price_section" v-if="data.maxprice==null || data.maxprice==0">
                  单价：{{data.minprice | formatMoney}
                </div>-->
                <div
                  class="price_section"
                  v-else
                >单价区间：{{data.minprice | formatMoney}}-{{data.maxprice | formatMoney}}</div>
                <!-- <div class="pay_type">付款方式：{{data.paytype}}</div> -->
                <div v-if="data.doctype == 1">
                  <!-- <div class="pay_type">每份数量:{{data.startqty}}{{data.company}}</div> -->
                  <div class="pay_type">供应数量:{{data.groupbuyqty}}{{data.company}} / {{data.copies}}份</div>
                  <div
                    class="pay_type"
                  >剩余数量:{{data.groupbuyqty - data.quantityordered}}{{data.company}} / {{data.copies - data.copiesordered}}份</div>
                </div>
                <div v-if="data.doctype == 2">
                  <!-- <div
                    class="pay_type"
                    v-if="data.doctype == 2"
                  >每份数量:{{data.startqty}}{{data.company}}</div>-->
                  <div
                    v-if="data.doctype == 2"
                    class="pay_type"
                  >成团数量：{{data.groupbuyqty | formatNumber}}{{data.company}} / {{data.copies}} 份</div>
                  <!-- <div
                    v-if="data.doctype == 2"
                    class="pay_type"
                  >参团数量：{{data.quantityordered}}{{data.company}}</div>-->
                  <div
                    v-if="data.doctype == 2"
                    class="pay_type"
                  >剩余数量：{{data.groupbuyqty - data.quantityordered}}{{data.company}} / {{data.copies - data.copiesordered}}份</div>
                  <div
                    v-if="(data.dd>0 || data.hh >'00' || data.mm>'00' || data.ss>'00') && !data.issuccess"
                    class="pay_type"
                    style="color:red"
                  >倒计时：{{data.dd}}天{{data.hh}}:{{data.mm}}:{{data.ss}}</div>
                </div>
                <ul class="name_layer">
                  <li class="item_price" v-if="data.bondamt">保证金：￥{{data.bondamt | formatMoney}}</li>
                </ul>
              </van-col>
              <van-col span="6" v-if="usertype == 2">
                <div v-if="data.doctype == 1" class="already">
                  <el-button
                    size="mini"
                    v-if="!data.isAccept"
                    type="danger"
                    round
                    @click="OnQuote(data.kzproductoid)"
                  >
                    <i class="el-icon-shopping-cart-1">订购</i>
                  </el-button>
                  <div v-else style="color:#67C23A;font-size: 14px;">已订购</div>
                </div>

                <div v-if="data.doctype == 2" class="already">
                  <el-button
                    size="mini"
                    v-if="!data.isAccept && !data.issuccess"
                    type="danger"
                    round
                    @click="OnQuote(data.kzproductoid)"
                  >
                    <i class="el-icon-shopping-cart-1">拼团</i>
                  </el-button>
                  <div v-if="data.isAccept" style="color:#67C23A;font-size: 14px;">已拼团</div>
                  <div
                    v-if="data.groupbuyqty <= data.quantityordered"
                    style="color:#E6A23C;font-size: 14px;padding:10px"
                  >拼团成功</div>
                </div>
                <i
                  style="color:green;font-size: 14px;"
                  class="el-icon-finished"
                  v-if="data.bondamt > 0"
                >保证金</i>
              </van-col>
              <van-col span="6" v-else>
                <div v-if="data.doctype == 2" class="already">
                  <div v-if="data.isAccept" style="color:#67C23A;font-size: 14px;">已拼团</div>
                  <div v-if="data.issuccess" style="color:#E6A23C;font-size: 14px;padding:10px">拼团成功</div>
                </div>
                <el-button
                  size="mini"
                  v-if="userToken == null"
                  type="danger"
                  round
                  @click="goLogin()"
                >
                  <i class="el-icon-shopping-cart-1">订购</i>
                </el-button>
                <i
                  style="color:green;font-size: 14px;"
                  class="el-icon-finished"
                  v-if="data.bondamt > 0"
                >保证金</i>
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
              <!-- @change="BigRadio(bigRadio,item.Kzghlxoid)" -->
              <el-radio-button :label="item.Lm" :value="item.Kzghlxoid">
                <span @click="BigRadio(item.Lm,item.Kzghlxoid)">{{item.Lm}}</span>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="search_min" v-if="minType.length > 0">
            <el-radio-group v-model="minRadio" v-for="(item,i) in minType" :key="i" size="small">
              <!-- @change="MinRadio(minRadio,item.kzlxoid)" -->

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
import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";
import { formatDate, formatMoney } from "./DataFormator.js";
import bigImage from "../components/bigImage";

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
        case "0":
          return "待支付";
          break;
        case "1":
          return "已付保证金";
          break;
        case "2":
          return "已达成订单";
          break;
        case "3":
          return "已完成";
          break;
        case "4":
          return "已取消";
          break;
        default:
          return "待支付";
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
  components: { bigImage },
  name: "reach",
  data() {
    return {
      activeClass: 0,
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
      bottom: false,
      show: true,
      inputShow: "",
      usertype: "",
      userId: "",
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
    localStorage.setItem("isTip", self.tip);
    self.countTime();
    self.getDemandDatas();
    self.getTopData();

    self.getTop();
    // }, 3000);
    self.getTopData();

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
            self.$axios
              .post(self.url + "/api/ProductPublish/GetAllPage", {
                maxResultCount: self.maxResultCount,
                skipCount: self.skipCount,
                userId: self.userId
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
      self.$axios
        .post(self.url + "/api/ProductPublish/GetAllPage", {
          maxResultCount: self.maxResultCount,
          skipCount: self.skipCount,
          userId: self.userId
        })
        .then(res => {
          for (let index = 0; index < res.data.data.length; index++) {
            const item = res.data.data[index];
            item.dd = 0;
            item.hh = "0";
            item.mm = "0";
            item.ss = "0";

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
            this.$router.push("/reach");
          });
      }
    },
    OnQuote(id) {
      localStorage.setItem("ViewReachOID", id);
      self.$router.push("viewReach");
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

    countTime() {
      setInterval(self.countTimes, 1000);
    },
    countTimes() {
      if (self.demandDatas.length == 0) {
        return;
      }
      self.demandDatas.forEach(data => {
        // console.log("eeee")
        // console.log(data)
        if (data.doctype == 2) {
          // 获取当前时间
          let date = new Date();
          let now = date.getTime();
          // 设置截止时间
          let endDate = new Date(data.groupendtime); // this.curStartTime需要倒计时的日期
          let end = endDate.getTime();
          // 时间差
          let leftTime = end - now;
          // 定义变量 d,h,m,s保存倒计时的时间
          if (leftTime >= 0) {
            // 天
            data.dd = Math.floor(leftTime / 1000 / 60 / 60 / 24);
            // 时
            let h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
            data.hh = h < 10 ? "0" + h : h;
            // 分
            let m = Math.floor((leftTime / 1000 / 60) % 60);
            data.mm = m < 10 ? "0" + m : m;
            // 秒
            let s = Math.floor((leftTime / 1000) % 60);
            data.ss = s < 10 ? "0" + s : s;
          } else {
            data.dd = 0;
            data.hh = "00";
            data.mm = "00";
            data.ss = "00";
          }
        }
      });
    },
    goLogin() {
      Dialog.confirm({
        title: "提示",
        message: "您还没有登录，登录后才能订购"
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
          self.$router.push("/reach");
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
          self.limit = [];
          self.bigRadio = null;
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirm() {
      self.$axios
        .post(self.url + "/api/ProductPublish/GetAllPage", {
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
      // var data;
      // var data = [];
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
      // }
    }
  }
};
</script>
<style scoped>
.reach {
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
.price_section,
.pay_type {
  font-size: 12px;
}
.item_price {
  color: red;
  font-size: 13px;
  font-weight: bold;
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
.already {
  text-align: center;
}
.el-button {
  margin-left: 0 !important;
}
a {
  text-decoration: underline;
}
.van-col--6 {
  text-align: center;
}
i.el-icon-finished {
  margin-top: 20px;
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
