<template>
  <div class="viewSupplier">
    <div class="top">
      <van-nav-bar
        title="供应商注册信息"
        left-text="返回"
        left-arrow
        @click-left="$router.go('-1')"
        @click-right="goEdit()"
      >
        <template #right>
          <van-icon name="edit" size="18" />
        </template>
      </van-nav-bar>
    </div>
    <div class="content">
      <el-divider content-position="center">基本信息</el-divider>
      <ul>
        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">公司名称：</span>
            </el-col>
            <el-col :span="16">{{SupplierForm.gsmc}}</el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">证件号：</span>
            </el-col>
            <el-col :span="16">{{SupplierForm.yyzzh}}</el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">注册人：</span>
            </el-col>
            <el-col :span="16">{{SupplierForm.sqr}}</el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">手机号：</span>
            </el-col>
            <el-col :span="16">
              <a :href="'tel:' + SupplierForm.sjh">{{SupplierForm.sjh}}</a>
              <!-- {{SupplierForm.sjh}} -->
            </el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">地址：</span>
            </el-col>
            <el-col :span="16">{{SupplierForm.xxdz}}</el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">简介：</span>
            </el-col>
            <el-col :span="16">{{SupplierForm.bz}}</el-col>
          </el-row>
        </li>

        <li>
          <el-divider content-position="center">我的钱包</el-divider>
          <el-row>
            <el-col :span="6">
              <span class="li_name">充值：</span>
            </el-col>
            <el-col :span="16">
              <a @click="showIncomeamts()">{{SupplierForm.zfzje | formatMoney}}</a>
            </el-col>
          </el-row>

          <el-row v-if="displayincomeamts">
            <el-col :span="6">&nbsp</el-col>
            <el-col :span="16">
              <div class="block">
                <el-timeline :reverse="reverse">
                  <el-timeline-item
                    placement="top"
                    v-for="(incomeamt, index) in incomeamts"
                    :key="index"
                    :timestamp="incomeamt.zfrq|format"
                  >
                    <span v-if="incomeamt.zflb==1">线上充值:</span>
                    <span v-if="incomeamt.zflb==2">线下汇款:</span>
                    {{incomeamt.zje|formatMoney}}
                    <br />
                    单号:{{incomeamt.orderid}}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">服务费：</span>
            </el-col>
            <el-col :span="16">
              <a @click="showAgnecyAmts()">{{SupplierForm.zfzyj | formatMoney}}</a>
            </el-col>
          </el-row>

          <el-row v-if="displayAgnecyAmt">
            <el-col :span="6">&nbsp</el-col>
            <el-col :span="16">
              <div class="block">
                <el-timeline :reverse="reverse">
                  <el-timeline-item
                    placement="top"
                    v-for="(agancyamt, index) in agencyamts"
                    :key="index"
                    :timestamp="agancyamt.zfrq|format"
                  >
                    金额:{{agancyamt.zje|formatMoney}}
                    <br />
                    单号:{{agancyamt.orderid}}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">已退款：</span>
            </el-col>
            <el-col :span="16">
              <a @click="showReAmts()">{{SupplierForm.zfzthje | formatMoney}}</a>
            </el-col>
          </el-row>
          <el-row v-if="displayReAmt">
            <el-col :span="6">&nbsp</el-col>
            <el-col :span="16">
              <div class="block">
                <el-timeline :reverse="reverse">
                  <el-timeline-item
                    placement="top"
                    v-for="(reamt, index) in reamts"
                    :key="index"
                    :timestamp="reamt.zfrq|format"
                  >
                    金额:{{reamt.zje|formatMoney}}
                    <br />
                    单号:{{reamt.orderid}}
                    <span v-if="reamt.shrq==null" style="color:red">退款审核中</span>
                    <span v-if="reamt.shrq!=null" style="color:green">客服审核通过</span>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-col>
          </el-row>
        </li>
        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">余额：</span>
            </el-col>
            <el-col :span="8" style="color:red">
              <a @click="showBalAmts()">{{SupplierForm.zfzye | formatMoney}}</a>
            </el-col>
          </el-row>
          <el-row v-if="displaybalAmt">
            <el-col :span="6">&nbsp</el-col>

            <el-col :span="8" v-if=" SupplierForm.zfzye - SupplierForm.bondamt>0 ">
              <el-button type="text" @click="RefundBill()">申请退款</el-button>
            </el-col>
          </el-row>
        </li>
        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">保证金：</span>
            </el-col>

            <el-col :span="16" style="color:green">
              <a @click="showBondAmts()">{{SupplierForm.bondamt | formatMoney}}</a>
            </el-col>
            <!-- <el-col :span="16" v-if="SupplierForm.zfzye<SupplierForm.bondamt" style="color:red">
              <a @click="showBondAmts()">{{SupplierForm.zfzye | formatMoney}}</a>
            </el-col>-->
          </el-row>
          <el-row v-if="displayBondAmt">
            <el-col :span="6">&nbsp</el-col>
            <el-col :span="16">
              <div class="block">
                <el-timeline :reverse="reverse">
                  <el-timeline-item
                    placement="top"
                    v-for="(agancyamt, index) in bondamt"
                    :key="index"
                    :timestamp="agancyamt.zfrq|format"
                  >
                    金额：{{agancyamt.zje|formatMoney}}
                    <br />
                    单号：{{agancyamt.orderid}}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">可用余额：</span>
            </el-col>

            <el-col :span="16" style="color:red">{{money }}</el-col>
            <!-- <el-col :span="16" v-if="SupplierForm.zfzye<=SupplierForm.bondamt" style="color:red">0</el-col> -->
          </el-row>
        </li>

        <li>
          <el-divider content-position="center">授权书</el-divider>

          <el-row>
            <div
              v-for="(item,index) in SupplierForm.sqzsFiles"
              :key="index"
              style="text-align: center;"
            >
              <el-col :span="8">
                <img
                  :src="pictureserverurl+item.thumbnailpath"
                  :large="pictureserverurl+item.fildpath"
                  :preview="index"
                  preview-text="授权书"
                  class="avatar"
                />
              </el-col>
            </div>
          </el-row>
        </li>

        <li>
          <el-divider content-position="center">营业执照</el-divider>

          <el-row>
            <div
              v-for="(item,index) in SupplierForm.yyzsFiles"
              :key="index"
              style="text-align: center;"
            >
              <el-col :span="8">
                <img
                  :src="pictureserverurl+item.thumbnailpath"
                  :large="pictureserverurl+item.fildpath"
                  :preview="index"
                  preview-text="营业执照"
                  class="avatar"
                />
              </el-col>
            </div>
          </el-row>
        </li>
      </ul>

      <div class="material">我关注的内容：{{SupplierForm.ghlx}}</div>
    </div>
    
    <div class="follow">
      <el-button size="mini" type="warning" @click="showPopup">我想关注</el-button>

      <van-popup v-model="show" position="left" :style="{ height: '100%',width:'80% '}">
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
                <el-checkbox-button
                  v-for="data in smoType"
                  :key="data.kzcpzloid"
                  :label="data.cpmc"
                ></el-checkbox-button>
              </el-checkbox-group>
            </div>
          </div>

          <div class="footer">
            <!-- <el-button size="mini" @click="reset()">重置</el-button> -->
            <el-button type="primary" size="mini" @click="confirm()">确认</el-button>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { format, formatMoney } from "../../DataFormator.js";
