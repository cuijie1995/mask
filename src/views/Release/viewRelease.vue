<template>
  <div class="viewRelease">
    <div class="top">
      <van-nav-bar title="我的需求" left-text="返回" left-arrow @click-left="$router.go('-1')" />
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
                <el-col :span="16">{{releaseForm.spmc}}</el-col>
              </el-row>
            </li>
            <li>
              <el-row>
                <el-col :span="6">
                  <span class="li_name">商品规格：</span>
                </el-col>
                <el-col :span="16">{{releaseForm.spgg}}</el-col>
              </el-row>
            </li>
            <li v-if="releaseForm.limit">
              <el-row>
                <el-col :span="6">
                  <span class="li_name">要求资质：</span>
                </el-col>
                <el-col :span="16">{{releaseForm.limit}}</el-col>
              </el-row>
            </li>
            <li v-if="releaseForm.docno">
              <el-row>
                <el-col :span="6">
                  <span class="li_name">订单单号：</span>
                </el-col>
                <el-col :span="16">{{releaseForm.docno}}</el-col>
              </el-row>
            </li>
          </ul>

          <div class="goods-area">
            <ul>
              <li class="item_img" v-if="releaseForm.maximgs">
                <div v-if="releaseForm.maximgs.length > 0">
                  <el-divider content-position="center">产品图片</el-divider>
                  <el-row>
                    <div v-for="(item,index) in releaseForm.maximgs" :key="index">
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

              <li class="item_img" v-if="releaseForm.imgs">
                <div v-if="releaseForm.imgs.length > 0">
                  <el-divider content-position="center">产品详情图片</el-divider>
                  <el-row>
                    <div v-for="(item,index) in releaseForm.imgs" :key="index">
                      <el-col :span="8">
                        <div class="item_img">
                          <img
                            :src="pictureserverurl+item.thumbnailpath"
                            :large="pictureserverurl+item.fildpath"
                            preview="2"
                            preview-text="产品详情图片"
                            class="avatar"
                          />
                        </div>
                      </el-col>
                    </div>
                  </el-row>
                </div>
              </li>
            </ul>
            <el-divider content-position="center">需求信息</el-divider>
            <ul>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">需求数量：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{releaseForm.sl|formatNumber}} {{releaseForm.company}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">单 价：</span>
                  </el-col>
                  <el-col
                    :span="16"
                    style="color:red"
                  >{{releaseForm.cgj | formatMoney}}~{{releaseForm.maxdj | formatMoney}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">总 计：</span>
                  </el-col>
                  <el-col :span="16" style="color:red">{{releaseForm.zje | formatMoney}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">税 率：</span>
                  </el-col>
                  <el-col :span="16">{{releaseForm.suilv|formatsuilv}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">交货：</span>
                  </el-col>
                  <el-col
                    :span="16"
                  >{{releaseForm.dhrq|formatDate}}~{{releaseForm.maxdhrq|formatDate}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">付款方式：</span>
                  </el-col>
                  <el-col :span="16">{{releaseForm.fkfs}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">物流费用：</span>
                  </el-col>
                  <el-col :span="16">{{releaseForm.wuliu}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">出货方式：</span>
                  </el-col>
                  <el-col :span="16">{{releaseForm.chfs}}</el-col>
                </el-row>
              </li>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">保证金：</span>
                  </el-col>
                  <el-col :span="16" style="color:red">￥{{releaseForm.bondamt | formatMoney}}</el-col>
                </el-row>
              </li>
            </ul>
            <ul v-if="releaseForm.ddbz!=''">
              <el-divider content-position="right"></el-divider>
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">备注：</span>
                  </el-col>
                  <el-col :span="16">{{releaseForm.ddbz}}</el-col>
                </el-row>
              </li>
            </ul>
            <el-divider content-position="center">成交记录</el-divider>

            <div>
              <div ref="item" v-for="(qdata,index) in QuotDatas" :key="index">
                <div>
                  <ul>
                    <li
                      style="font-size:17px;color:#1989fa;text-align: center;"
                      @click="showInfo(qdata.kzjjlistoid)"
                    >
                      <a>{{qdata.quotationUser}}</a>
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
                        <el-col :span="10">{{qdata.jbdj | formatMoney}}</el-col>
                      </el-row>
                    </li>
                    <li>
                      <el-row>
                        <el-col :span="8">报价数量:</el-col>
                        <el-col :span="10">{{qdata.jjsl}} {{qdata.company}}</el-col>
                      </el-row>
                    </li>
                    <li>
                      <el-row>
                        <el-col :span="8">
                          保证金：
                        </el-col>
                        <el-col :span="10" style="color:red">￥{{qdata.bondamt | formatMoney}}</el-col>
                      </el-row>
                    </li>
                    <li>
                      <div v-for="(item2,index1) in qdata.deliveryTimeDtos" :key="index1">
                        <el-row>
                          <el-col :span="8">{{item2.dtime|formatDate}}</el-col>
                          <el-col :span="8">{{item2.qsmc}}</el-col>
                          <el-col :span="8">交货{{item2.qssl}}</el-col>
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
  name: "viewRelease",
  data() {
    return {
      releaseForm: {},
      viewType: "",
      QuotDatas: []
    };
  },
  mounted() {
    this.viewType = localStorage.getItem("viewType");
    this.getViewRelese();
  },
  methods: {
    getViewRelese() {
      var ViewReleaseOID = localStorage.getItem("viewRelaseID");
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      this.$axios
        .get(
          this.url +
            "/api/RequestPublish/GetRequestPublish?oid=" +
            ViewReleaseOID
        )
        .then(res => {
          this.releaseForm = res.data.data;
          this.getData();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getData() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      this.$axios
        .get(
          this.url +
            "/api/Quotation/GetByOrder?orderid=" +
            this.releaseForm.kzxqorderoid
        )
        .then(res => {
          this.QuotDatas = res.data.data;
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
          //补充完成后 移除单据显示
          self.QuotDatas.splice(index, 1);
        })
        .catch(err => {
          console.log(err);
        });
    },
    RejectQuo(oid, index) {
      var ViewReleaseOID = localStorage.getItem("viewRelaseID");
      var token = localStorage.getItem("loginToken");
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      self.$axios
        .get(this.url + "/api/Quotation/RejectQuotation?id=" + oid)
        .then(res => {
          self.QuotDatas.splice(index, 1);
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

<style  scoped>
.viewRelease {
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
.good_top {
  background: none;
  margin: 0;
}
/* .goods-area {
  height: 30rem;
  overflow-x: hidden;
  /* 解决左右可以滑动的问题 */
/* overflow-y: auto; */
/* 解决左右可以滑动的问题 */
/* overflow-scrolling: touch; */
/*兼容性 ios5+、android4+ */
/* } */
a {
  text-decoration: underline;
}
</style>
<style>
.viewRelease .item_img .el-divider__text.is-center {
  background: #409eff;
  font-size: 10px;
  padding: 4px 10px;
}
.viewRelease .el-divider__text.is-center {
  background: #67c23a;
  color: #ffffff;
  padding: 6px 20px;
}
</style>