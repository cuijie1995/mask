<template>
  <div class="release">
    <div class="top">
      <van-nav-bar title="我的需求" left-text="返回" left-arrow @click-left="$router.go('-1')" />
    </div>
    <div class="image">
      <a href="http://img.qqr.world:8880/Enclosure/需求发布交易流程图.jpg">需求发布交易流程图</a>
    </div>
    <el-form ref="releaseForm" :model="releaseForm" :rules="rules" label-width="95px" size="mini">
      <el-form-item label="商品名称：" prop="spmc">
        <el-select v-model="releaseForm.spmc" placeholder="请选择">
          <el-option
            v-for="(item,index) in goodName"
            :key="index"
            :label="item.cpmc"
            :value="item.cpmc"
          >
            <span @click="onSelect(item)">{{item.cpmc}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <div v-if="itemData">
        <div v-if="itemData.length > 0">
          <el-form-item label="要求资质：" prop="limit">
            <el-checkbox-group v-model="limit" @change="chooseItem">
              <el-checkbox v-for="data in itemData" :key="data" :label="data"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>

      <el-form-item label="商品规格：" prop="spgg">
        <el-input v-model="releaseForm.spgg" placeholder="商品规格"></el-input>
      </el-form-item>

      <el-form-item label="单价：" prop="cgj">
        <el-row>
          <el-col :span="10">
            <el-input v-model="releaseForm.cgj" @change="onChangemaxdj()" placeholder="最小单价"></el-input>
          </el-col>
          <el-col :span="4">
            <div style=" text-align: center">~</div>
          </el-col>
          <el-col :span="10">
            <el-input v-model="releaseForm.maxdj" @change="onChangemaxdj()" placeholder="最大单价"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="需求数量:" prop="sl" class="shuliang">
        <el-input v-model="releaseForm.sl" placeholder="需求数量" @change="onChangesl()"></el-input>
        <span class="unit">{{company}}</span>
      </el-form-item>

      <el-form-item label="总价：" prop="zje">
        <el-input v-model="releaseForm.zje" disabled placeholder="总价"></el-input>
      </el-form-item>

      <el-form-item :label="'保证金( ' + rate + ' )：'" prop="bondamt">
        <el-slider
          v-model="releaseForm.bondamt"
          :step="1"
          show-stops
          :marks="marks"
          :min="bond.BondMin"
          :max="bond.BondMax"
        ></el-slider>
      </el-form-item>
      <div
        style="font-size:10px;text-align: center;margin-bottom: 20px;color:red;padding: 0 20px;
"
      >注：为防止虚假信息，建议支付保证金，您支付多少保证金供应方也需要支付对应的保证金，双方无异议时，平台将会退回保证金</div>
      <el-form-item label="交货日期：" prop="dhrq">
        <el-row>
          <el-col :span="10">
            <el-date-picker
              v-model="releaseForm.dhrq"
              type="date"
              :editable="false"
              placeholder="最早日期时间"
            ></el-date-picker>
          </el-col>
          <el-col :span="4">
            <div style=" text-align: center">~</div>
          </el-col>
          <el-col :span="10">
            <el-date-picker
              v-model="releaseForm.maxdhrq"
              type="date"
              :editable="false"
              placeholder="最晚日期时间"
            ></el-date-picker>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="付款方式：" prop="fkfs">
        <el-select v-model="releaseForm.fkfs" placeholder="请选择">
          <el-option
            v-for="(item,index) in payData"
            :key="index"
            :label="item.Fkfs"
            :value="item.Fkfs"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="物流费用：" prop="wuliu">
        <el-select v-model="releaseForm.wuliu" placeholder="请选择">
          <el-option
            v-for="(item,index) in wuliuData"
            :key="index"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出货方式：" prop="chfs">
        <el-select v-model="releaseForm.chfs" placeholder="请选择">
          <el-option
            v-for="(item,index) in chufsData"
            :key="index"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="税率：" prop="suilv">
        <el-select v-model="releaseForm.suilv" placeholder="请选择">
          <el-option
            v-for="(item,index) in rateData"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注：" prop="ddbz">
        <el-input type="textarea" v-model="releaseForm.ddbz" placeholder="备注"></el-input>
      </el-form-item>

      <el-form-item label="商品图片：" prop="maximgs">
        <el-upload
          class="upload-demo"
          ref="uploadpicture1"
          :action="uploadurl1"
          :multiple="true"
          :auto-upload="true"
          :before-upload="doUpload1"
          :on-success="onUploadSuccess1"
          :before-remove="OnBeforeRemoveUpLoad1"
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

      <el-form-item label="商品详情图：" prop="imgs">
        <el-upload
          class="upload-demo"
          ref="uploadpicture2"
          :action="uploadurl2"
          :multiple="true"
          :auto-upload="true"
          :before-upload="doUpload2"
          :on-success="onUploadSuccess2"
          :before-remove="OnBeforeRemoveUpLoad2"
          :show-file-list="true"
          :file-list="fileList"
          accept="image/*"
          name="files"
          list-type="picture"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item size="large" class="next">
        <el-button type="success" @click="keep">保存</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
let self;
import axios from "axios";
import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";
import Notify from "vant/lib/notify";
import "vant/lib/notify/style";
export default {
  name: "Release",
  data() {
    return {
      marks: {
        0: "0",
        1: "1",
        2: "2",
        3: "3",
        4: "4"
      },
      rate: "",
      company: "",
      limit: [],
      isIndeterminate: true,
      itemData: "",
      userId: "",
      curguid: "", //大图的id
      curguids: "", //详情图的id
      releaseForm: {
        spmc: "",
        spgg: "",
        hq: 0,
        fkfs: "",
        wuliu: "",
        suilv: "",
        ddbz: "",
        chfs: "",
        dhrq: "", //最早
        maxdhrq: "", //最晚
        cgj: "", //最小单价
        maxdj: "", //最大单价
        zje: "", //最小总价
        imgs: [],
        maximgs: [],
        maximg: "", //curguid
        img: "", //curguids,
        limit: "",
        bondamt: 1,
        company: ""
      },
      rules: {
        spmc: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        spgg: [{ required: true, message: "请输入商品规格", trigger: "blur" }],
        fkfs: [{ required: true, message: "请输入付款方式", trigger: "blur" }],
        dhrq: [{ required: true, message: "请选择交期", trigger: "blur" }],
        wuliu: [{ required: true, message: "物流费用承担方", trigger: "blur" }],
        zje: [{ required: true, message: "总额", trigger: "blur" }],
        sl: [{ required: true, message: "请输入需求数量", trigger: "blur" }],
        suilv: [{ required: true, message: "请输入税率", trigger: "blur" }],
        chfs: [{ required: true, message: "请输入出货方式", trigger: "blur" }],
        cgj: [{ required: true, message: "请输入单价", trigger: "blur" }],
        dhrq: [{ required: true, message: "请选择时间" }]
      },
      imageUrl: "",
      imgId: "",
      fileList: [],
      listFile: [],
      userId: "",
      sqzsId: "",
      imgsFiles: [],
      maximgsFiles: [],
      imageUrl1: [],
      imageUrl: [],
      goodName: [],
      rateData: [
        {
          name: "不含税",
          value: 0
        },
        {
          name: "含税13%",
          value: 0.13
        },
        {
          name: "3%普票",
          value: 0.03
        }
      ],
      payData: [],
      wuliuData: [
        {
          name: "买方"
        },
        {
          name: "卖方"
        }
      ],
      chufsData: [
        {
          name: "分批"
        },
        {
          name: "一次性"
        }
      ],
      uploadurl1: "",
      uploadurl2: "",
      bond: null,
      orderId: ""
    };
  },
  mounted() {
    self = this;

    self.getGoodName();
    self.getid();
    self.getPayData();

    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", self.goBack, false); //false阻止默认事件    self.fun是指返回按建实际要执行的方法
    }
  },
  destroyed() {
    window.removeEventListener("popstate", self.goBack, false); //false阻止默认事件
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    goBack() {
      self.$router.push({ path: "need" });
    },
    onChangemaxdj() {
      if (
        self.releaseForm.maxdj < self.releaseForm.cgj &&
        self.releaseForm.maxdj != ""
      ) {
        self.$message({
          message: "最大价不能小于最小价格",
          type: "error"
        });
        self.releaseForm.maxdj = self.releaseForm.cgj;
      }
      if (self.releaseForm.sl > 0 && self.releaseForm.cgj > 0) {
        self.releaseForm.zje = (
          self.releaseForm.sl * self.releaseForm.cgj
        ).toFixed(2);
      }
    },

    onChangesl() {
      if (self.releaseForm.sl > 0 && self.releaseForm.cgj > 0) {
        var amt = self.releaseForm.sl * self.releaseForm.cgj;
        self.releaseForm.zje = amt.toFixed(2);
      }
    },
    getid() {
      var curguid = "";
      var curguids = "";
      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curguid += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) curguid += "-";
      }
      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curguids += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) curguids += "-";
      }
      self.curguid = curguid;
      self.curguids = curguids;
      self.uploadurl1 =
        self.uploadurl +
        "/api/FildLoad/UpLoadFildAndZoom?userId=" +
        localStorage.getItem("loginId") +
        "&relationKey=" +
        self.curguid;
      self.uploadurl2 =
        self.uploadurl +
        "/api/FildLoad/UpLoadFildAndZoom?userId=" +
        localStorage.getItem("loginId") +
        "&relationKey=" +
        self.curguids;
    },
    getGoodName() {
      self.$axios
        .get(
          self.url +
            "/api/BaseData/GetGoodsName?Userid=" +
            localStorage.getItem("loginId")
        )
        .then(res => {
          self.goodName = res.data.data;
        })
        .catch(err => {});
      self.$axios
        .get(self.url + "/api/BaseData/GetBond")
        .then(res => {
          self.bond = res.data.Value.Data;
          if (res.data.Value.Data.BondRate == 1) {
            self.rate = "元";
          }
          if (res.data.Value.Data.BondRate == 10000) {
            self.rate = "万元";
          }
        })
        .catch(err => {});
    },
    getPayData() {
      self.$axios
        .get(self.url + "/api/BaseData/GetPayType")
        .then(res => {
          self.payData = res.data.Value.Data;
        })
        .catch(err => {});
    },
    onUploadSuccess1(response, file, fileList) {
      self.maximgsFiles.push(response.filds[0]);
    },
    doUpload1(file, files) {
      self.fileuploaded = false;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpeg";
      const extension2 = testmsg === "png";
      const extension3 = testmsg === "jpg";
      if (!extension && !extension2 && !extension3) {
        self.$message({
          message: "上传文件只能是jpeg、png、jpg格式!",
          type: "warning"
        });
      }

      return extension || extension2 || extension3;
    },
    OnBeforeRemoveUpLoad1(file, fileList) {
      var ress = false;

      self.maximgsFiles.forEach(item => {
        if (item.fildName == file.name) {
          ress = true;
        }
        if (ress) {
          self.maximgsFiles = self.maximgsFiles.filter(function(
            element,
            index
          ) {
            return element["fildName"] != file.name;
          });
        }
      });

      return ress;
    },

    onUploadSuccess2(response, file, fileList) {
      self.imgsFiles.push(response.filds[0]);
    },
    doUpload2(file, files) {
      self.fileuploaded = false;

      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpeg";
      const extension2 = testmsg === "png";
      const extension3 = testmsg === "jpg";
      if (!extension && !extension2 && !extension3) {
        self.$message({
          message: "上传文件只能是jpeg、png、jpg格式!",
          type: "warning"
        });
      }

      return extension || extension2 || extension3;
    },
    OnBeforeRemoveUpLoad2(file, fileList) {
      var ress = false;

      self.imgsFiles.forEach(item => {
        if (item.fildName == file.name) {
          ress = true;
        }
        if (ress) {
          self.imgsFiles = self.imgsFiles.filter(function(element, index) {
            return element["fildName"] != file.name;
          });
        }
      });

      return ress;
    },
    onSubmit() {
      if (self.maximgsFiles.length == 0) {
        self.$message({
          message: "请上传商品图片",
          type: "warning"
        });
        if (
          self.$refs.uploadpicture1.$data.uploadFiles.length !=
          self.maximgsFiles.length
        ) {
          self.$message({
            message: "请等待商品图片上传完成",
            type: "warning"
          });
        }
      } else {
        self.$refs["releaseForm"].validate(valid => {
          if (valid) {
            self.releaseForm.imgs = self.imgsFiles;
            self.releaseForm.maximgs = self.maximgsFiles;
            self.releaseForm.maximg = self.curguid;
            self.releaseForm.img = self.curguids;
            self.releaseForm.company = self.company;
            self.releaseForm.yfyj = self.yfyj * 10000;

            var token = localStorage.getItem("loginToken");
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios.defaults.headers.common["Accept"] = "text/plain";

            Dialog.confirm({
              title: "提示",
              message: "支付保证金后，此需求单才会正式发布"
            })
              .then(() => {
                self.$axios
                  .post(
                    self.url + "/api/RequestPublish/SubmitRequestPublish",
                    self.releaseForm,
                    {
                      headers: {
                        "Content-Type": "application/json; charset=utf-8"
                      }
                    }
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
                            self.onBridgeReady(pay_params);
                          }
                          // self.$router.push("me");
                        } else {
                          window.location.href = res.data.data.mWebUrl;
                          self.$router.push("me");
                        }

                        self.orderId = res.data.data.billId;
                      }
                      //  self.$router.push("me");
                    }
                    if (res.data.statusCode == 0) {
                      self.$router.push("me");
                    }
                    if (res.data.statusCode == 9) {
                      Notify({ type: "warning", message: res.data.resultMsg });
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(() => {});
          } else {
          }
        });
      }

      if (self.orderId) {
        self.$axios
          .post(
            self.url +
              "/api/RequestPublish/BatchSubmitRequestPublish?inputDto=" +
              self.orderId,

            {
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            }
          )
          .then(res => {
            if (res.data.statusCode == 0) {
              self.$router.push("me");
            }
          })
          .catch(() => {
            self.$router.push("orderPaid");
          });
      }
    },
    keep() {
      if (self.maximgsFiles.length == 0) {
        self.$message({
          message: "请上传商品图片",
          type: "warning"
        });

        if (
          self.$refs.uploadpicture1.$data.uploadFiles.length !=
          self.maximgsFiles.length
        ) {
          self.$message({
            message: "请等待商品图片上传完成",
            type: "warning"
          });
        }
      } else {
        self.$refs["releaseForm"].validate(valid => {
          if (valid) {
            self.releaseForm.imgs = self.imgsFiles;
            self.releaseForm.maximgs = self.maximgsFiles;
            self.releaseForm.maximg = self.curguid;
            self.releaseForm.img = self.curguids;
            self.releaseForm.company = self.company;
            self.releaseForm.yfyj = self.yfyj * 10000;

            var token = localStorage.getItem("loginToken");
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios.defaults.headers.common["Accept"] = "text/plain";

            Dialog.confirm({
              title: "提示",
              message: "保存的信息请到待提交的需求中查看"
            })
              .then(() => {
                self.$axios
                  .post(
                    self.url + "/api/RequestPublish/InsertRequestPublish",
                    self.releaseForm,
                    {
                      headers: {
                        "Content-Type": "application/json; charset=utf-8"
                      }
                    }
                  )
                  .then(res => {
                    if (res.data.statusCode == 0) {
                      self.$router.push("orderPaid");
                    }
                    if (res.data.statusCode == 9) {
                      Notify({ type: "warning", message: res.data.resultMsg });
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(() => {});
          } else {
          }
        });
      }

      if (self.orderId) {
        self.$router.push("orderPaid");
      }
    },
    onBridgeReady(params) {
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
                  "/api/RequestPublish/BatchSubmitRequestPublish?inputDto=" +
                  self.orderId,

                {
                  headers: {
                    "Content-Type": "application/json; charset=utf-8"
                  }
                }
              )
              .then(res => {
                if (res.data.statusCode == 0) {
                  self.$router.push("me");
                }
              })
              .catch(() => {});
          } else {
            self.$router.push("orderPaid");
          }
        }
      );
    },
    onSelect(item) {
      self.itemData = item.limits;
      self.company = item.company;
    },
    chooseItem(value) {
      self.releaseForm.limit = value.join(",");
    }
  }
};
</script>
<style>
.release .el-form-item__label {
  font-size: 2.5vw;
}
.release .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.release .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.release .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.release .avatar {
  width: 50px;
  height: 50px;
  display: block;
}
.release .el-form-item {
  margin-bottom: 15px;
}
.release .next .el-form-item__content {
  margin-left: 5% !important;
}
.next {
  text-align: center;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 110px !important;
  font-size: 9px;
}
.el-select {
  width: 100%;
}
</style>
<style  scoped>
.release {
  width: 100%;
  height: 100%;
}
.release .el-form {
  margin-top: 20px;
  padding-right: 5%;
}
.release .template {
  color: #0068d8;
}
.top {
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 10;
}
.shuliang .el-input.el-input--mini {
  width: 80%;
}
.unit {
  font-size: 12px;
  margin-left: 10px;
}
a {
  text-decoration: underline;
}
.image {
  margin-top: 60px;
  text-align: center;
}
.el-slider {
  width: 90%;
}
</style>