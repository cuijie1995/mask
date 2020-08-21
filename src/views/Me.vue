<template>
  <div class="me">
    <div v-if="userToken">
      <div class="top">
        <div v-if="porductTotalShow">
          <div v-if="porductTotal.user.gsmc != ''" @click="showMyInfo()">
            <el-row>
              <el-col
                :span="13"
                style="color: #409eff; font-size: 18px;text-align: center;font-size:14px"
              >
                <span v-if="porductTotal.user.zt == 1 ">{{porductTotal.user.gsmc }}</span>
                <span v-if="porductTotal.user.zt == 0">{{porductTotal.user.sjh}}</span>
                <span v-if="porductTotal.user.zt == 2 ">{{porductTotal.user.sjh}}</span>
              </el-col>
              <el-col
                :span="10"
                v-if="porductTotal.user.zt == 1 "
                style="text-align: right;padding-right: 20px;"
              >
                <i class="el-icon-arrow-right aa"></i>
              </el-col>
              <el-col :span="10" v-if="porductTotal.user.zt == 0 " style="text-align: right;">
                <span style="font-size: 12px;color: red">用户未审核，请完善信息</span>
              </el-col>
              <el-col :span="10" v-if="porductTotal.user.zt == 2 " style="text-align: right;">
                <span style="font-size: 12px;color: red" class="ee">用户信息正在审核</span>
              </el-col>
            </el-row>
          </div>
          <div v-else @click="showMyInfo()">
            <el-row>
              <el-col
                :span="13"
                style="color: #409eff; font-size: 18px;text-align: center;font-size:14px"
              >
                <span v-if="porductTotal.user.zt == 1 ">{{porductTotal.user.sqr}}</span>
                <span v-if="porductTotal.user.zt == 0 ">{{porductTotal.user.sjh}}</span>
                <span v-if="porductTotal.user.zt == 2 ">{{porductTotal.user.sjh}}</span>
              </el-col>
              <el-col
                :span="10"
                v-if="porductTotal.user.zt == 1 "
                style="text-align: right;padding-right: 20px;"
              >
                <i class="el-icon-arrow-right bb"></i>
              </el-col>
              <el-col :span="10" v-if="porductTotal.user.zt == 0 " style="text-align: right;">
                <span style="font-size: 12px;color: red">用户未审核，请完善信息</span>
              </el-col>
              <el-col :span="10" v-if="porductTotal.user.zt == 2 " style="text-align: right;">
                <span style="font-size: 12px;color: red" class="qq">用户信息正在审核</span>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-if="requestTotalShow">
          <div v-if="requestTotal.user.gsmc != ''" @click="showMyInfo()">
            <el-row>
              <el-col
                :span="13"
                style="color: #409eff; font-size: 18px;text-align: center;font-size:14px"
              >
                <span v-if="requestTotal.user.zt == 1 ">
                  <span v-if="requestTotal.user.gsmc">{{requestTotal.user.gsmc}}</span>
                  <span v-else>{{requestTotal.user.sjh}}</span>
                </span>
                <span v-if="requestTotal.user.zt == 0">{{requestTotal.user.sjh}}</span>
                <span v-if="requestTotal.user.zt == 2 ">{{requestTotal.user.sjh}}</span>
              </el-col>
              <el-col
                :span="10"
                v-if="requestTotal.user.zt == 1 "
                style="text-align: right;padding-right: 20px;"
              >
                <i class="el-icon-arrow-right cc"></i>
              </el-col>
              <el-col :span="10" v-if="requestTotal.user.zt == 0 " style="text-align: right;">
                <span style="font-size: 12px;color: red">用户未审核，请完善信息</span>
              </el-col>
              <el-col :span="10" v-if="requestTotal.user.zt == 2 " style="text-align: right;">
                <span style="font-size: 12px;color: red">用户信息正在审核</span>
              </el-col>
            </el-row>
          </div>
          <div v-else @click="showMyInfo()">
            <el-row>
              <el-col
                :span="13"
                style="color: #409eff; font-size: 18px;text-align: center;font-size:14px"
              >
                <span v-if="requestTotal.user.zt == 1 ">
                  <span v-if="requestTotal.user.sqr">{{requestTotal.user.sqr}}</span>
                  <span v-else>{{requestTotal.user.sjh}}</span>
                </span>
                <span v-if="requestTotal.user.zt == 0 ">{{requestTotal.user.sjh}}</span>
                <span v-if="requestTotal.user.zt == 2 ">{{requestTotal.user.sjh}}</span>
              </el-col>
              <el-col
                :span="10"
                v-if="requestTotal.user.zt == 1 "
                style="text-align: right;padding-right: 20px;"
              >
                <i class="el-icon-arrow-right dd"></i>
              </el-col>
              <el-col :span="10" v-if="requestTotal.user.zt == 0 " style="text-align: right;">
                <span style="font-size: 12px;color: red">用户未审核，请完善信息</span>
              </el-col>
              <el-col :span="10" v-if="requestTotal.user.zt == 2 " style="text-align: right;">
                <span style="font-size: 12px;color: red">用户信息正在审核</span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="content">
        <div v-if="token">
          <ul class="purchaser" v-if="show">
            <li @click="$router.push('need')">
              <el-row :gutter="20">
                <el-col :span="3">
                  <i class="iconfont icon-xuqiu" style="color:#1ab394"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>我的需求</div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
            <li @click="$router.push('orderPaid')">
              <el-row :gutter="20">
                <el-col :span="3">
                  <i class="iconfont icon-icon1" style="color:#1ab394"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        待提交的需求
                        <span
                          class="total"
                          v-if="requestTotal.waitingPaymentTotal != 0 "
                        >{{requestTotal.waitingPaymentTotal}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
            <li @click="$router.push('biddingListPurchaser')">
              <el-row :gutter="20">
                <el-col :span="3">
                  <i class="iconfont icon-jingjia" style="color:#ff4634"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        发布中的需求
                        <span
                          class="total"
                          v-if="requestTotal.waitingConfirmTotal != 0 "
                        >{{requestTotal.waitingConfirmTotal}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
            <li @click="$router.push('orderReached')">
              <el-row :gutter="20">
                <el-col :span="3">
                  <i class="iconfont icon-dacheng" style="color:#44ab34"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        <!-- 已达成未收货 -->
                        已达成的意向
                        <span
                          class="total"
                          v-if="requestTotal.waitingDeliveryTotal != 0 "
                        >{{requestTotal.waitingDeliveryTotal}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
          </ul>

          <ul class="purchaser" v-if="show">
            <li @click="$router.push('myOrder')">
              <el-row :gutter="20">
                <el-col :span="3">
                  <i class="iconfont icon-dinghuo" style="color:#e58162"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>我的订货</div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
            <li @click="$router.push('noSubmit')">
              <el-row :gutter="20">
                <el-col :span="3">
                  <i class="iconfont icon-daijiaohuo" style="color:#09ccbf"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        待提交的订货
                        <span
                          class="total"
                          v-if="requestTotal.waitingProductConfim != 0 "
                        >{{requestTotal.waitingProductConfim}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
            <li @click="$router.push('intentionReached')">
              <el-row :gutter="20">
                <el-col :span="3">
                  <i class="iconfont icon-daiquerendingdan" style="color:#6286dc"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        已达成的意向
                        <span
                          class="total"
                          v-if="requestTotal.waitingProductSubmit != 0 "
                        >{{requestTotal.waitingProductSubmit}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
          </ul>

          <ul class="supplier" v-if="!show">
            <li @click="$router.push('supplyList')">
              <el-row>
                <el-col :span="3">
                  <i class="iconfont icon-gonghuo" style="color:#09ba07"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>我的供货</div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
            <li @click="$router.push('noReach')">
              <el-row>
                <el-col :span="3">
                  <i class="iconfont icon-icon1" style="color:#1ab394"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        待发布的供货
                        <span
                          class="total"
                          v-if="porductTotal.waitingProductSubmit != 0 "
                        >{{porductTotal.waitingProductSubmit}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>

            <li @click="$router.push('noConfirmed')">
              <el-row>
                <el-col :span="3">
                  <i class="iconfont icon-daiquerendingdan" style="color:#6286dc"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        发布中的供货
                        <span
                          class="total"
                          v-if="porductTotal.waitingGroupBuy != 0 "
                        >{{porductTotal.waitingGroupBuy}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
            <li @click="$router.push('reachPurpose')">
              <el-row>
                <el-col :span="3">
                  <i class="iconfont icon-yidacheng" style="color:#ff4634"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        已达成意向
                        <span
                          class="total"
                          v-if="porductTotal.waitingProductConfim != 0 "
                        >{{porductTotal.waitingProductConfim}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
          </ul>

          <ul class="supplier" v-if="!show">
            <li @click="$router.push('biddingListSupplier')">
              <el-row>
                <el-col :span="3">
                  <i class="iconfont icon-zhukongtailiuchengicon-" style="color:#ff7700"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>我的报价</div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
            <li @click="$router.push('quetionPaid')">
              <el-row>
                <el-col :span="3">
                  <i class="iconfont icon-daizhifu" style="color:#ffd000"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        待提交报价
                        <span
                          class="total"
                          v-if="porductTotal.waitingPaymentTotal != 0 "
                        >{{porductTotal.waitingPaymentTotal}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
            <li @click="$router.push('orderDelivered')">
              <el-row>
                <el-col :span="3">
                  <i class="iconfont icon-daijiaohuo" style="color:#1296db"></i>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="20">
                      <div>
                        已达成的意向
                        <span
                          class="total"
                          v-if="porductTotal.waitingDeliveryTotal != 0 "
                        >{{porductTotal.waitingDeliveryTotal}}</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>

        <ul class="footer">
          <li @click="signOut()" v-if="userToken">
            <el-row :gutter="20">
              <el-col :span="3">
                <i class="iconfont icon-tuichudenglu" style="color:#d81e06"></i>
              </el-col>
              <el-col :span="21">
                <el-row>
                  <el-col :span="20">
                    <div>退出登录</div>
                    <div></div>
                  </el-col>
                  <el-col :span="4">
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </li>
        </ul>
      </div>
    </div>
    <div class="token_none" v-else>
      <div class="none_title">你还没有登录，请先去登录呦</div>

      <div class="token_login" @click="login()">
        <el-button type="primary">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Me",
  data() {
    return {
      show: true,
      token: false,
      companyName: "",
      userType: "",
      userToken: "",
      userName: "",
      userZt: "",
      requestTotal: "",
      porductTotal: "",
      showred: true,
      porductTotalShow: false,
      requestTotalShow: false,
      tip: 1
    };
  },
  components: {},
  mounted() {
    this.getData();

    localStorage.setItem("isTip", this.tip);
  },
  methods: {
    showMyInfo() {
      var userid = localStorage.getItem("loginId");
      if (this.porductTotal != "") {
        if (this.porductTotal.user.zt == 0) {
          localStorage.setItem("supplierID", userid);
          this.$router.push("/supplier");
        }
        if (this.porductTotal.user.zt == 1) {
          localStorage.setItem("supplierID", userid);
          this.$router.push("/viewSupplier");
        }
      }
      if (this.requestTotal != "") {
        if (this.requestTotal.user.zt == 0) {
          localStorage.setItem("purchaserID", userid);
          this.$router.push("/purchaser");
        }

        if (this.requestTotal.user.zt == 1) {
          localStorage.setItem("purchaserID", userid);
          this.$router.push("/viewPurchaser");
        }
      }
    },
    getData() {
      this.userType = localStorage.getItem("loginLx");
      this.userToken = localStorage.getItem("loginToken");
      this.userZt = localStorage.getItem("loginZt");
      this.userSjh = localStorage.getItem("loginSjh");

      if (this.userType == 1) {
        // 供应商
        this.show = false;
        this.companyName = localStorage.getItem("loginGsmc");
        this.getPorductTotal();
      }
      if (this.userType == 2) {
        // 采购商
        this.show = true;
        this.userName = localStorage.getItem("loginSqr");
        this.getRequestTotal();
      }
      if (this.userToken) {
        this.token = true;
      }
    },
    login() {
      let currentUrl = encodeURIComponent("http://www.qqr.world/m/#/login");

      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb78fc8385b943fd8&redirect_uri=" +
        currentUrl +
        "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
      // this.$router.push("/login");

      alert(currentUrl);
    },
    signOut() {
      localStorage.clear();

      this.$axios
        .post(this.url + "/api/OAuth/LoginOut")
        .then(res => {
          let currentUrl = encodeURIComponent("http://www.qqr.world/m/#/login");

          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb78fc8385b943fd8&redirect_uri=" +
            currentUrl +
            "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";

          // this.$router.push("/login");
        })
        .catch(err => {});
    },
    getRequestTotal() {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.$axios
        .get(this.url + "/api/RequestPublish/GetRequestTotal")
        .then(res => {
          this.requestTotal = res.data.data;
          this.requestTotalShow = true;
        })
        .catch(() => {});
    },
    getPorductTotal() {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.$axios
        .get(this.url + "/api/ProductPublish/GetPorductTotal")
        .then(res => {
          this.porductTotal = res.data.data;
          this.porductTotalShow = true;
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
.me {
  height: 100%;
}
.top {
  height: 50px;
  line-height: 50px;
  /* padding-left: 10%; */
  background: #ffffff;
}
.content ul {
  margin-top: 3%;
  background: #ffffff;
}
.content .el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.content ul li {
  padding-left: 5%;
}
.content ul li .el-col.el-col-21 {
  border-bottom: 1px solid #f1f1f1;
  padding: 2.8vw 2vw;
}
.content ul li .el-col.el-col-3 {
  padding-top: 2%;
}
.content ul li .el-col.el-col-21:last-child {
  border: none;
}
.content ul li div {
  font-weight: normal;
  font-size: 4.2vw;
}
.content ul li i {
  font-size: 6vw;
  /* font-size: 16px; */
}
.token_none {
  height: 100%;
}
.none_title {
  padding-top: 25%;
  text-align: center;
  padding-bottom: 10%;
}
.token_login {
  padding: 0 10%;
}
.token_login .el-button {
  width: 100%;
}
.total {
  color: red;
  border: red 2px solid;
  padding: 1px;
  font-size: 10px;
  border-radius: 50%;
  font-weight: 800;
}
</style>