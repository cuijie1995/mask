<template>
  <div class="view_reach">
    <div class="top">
      <van-nav-bar title="产品供应信息" left-text="返回" left-arrow @click-left="$router.go('-1')" />
    </div>
    <div class="wrapper">
      <div class="container">
        <div class="content">
          <el-divider content-position="center">产品信息</el-divider>
          <ul class="good_top">
            <li>
              <el-row>
                <el-col :span="6">
                  <span class="li_name">商品名称：</span>
                </el-col>
                <el-col :span="16">{{reachForm.productname}}</el-col>
              </el-row>
            </li>
            <li>
              <el-row>
                <el-col :span="6">
                  <span class="li_name">商品规格：</span>
                </el-col>
                <el-col :span="16">{{reachForm.productspec}}</el-col>
              </el-row>
            </li>
            <li>
              <el-row>
                <el-col :span="6">
                  <span class="li_name">订单单号：</span>
                </el-col>
                <el-col :span="16">{{reachForm.docno}}</el-col>
              </el-row>
            </li>
          </ul>

          <div class="goods-area">
            <ul v-if="reachForm.productimgs || reachForm.qualifications">
              <li class="item_img" v-if="reachForm.productimgs">
                <div v-if="reachForm.productimgs.length > 0">
                  <el-divider content-position="center">产品图片</el-divider>
                  <el-row>
                    <div v-for="(item,index) in reachForm.productimgs" :key="index">
                      <el-col :span="8">
                        <div class="item_img">
                          <img
                            :src="pictureserverurl+item.thumbnailpath"
                            :large="pictureserverurl+item.fildpath"
                            preview="1"
                            preview-text="产品图片"
                            class="avatar"
                          />
                        </div>
                      </el-col>
                    </div>
                  </el-row>
                </div>
              </li>

              <li class="item_img" v-if="reachForm.qualifications">
                <div v-if="reachForm.qualifications.length > 0">
                  <el-divider content-position="center">资质证书</el-divider>
                  <el-row>
                    <div v-for="(item,index) in reachForm.qualifications" :key="index">
                      <el-col :span="8">
                        <div class="item_img">
                          <img
                            :src="pictureserverurl+item.thumbnailpath"
                            :large="pictureserverurl+item.fildpath"
                            preview="2"
                            preview-text="资质证书"
                            class="avatar"
                          />
                        </div>
                      </el-col>
                    </div>
                  </el-row>
                </div>
              </li>
            </ul>

            <el-divider v-if="reachForm.doctype==1" content-position="center">供应信息</el-divider>
            <el-divider v-if="reachForm.doctype==2" content-position="center">团购信息</el-divider>
            <ul>
              <li v-if="reachForm.doctype==2">
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">成团数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{reachForm.groupbuyqty|formatNumber}} {{reachForm.company}}</el-col>
                </el-row>
              </li>

              <li v-if="reachForm.doctype==2">
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">参团数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{reachForm.quantityordered|formatNumber}} {{reachForm.company}}</el-col>
                </el-row>
              </li>
              <!-- 1111111111111111111
              {{userState}} -->
              <li v-if="userState == 1">
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">价格区间：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{reachForm.minprice | formatMoney}}~{{reachForm.maxprice | formatMoney}}</el-col>
                </el-row>
              </li>
              <li v-else>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">价格区间：</span>
                  </el-col>
                  <el-col :span="16" style="color:red">登录会员以后才能查看</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">交期天数：</span>
                  </el-col>
                  <el-col :span="16" style="color:red">{{reachForm.deliverydays|formatNumber}}天</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">税 率：</span>
                  </el-col>
                  <el-col :span="16">{{reachForm.taxrate|formatsuilv}}</el-col>
                </el-row>
              </li>

              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">付款方式：</span>
                  </el-col>
                  <el-col :span="16">{{reachForm.paytype}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">物流费用：</span>
                  </el-col>
                  <el-col :span="16">{{reachForm.undertaker}}</el-col>
                </el-row>
              </li>

              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">每份数量：</span>
                  </el-col>
                  <el-col :span="16">{{reachForm.startqty|formatNumber}} {{reachForm.company}}</el-col>
                </el-row>
              </li>
              <li v-if="reachForm.doctype == 1">
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">供应数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                  >{{reachForm.groupbuyqty | formatNumber}}{{reachForm.company}} / {{reachForm.copies}} 份</el-col>
                </el-row>
              </li>
              <li v-if="reachForm.doctype == 2">
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">团购数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                  >{{reachForm.groupbuyqty | formatNumber}}{{reachForm.company}} / {{reachForm.copies}} 份</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">剩余数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{reachForm.groupbuyqty - reachForm.quantityordered | formatNumber}}{{reachForm.company}} / {{reachForm.copies - reachForm.copiesOrdered}}份</el-col>
                </el-row>
              </li>

              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">保证金：</span>
                  </el-col>
                  <el-col :span="16" style="color:red">{{reachForm.bondamt | formatMoney}}</el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { formatDate, formatMoney } from "../DataFormator.js";
