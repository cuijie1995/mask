<template>
  <div class="add_bidding">
    <div class="top">
      <van-nav-bar title="报价" left-text="返回" left-arrow @click-left="$router.go('-1')" />
    </div>
    <div class="content">
      <el-form ref="biddingForm" :model="biddingForm" :rules="rules" label-width="95px" size="mini">
        <el-form-item label="商品图片：">
          <div class="item_img">
            <img
              :src="pictureserverurl+chpImgs"
              :large="pictureserverurl+chpImgs"
              preview="1"
              preview-text="产品图片"
              class="avatar"
            />
          </div>
        </el-form-item>

        <el-form-item label="公司名称：" prop="gsName">
          <el-input v-model="gsName" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品名称：" prop="chpSpmc">
          <el-input v-model="chpSpmc" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品规格：" prop="chpSpgg">
          <el-input v-model="chpSpgg" disabled></el-input>
        </el-form-item>

        <el-form-item label="单价：" prop="jbdj">
          <el-input v-model="biddingForm.jbdj" :placeholder="chcgj"></el-input>
        </el-form-item>
        <el-form-item label="期数：" prop="jbqs">
          <el-input-number
            v-model="biddingForm.jbqs"
            @change="changeNum()"
            :min="1"
            :max="5"
            label="交货期数"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          class="qishu"
          prop="deliveryTimeDtos"
          v-if="biddingForm.deliveryTimeDtos.length > 0"
        >
          <div v-model="biddingForm.deliveryTimeDtos">
            <div v-for="(item,index) in biddingForm.deliveryTimeDtos" :key="index">
              <el-row>
                <el-col :span="12">
                  <el-date-picker
                    v-model="item.dtime"
                    :editable="false"
                    style="width: 100%;"
                    type="date"
                    placeholder="交货日期"
                    @change="onDateChange(item)"
                  ></el-date-picker>
                </el-col>
                <el-col :span="11">
                  <el-input v-model="item.qssl" @change="onqsslChange(item)" placeholder="交货数量"></el-input>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="保证金：" prop="bondamt">
          <el-input disabled v-model="bondAmt" :placeholder="'需方求购数量'+chsl"></el-input>
        </el-form-item>
        <el-form-item label="抢单数量：" prop="jjsl">
          <el-input disabled v-model="biddingForm.jjsl" :placeholder="'需方求购数量'+chsl"></el-input>
        </el-form-item>

        <el-form-item label="上传资质证书：" prop="sqzs">
          <el-upload
            class="upload-demo"
            ref="uploadpicture"
            :action="uploadurls"
            :multiple="true"
            :auto-upload="true"
            :before-upload="doUploads"
            :on-success="onUploadSuccess"
            :before-remove="OnBeforeRemoveUpLoad"
            :show-file-list="true"
            :file-list="fileList"
            accept="image/*"
            name="files"
            list-type="picture"
          >
            <div v-for="(item,index) in imageUrl" :key="index" style="float: left">
              <span v-if="imageUrl" style="color:red">x</span>
              <img v-if="imageUrl" :src="item" class="avatar" />
            </div>
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注：" prop="bz">
          <el-input v-model="biddingForm.bz" placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item size="large" class="next">
          <!-- <el-button :disabled="submintbutton" type="primary" @click="onSubmit">提交申请</el-button> -->
          <el-button type="success" @click="keep">保存申请</el-button>
          <el-button type="primary" @click="onSubmit">提交申请</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";
let self;

