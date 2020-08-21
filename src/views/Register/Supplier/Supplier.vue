<template>
  <div class="supplier">
    <div class="top">
      <van-nav-bar title="完善信息（供应商）" left-text="返回" left-arrow @click-left="$router.go('-1')" />
    </div>

    <el-form ref="supplierForm" :model="supplierForm" :rules="rules" label-width="95px" size="mini">
      <el-form-item label="公司名称：" prop="gsmc">
        <el-input v-model="supplierForm.gsmc" placeholder="公司名称"></el-input>
      </el-form-item>
      <el-form-item label="营业执照号：" prop="yyzzh">
        <el-input v-model="supplierForm.yyzzh" placeholder="营业执照号"></el-input>
      </el-form-item>
      <el-form-item label="上传营业执照：" prop="yyzs">
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
      <el-form-item label="供货产品：" prop="ghlx">
        <el-checkbox-group v-model="limit" @change="chooseItem(limit)">
          <el-checkbox v-for="data in goodType" :key="data.Lm" :label="data.Lm"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      
      <el-form-item label="申请人：" prop="sqr">
        <el-input v-model="supplierForm.sqr" placeholder="申请人"></el-input>
      </el-form-item>
      <el-form-item label="上传授权书：" prop="sqzs">
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

        <a href="http://img.qqr.world:8880/Enclosure/授权书模板.doc" style="color:#409EFF">下载授权书模板</a>
      </el-form-item>
      <el-form-item label="手机号：" prop="sjh">
        <el-input v-model="supplierForm.sjh" placeholder="手机号" disabled></el-input>
      </el-form-item>

      <el-form-item label="详细地址：" prop="xxdz">
        <el-input v-model="supplierForm.xxdz" placeholder="详细地址"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="bz">
        <el-input v-model="supplierForm.bz" placeholder="备注"></el-input>
      </el-form-item>

      <el-form-item size="large" class="next">
        <el-button type="primary" @click="onSubmit">提交申请</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
let self;
import LoginHeader from "./loginHeader";
export default {
  name: "Supplier",
  data() {
    return {
      limit: [],
      supplierForm: {
        sjh: "",
        ghlx: "",
        gsmc: "",
        yyzzh: "",
        sqr: "",
        xxdz: "",
        bz: "",
        jycp: "",
        yyzs: "",
        yyzsFiles: [],
        sqzs: "",
        sqzsFiles: []
      },
      rules: {
        gsmc: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
        yyzzh: [
          { required: true, message: "请输入公司代号", trigger: "change" }
        ],
        ghlx: [{ required: true, message: "请选择供货类型", trigger: "blur" }],
        sqr: [{ required: true, message: "请输入申请人", trigger: "blur" }],
        sjh: [{ required: true, message: "请输入手机号", trigger: "blur" }],

        xxdz: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
        jycp: [{ required: true, message: "请输入经营产品", trigger: "blur" }]
      },
      fileList: [],
      listFile: [],
      userId: "",
      yyzsId: "",
      sqzsId: "",
      yyzsFiles: [],
      sqzsFiles: [],
      imageUrl1: [],
      imageUrl: [],
      pHone: "",
      Code: "",
      Key: "",
      goodType: [],
      uploadurl1: "",
      uploadurl2: ""
    };
  },
  mounted() {
    self = this;
    self.supplierForm.sjh = localStorage.getItem("loginSjh");
    self.Code = localStorage.getItem("code");
    self.Key = localStorage.getItem("key");
    self.getId();
    self.getGoodType();
  },
  methods: {
    getGoodType() {
      self.$axios
        .get(self.url + "/api/BaseData/GetGoodsType")
        .then(res => {
          self.goodType = res.data.Value.Data;
        })
        .catch(err => {
          console.log(err);
        });

      var arr = localStorage.getItem("supplierGhlx").split(",");
      self.limit = arr;
    },
    getId() {
      self.$axios
        .get(self.url + "/api/User/GetSupplier")
        .then(res => {
          self.userId = localStorage.getItem("loginId");
          self.yyzsId = res.data.data.yyzs;
          self.sqzsId = res.data.data.sqzs;
          self.uploadurl1 =
            self.uploadurl +
            "/api/FildLoad/UpLoadFildAndZoom?userId=" +
            self.userId +
            "&relationKey=" +
            self.yyzsId;
          self.uploadurl2 =
            self.uploadurl +
            "/api/FildLoad/UpLoadFildAndZoom?userId=" +
            self.userId +
            "&relationKey=" +
            self.sqzsId;
        })
        .catch(err => {});
    },
    onUploadSuccess1(response, file, fileList) {
      self.yyzsFiles.push(response.filds[0]);
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

      self.yyzsFiles.forEach(item => {
        if (item.fildName == file.name) {
          ress = true;
        }
        if (ress) {
          self.yyzsFiles = self.yyzsFiles.filter(function(element, index) {
            return element["fildName"] != file.name;
          });
        }
      });

      return ress;
    },

    onUploadSuccess2(response, file, fileList) {
      self.sqzsFiles.push(response.filds[0]);
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
        self.$refs.uploadpicture1.$data.uploadFiles.length !=
          self.yyzsFiles.length &&
        self.$refs.uploadpicture2.$data.uploadFiles.length !=
          self.sqzsFiles.length
      ) {
        self.$message({
          message: "请等待图片上传完成",
          type: "warning"
        });
      } else {
        self.$refs["supplierForm"].validate(valid => {
          if (valid) {
            self.supplierForm.kzuseroid = self.userId;
            self.supplierForm.yyzs = self.yyzsId;
            self.supplierForm.yyzsFiles = self.yyzsFiles;
            self.supplierForm.sqzs = self.sqzsId;
            self.supplierForm.sqzsFiles = self.sqzsFiles;

            var token = localStorage.getItem("loginToken");
            self.$axios.defaults.headers.common["Authorization"] =
              "Bearer " + token;

            self.$axios
              .post(self.url + "/api/User/ExamineUser", self.supplierForm, {
                headers: {
                  "Content-Type": "application/json-patch+json"
                }
              })
              .then(res => {
                self.$message({
                  message: "信息完善成功",
                  type: "success"
                });
                self.$router.push("me");
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
      }
    },
    chooseItem(value) {
      this.supplierForm.ghlx = value.join(",");
      this.supplierForm.jycp = value.join(",");
    }
  }
};
</script>

<style>
.supplier .el-form-item__label {
  font-size: 2.5vw;
}

.supplier .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.supplier .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.supplier .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

.supplier .avatar {
  width: 50px;
  height: 50px;
  display: block;
}

.supplier .el-form-item {
  margin-bottom: 10px;
}

.supplier .next .el-form-item__content {
  margin-left: 5% !important;
}
</style>
<style scoped>
.supplier {
  width: 100%;
  height: 100%;
}

.supplier .el-form {
  margin-top: 7%;
  padding-right: 5%;
}

.supplier .template {
  color: #0068d8;
}

.supplier button.el-button.el-button--primary {
  width: 100%;
}
.img {
  position: relative;
  top: 20px;
  left: 18px;
}
.supplier .el-select {
  width: 100%;
}
</style>