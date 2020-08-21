<template>
  <div class="quoted_price">
    <div class="top">
      <van-nav-bar
        title="抢购/团购明细"
        left-text="返回"
        left-arrow
        @click-left="$router.push('/noConfirmed')"
      ></van-nav-bar>
    </div>
    <div class="wrapper">
      <div class="container" ref="wrapper">
        <div class="content">
          <div class="content_item">
            <!-- @click="baojia()" -->
            <div>
              <van-row type="flex">
                <van-col span="8">
                  <div class="item_img">
                    <img v-if="demandDatas.productimgs==null " src alt />
                    <img
                      v-if="demandDatas.productimgs!=null"
                      :src="pictureserverurl+demandDatas.productimgs[0].thumbnailpath"
                      :large="pictureserverurl+demandDatas.productimgs[0].fildpath"
                      :preview="1"
                      preview-text="产品图片"
                      class="avatar"
                      alt
                    />
                  </div>
                </van-col>

                <van-col span="16">
                  <ul class="name_layer">
                    <li class="item_name">
                      <a>{{demandDatas.productname}}</a>
                    </li>
                    <li class="item_layer">{{demandDatas.productspec}}</li>
                  </ul>
                  <div
                    class="price_section"
                    v-if="demandDatas.maxprice==null || demandDatas.maxprice==0"
                  >单价：{{demandDatas.minprice | formatMoney}}</div>
                  <div
                    class="price_section"
                    v-else
                  >单价区间：{{demandDatas.minprice | formatMoney}}-{{demandDatas.maxprice | formatMoney}}</div>
                  <div class="pay_type">付款方式：{{demandDatas.paytype}}</div>
                  <div v-if="demandDatas.doctype == 1">
                    <!-- <div class="pay_type">最小起订量:{{demandDatas.startqty}}</div> -->
                  </div>
                  <div v-if="demandDatas.doctype == 2">
                    <!-- <div class="pay_type">每单最小数量：{{demandDatas.startqty}}</div> -->
                    <div class="pay_type">成团数量：{{demandDatas.groupbuyqty}}</div>
                  </div>
                </van-col>
              </van-row>
            </div>
          </div>

          <div class="goods-area" ref="box">
            <div class="goods-list" ref="item" v-for="(qdata,index) in QuotDatas" :key="index">
              <div>
                <ul>
                  <li>
                    <el-row>
                      <el-col :span="20" style="font-size:17px;color:#1989fa;text-align: center;">
                        <a @click="showInfo(qdata.kzjjlistoid)">{{qdata.quotationUser}}</a>
                      </el-col>
                      <el-col :span="4" style="color:#67C23A">
                        <span v-if="qdata.jjzt == 0">待提交</span>
                        <span v-if="qdata.jjzt == 1">已提交</span>
                        <span v-if="qdata.jjzt == 2">达成意向</span>
                        <span v-if="qdata.jjzt == 3">已完成</span>
                        <span v-if="qdata.jjzt == 4">取消</span>
                        <span v-if="qdata.jjzt == 5">拒绝</span>
                      </el-col>
                    </el-row>
                  </li>
                  <li>
                    <el-row>
                      <el-col :span="8">报价人:</el-col>
                      <el-col :span="10"></el-col>
                    </el-row>
                  </li>
                  <li>
                    <el-row>
                      <el-col :span="8">交货次数:</el-col>
                      <el-col :span="10">{{qdata.jbqs}}</el-col>
                    </el-row>
                  </li>
                  <li>
                    <el-row>
                      <el-col :span="8">单价：</el-col>
                      <el-col :span="10">{{qdata.jbdj|formatMoney}}</el-col>
                    </el-row>
                  </li>
                  <li>
                    <el-row>
                      <el-col :span="8">报价数量:</el-col>
                      <el-col :span="10">{{qdata.jjsl|formatNumber}}</el-col>
                    </el-row>
                  </li>

                  <li>
                    <div v-for="(item2,index1) in qdata.deliveryTimeDtos" :key="index1">
                      <el-row>
                        <el-col :span="8">{{item2.dtime|formatDate}}</el-col>
                        <el-col :span="8">{{item2.qsmc}}</el-col>
                        <el-col :span="8">交货：{{item2.qssl}}</el-col>
                      </el-row>
                    </div>
                  </li>
                  <li>{{qdata.bz}}</li>

                  <li>
                    <el-row>
                      <div v-for="(item1,index1) in qdata.zzzsFiles" :key="index1">
                        <el-col :span="8">
                          <div class="item_img">
                            <img
                              :src="pictureserverurl + item1.thumbnailpath"
                              :large="pictureserverurl + item1.fildpath"
                              preview="2"
                              preview-text="资质信息"
                              class="avatar"
                            />
                          </div>
                        </el-col>
                      </div>
                    </el-row>
                  </li>

                  <li class="button">
                    <el-button
                      v-if="viewType=='UnConfirm'"
                      @click="AcceptQuo(qdata.kzjjlistoid,index)"
                      size="mini"
                      type="success"
                      round
                    >接受</el-button>
                    <el-button
                      v-if="viewType=='UnConfirm'"
                      @click="RejectQuo(qdata.kzjjlistoid,index)"
                      size="mini"
                      type="warning"
                      round
                    >拒绝</el-button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="拒绝原因" :visible.sync="dialogFormVisible">
      <el-checkbox-group v-model="limit" @change="chooseItem">
        <el-checkbox
          v-for="data in refuseData"
          :key="data.kzdatabaseoid"
          :label="data.kzdatabaseoid"
        >{{data.dataname}}</el-checkbox>
        <br />
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitRefuse" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let self;
import BScroll from "better-scroll";
import { formatDate,formatMoney } from "../DataFormator.js";
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
  usertype: "",
  name: "QuotedPrice",
  data: function() {
    return {
      dialogFormVisible: false,
      refuseData: [],
      limit: [],
      arrId: [],
      OID: "",
      dataIndex: "",
      demandDatas: [],
      QuotDatas: [],
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
      noOffer: 5,
      viewType: ""
    };
  },
  mounted() {
    self = this;

    self.usertype = localStorage.getItem("loginLx");
    self.viewType = localStorage.getItem("viewType");
    self.getDemandDatas();
    self.getRefuse();
  },
  methods: {
    getRefuse() {
      self.$axios
        .get(
          self.url + "/api/BaseData/GetBaseDataByTypeCode?typecode=Sys_Reason"
        )
        .then(res => {
          self.refuseData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    AcceptQuo(oid, index) {
      var ViewReleaseOID = localStorage.getItem("viewRelaseID");
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      self.$axios
        .get(this.url + "/api/Quotation/ReachQuotation?id=" + oid)
        .then(res => {
          if (res.data.statusCode == 9) {
            Notify({ type: "warning", message: res.data.resultMsg });
          } else {
            self.QuotDatas.splice(index, 1);
          }

          // self.
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    RejectQuo(oid, index) {
      self.dialogFormVisible = true;
      self.OID = oid;
      self.dataIndex = index;
    },
    chooseItem(value) {
      self.arrId = value;
    },
    submitRefuse() {
      var ViewReleaseOID = localStorage.getItem("viewRelaseID");
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .post(this.url + "/api/Quotation/RejectQuotation", {
          id: self.OID,
          reasonId: self.arrId
        })
        .then(res => {
          //补充完成后 移除单据显示
          if (res.data.statusCode == 9) {
            Notify({ type: "warning", message: res.data.resultMsg });
          } else {
            self.QuotDatas.splice(dataIndex, 1);
            self.dialogFormVisible = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    getDemandDatas() {
      var recordReachOID = localStorage.getItem("recordReachOID");
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      this.$axios
        .get(this.url + "/api/ProductPublish/GetOrder?id=" + recordReachOID)
        .then(res => {
          this.demandDatas = res.data.data;
          this.getRecordData();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRecordData() {
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      this.$axios
        .post(
          this.url + "/api/Pruchase/GetByOrderSupplierPage",
          {
            kzproductFk: this.demandDatas.kzproductoid
          }
        )
        .then(res => {
        })
        .catch(err => {
          console.log(err);
        });
    },
    showInfo(id) {
      localStorage.setItem("supplierID", id);
      this.$router.push("showSupplier");
    }
  }
};
</script>
<style scoped>
.top {
  height: 46px;
}
.wrapper {
  width: 100%;
  height: calc(100% - 46px);
  padding-bottom: 0px;
}

.container {
  height: 100%;
  overflow: hidden;
}

.content {
  padding: 4% 2% 0% 2%;
  min-height: 100%;
  position: relative;
  overflow-y: scroll;
}

.content_item {
  padding: 5px 0;
  border-bottom: 1px solid #dbd8d8;
  height: 120px;
}

.item_img {
  width: 100px;
  height: 100px;
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
.el-icon-finished {
  margin-top: 28px;
}

.button {
  height: 100%;
  line-height: 100%;
  margin-top: 50px;
}

.el-select {
  width: 70px;
  text-align: center;
}
</style>

<style scoped>
.quoted_price {
  height: 100%;
}

.goods-area {
  height: 65vh;
  overflow-x: hidden; /* 解决左右可以滑动的问题 */
  overflow-y: auto; /* 解决左右可以滑动的问题 */
  overflow-scrolling: touch; /*兼容性 ios5+、android4+ */
}

.goods-list li {
  padding: 5px;
  font-size: 12px;
}
.goods-area li {
  padding-left: 20px;
}
.button {
  text-align: center;
  padding: 10px;
  margin: 10px;
  border-bottom: 1px solid #e2c6c6;
}
.goods-list {
  background: #ffffff;
}
.goods-list li .el-col.el-col-8 {
  font-size: 12px;
  color: #888888;
  /* text-align: right; */
}
</style>
<style>
.quoted_price .el-dialog {
  width: 90% !important;
}
.quoted_price .el-checkbox {
  margin-right: 0 !important;
  width: 100%;
}
.quoted_price .el-dialog__body {
  padding: 10px 20px;
}
</style>