export default {
  name: "BiddingList",
  computed: {
    bondAmt() {
      var bondAmt =
        (this.biddingForm.jjsl / this.chsl) * localStorage.getItem("bondamt");
      return bondAmt;
    }
  },
  data() {
    return {
      biddingForm: {
        jbdj: "",
        jbqs: 1,
        jbrq: "",
        kzxqorderFk: "",
        jjsl: "",
        bz: "",
        zzzs: "",
        zzzsFiles: [],
        deliveryTimeDtos: [],
        bondamt: ""
      },
      rules: {
        jbdj: [{ required: true, message: "请输入单价", trigger: "blur" }],
        jbqs: [{ required: true, message: "请录入期数", trigger: "change" }],
        jbrq: [{ required: true, message: "请选择供货类型", trigger: "blur" }],
        kzxqorderFk: [
          { required: true, message: "请输入申请人", trigger: "blur" }
        ],
        jjsl: [{ required: true, message: "录入抢单数量", trigger: "blur" }],
        dtime: [{ required: true, message: "交货日期", trigger: "blur" }]
      },
      fileList: [],
      imageUrl: [],
      sqzsFiles: [],
      curguid: "",
      zzzs: "",
      kzxqorderFk: "",
      gsName: "",
      chpSpmc: "",
      chpSpgg: "",
      chpImgs: "",
      chID: "",
      chcgj: "",
      chmaxdj: "",
      chsl: "",
      submintbutton: false,
      uploadurls: "",
      orderId: ""
    };
  },
  mounted() {
    self = this;
    self.getid();

    self.changeNum();
    self.biddingForm.jjsl = self.chsl;
  },
  methods: {
    onqsslChange(item) {
      self.CalcQty();
    },

    CalcQty() {
      var qty = 0;
      self.biddingForm.deliveryTimeDtos.forEach(obj => {
        qty = qty + parseInt(obj.qssl);
      });
      self.biddingForm.jjsl = qty;
      self.vaildQty();
    },

    vaildQty() {
      if (self.biddingForm.jjsl > self.chsl) {
        self.$message({
          message: "抢单数量不能大于需求数量",
          type: "error"
        });
        return false;
      }
    },

    vaildJHData() {
      var res = true;
      self.biddingForm.deliveryTimeDtos.forEach(obj => {
        if (parseInt(obj.qssl) <= 0) {
          self.$message({
            message: "交货数量不能为0!",
            type: "error"
          });
          res = false;
        }
        if (obj.dtime == null) {
          self.$message({
            message: "交货期必须填写!",
            type: "error"
          });
          res = false;
        }
      });
      return res;
    },
    onDateChange(item) {
      if (item.dtime > Date.parse(self.chmaxdhrq)) {
        self.$message({
          message: "交货日期不能晚于需求最后交货期",
          type: "error"
        });
        item.dtime = Date.parse(self.chmaxdhrq);
      }
    },
    changeNum() {
      self.biddingForm.deliveryTimeDtos = [];
      if (parseInt(self.biddingForm.jbqs) > 0) {
        self.biddingForm.deliveryTimeDtos.length = parseInt(
          self.biddingForm.jbqs
        );
        for (let index = 1; index <= parseInt(self.biddingForm.jbqs); index++) {
          const element = {
            qsmc: "第" + index + "次",
            dtime: self.chdhrq,
            qssl: self.chsl
          };

          self.biddingForm.deliveryTimeDtos.push(element);
        }
        self.biddingForm.deliveryTimeDtos = self.biddingForm.deliveryTimeDtos.slice(
          parseInt(self.biddingForm.jbqs),
          self.biddingForm.deliveryTimeDtos.length
        );
      }
    },
    getid() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .get(self.url + "/api/ProductPublish/GetPorductTotal")
        .then(res => {
          self.gsName = res.data.data.user.gsmc;
        })
        .catch(err => {
          console.log(err);
        });

      self.chpSpgg = localStorage.getItem("chpSpgg");
      self.chpSpmc = localStorage.getItem("chpSpmc");
      // self.gsName = localStorage.getItem("loginGsmc");
      self.chpImgs = localStorage.getItem("chpImgs");
      self.chID = localStorage.getItem("chID");
      self.chdhrq = localStorage.getItem("dhrq");

      self.chcgj = "建议抢单价格:" + localStorage.getItem("cgj");
      if (localStorage.getItem("maxdj") > 0) {
        self.chcgj = self.chcgj + "~" + localStorage.getItem("maxdj");
      }
      self.chsl = localStorage.getItem("sl");

      var curguid = "";
      var zzzs = "";
      var kzxqorderFk = "";
      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curguid += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) curguid += "-";
      }

      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        zzzs += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) zzzs += "-";
      }

      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        kzxqorderFk += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) kzxqorderFk += "-";
      }

      self.curguid = curguid;
      self.zzzs = zzzs;
      self.kzxqorderFk = kzxqorderFk;

      self.uploadurls =
        self.uploadurl +
        "/api/FildLoad/UpLoadFildAndZoom?userId=" +
        localStorage.getItem("loginId") +
        "&relationKey=" +
        self.zzzs;
    },
    onUploadSuccess(response, file, fileList) {
      self.sqzsFiles.push(response.filds[0]);
    },
    doUploads(file, files) {
      self.fileuploaded = false;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpeg";
      const extension2 = testmsg === "png";
      const extension3 = testmsg === "jpg";
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: "上传文件只能是jpeg、png、jpg格式!",
          type: "warning"
        });
      }

      return extension || extension2 || extension3;
    },
    OnBeforeRemoveUpLoad(file, fileList) {
      var ress = false;

      self.sqzsFiles.forEach(item => {
        if (item.fildName == file.name) {
          ress = true;
        }
        if (ress) {
          self.sqzsFiles = self.sqzsFiles.filter(function(element, index) {
            return element["fildName"] != file.name;
          });
        }
      });

      return ress;
    },
    onSubmit() {
      if (
        this.$refs.uploadpicture.$data.uploadFiles.length !=
        this.sqzsFiles.length
      ) {
        this.$message({
          message: "请等待图片上传完成",
          type: "warning"
        });
      } else {
        self.$refs["biddingForm"].validate(valid => {
          if (valid) {
            Dialog.confirm({
              title: "提示",
              message: "只有支付完保证金后，才会发送给采购商"
            })
              .then(() => {
                self.submintbutton = true;
                self.biddingForm.zzzs = self.zzzs;
                self.biddingForm.kzxqorderFk = self.chID;
                self.biddingForm.zzzsFiles = self.sqzsFiles;
                self.biddingForm.bondamt = self.bondAmt;

                var token = localStorage.getItem("loginToken");
                axios.defaults.headers.common["Authorization"] =
                  "Bearer " + token;

                self.$axios
                  .post(
                    self.url + "/api/Quotation/SubmitQuotation",
                    self.biddingForm
                  )
                  .then(res => {
                    if (res.data.statusCode == 1) {
                      if (res.data.statusCode == 1) {
                        var ua = window.navigator.userAgent.toLowerCase();

                        if (ua.match(/MicroMessenger/i) == "micromessenger") {
                          const pay_params = res.data.data;

                          if (typeof WeixinJSBridge == "undefined") {
                            if (document.addEventListener) {
                              document.addEventListener(
                                "WeixinJSBridgeReady",
                                onBridgeReady,
                                false
                              );
                            } else if (document.attachEvent) {
                              document.attachEvent(
                                "WeixinJSBridgeReady",
                                onBridgeReady
                              );
                              document.attachEvent(
                                "onWeixinJSBridgeReady",
                                onBridgeReady
                              );
                            }
                          } else {
                            this.onBridgeReady(pay_params);
                          }

                          // this.$router.push("release");
                        } else {
                          window.location.href = res.data.data.mWebUrl;
                          this.$router.push("release");
                        }

                        self.orderId = res.data.data.billId;
                      }
                    }
                    // this.refreshData();
                    if (res.data.statusCode == 9) {
                      self.$message({
                        message: res.data.resultMsg,
                        type: "warning"
                      });
                    }
                    if (res.data.statusCode == 0) {
                      self.$router.push("/release");
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(() => {});
          } else {
            self.submintbutton = false;
          }
        });
      }
    },
    keep() {
      if (
        this.$refs.uploadpicture.$data.uploadFiles.length !=
        this.sqzsFiles.length
      ) {
        this.$message({
          message: "请等待图片上传完成",
          type: "warning"
        });
      } else {
        self.$refs["biddingForm"].validate(valid => {
          if (valid) {
            Dialog.confirm({
              title: "提示",
              message: "保存的信息请到待提交报价查看"
            })
              .then(() => {
                self.submintbutton = true;
                self.biddingForm.zzzs = self.zzzs;
                self.biddingForm.kzxqorderFk = self.chID;
                self.biddingForm.zzzsFiles = self.sqzsFiles;

                var token = localStorage.getItem("loginToken");
                axios.defaults.headers.common["Authorization"] =
                  "Bearer " + token;

                self.$axios
                  .post(
                    self.url + "/api/Quotation/InsertQuotation",
                    self.biddingForm
                  )
                  .then(res => {
                    if (res.data.statusCode == "9") {
                      self.$message({
                        message: res.data.resultMsg,
                        type: "error"
                      });
                    }
                    if (res.data.statusCode == "0") {
                      self.$router.push("quetionPaid");
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(() => {});
          } else {
            self.submintbutton = false;
          }
        });
      }
    },
    onBridgeReady(params) {
      // Notify({ type: "success", message: params.toString() });
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: params.appId, //公众号名称，由商户传入
          timeStamp: params.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: params.nonceStr, //随机串
          package: params.package,
          signType: params.signType, //微信签名方式：
          paySign: params.paySign //微信签名
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // Notify({ type: "success", message: "支付成功！" });
            self.$axios
              .post(
                self.url +
                  "/api/Quotation/BacthSubmitQuotation?input=" +
                  self.orderId
              )
              .then(res => {
                if (res.data.statusCode == 0) {
                  // self.refreshData();
                  self.$router.push("/release");
                }
              })
              .catch(() => {
                self.$router.push("quetionPaid");
              });
          }
        }
      );
    },
    getMoneyData() {
      var token = localStorage.getItem("loginToken");
      self.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
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
    }
  }
};
</script>
<style>
.add_bidding .el-form-item__label {
  font-size: 2.5vw;
}

.add_bidding .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.add_bidding .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.add_bidding .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

.add_bidding .avatar {
  width: 50px;
  height: 50px;
  display: block;
}

.add_bidding .el-form-item {
  margin-bottom: 10px;
}

.add_bidding .next .el-form-item__content {
  margin-left: 5% !important;
  text-align: center;
  margin-top: 15px;
}
.add_bidding .next .el-button {
  padding: 8px 10px;
}
.add_bidding .qishu .el-row {
  padding-bottom: 5px;
}
.add_bidding .qishu .el-col.el-col-3 div {
  font-size: 10px;
}

.el-col.el-col-11 {
  margin-left: 10px;
}
</style>
<style scoped>
.add_bidding {
  width: 100%;
  height: 100%;
}

.add_bidding .el-form {
  margin-top: 7%;
  padding-right: 5%;
}

.add_bidding .template {
  color: #0068d8;
}
.img {
  position: relative;
  top: 20px;
  left: 18px;
}
</style>