<template>
  <div class="purchaser_header">
    <div class="top">
      <van-nav-bar title="供应商注册" left-text="返回" left-arrow @click-left="goLogin()" />
    </div>

    <div class="agreement" v-if="agreementShow">
      <p>
        <span class="tip">【审慎阅读】</span> 您在申请注册流程中点击同意前，应当认真阅读以下协议。
        <span class="black">请您务必审慎阅读、充分理解协议中相关条款内容，其中包括但不限于：</span>
      </p>
      <p class="black">1、与您约定免除或限制责任的条款；</p>
      <p class="black">2、与您约定的个人信息收集和使用的条款；</p>
      <p class="black">3、其他以粗体标识的重要条款内容。</p>
      <p>如您对协议有任何疑问，可向平台客服咨询。</p>
      <p>
        <span class="tip">【特别提示】</span>
        当您按照注册页面提示填写信息、阅读并同意协议且完成全部注册程序后，即表示您已充分阅读、理解并接受协议的全部内容。
        <span
          class="black"
        >阅读协议的过程中，如果您不同意相关协议或其中任何条款约定，您应立即停止注册程序。</span>
      </p>
      <a
        class="title"
        href="http://img.qqr.world:8880/Enclosure/全球人AI供应链平台服务协议.docx"
      >《全球人AI供应链平台服务协议》</a>
      <br />
      <a class="title" href="http://img.qqr.world:8880/Enclosure/隐私政策.docx">《隐私政策》</a>
      <div class="argee_footer">
        <el-button type="primary" @click="agree" :disabled="disabledagreement">
          <span v-if="downCount > 0">{{downCount}}s</span>
          同意协议
        </el-button>
      </div>
    </div>
    <el-form
      ref="supplierHeader"
      :model="supplierHeader"
      :rules="rules"
      label-width="95px"
      size="mini"
      v-if="!agreementShow"
    >
      <el-form-item label="手机号码：" prop="phoneNo">
        <el-row>
          <el-col :span="14">
            <el-input v-model="supplierHeader.phoneNo" placeholder="手机号码"></el-input>
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
        <el-input v-model="supplierHeader.smsCode" placeholder="验证码" @change="next"></el-input>
      </el-form-item>

      <el-form-item label="登陆密码：" prop="pwd">
        <el-input v-model="supplierHeader.pwd" placeholder="请输入的密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPassWord">
        <el-input v-model="supplierHeader.confirmPassWord" placeholder="请输入确认密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="供货产品：" prop="ghlx">
        <el-checkbox-group v-model="limit" @change="chooseItem(limit)">
          <el-checkbox v-for="data in goodType" :key="data.Lm" :label="data.Lm"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item size="large" class="next">
        <el-button type="primary" @click="submit">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Notify from "vant/lib/notify";
import "vant/lib/notify/style";
export default {
  name: "supplierHeader",
  data() {
    return {
      limit: [],
      supplierHeader: {
        phoneNo: "",
        smsCode: "",
        // checkType: 1,
        pwd: "",
        confirmPassWord: "",
        ghlx: ""
      },
      rules: {
        phoneNo: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        smsCode: [{ required: true, message: "请填写验证码", trigger: "blur" }],
        pwd: [{ required: true, message: "请填写密码", trigger: "blur" }],
        confirmPassWord: [
          { required: true, message: "请确认密码", trigger: "blur" }
        ],
        ghlx: [{ required: true, message: "请选择供货类型", trigger: "blur" }]
      },
      show: true,
      count: "",
      timer: null,
      phone: "",
      scode: "",
      key: "",
      agreementShow: true,
      downCount: "",
      downTimer: null,
      disabledagreement: true,
      goodType: []
    };
  },
  mounted() {
    this.countDown();
    this.getGoodType();
  },
  methods: {
    countDown() {
      const TIME_COUNT = 10;
      if (!this.downTimer) {
        this.downCount = TIME_COUNT;
        this.downTimer = setInterval(() => {
          if (this.downCount > 0 && this.downCount <= TIME_COUNT) {
            this.downCount--;
            if (this.downCount == 0) {
              this.disabledagreement = false;
            }
          } else {
            clearInterval(this.downTimer);
            this.downTimer = null;
          }
        }, 1000);
      }
    },

    agree() {
      this.agreementShow = false;
    },
    send() {
      // debugger;
      if (this.supplierHeader.phoneNo) {
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
              if (this.count == 0) {
              }
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
              this.supplierHeader.phoneNo
          )
          .then(res => {})
          .catch(err => {});
      } else {
        Notify({ type: "danger", message: "手机号不能为空" });
      }
    },
    next() {
      this.$axios
        .post(this.url + "/api/SmsVerification/CheckCode", this.supplierHeader)
        .then(res => {
          if (res.data.statusCode == 0) {
            localStorage.setItem("phone", this.supplierHeader.phoneNo);
            localStorage.setItem("code", this.supplierHeader.smsCode);
            localStorage.setItem("key", res.data.data.secretkey);
            // this.$router.push("supplier");
          }
          if (res.data.statusCode == 9) {
            Notify({ type: "danger", message: res.data.resultMsg });
          }
        })
        .catch(err => {});
    },
    getGoodType() {
      this.$axios
        .get(this.url + "/api/BaseData/GetGoodsType")
        .then(res => {
          this.goodType = res.data.Value.Data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    chooseItem(value) {
      this.supplierHeader.ghlx = value.join(",");
    },
    submit() {
      if (this.supplierHeader.pwd != this.supplierHeader.confirmPassWord) {
        Notify({ type: "danger", message: "密码不一致" });
        return;
      }
      this.$refs["supplierHeader"].validate(valid => {
        if (valid) {
          this.$axios
            .post(this.url + "/api/User/RegisterUser", {
              sjh: this.supplierHeader.phoneNo,
              lx: 1,
              pwd: this.supplierHeader.pwd,
              smsCode: this.supplierHeader.smsCode,
              ghlx: this.supplierHeader.ghlx
            })
            .then(res => {
              if (res.data.statusCode == 0) {
                localStorage.setItem("supplierGhlx", this.supplierHeader.ghlx);

                Notify({ type: "success", message: res.data.resultMsg });
                let currentUrl = encodeURIComponent(
                  "http://www.qqr.world/m/#/login"
                );

                window.location.href =
                  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb78fc8385b943fd8&redirect_uri=" +
                  currentUrl +
                  "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
                // this.$router.push("/login");
              }
              if (res.data.statusCode == 9) {
                Notify({ type: "danger", message: res.data.resultMsg });
              }
            })
            .catch(err => {});
        }
      });
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
.black {
  text-decoration: underline;
  font-weight: 800;
}
.agreement {
  margin: 15px;
  font-size: 12px;
}
.agreement span {
  height: 30px;
  line-height: 30px;
}
.title {
  color: #409eff;
}
.argee_footer {
  text-align: center;
}
.argee_footer button.is-disabled {
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
