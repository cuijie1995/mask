<template>
  <div class="viewPurchaser">
    <div class="top">
      <van-nav-bar title="采购商信息" left-text="返回" left-arrow @click-left="$router.go('-1')" />
    </div>
    <div class="content">
      <el-divider content-position="center">基本信息</el-divider>
      <ul>
        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">公司名称：</span>
            </el-col>
            <el-col :span="16">{{purchaserForm.gsmc}}</el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">注册人：</span>
            </el-col>
            <el-col :span="16">{{purchaserForm.sqr}}</el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">手机号：</span>
            </el-col>
            <el-col :span="16">
              <!-- {{purchaserForm.sjh}} -->
              <a :href="'tel:' + purchaserForm.sjh">{{purchaserForm.sjh}}</a>
            </el-col>
          </el-row>
        </li>
        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">地址：</span>
            </el-col>
            <el-col :span="16">{{purchaserForm.xxdz}}</el-col>
          </el-row>
        </li>

        <li>
          <el-row>
            <el-col :span="6">
              <span class="li_name">简介：</span>
            </el-col>
            <el-col :span="16">{{purchaserForm.bz}}</el-col>
          </el-row>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "viewPurchaser",
  data() {
    return {
      purchaserForm: {
        bondamt: 0
      },
      displayincomeamts: false,

      reverse: false,
      incomeamts: [],
      displaybalAmt: false,
      displayAgnecyAmt: false,
      agencyamts: [],
      displayReAmt: false,
      reamts: [],
      purchaserID: ""
    };
  },

  mounted() {
    this.getId();
  },
  methods: {
    getId() {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.$axios.defaults.headers.common["accept"] = "text/plain";
      if (localStorage.getItem("showTwo") == 1) {
        this.$axios
          .get(
            this.url +
              "/api/Pruchase/GetPurchaserByReachOrder?Id=" +
              localStorage.getItem("showPurchaserId")
          )
          .then(res => {
            this.purchaserForm = res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      }
      if (localStorage.getItem("showTwo") == 2) {
        this.$axios
          .get(
            this.url +
              "/api/Quotation/GetPurchaserByQuotation?Id=" +
              localStorage.getItem("showPurchaserId")
          )
          .then(res => {
            this.purchaserForm = res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>
<style scoped>
.viewPurchaser ul {
  background: #ffffff;
  font-size: 14px;
}
li {
  padding: 5px;
}
img {
  height: 60px;
}
.item_img {
  display: inline;
}
a {
  text-decoration: underline;
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
  margin-top: 85px;
}
</style>
<style>
.viewPurchaser .el-divider__text.is-center {
  background: #409eff;
  color: #ffffff;
  padding: 5px 20px;
}
.viewPurchaser .el-col.el-col-6 {
  text-align: right;
  color: #a1a1a1;
}
</style>