import Notify from "vant/lib/notify";
import "vant/lib/notify/style";
import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";

import concern from "../concern";
export default {
  components: { concern },
  filters: {
    format(time) {
      let date = new Date(time);

      return format(date, "yyyy-MM-dd hh:mm:ss");
    },

    formatMoney(data) {
      return formatMoney(data);
    }
  },
  name: "viewSupplier",
  data() {
    return {
      SupplierForm: {},
      supplierID: "",
      displayincomeamts: false,

      reverse: false,
      incomeamts: [],
      displaybalAmt: false,
      displayAgnecyAmt: false,
      agencyamts: [],
      displayReAmt: false,
      reamts: [],
      show: false,
      bondamt: [],
      displayBondAmt: false,
      money: "",
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
      smoId: ""
    };
  },

  mounted() {
    this.supplierID = localStorage.getItem("supplierID");
    this.getId();
  },
  methods: {
    getMoney() {
      this.money = this.SupplierForm.zfzye - this.SupplierForm.bondamt;
      this.money = this.money.toFixed(2);
    },
    showIncomeamts() {
      if (this.displayincomeamts) {
        this.displayincomeamts = false;
      } else {
        this.GetFundBill(1);
        this.displayincomeamts = true;
      }
    },

    showAgnecyAmts() {
      if (this.displayAgnecyAmt) {
        this.displayAgnecyAmt = false;
      } else {
        this.GetFundBill(4);
        this.displayAgnecyAmt = true;
      }
    },

    showReAmts() {
      if (this.displayReAmt) {
        this.displayReAmt = false;
      } else {
        this.GetFundBill(3);
        this.displayReAmt = true;
      }
    },
    showBalAmts() {
      if (this.displaybalAmt) {
        this.displaybalAmt = false;
      } else {
        this.displaybalAmt = true;
      }
    },
    showBondAmts() {
      if (this.displayBondAmt) {
        this.displayBondAmt = false;
      } else {
        this.GetFundBill(5);
        this.displayBondAmt = true;
      }
    },

    RefundBill() {
      Dialog.confirm({
        title: "提示",
        message: "退款到账时间,按银行实际到账时间为准！"
      })
        .then(() => {
          debugger;
          var token = localStorage.getItem("loginToken");
          this.$axios.defaults.headers.common["Authorization"] =
            "Bearer " + token;
          this.$axios.defaults.headers.common["Accept"] = "text/plain";
          this.$axios
            .get(this.url + "/api/Wxh5Pay/RefundBill")
            .then(res => {
              Notify({ type: "success", message: res.data.resultMsg });
              this.refreshData();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    getId() {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.$axios.defaults.headers.common["Accept"] = "text/plain";
      this.$axios
        .post(this.url + "/api/User/GetSupplierEdit?id=" + this.supplierID)
        .then(res => {
          this.SupplierForm = res.data.data;
          this.getMoney();
        })
        .catch(err => {
          console.log(err);
        });

      this.money = this.SupplierForm;
    },
    GetFundBill(optype) {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.$axios.defaults.headers.common["Accept"] = "text/plain";
      this.$axios
        .post(this.url + "/api/Wxh5Pay/GetFundBill", { type: optype })
        .then(res => {
          if (optype == 1) {
            this.incomeamts = res.data.data;
          }
          if (optype == 4) {
            this.agencyamts = res.data.data;
          }
          if (optype == 3) {
            this.reamts = res.data.data;
          }
          if (optype == 5) {
            this.bondamt = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    goEdit() {
      this.$router.push("updateSupplier");
    },
    concern() {
      this.show = true;
    },
    viewConcern() {
      this.show = true;
    },
    showPopup() {
      this.show = true;
      this.$axios
        .get(this.url + "/api/BaseData/GetGoodsType")
        .then(res => {
          this.goodType = res.data.Value.Data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    BigRadio(value, id) {
      this.bigValue = value;
      this.bigId = id;
      this.minRadio = null;

      this.$axios
        .get(this.url + "/api/BaseData/GetGoodsMidType?id=" + this.bigId)
        .then(res => {
          this.minType = res.data.data;
          this.smoType = [];
          this.limit = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    MinRadio(value, id) {
      this.minValue = value;
      this.minId = id;
      this.$axios
        .get(this.url + "/api/BaseData/GetGoodsSmoType?id=" + this.minId)
        .then(res => {
          this.smoType = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    SmoRadio(value) {
      this.smoValue = value;
    },
    reset() {
      this.$axios
        .get(this.url + "/api/BaseData/GetGoodsType")
        .then(res => {
          this.goodType = res.data.Value.Data;
          this.minType = [];
          this.smoType = [];
          this.bigValue = null;
          this.minValue = null;
          this.smoValue = [];
          this.bigRadio = null;
          this.limit = [];
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.viewSupplier ul {
  background: #ffffff;
}
li {
  padding: 5px;
}
img {
  height: 60px;
}
.footer {
  text-align: center;
  margin-top: 30px;
}
.top {
  height: 46px;
  line-height: 46px;
  /* padding-left: 10%; */
  background: #ffffff;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 10;
}
.content {
  margin-top: 65px;
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
.follow {
  position: fixed;
  width: 100%;
  /* height: 70px; */
  bottom: 0;
  /* text-align: center; */
  background: #f1f1f1;
  padding: 10px;
  z-index: 11;
}
.material {
  padding: 20px 10px;
}

button.el-button.el-button--warning.el-button--mini {
  margin-left: 35%;
}
</style>
<style>
.viewSupplier .search_content span.el-radio-button__inner,
.viewSupplier .search_content .el-checkbox-button__inner {
  border-radius: 20px !important;
}
.viewSupplier .search_content .el-radio-group {
  margin-right: 10px;
  margin-top: 10px;
}
.viewSupplier
  .search_content
  label.el-checkbox-button.el-checkbox-button--small {
  margin-top: 10px;
  margin-right: 10px;
}
.viewSupplier .search_content .el-checkbox-group {
  display: inline;
}

.viewSupplier .el-divider__text.is-center {
  background: #409eff;
  color: #ffffff;
  padding: 5px 20px;
}
.viewSupplier .el-col.el-col-6 {
  text-align: right;
  color: #a1a1a1;
}
a {
  text-decoration: underline;
}
</style>