<template>
  <div class="purchaser_header">
    <div class="top">
      <van-nav-bar title="修改密码" left-text="返回" left-arrow @click-left="goLogin()" />
    </div>
    <el-form
      ref="changePWdForm"
      :model="changePWdForm"
      :rules="rules"
      label-width="95px"
      size="mini"
    >
      <el-form-item label="手机号码：" prop="phoneNo">
        <el-row>
          <el-col :span="14">
            <el-input v-model="changePWdForm.phoneNo" placeholder="手机号码"></el-input>
          </el-col>
          <el-col :span="6" style="margin-left:6px">
            <el-button v-if="show" style="background:#78AEE8;color:#ffffff" @click="send">发送验证码</el-button>
            <el-button
              v-show="!show"
              class="count"
              style="background:#78AEE8;color:#ffffff"
            >{{count}} s后重新获取</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码：" prop="smsCode">
        <el-input v-model="changePWdForm.smsCode" placeholder="验证码"></el-input>
      </el-form-item>

      <el-form-item label="修改密码" prop="smsCode">
        <el-input v-model="changePWdForm.newPassWord" placeholder="请输入修改后的密码" show-password></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="smsCode">
        <el-input v-model="changePWdForm.confirmPassWord" placeholder="请输入确认修改后的密码" show-password></el-input>
      </el-form-item>

      <el-form-item size="large" class="next">
        <el-button type="primary" @click="next">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Notify from "vant/lib/notify";
import "vant/lib/notify/style";
export default {
  name: "ChangeePwdHeader",
  data() {
    return {
      changePWdForm: {
        phoneNo: "",
        smsCode: "",
        newPassWord: "",
        confirmPassWord: "",

        checkType: 1
      },
      rules: {
        phoneNo: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        smsCode: [{ required: true, message: "请填写验证码", trigger: "blur" }],
        newPassWord: [
          { required: true, message: "请输入修改后的密码", trigger: "blur" }
        ],
        confirmPassWord: [
          { required: true, message: "请输入确认修改后的密码", trigger: "blur" }
        ]
      },
      show: true,
      count: "",
      timer: null,
      phone: "",
      scode: "",
      key: ""
    };
  },
  methods: {
    send() {
      if (this.changePWdForm.phoneNo) {
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }

        this.$axios
          .get(
            this.url +
              "/api/SmsVerification/GetVerificationCode?phoneNo=" +
              this.changePWdForm.phoneNo
          )
          .then(res => {})
          .catch(err => {});
      } else {
        Notify({ type: "danger", message: "手机号不能为空" });
      }
    },
    next() {
      if (
        this.changePWdForm.newPassWord != this.changePWdForm.confirmPassWord
      ) {
        Notify({ type: "danger", message: "确认密码不一致 " });
        return;
      }
      this.$axios
        .post(this.url + "/api/User/ChangePassWord", this.changePWdForm)
        .then(res => {
          if (res.data.statusCode == 0) {
            Notify({ type: "success", message: res.data.resultMsg });
            let currentUrl = encodeURIComponent(
              "http://www.qqr.world/m/#/login"
            );

            window.location.href =
              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb78fc8385b943fd8&redirect_uri=" +
              currentUrl +
              "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
            // this.$router.push("login");
          }
          if (res.data.statusCode == 9) {
            Notify({ type: "danger", message: res.data.resultMsg });
          }
        })
        .catch(err => {});
    },
    goLogin() {
      let currentUrl = encodeURIComponent("http://www.qqr.world/m/#/login");

      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb78fc8385b943fd8&redirect_uri=" +
        currentUrl +
        "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
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
.count {
  padding: 7px 10px;
}
</style>>
<style>
.purchaser_header .next .el-form-item__content {
  margin-left: 0 !important;
}
</style>
<style>
.van-popup--top {
  top: 300px;
}
</style>
