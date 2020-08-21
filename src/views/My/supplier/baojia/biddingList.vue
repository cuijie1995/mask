<template>
  <div class="bidding_list">
    <div class="top">
      <van-nav-bar title="我的报价" left-text="返回" left-arrow @click-left="$router.push('/me')"></van-nav-bar>
    </div>
    <div class="wrapper">
      <div class="container" ref="wrapper">
        <div class="content" v-if="demandDatas.length > 0">
          <div class="content_item" v-for="(data,index) in demandDatas" :key="index">
            <van-row type="flex">
              <van-col span="8">
                <div class="item_img">
                  <img v-if="data.order.maxFile==null " src alt />
                  <img
                    v-if="data.order.maxFile!=null"
                    :src="pictureserverurl+data.order.maxFile.thumbnailpath"
                    :large="pictureserverurl+data.order.maxFile.fildpath"
                    :preview="index"
                    preview-text="产品图片"
                    class="avatar"
                    alt
                  />
                </div>
              </van-col>
              <van-col span="10">
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
                <div class="price_section" style="color:red">保证金：￥{{data.bondamt | formatMoney}}</div>
              </van-col>
              <van-col span="6">
                <div class="button">
                  <div v-if="data.jjzt == 0" class="jjzt">
                    <span>待提交</span>
                  </div>
                  <div v-if="data.jjzt == 1" class="jjzt">
                    <span>等待买家接受</span>
                  </div>
                  <div v-if="data.jjzt == 2" class="jjzt">
                    <span>达成意向</span>
                  </div>
                  <div v-if="data.jjzt == 3" class="jjzt">
                    <span>已完成</span>
                  </div>
                  <div v-if="data.jjzt == 4" class="jjzt">
                    <span>取消</span>
                  </div>
                  <div v-if="data.jjzt == 5" class="jjzt">
                    <span>拒绝</span>
                  </div>

                  <div class="status" @click="supplierJournal(data.kzjjlistoid)">
                    <el-button size="mini" type="success" round>操作记录</el-button>
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
import { formatDate,formatMoney } from "../../../DataFormator";
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
  // usertype: "",
  name: "biddingList",
  data: function() {
    return {
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
      show: true,
      //控制全选
      allChecked: true,
      //存放被选择的数据
      allSelectedGoods: [],
      dataId: "",
      dataIndex: "",
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
            axios.defaults.headers.common["Accept"] = "text/plain";

            self.$axios
              .post(self.url + "/api/Quotation/GetAllPage", {
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
      axios.defaults.headers.common["accept"] = "text/plain";

      self.$axios
        .post(
          self.url + "/api/Quotation/GetAllPage",

          {
            maxResultCount: self.maxResultCount,
            skipCount: self.skipCount
          },
          {
            headers: {
              "Content-Type": "application/json-patch+json"
            }
          }
        )
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
    viewDetails(id) {
      localStorage.setItem("supOrdId", id);
      self.$router.push("supViewRelease");
    },
    supplierJournal(id) {
      localStorage.setItem("logId", id);
      this.$router.push("supplierJournal");
    }
  }
};
</script>
<style scoped>
.bidding_list {
  height: 100%;
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

.button_i {
  height: 100%;
  line-height: 100%;
}
.button_i .el-button {
  margin-top: 20px;
}
.el-icon-finished {
  margin-top: 28px;
}

.button {
  height: 100%;
  line-height: 100%;
  /* margin-top: 50px; */
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
  width: 30%;
  padding-left: 20px;
}
.sum {
  margin-left: 20px;
}
.sum .el-button {
  padding: 10px 20px;
}
.jjzt {
  padding: 10px;
  text-align: center;
  font-size: 12px;
  color: #e6a23c;
}
a {
  text-decoration: underline;
}
</style>

