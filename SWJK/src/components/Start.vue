<template>
  <div class="step">
    <el-steps :active="step_active" align-center finish-status="success">
      <el-step title="绑定商户" description="请填写商户信息(二选一)" />
      <el-step title="扫码登录" description="请扫码登录" />
      <el-step title="完成" description="请记住您的uid,方便查询" />
    </el-steps>
  </div>
  <div class="tabs" v-if="step_active == 0">
    0
    <el-tabs v-model="isBase64" type="card">
      <el-tab-pane label="监控信息" name="true">
        {{ isBase64 }}
        <el-text>
          请输入监控信息：
        </el-text>
        <el-input v-model="Base64">
        </el-input>


      </el-tab-pane>
      <el-tab-pane label="商户信息" name="false">
        {{ isBase64 }}
        <el-text>
          请输入对接域名：
        </el-text>
        <el-input v-model="merchant.site">
        </el-input>
        <el-text>
          请输入商户id：
        </el-text>
        <el-input v-model="merchant.pid">
        </el-input>
        <el-text>
          请输入商户密钥：
        </el-text>
        <el-input v-model="merchant.key">
        </el-input>
      </el-tab-pane>
    </el-tabs>

    <br>
    <el-text>
      点击后请等待3秒，二维码生成后，请扫描二维码登录
    </el-text>
    <br>

    <el-button type="primary" @click="btn_click_0">下一步</el-button>

  </div>
  <div class="tabs" v-else-if="step_active == 1">
    <el-text>
      你的 uid 请牢记：{{ uid }}
    </el-text>
    <br>
    <el-text>
      {{ qrCodeStats }}
    </el-text>
    <br>
    <el-text>
      {{ qrCodeValue }}
    </el-text>
    <br>
    <vue-qrcode :value="qrCodeValue" :width="qrCodeWidth" margin="1" errorCorrectionLevel="H"></vue-qrcode>

  </div>
  <div class="tabs" v-else>
    你的 uid 请牢记：{{ uid }}
  </div>
</template>

<script setup lang="ts">


import { ref } from 'vue';
import * as axiosTools from '../axiosTools.ts'

var step_active = ref(0);
var isBase64 = ref('true');
var merchant = ref({
  site: '',
  pid: '',
  key: ''
}) //商户信息
var Base64 = ref(''); //监控信息
var Base64Text = ''; //监控信息文本
var qrCodeValue = ref('http://www.baidu.com'); //二维码内容
var qrCodeWidth = window.innerWidth * 0.35; //二维码宽度
var qrCodeStats = ref('等待二维码生成'); //二维码状态
var uid = ref(''); //uid

function btn_click_0() {
  console.log(step_active.value);
  console.log(Base64.value);

  if (isBase64.value == 'true') {
    Base64Text = Base64.value;
  } else {
    //将merchant的值转换为json字符串，并取base64编码
    var merchantJson = JSON.stringify(merchant.value);
    Base64Text = btoa(merchantJson);
  }
  console.log(Base64Text);
  //获取uid
  secondFunc();

}

async function secondFunc() {
  await axiosTools.url_get_uid(Base64Text).then(result => {
    console.log("app:result:" + result);

    uid.value = result
  })

  console.log('uid:' + uid.value);

  if (uid.value == undefined) {
    console.log('未获取到uid');
    return;
  }
  //延时3秒，等待二维码生成
  console.log("延时3000ms");
  await delay(3000);
  console.log("开始请求二维码");

  //请求二维码
  await axiosTools.url_get_qrCode(uid.value).then(result => {
    console.log("app:result:" + result);

    qrCodeValue.value = result;
  })

  step_active.value = 1;
  //开始检测二维码状态
  //每隔3秒请求一次二维码状态，直到返回值为code为2
  if (qrCodeValue.value == undefined) {
    console.log('未获取到二维码');
    return;
  }
  var timer = setInterval(async function () {
    qrCodeStats.value = '等待二维码生成';
    var code = "0";
    await axiosTools.url_get_qrCode_status(uid.value).then(result => {
      console.log("app:result:" + result);
      code = result;
    })
    switch (code) {
      case "0":
        console.log('未登录');
        qrCodeStats.value = '请扫描二维码登录';
        break;
      case "1":
        console.log('登陆中');
        qrCodeStats.value = '正在登录，请稍候';
        break;
      case "2":
        console.log('已登录');
        qrCodeStats.value = '已登录';
        break;
      default:
        console.log('未知错误，请重试');
        break;
    }
    if (code == "2") {
      qrCodeStats.value = '已登录';
      clearInterval(timer);
      step_active.value = 3;
    }
  }, 3000);
}


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


</script>


<style scoped>
.step {
  width: 80%;
  margin: 0 auto;
}

.tabs {
  width: 50%;
  margin: 10px auto;
}

.el-text {
  text-align: center;
  font-size: 16px;
}
</style>
