<template>
  <div class="viewRelease">
    <div class="top">
      <van-nav-bar title="采购商需求" left-text="返回" left-arrow @click-left="$router.go('-1')" />
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
            <ul v-if="releaseForm.maximgs || releaseForm.imgs">
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
                  <el-col :span="16" style="color:red">{{releaseForm.sl}} {{releaseForm.company}}</el-col>
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
              <li>
                <el-row>
                  <el-col :span="6">
                    <span class="li_name">备注：</span>
                  </el-col>
                  <el-col :span="16">{{releaseForm.ddbz}}</el-col>
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
    }
  },
  viewType: "",
  name: "viewRelease",
  data() {
    return {
      releaseForm: {},
      viewType: ""
    };
  },
  mounted() {
    this.viewType = localStorage.getItem("viewType");
    this.getViewRelese();
  },
  methods: {
    getViewRelese() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      this.$axios
        .get(
          this.url +
            "/api/Quotation/GetForEdit?id=" +
            localStorage.getItem("supOrdId")
        )
        .then(res => {
          this.releaseForm = res.data.data.order;
        })
        .catch(err => {
          console.log(err);
        });
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
  margin-top: 46px;
}
.container {
  height: 100%;
}
.content {
  padding-top: 30px;
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
.good_top {
  background: none;
  margin: 0;
}
/* .goods-area {
  height: 30rem;
  overflow-x: hidden; /* 解决左右可以滑动的问题 */
/* overflow-y: auto; 解决左右可以滑动的问题 */
/* overflow-scrolling: touch; 兼容性 ios5+、android4+ */
/* } */
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