<template>
  <div class="home">
    <div class="top">
      <van-nav-bar title="已收货待确认" left-text="返回" left-arrow @click-left="$router.push('/me')"></van-nav-bar>
    </div>
    <div class="wrapper">
      <div class="container" ref="wrapper">
        <div class="content" v-if="demandDatas.length > 0">
          <div class="content_item" v-for="(data,index) in demandDatas" :key="index">
            <van-row type="flex">
              <van-col span="4">
                <input
                  type="checkbox"
                  @click="selectSingle(index)"
                  :checked="allSelectedGoods.indexOf(data.kzjjlistoid)>=0"
                />
              </van-col>
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
                  <li class="item_name">{{data.order.spmc}}</li>
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
                <div class="price_section">订单价格：{{data.jbdj | formatMoney}}</div>
                <div class="price_section">订单数量：{{data.jjsl}}</div>
                <div class="price_section">保证金{{data.jjsl}}</div>

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

      <div class="footer" v-if="demandDatas.length > 0">
        <ul>
          <li class="all">
            <input
              type="checkbox"
              @click="selectAll()"
              :checked="demandDatas.length===allSelectedGoods.length&&demandDatas.length"
            />全选
          </li>
          <li></li>
          <li class="sum">
            <el-button type="primary" round @click="payment">确认收货</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
let self;
import BScroll from "better-scroll";
import { formatDate,formatMoney } from "../../DataFormator";
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
  name: "OrderReached",
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
      dataIndex: ""
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
              .post(self.url + "/api/Quotation/GetDemandAllPage", {
                maxResultCount: self.maxResultCount,
                skipCount: self.skipCount,
                jjzt: 2,
                quoStatus: 0
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
          self.url + "/api/Quotation/GetDemandAllPage",
          // "/api/RequestPublish/GetMyPage"
          {
            maxResultCount: self.maxResultCount,
            skipCount: self.skipCount,
            jjzt: 2,
            quoStatus: 0
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
    //点击全选按钮
    selectAll() {
      //event.currentTarget.checked表示点击完后该选择框的状态
      if (!event.currentTarget.checked) {
        this.allSelectedGoods = [];
      } else {
        this.allSelectedGoods = []; //先置空，然后再重新添加，不然数组里会有重复！因为有可能点击全选之前已经选择了几个单选按钮。也就是数组里已经添加过了对应的id。
        this.demandDatas.forEach((v, k) => {
          this.allSelectedGoods.push(v.kzjjlistoid);
        });
      }
    },
    //点击单选按钮
    selectSingle(index) {
      this.dataIndex = index;
      if (event.currentTarget.checked) {
        this.dataId = this.demandDatas[index].kzjjlistoid;
        this.allSelectedGoods.push(this.demandDatas[index].kzjjlistoid);
      } else {
        for (var i = 0; i < this.allSelectedGoods.length; i++) {
          if (
            self.demandDatas[index].kzjjlistoid === self.allSelectedGoods[i]
          ) {
            self.allSelectedGoods.splice(i, 1);
            self.allChecked = false;
            break;
          }
        }
      }
    },
    payment() {
      self.$axios
        .get(
          self.url + "/api/Quotation/FinisQuotationOfBuyer?id=" + self.dataId
        )
        .then(res => {
          // self.demandDatas.splice(self.dataIndex, 1);

          var token = localStorage.getItem("loginToken");
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          axios.defaults.headers.common["accept"] = "text/plain";

          self.$axios
            .post(
              self.url + "/api/Quotation/GetDemandAllPage",
              // "/api/RequestPublish/GetMyPage"
              {
                maxResultCount: self.maxResultCount,
                skipCount: 0,
                jjzt: 2,
                quoStatus: 0
              },
              {
                headers: {
                  "Content-Type": "application/json-patch+json"
                }
              }
            )
            .then(res => {
              // for (let index = 0; index < res.data.data.length; index++) {
              //   const item = res.data.data[index];

              //   self.demandDatas.push(item);
              //   // self.demandDatas[index].isSelected = true;
              // }
              self.demandDatas = res.data.data;
              self.lastPage = res.data.toletCount;
              self.skipCount += res.data.data.length;
              self.show = true;
            })
            .catch(err => {
              console.log(err);
            });

          Notify({ type: "success", message: res.data.resultMsg });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    //totalPrice计算总价
    totalPrice() {
      var totalprice = 0;
      //加入选择框以后的计算总价
      self.demandDatas.forEach((v, k) => {
        // console.log(v)
        if (self.allSelectedGoods.indexOf(v.kzjjlistoid) !== -1) {
          totalprice += v.bjyfyj;
        }
      });
      return totalprice.toFixed(2);
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
  /* padding-top: 10%; */
  padding-bottom: 0px;
}

.container {
  height: calc(100% - 60px);
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
  margin-top: 50px;
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
</style>

