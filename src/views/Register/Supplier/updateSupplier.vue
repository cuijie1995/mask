<template>
  <div class="updateSupplier">
    <div class="top">
      <van-nav-bar title="供应商修改信息" left-text="返回" left-arrow @click-left="$router.go('-1')"></van-nav-bar>
    </div>
    <div class="content">
      <el-form
        ref="supplierForm"
        :model="supplierForm"
        :rules="rules"
        label-width="95px"
        size="mini"
      >
        <el-form-item label="公司名称：" prop="gsmc">
          <el-input v-model="supplierForm.gsmc" placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item label="营业执照号：" prop="yyzzh">
          <el-input v-model="supplierForm.yyzzh" placeholder="营业执照号"></el-input>
        </el-form-item>
        <el-form-item label="上传营业执照：" prop="yyzs">
          <el-row>
            <div
              v-for="(item,index) in supplierForm.yyzsFiles"
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

                <i class="el-icon-delete" @click="deleteImg(index)"></i>
                </div>
              </el-col>
            </div>
          </el-row>
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
          <el-row>
            <div
              v-for="(item,index) in supplierForm.sqzsFiles"
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
                />
                <i class="el-icon-delete" @click="deleteImgs(index)"></i>
                </div>
              </el-col>
            </div>
          </el-row>
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
          <el-input v-model="supplierForm.sjh" placeholder="手机号"></el-input>
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
  </div>
</template>
<script>
let self;
import axios from "axios";

import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";
export default {
  name: "updateSupplier",
  data() {
    return {
      limit: [],
      supplierForm: {},
      supplierID: "",
      rules: {},
      fileList: [],
      listFile: [],
      userId: "",
      yyzsId: "",
      sqzsId: "",
      yyzsFiles: [],
      sqzsFiles: [],
      imageUrl1: [],
      imageUrl: [],
      goodType: [],
      uploadurl1: "",
      uploadurl2: ""
    };
  },
  mounted() {
    self = this;
    self.supplierID = localStorage.getItem("supplierID");
    self.getData();
    // self.getId();
  },
  methods: {
    getData() {
      var token = localStorage.getItem("loginToken");
      self.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      self.$axios.defaults.headers.common["Accept"] = "text/plain";
      self.$axios
        .post(self.url + "/api/User/GetSupplierEdit?id=" + self.supplierID)
        .then(res => {
          self.supplierForm = res.data.data;
          self.userId = localStorage.getItem("loginId");
          self.yyzsId = self.supplierForm.yyzs;
          self.sqzsId = self.supplierForm.sqzs;
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

          var arr = self.supplierForm.ghlx.split(",");
          self.limit = arr;
        })
        .catch(err => {
          console.log(err);
        });

      self.$axios
        .get(self.url + "/api/BaseData/GetGoodsType")
        .then(res => {
          self.goodType = res.data.Value.Data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    getId() {
      self.userId = localStorage.getItem("loginId");
      self.yyzsId = self.supplierForm.yyzs;
      self.sqzsId = self.supplierForm.sqzs;
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
            self.supplierForm.yyzsFiles = self.yyzsFiles.concat(
              self.supplierForm.yyzsFiles
            );
            self.supplierForm.sqzs = self.sqzsId;
            self.supplierForm.sqzsFiles = self.sqzsFiles.concat(
              self.supplierForm.sqzsFiles
            );

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
                  message: "信息修改成功",
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
      self.supplierForm.ghlx = value.join(",");
      self.supplierForm.jycp = value.join(",");
    },
    deleteImg(index) {
      self.supplierForm.yyzsFiles.splice(index, 1);
    },
    deleteImgs(index) {
      self.supplierForm.sqzsFiles.splice(index, 1);
    }
  }
};
</script>
<style  scoped>
.el-form {
  margin-top: 10%;
  padding-right: 5%;
  padding-left: 5%;
}
button.el-button.el-button--primary.el-button--large {
  width: 100%;
}
.title {
  color: #409eff;
}
img {
  width: 70px;
}
i {
  font-size: 14px;
}
.top {
  position: fixed;
  width: 100%;
  z-index: 10;
  top: 0;
}
.content {
  margin-top: 70px;
}
.item_img {
  position: relative;
  overflow: hidden;
}
.el-icon-delete {
  /* display: none; */
  color: red;
  font-weight: 1000;
  position: absolute;
  left: 40%;
  top: 40%;
  font-size: 15px;
}
</style>>

<style>
.van-popup--top {
  top: 300px;
}
.updateSupplier .next .el-form-item__content {
  margin-left: 0 !important;
}
.updateSupplier label.el-form-item__label {
  font-size: 11px;
}
</style>