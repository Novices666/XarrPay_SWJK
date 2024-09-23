<template>
  <div class="tabs">

    <el-text>
      请输入uid：
    </el-text>
    <el-input v-model="uid" />
    <br>
    <el-text>
      登录状态：{{ loginStatus }}
    </el-text>

    <el-button type="primary" @click="btn_check">查询</el-button>
  </div>
</template>

<script setup lang="ts">


import { ref } from 'vue';
import * as axiosTools from '../axiosTools.ts'

var loginStatus = ref('待查询');
var uid = ref(''); //uid

async function btn_check() {
  var code = "0";
  await axiosTools.url_get_qrCode_status(uid.value).then(result => {
    console.log("app:result:" + result);
    code = result;
  })
  switch (code) {
    case "0":
      console.log('未登录');
      loginStatus.value = '请扫描二维码登录';
      break;
    case "1":
      console.log('登陆中');
      loginStatus.value = '正在登录，请稍候';
      break;
    case "2":
      console.log('已登录');
      loginStatus.value = '已登录';
      break;
    default:
      console.log('未知错误，请重试');
      break;
  }

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
