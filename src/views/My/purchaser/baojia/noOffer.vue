<template>
  <div class="bidding_list">
    <div class="top">
      <van-nav-bar
        title="未报价列表"
        left-text="返回"
        left-arrow
        @click-left="$router.push('/biddingListPurchaser')"
      ></van-nav-bar>
    </div>
    <div class="wrapper">
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
                    :large="pictureserverurl+data.maxFile.fildpath"
                    :preview="index"
                    preview-text="产品图片"
                    class="avatar"
                    alt
                  />
                </div>
              </van-col>

              <van-col span="10">
                <ul class="name_layer">
                  <li class="item_name">{{data.spmc}}</li>
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
                <div class="pay_type">付款方式：{{data.fkfs}}</div>
                <ul class="name_layer">
                  <li class="item_price">￥{{data.zje|formatMoney}}</li>
                </ul>
              </van-col>
              <van-col span="6">
                <div class="button">
                  <el-button @click="confirm(index)" size="mini" type="warning" round>确认</el-button>

                  <el-button @click="cancel(index)" size="mini" type="success" round>取消</el-button>
                </div>
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
import { formatDate,formatMoney } from "../../../DataFormator.js";
import axios from "axios";
import Notify from "vant/lib/notify";
import "vant/lib/notify/style";

export default {
  filters: {
    formatDate(time) {
      let date = new Date(time);

      return formatDate(date, "M月d日");
    },
   formatMoney(data) {
      return formatMoney(data)
    },
  },
  usertype: "",
  name: "NoOffer",
  data: function() {
    return {
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
      noOffer: 5
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
  },
  methods: {
    getDemandDatas() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
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
    confirm(index) {
      Notify({ type: 'success', message: '确认报价成功' });

    },
    cancel(index) {
      Notify({ type: 'success', message: '取消报价成功' });
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

.el-button--mini {
  padding: 5px 10px;
  margin-bottom: 10px;
}
.button {
  text-align: right;
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>
<style>
.van-popup--top{
  top: 300px;
}
</style>
