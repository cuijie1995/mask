<template>
  <div class="reach">
    <div class="top">
      <van-nav-bar title="我的商品" left-text="返回" left-arrow @click-left="$router.push('me')" />
    </div>

    <van-tabs type="card" color="#409EFF">
      <van-tab title="产品发布">
        <div class="image">
          <a href="http://img.qqr.world:8880/Enclosure/产品发布订购流程图.jpg">产品发布订购流程图</a>
        </div>

        <el-form ref="reachForm" :model="reachForm" :rules="rules" label-width="95px" size="mini">
          <el-form-item label="商品名称：" prop="productname">
            <el-select v-model="reachForm.productname" placeholder="请选择">
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
              <el-form-item label="拥有资质：" prop="limit">
                <el-checkbox-group v-model="limit" @change="chooseItem">
                  <el-checkbox v-for="data in itemData" :key="data" :label="data"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="商品规格：" prop="productspec">
            <el-input v-model="reachForm.productspec" placeholder="商品规格"></el-input>
          </el-form-item>
          <el-form-item label="供货价格：" prop="minprice">
            <el-row>
              <el-col :span="10">
                <el-input v-model="reachForm.minprice" placeholder="最小单价"></el-input>
              </el-col>
              <el-col :span="2">~</el-col>
              <el-col :span="10">
                <el-input v-model="reachForm.maxprice" placeholder="最大单价"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="保证金：" prop="bondamt">
            <el-slider v-model="reachForm.bondamt" :step="1" show-stops :max="4" :marks="marks"></el-slider>
          </el-form-item>
          <div
            style="font-size:10px;text-align: center;margin-bottom: 20px;color:red;padding: 0 20px"
          >注：为防止虚假信息，建议支付保证金，您支付多少保证金采购方也需要支付对应的保证金，双方无异议时，平台将会退回保证金</div>
          <el-form-item label="每份数量：" prop="startqty" class="shuliang">
            <el-input v-model="reachForm.startqty" placeholder="每份数量"></el-input>
            <span class="unit">{{company}}</span>
          </el-form-item>
          <el-form-item label="供应份数：" prop="copies">
            <el-input-number
              v-model="reachForm.copies"
              @change="handleChange"
              label="供应份数"
              :step="1"
              step-strictly
            />
            <!-- :min="0"
            :max="4"-->
          </el-form-item>
          <el-form-item label="供应数量：" prop="groupbuyqty" class="shuliang">
            <el-input v-model="shuliang" placeholder="供应数量" disabled></el-input>
            <span class="unit">{{company}}</span>
          </el-form-item>
          <el-form-item label="交期天数：" prop="deliverydays">
            <el-input-number v-model="reachForm.deliverydays" :min="1" :max="60" label="交期天数"></el-input-number>
          </el-form-item>
          <el-form-item label="付款方式：" prop="paytype">
            <el-select v-model="reachForm.paytype" placeholder="请选择">
              <el-option
                v-for="(item,index) in payData"
                :key="index"
                :label="item.Fkfs"
                :value="item.Fkfs"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流承担方：" prop="undertaker">
            <el-select v-model="reachForm.undertaker" placeholder="请选择">
              <el-option
                v-for="(item,index) in wuliuData"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="税率：" prop="taxrate">
            <el-select v-model="reachForm.taxrate" placeholder="请选择">
              <el-option
                v-for="(item,index) in rateData"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品图片：" prop="productimgFk">
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

          <el-form-item label="资质证书：" prop="qualificationFk">
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
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item size="large" class="next">
            <el-button type="primary" @click="keep">保存</el-button>
            <el-button type="success" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </van-tab>
      <van-tab title="团购发布">
        <div class="image">
          <a href="http://img.qqr.world:8880/Enclosure/产品团购交易流程图.jpg">产品团购交易流程图</a>
        </div>
        <el-form
          ref="reachGroupForm"
          :model="reachGroupForm"
          :rules="rulesGroup"
          label-width="95px"
          size="mini"
        >
          <el-form-item label="商品名称：" prop="productname">
            <el-select v-model="reachGroupForm.productname" placeholder="请选择">
              <el-option
                v-for="(item,index) in goodName"
                :key="index"
                :label="item.cpmc"
                :value="item.cpmc"
              >
                <span @click="onSelectGroup(item)">{{item.cpmc}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <div v-if="itemDataGroup">
            <div v-if="itemDataGroup.length > 0">
              <el-form-item label="拥有资质：" prop="limit">
                <el-checkbox-group v-model="limitGroup" @change="chooseItemGroup">
                  <el-checkbox v-for="data in itemDataGroup" :key="data" :label="data"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="商品规格：" prop="productspec">
            <el-input v-model="reachGroupForm.productspec" placeholder="商品规格"></el-input>
          </el-form-item>
          <el-form-item label="供货价格：" prop="minprice">
            <!-- <el-row> -->
            <!-- <el-col :span="10"> -->
            <el-input v-model="reachGroupForm.minprice" placeholder="供货价格"></el-input>
            <!-- </el-col> -->
            <!-- <el-col :span="2">~</el-col>
              <el-col :span="10">
                <el-input v-model="reachGroupForm.maxprice" placeholder="最大单价"></el-input>
            </el-col>-->
            <!-- </el-row> -->
          </el-form-item>
          <el-form-item :label="'保证金( ' + rate + ' )：'" prop="bondamt">
            <el-slider
              v-model="reachGroupForm.bondamt"
              :step="1"
              show-stops
              :marks="marks"
              :min="bond.BondMin"
              :max="bond.BondMax"
            ></el-slider>
          </el-form-item>
          <div
            style="font-size:10px;text-align: center;margin-bottom: 20px;color:red;padding: 0 20px"
          >注：为防止虚假信息，建议支付保证金，您支付多少保证金采购方也需要支付对应的保证金，双方无异议时，平台将会退回保证金</div>
          <el-form-item label="每份数量：" prop="startqty" class="shuliang">
            <el-input v-model="reachGroupForm.startqty" placeholder="每份数量"></el-input>
            <span class="unit">{{companyGroup}}</span>
          </el-form-item>
          <el-form-item label="团购份数：" prop="copies">
            <el-input-number
              v-model="reachGroupForm.copies"
              @change="handleChange"
              label="团购份数"
              :step="1"
              step-strictly
            />
          </el-form-item>
          <el-form-item label="团购数量：" prop="groupbuyqty" class="shuliang">
            <el-input v-model="shuliangGroup" placeholder="团购数量" disabled></el-input>
            <span class="unit">{{companyGroup}}</span>
          </el-form-item>

          <el-form-item label="团购天数：" prop="deliverydays">
            <el-input-number
              v-model="reachGroupForm.groupenddays"
              :min="1"
              :max="10"
              label="请选择团购结束天数"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="发货周期：" prop="deliverydays">
            <el-input-number
              v-model="reachGroupForm.deliverydays"
              :min="1"
              :max="60"
              label="成团后多少天"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="付款方式：" prop="paytype">
            <el-select v-model="reachGroupForm.paytype" placeholder="请选择">
              <el-option
                v-for="(item,index) in payData"
                :key="index"
                :label="item.Fkfs"
                :value="item.Fkfs"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流承担方：" prop="undertaker">
            <el-select v-model="reachGroupForm.undertaker" placeholder="请选择">
              <el-option
                v-for="(item,index) in wuliuData"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="税率：" prop="taxrate">
            <el-select v-model="reachGroupForm.taxrate" placeholder="请选择">
              <el-option
                v-for="(item,index) in rateData"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品图片：" prop="productimgFk">
            <el-upload
              class="upload-demo"
              ref="uploadpictureGroup2"
              :action="uploadurlGroup2"
              :multiple="true"
              :auto-upload="true"
              :before-upload="doUploadGroup2"
              :on-success="onUploadSuccessGroup2"
              :before-remove="OnBeforeRemoveUpLoadGroup2"
              :show-file-list="true"
              :file-list="fileList"
              accept="image/*"
              name="files"
              list-type="picture"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="资质证书：" prop="qualificationFk">
            <el-upload
              class="upload-demo"
              ref="uploadpictureGroup1"
              :action="uploadurlGroup1"
              :multiple="true"
              :auto-upload="true"
              :before-upload="doUploadGroup1"
              :on-success="onUploadSuccessGroup1"
              :before-remove="OnBeforeRemoveUpLoadGroup1"
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
            <el-button type="primary" @click="keepGroup">保存</el-button>
            <el-button type="success" @click="onSubmitGroup">提交</el-button>
          </el-form-item>
        </el-form>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
let self;
import Notify from "vant/lib/notify";
import "vant/lib/notify/style";
export default {
  computed: {
    shuliang() {
      var shuliang;
      shuliang = this.reachForm.copies * this.reachForm.startqty;

      this.reachForm.groupbuyqty = shuliang;
      return shuliang;
    },
    shuliangGroup() {
      var shuliangGroup;
      shuliangGroup = this.reachGroupForm.copies * this.reachGroupForm.startqty;

      this.reachGroupForm.groupbuyqty = shuliangGroup;
      return shuliangGroup;
    }
  },
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
      bond: [],
      rate: "",
      company: "",
      companyGroup: "",
      bondamt: "",
      limit: [],
      limitGroup: [],
      isIndeterminate: true,
      itemData: "",
      itemDataGroup: "",
      curguid: "", //大图的id
      curguids: "", //详情图的id
      reachForm: {
        productname: "",
        productspec: "",
        minprice: "",
        maxprice: "",
        startqty: "",
        deliverydays: "",
        paytype: "",
        undertaker: "",
        taxrate: "",
        productimgFk: "", //id
        productimgs: [], //[]
        qualificationFk: "", //id
        qualifications: [], //[]，
        limit: "",
        groupenddays: 1,
        deliverydays: 1,
        copies: 1,
        groupbuyqty: "",
        company: "",
        bondamt: 1
      },
      rules: {
        productname: [
          { required: true, message: "请选择商品名称", trigger: "blur" }
        ],
        productspec: [
          { required: true, message: "请输入商品规格", trigger: "blur" }
        ],
        minprice: [
          { required: true, message: "请输入供货价格", trigger: "blur" }
        ],
        startqty: [
          { required: true, message: "请输入每份数量", trigger: "blur" }
        ],
        deliverydays: [
          { required: true, message: "请输入交期天数", trigger: "blur" }
        ],
        paytype: [
          { required: true, message: "请选择付款方式", trigger: "blur" }
        ],
        undertaker: [
          { required: true, message: "请选择物流承担方", trigger: "blur" }
        ],
        taxrate: [{ required: true, message: "请选择税率", trigger: "blur" }],
        copies: [
          { required: true, message: "请输入供应份数", trigger: "blur" }
        ],
        number: [{ required: true, message: "请输入供应数量", trigger: "blur" }]
        // yfyj:[{required:true,message:"请选择保证金",trigger:"blur"}]
      },
      fileList: [],
      listFile: [],
      productimgs: [],
      qualifications: [],
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
          name: "普票3%",
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
      deliveryData: [
        {
          name: "现货",
          value: 1
        },
        {
          name: "期货",
          value: 2
        },
        {
          name: "拼团",
          value: 3
        }
      ],
      goodName: "",
      uploadurl1: "",
      uploadurl2: "",
      yfyjGroup: "",
      reachGroupForm: {
        productname: "",
        productspec: "",
        minprice: "",
        maxprice: "",
        startqty: "",
        deliverydays: "",
        paytype: "",
        undertaker: "",
        taxrate: "",
        productimgFk: "", //id
        productimgs: [], //[]
        qualificationFk: "", //id
        qualifications: [], //[]，
        limit: "",
        groupenddays: 1,
        deliverydays: 1,
        copies: 1,
        groupbuyqty: "",
        bondamt: 1,
        company: ""
      },
      rulesGroup: {
        productname: [
          { required: true, message: "请选择商品名称", trigger: "blur" }
        ],
        productspec: [
          { required: true, message: "请输入商品规格", trigger: "blur" }
        ],
        minprice: [
          { required: true, message: "请输入供货价格", trigger: "blur" }
        ],
        startqty: [
          { required: true, message: "请输入每份数量", trigger: "blur" }
        ],
        deliverydays: [
          { required: true, message: "请输入交期天数", trigger: "blur" }
        ],
        paytype: [
          { required: true, message: "请选择付款方式", trigger: "blur" }
        ],
        undertaker: [
          { required: true, message: "请选择物流承担方", trigger: "blur" }
        ],
        taxrate: [{ required: true, message: "请选择税率", trigger: "blur" }],
        copies: [
          { required: true, message: "请输入供应份数", trigger: "blur" }
        ],
        number: [{ required: true, message: "请输入供应数量", trigger: "blur" }]
      },
      uploadurlGroup1: "",
      uploadurlGroup2: "",
      productimgsGroup: [],
      qualificationsGroup: [],
      orderId: ""
    };
  },
  mounted() {
    self = this;
    self.getid();
    self.getPayData();
    self.getGoodName();
  },
  methods: {
    handleChange(value) {
      console.log(value);
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
        self.curguids;
      self.uploadurl2 =
        self.uploadurl +
        "/api/FildLoad/UpLoadFildAndZoom?userId=" +
        localStorage.getItem("loginId") +
        "&relationKey=" +
        self.curguid;

      self.uploadurlGroup1 =
        self.uploadurl +
        "/api/FildLoad/UpLoadFildAndZoom?userId=" +
        localStorage.getItem("loginId") +
        "&relationKey=" +
        self.curguids;
      self.uploadurlGroup2 =
        self.uploadurl +
        "/api/FildLoad/UpLoadFildAndZoom?userId=" +
        localStorage.getItem("loginId") +
        "&relationKey=" +
        self.curguid;
    },
    getPayData() {
      self.$axios
        .get(self.url + "/api/BaseData/GetPayType")
        .then(res => {
          self.payData = res.data.Value.Data;
        })
        .catch(err => {});
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
            var token = localStorage.getItem("loginToken");
            self.$axios.defaults.headers.common["Authorization"] =
              "Bearer " + token;
            self.$axios
              .post(
                self.url +
                  "/api/ProductPublish/BatchSubmitOrder?batchOperationDto=" +
                  self.orderId,
                {
                  headers: {
                    "Content-Type": "application/json-patch+json"
                  }
                }
              )
              .then(res => {
                if (res.data.statusCode == 0) {
                  self.$router.push("me");
                }
              })
              .catch(() => {
                self.$router.push("noReach");
              });
          }
        }
      );
    },
    onUploadSuccess1(response, file, fileList) {
      self.productimgs.push(response.filds[0]);
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

      self.productimgs.forEach(item => {
        if (item.fildName == file.name) {
          ress = true;
        }
        if (ress) {
          self.productimgs = self.productimgs.filter(function(element, index) {
            return element["fildName"] != file.name;
          });
        }
      });

      return ress;
    },

    onUploadSuccess2(response, file, fileList) {
      self.qualifications.push(response.filds[0]);
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

      self.qualifications.forEach(item => {
        if (item.fildName == file.name) {
          ress = true;
        }
        if (ress) {
          self.qualifications = self.qualifications.filter(function(
            element,
            index
          ) {
            return element["fildName"] != file.name;
          });
        }
      });

      return ress;
    },
    SaveGeneralOrder() {
      self.reachForm.productimgs = self.productimgs;
      self.reachForm.qualifications = self.qualifications;
      self.reachForm.productimgFk = self.curguid;
      self.reachForm.qualificationFk = self.curguids;
      self.reachForm.company = self.company;
      // self.reachForm.yfyj = self.yfyj * 10000;
      // self.reachForm.yfyj = self.yfyj;

      var token = localStorage.getItem("loginToken");
      self.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .post(
          self.url + "/api/ProductPublish/SaveGeneralOrder",
          self.reachForm,
          {
            headers: {
              "Content-Type": "application/json-patch+json"
            }
          }
        )
        .then(res => {
          self.$message({
            message: res.data.resultMsg,
            type: "success"
          });

          self.$router.push("supplyList");
        })
        .catch(err => {});
    },
    keep() {
      if (self.qualifications == "") {
        self.$message({
          message: "商品图片不能为空",
          type: "warning"
        });

        if (
          self.$refs.uploadpicture2.$data.uploadFiles.length !=
          self.qualifications.length
        ) {
          self.$message({
            message: "请等待图片上传完成",
            type: "warning"
          });
        }
      } else {
        self.$refs["reachForm"].validate(valid => {
          if (valid) {
            if (self.reachForm.limit) {
              if (self.productimgs == "") {
                self.$message({
                  message: "资质证书不能为空",
                  type: "warning"
                });
                if (
                  self.$refs.uploadpicture1.$data.uploadFiles.length !=
                  self.productimgs.length
                ) {
                  self.$message({
                    message: "请等待资质证书上传完成",
                    type: "warning"
                  });
                }
              } else {
                self.SaveGeneralOrder();
              }
            } else {
              self.SaveGeneralOrder();
            }
          }
        });
      }
    },
    SubmitGeneralOrder() {
      self.reachForm.productimgs = self.productimgs;
      self.reachForm.qualifications = self.qualifications;
      self.reachForm.productimgFk = self.curguid;
      self.reachForm.qualificationFk = self.curguids;
      self.reachForm.company = self.company;
      // self.reachForm.yfyj = self.yfyj * 10000;
      // self.reachForm.yfyj = self.yfyj;

      var token = localStorage.getItem("loginToken");
      self.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .post(
          self.url + "/api/ProductPublish/SubmitGeneralOrder",
          self.reachForm,
          {
            headers: {
              "Content-Type": "application/json-patch+json"
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
                    document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                    document.attachEvent(
                      "onWeixinJSBridgeReady",
                      onBridgeReady
                    );
                  }
                } else {
                  self.onBridgeReady(pay_params);
                }
                // self.$router.push("supplyList");
              } else {
                window.location.href = res.data.data.mWebUrl;
                self.$router.push("supplyList");
              }
            }
            // self.$router.push("supplyList");

            self.orderId = res.data.data.billId;
          }
          if (res.data.statusCode == 0) {
            self.$router.push("supplyList");
          }
          if (res.data.statusCode == 9) {
            self.$message({
              message: res.data.resultMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});

      if (self.orderId) {
        var token = localStorage.getItem("loginToken");
        self.$axios.defaults.headers.common["Authorization"] =
          "Bearer " + token;
        self.$axios
          .post(
            self.url +
              "/api/ProductPublish/BatchSubmitOrder?batchOperationDto=" +
              self.orderId,
            {
              headers: {
                "Content-Type": "application/json-patch+json"
              }
            }
          )
          .then(res => {
            if (res.data.statusCode == 0) {
              self.$router.push("me");
            }
          })
          .catch(() => {
            self.$router.push("noReach");
          });
      }
    },
    onSubmit() {
      if (self.qualifications == "") {
        self.$message({
          message: "商品图片不能为空",
          type: "warning"
        });

        if (
          self.$refs.uploadpicture2.$data.uploadFiles.length !=
          self.qualifications.length
        ) {
          self.$message({
            message: "请等待图片上传完成",
            type: "warning"
          });
        }
      } else {
        self.$refs["reachForm"].validate(valid => {
          if (valid) {
            if (self.reachForm.limit) {
              if (self.productimgs == "") {
                self.$message({
                  message: "资质证书不能为空",
                  type: "warning"
                });
                if (
                  self.$refs.uploadpicture1.$data.uploadFiles.length !=
                  self.productimgs.length
                ) {
                  self.$message({
                    message: "请等待资质证书上传完成",
                    type: "warning"
                  });
                }
              } else {
                self.SubmitGeneralOrder();
              }
            } else {
              self.SubmitGeneralOrder();
            }
          }
        });
      }
    },
    onSelect(item) {
      self.itemData = item.limits;
      self.company = item.company;
    },
    onSelectGroup(item) {
      self.itemDataGroup = item.limits;
      self.companyGroup = item.company;
    },
    chooseItem(value) {
      self.reachForm.limit = value.join(",");
      // self.reachGroupForm.limit = value.join(",");
    },
    chooseItemGroup(value) {
      // self.reachForm.limit = value.join(",");
      self.reachGroupForm.limit = value.join(",");
    },

    SaveGroupBuyOrder() {
      self.reachGroupForm.productimgs = self.productimgsGroup;
      self.reachGroupForm.qualifications = self.qualificationsGroup;
      self.reachGroupForm.productimgFk = self.curguid;
      self.reachGroupForm.qualificationFk = self.curguids;
      self.reachGroupForm.company = self.companyGroup;
      self.reachGroupForm.maxprice = self.reachGroupForm.minprice;
      // self.reachGroupForm.yfyj = self.yfyj * 10000;
      // self.reachGroupForm.yfyj = self.yfyj;

      var token = localStorage.getItem("loginToken");
      self.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .post(
          self.url + "/api/ProductPublish/SaveGroupBuyOrder",
          self.reachGroupForm,
          {
            headers: {
              "Content-Type": "application/json-patch+json"
            }
          }
        )
        .then(res => {
          self.$message({
            message: res.data.resultMsg,
            type: "success"
          });
          self.$router.push("supplyList");
        })
        .catch(err => {});
    },
    keepGroup() {
      // if (self.reachGroupForm.startqty >= self.reachGroupForm.groupbuyqty) {
      //   self.$message({
      //     message: "成团数量必须大于起订数量",
      //     type: "warning"
      //   });
      // }
      if (self.qualificationsGroup == "") {
        self.$message({
          message: "商品图片不能为空",
          type: "warning"
        });
        if (
          self.$refs.uploadpictureGroup2.$data.uploadFiles.length !=
          self.qualificationsGroup.length
        ) {
          self.$message({
            message: "请等待图片上传完成",
            type: "warning"
          });
        }
      } else {
        self.$refs["reachGroupForm"].validate(valid => {
          if (valid) {
            if (self.reachGroupForm.limit) {
              if (self.productimgsGroup == "") {
                self.$message({
                  message: "资质证书不能为空",
                  type: "warning"
                });

                if (
                  self.$refs.uploadpictureGroup1.$data.uploadFiles.length !=
                  self.productimgsGroup.length
                ) {
                  self.$message({
                    message: "请等待资质证书上传完成",
                    type: "warning"
                  });
                }
              } else {
                self.SaveGroupBuyOrder();
              }
            } else {
              self.SaveGroupBuyOrder();
            }
          }
        });
      }
    },
    SubmitGroupBuyOrder() {
      self.reachGroupForm.productimgs = self.productimgsGroup;
      self.reachGroupForm.qualifications = self.qualificationsGroup;
      self.reachGroupForm.productimgFk = self.curguid;
      self.reachGroupForm.qualificationFk = self.curguids;
      self.reachGroupForm.company = self.companyGroup;
      self.reachGroupForm.maxprice = self.reachGroupForm.minprice;
      // self.reachGroupForm.yfyj = self.yfyj * 10000;
      // self.reachGroupForm.yfyj = self.yfyj;

      var token = localStorage.getItem("loginToken");
      self.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios
        .post(
          self.url + "/api/ProductPublish/SubmitGroupBuyOrder",
          self.reachGroupForm,
          {
            headers: {
              "Content-Type": "application/json-patch+json"
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
                    document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                    document.attachEvent(
                      "onWeixinJSBridgeReady",
                      onBridgeReady
                    );
                  }
                } else {
                  self.onBridgeReady(pay_params);
                }
                // self.$router.push("supplyList");
              } else {
                window.location.href = res.data.data.mWebUrl;
                self.$router.push("supplyList");
              }
            }
            // self.$router.push("supplyList");

            self.orderId = res.data.data.billId;
          }
          if (res.data.statusCode == 0) {
            self.$router.push("supplyList");
          }
          if (res.data.statusCode == 9) {
            self.$message({
              message: res.data.resultMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});

      if (self.orderId) {
        var token = localStorage.getItem("loginToken");
        self.$axios.defaults.headers.common["Authorization"] =
          "Bearer " + token;
        self.$axios
          .post(
            self.url +
              "/api/ProductPublish/BatchSubmitOrder?batchOperationDto=" +
              self.orderId,
            {
              headers: {
                "Content-Type": "application/json-patch+json"
              }
            }
          )
          .then(res => {
            if (res.data.statusCode == 0) {
              self.$router.push("me");
            }
          })
          .catch(() => {
            self.$router.push("noReach");
          });
      }
    },
    onSubmitGroup() {
      // if (self.reachGroupForm.startqty >= self.reachGroupForm.groupbuyqty) {
      //   self.$message({
      //     message: "成团数量必须大于起订数量",
      //     type: "warning"
      //   });
      // }
      if (self.qualificationsGroup == "") {
        self.$message({
          message: "商品图片不能为空",
          type: "warning"
        });

        if (
          self.$refs.uploadpictureGroup2.$data.uploadFiles.length !=
          self.qualificationsGroup.length
        ) {
          self.$message({
            message: "请等待图片上传完成",
            type: "warning"
          });
        }
      } else {
        self.$refs["reachGroupForm"].validate(valid => {
          if (valid) {
            if (self.reachGroupForm.limit) {
              if (self.productimgsGroup == "") {
                self.$message({
                  message: "资质证书不能为空",
                  type: "warning"
                });

                if (
                  self.$refs.uploadpictureGroup1.$data.uploadFiles.length !=
                  self.productimgsGroup.length
                ) {
                  self.$message({
                    message: "请等待资质证书上传完成",
                    type: "warning"
                  });
                }
              } else {
                self.SubmitGroupBuyOrder();
              }
            } else {
              self.SubmitGroupBuyOrder();
            }
          }
        });
      }

      if (self.orderId) {
      }
    },
    onUploadSuccessGroup1(response, file, fileList) {
      self.productimgsGroup.push(response.filds[0]);
    },
    doUploadGroup1(file, files) {
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
    OnBeforeRemoveUpLoadGroup1(file, fileList) {
      var ress = false;
      self.productimgsGroup.forEach(item => {
        if (item.fildName == file.name) {
          ress = true;
        }
        if (ress) {
          self.productimgsGroup = self.productimgsGroup.filter(function(
            element,
            index
          ) {
            return element["fildName"] != file.name;
          });
        }
      });
      return ress;
    },
    onUploadSuccessGroup2(response, file, fileList) {
      self.qualificationsGroup.push(response.filds[0]);
    },
    doUploadGroup2(file, files) {
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
    OnBeforeRemoveUpLoadGroup2(file, fileList) {
      var ress = false;
      self.qualificationsGroup.forEach(item => {
        if (item.fildName == file.name) {
          ress = true;
        }
        if (ress) {
          self.qualificationsGroup = self.qualificationsGroup.filter(function(
            element,
            index
          ) {
            return element["fildName"] != file.name;
          });
        }
      });
      return ress;
    }
  }
};
</script>
<style>
.reach .el-form-item__label {
  font-size: 2.5vw;
}
.reach .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.reach .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.reach .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.reach .avatar {
  width: 50px;
  height: 50px;
  display: block;
}
.reach .el-form-item {
  margin-bottom: 15px;
}
.reach .next .el-form-item__content {
  margin-left: 5% !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 110px;
  font-size: 8px;
}
.el-date-editor.el-input__inner {
  padding: 0 10px;
}
.shuliang .el-input.el-input--mini {
  width: 80%;
}
.unit {
  font-size: 12px;
  margin-left: 20px;
}
</style>
<style  scoped>
.reach {
  width: 100%;
  height: 100%;
}
.reach .el-form {
  /* margin-top: 7%; */
  padding-right: 5%;
}
.reach .template {
  color: #0068d8;
}
.next {
  text-align: center;
}
.el-select {
  width: 100%;
}
.van-tabs {
  margin-top: 60px;
}
.el-col-2 {
  text-align: center;
}
.top {
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 10;
}
.el-slider {
  width: 90%;
}
a {
  text-decoration: underline;
}
.image {
  text-align: center;
  padding: 20px 0;
}
</style>