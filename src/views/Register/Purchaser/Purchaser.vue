<template>
  <div class="purchaser">
    <div class="top">
      <van-nav-bar title="完善信息（采购商）" left-text="返回" left-arrow @click-left="$router.go('-1')" />
    </div>

    <el-form
      ref="purchaserForm"
      :model="purchaserForm"
      :rules="rules"
      label-width="95px"
      size="mini"
    >
      <el-form-item label="公司名称：" prop="gsmc">
        <el-input v-model="purchaserForm.gsmc" placeholder="个人填写姓名"></el-input>
      </el-form-item>
      <el-form-item label="证件号：" prop="yyzzh">
        <el-input v-model="purchaserForm.yyzzh" placeholder="证件号"></el-input>
      </el-form-item>

      <el-form-item label="上传证件正反面：" prop="sqzs">
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

      <el-form-item label="申请人：" prop="sqr">
        <el-input v-model="purchaserForm.sqr" placeholder="申请人"></el-input>
      </el-form-item>

      <el-form-item label="手机号：" prop="sjh">
        <el-input v-model="purchaserForm.sjh" placeholder="手机号" disabled></el-input>
      </el-form-item>

      <el-form-item label="采购产品：" prop="ghlx">
        <el-checkbox-group v-model="limit" @change="chooseItem(limit)">
          <el-checkbox v-for="data in goodType" :key="data.Lm" :label="data.Lm"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="详细地址：" prop="xxdz">
        <el-input v-model="purchaserForm.xxdz" placeholder="详细地址"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="bz">
        <el-input v-model="purchaserForm.bz" placeholder="备注"></el-input>
      </el-form-item>

      <el-form-item size="large" class="next">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
let self;
export default {
  name: "Purchaser",
  data() {
    return {
      limit: [],
      purchaserForm: {
        gsmc: "",
        sjh: "",
        yyzzh: "",
        sqr: "",
        xxdz: "",
        bz: "",
        sqzs: "",
        sqzsFiles: [],
        ghlx: ""
      },
      rules: {
        gsmc: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
        yyzzh: [{ required: true, message: "请输入证件号", trigger: "blur" }],
        sqr: [{ required: true, message: "请输入申请人", trigger: "blur" }],
        sjh: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        xxdz: [{ required: true, message: "请输入详细地址", trigger: "blur" }]
      },
      imageUrl: "",
      imgId: "",
      fileList: [],
      userId: "",
      sqzsId: "",
      sqzsFiles: [],
      imageUrl1: [],
      uploadurl1: "",
      goodType: []
    };
  },
  mounted() {
    self = this;
    self.purchaserForm.sjh = localStorage.getItem("loginSjh");
    self.getId();
    self.getGoodType();
  },
  methods: {
    getId() {
      self.$axios
        .get(self.url + "/api/User/GetPurchaser")
        .then(res => {
          self.userId = localStorage.getItem("loginId");
          self.sqzsId = res.data.data.sqzs;
          self.uploadurl1 =
            self.uploadurl +
            "/api/FildLoad/UpLoadFildAndZoom?userId=" +
            self.userId +
            "&relationKey=" +
            self.sqzsId;
        })
        .catch(err => {
          console.log(err);
        });
    },

    getGoodType() {
      self.$axios
        .get(self.url + "/api/BaseData/GetGoodsType")
        .then(res => {
          self.goodType = res.data.Value.Data;
        })
        .catch(err => {
          console.log(err);
        });

      var arr = localStorage.getItem("purchaserGhlx").split(",");
      self.limit = arr;
    },
    chooseItem(value) {
      this.purchaserForm.ghlx = value.join(",");
    },

    onUploadSuccess1(response, file, fileList) {
      self.sqzsFiles.push(response.filds[0]);
    },
    doUpload1(file, files) {
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
    OnBeforeRemoveUpLoad1(file, fileList) {
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
        self.sqzsFiles.length
      ) {
        self.$message({
          message: "请等待图片上传完成",
          type: "success"
        });
      } else {
        self.$refs["purchaserForm"].validate(valid => {
          if (valid) {
            self.purchaserForm.kzuseroid = self.userId;
            self.purchaserForm.sqzs = self.sqzsId;
            self.purchaserForm.sqzsFiles = self.sqzsFiles;

            var token = localStorage.getItem("loginToken");
            self.$axios.defaults.headers.common["Authorization"] =
              "Bearer " + token;

            self.$axios
              .post(self.url + "/api/User/ExamineUser", self.purchaserForm, {
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
    }
  }
};
</script>
<style>
.purchaser .el-form-item__label {
  font-size: 2.5vw;
}
.purchaser .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.purchaser .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.purchaser .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.purchaser .avatar {
  width: 50px;
  height: 50px;
  display: block;
}
.purchaser .el-form-item {
  margin-bottom: 15px;
}
.purchaser .next .el-form-item__content {
  margin-left: 5% !important;
}
</style>
<style  scoped>
.purchaser {
  width: 100%;
  height: 100%;
}
.purchaser .el-form {
  margin-top: 7%;
  padding-right: 5%;
}
.purchaser .template {
  color: #0068d8;
}
.purchaser button.el-button.el-button--primary {
  width: 100%;
}
</style>