<template>
  <div class="home">
    <div class="top">
      <van-nav-bar
        title="我的需求"
        left-text="返回"
        left-arrow
        @click-left="$router.push('/me')"
        @click-right="$router.push('/addRelease')"
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
                <div class="button">
                  <div class="status" @click="purchaserJournal(data.kzxqorderoid)">
                    <el-button size="mini" type="success" round>{{data.jszt|formatstatus}}</el-button>
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
import axios from "axios";
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
    }
  },
  components: { bigImage },
  name: "Need",
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
            self.$axios
              .post(self.url + "/api/RequestPublish/GetMyPage", {
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

    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false); //false阻止默认事件    this.fun是指返回按建实际要执行的方法
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false); //false阻止默认事件
  },
  methods: {
    goBack() {
      this.$router.push({ path: "me" });
    },
    onClickView(viewoid) {
      this.$router.push("viewRelese");
      localStorage.setItem("viewRelaseID", viewoid);
      localStorage.setItem("viewType", "View");
    },
    getDemandDatas() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.defaults.headers.common["Accept"] = "text/plain";

      self.$axios
        .post(self.url + "/api/RequestPublish/GetMyPage", {
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
    purchaserJournal(id) {
      localStorage.setItem("logId", id);
      this.$router.push("purchaserJournal");
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
.home {
  height: 100%;
}
.top {
  height: 46px;
}
.wrapper {
  width: 100%;
  height: calc(100% - 46px);
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
.item_name,
.item_layer {
  font-weight: bold;
  font-size: 13px;
}
ul {
  width: 100%;
}
ul .item_name,
.item_delivery,
.pay_type {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
ul .item_name {
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
.status {
  color: #e6a23c;
  font-size: 12px;
}
.button {
  height: 100%;
  line-height: 100%;
  text-align: center;
}
.el-button--mini {
  padding: 5px 10px;
}
a {
  text-decoration: underline !important;
}
</style>