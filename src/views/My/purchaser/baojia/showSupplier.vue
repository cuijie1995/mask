<template>
  <div class="showSupplier">
    <div class="top">
      <van-nav-bar title="供应商信息" left-text="返回" left-arrow @click-left="$router.go('-1')" />
    </div>
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
          <el-col :span="10">{{SupplierForm.sqr}}</el-col>
          <el-col :span="6" v-if="show">
            <div v-if="viewType=='UnConfirm'" class="footer">
              <!-- <div class="footer"> -->
              <el-button type="success" size="mini" @click="AcceptQuo">接受报价</el-button>
            </div>
          </el-col>
        </el-row>
      </li>

      <li>
        <el-row>
          <el-col :span="6">
            <span class="li_name">手机号：</span>
          </el-col>
          <el-col :span="16">
            <a :href="'tel:' + SupplierForm.sjh">{{SupplierForm.sjh}}</a>
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
        <el-divider content-position="center">授权书</el-divider>
        <el-row>
          <div
            v-for="(item,index) in SupplierForm.sqzsFiles"
            :key="index"
            style="text-align: center;"
          >
            <el-col :span="8">
              <div class="item_img">
                <img
                  :src="pictureserverurl+item.thumbnailpath"
                  :large="pictureserverurl+item.fildpath"
                  :preview="index"
                  preview-text="授权书"
                  class="avatar"
                  alt
                />
              </div>
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
              <div class="item_img">
                <img
                  :src="pictureserverurl+item.thumbnailpath"
                  :large="pictureserverurl+item.fildpath"
                  :preview="index"
                  preview-text="营业执照"
                  class="avatar"
                />
              </div>
            </el-col>
          </div>
        </el-row>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "viewPurchaser",
  data() {
    return {
      SupplierForm: {},
      supplierID: "",
      viewType: "",
      show: true
    };
  },

  mounted() {
    this.supplierID = localStorage.getItem("supplierID");
    this.viewType = localStorage.getItem("viewType");
    this.getId();
  },
  methods: {
    getId() {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.$axios.defaults.headers.common["Accept"] = "text/plain";
      this.$axios
        .get(
          this.url +
            "/api/Quotation/GetSupplierByQuotation?Id=" +
            this.supplierID
        )
        .then(res => {
          this.SupplierForm = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    AcceptQuo() {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      this.$axios
        .get(this.url + "/api/Quotation/ReachQuotation?id=" + this.supplierID)
        .then(res => {
          if (res.data.statusCode == 9) {
            Notify({ type: "warning", message: res.data.resultMsg });
          } else {
            this.show = false;
            this.getId();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

  }
};
</script>
<style scoped>
.showSupplier ul {
  background: #ffffff;
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
.footer {
  /* margin-top: 20px; */
  text-align: center;
}
</style>
<style>
.showSupplier .el-divider__text.is-center {
  background: #409eff;
  color: #ffffff;
  padding: 5px 20px;
}
.showSupplier .el-col.el-col-6 {
  text-align: right;
  color: #a1a1a1;
}
</style>