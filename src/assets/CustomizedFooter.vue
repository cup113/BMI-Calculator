<script lang="ts" setup>
import {defineProps} from 'vue';
type Props = {
  remoteUrl: string,
  version: string,
  license: string,
  years: string,
  detailed: string,
};
const props = defineProps<Props>();
console.log("@Version", props.version)
if (props.remoteUrl.endsWith("/"))
  console.error("@RemoteUrlCheck", "no '/' at the end");
</script>

<template lang="pug">
div.customized-footer
  div(v-if="license && license.length > 0") &copy; {{ years }} Jason Li ({{ license }} licensed)
  div(v-else) Copyleft {{ years }} (Author: Jason Li)
  div
    | 版本:&nbsp;
    span {{ version }}
  div(v-if="detailed && detailed.toLowerCase() !== 'false'")
    a(target="_blank" href="https://github.com/cup113") 关于开发者
    a(target="_blank" :href='remoteUrl + "/issues"') 问题报告
    a(target="_blank" :href='remoteUrl') 开源
  div
    a(target="_blank" href="readme.html")
      strong 使用说明
    a(href="copyrights.txt")
      strong 版权声明
    a(href="changelog.html") 更新日志
</template>

<style lang="scss">

.main {
  position: relative;
  min-height: 100vh;
}

$a-bgc: #ffccff;
$a-hover-c: #333333;
$a-active-c: #337733;

.customized-footer {
  display: block;
  width: var(--cf-width, 100%);
  margin-top: 200px;
  border-top: 2px solid gray;
  text-align: center;

  a {
    display: inline-block;
    background-color: $a-bgc;
    color: black;
    text-decoration: none;
    padding: 2px 0.5em;

    &:hover {
      color: $a-hover-c;
    }

    &:active {
      color: $a-active-c;
    }
  }

  a,
  span {
    margin: 0 1px;
  }

  >div {
    padding: 2px 1em;
  }
}
</style>