export default {
  filters: {
    formatDate(time) {
      let date = new Date(time);

      return formatDate(date, "M月d日");
    },
    formatsuilv(val) {
      if (val == 0.13) {
        return "含税13%";
      } else {
        return "不含税";
      }
    },
    formatMoney(data) {
      return formatMoney(data);
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
  viewType: "",
  name: "orderViewReach",
  data() {
    return {
      reachForm: {},
      purform: {
        quantity: ""
      },
      viewType: "",
      userType: "",
      requestTotal: "",
      porductTotal: "",
      userState: ""
    };
  },
  rules: {
    quantity: [{ required: true, message: "请录入数量", trigger: "blur" }]
  },
  mounted() {
    self = this;
    this.viewType = localStorage.getItem("viewType");
    this.userType = localStorage.getItem("loginLx");
    this.getViewReach();

    if (localStorage.getItem("loginToken")) {
      this.getType();
    }
  },
  methods: {
    getViewReach() {
      var ViewReachOID = localStorage.getItem("orderViewReachOID");
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      this.$axios
        .get(this.url + "/api/ProductPublish/GetOrder?id=" + ViewReachOID)
        .then(res => {
          this.reachForm = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getType() {
      if (this.userType == 1) {
        var token = localStorage.getItem("loginToken");
        this.$axios.defaults.headers.common["Authorization"] =
          "Bearer " + token;
        this.$axios
          .get(this.url + "/api/ProductPublish/GetPorductTotal")
          .then(res => {
            this.userState = res.data.data.user.zt;
          })
          .catch(() => {});
      }
      if (this.userType == 2) {
        var token = localStorage.getItem("loginToken");
        this.$axios.defaults.headers.common["Authorization"] =
          "Bearer " + token;
        this.$axios
          .get(this.url + "/api/RequestPublish/GetRequestTotal")
          .then(res => {
            this.userState = res.data.data.user.zt;
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style  scoped>
.view_reach {
  height: 100%;
}
.top {
  height: 46px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
}
.wrapper {
  height: calc(100% - 46px);
  margin-top: 70px;
}
.container {
  height: 100%;
}
ul {
  background: #ffffff;
  margin: 30px 0;
  width: 98%;
  margin-left: 1%;
  border-radius: 20px;
  padding-top: 10px;
  font-size: 14px;
}
ul li {
  /* height: 40px; */
  padding: 5px;
  color: black;
  margin-left: 10px;
}
.el-divider {
  height: 2px;
  margin: 16px 0;
}
.li_name {
  color: gray;
}
.el-col.el-col-6 {
  text-align: right;
}
.attribute .el-row {
  padding-left: 10px;
}
</style>
<style>
.view_reach .item_img .el-divider__text.is-center {
  background: #409eff;
  font-size: 10px;
  padding: 4px 10px;
}
.view_reach .el-divider__text.is-center {
  background: #67c23a;
  color: #ffffff;
  padding: 6px 20px;
}
</style>