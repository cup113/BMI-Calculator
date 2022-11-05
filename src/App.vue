<script setup lang="ts">
import { computed, ref } from 'vue';
import { Ref } from 'vue';
import CustomizedFooter from './assets/CustomizedFooter.vue';
import { MARGIN, AGE_KEYS } from './data'
import { BmiMargin } from './data';

console.log("BMI-Calculator");

const enum Sex {
  unselected = 0,
  male = 1,
  female = 2,
};

class BiConfig<DataT> {
  static get_val(ev: Event): string {
    return (ev.target as HTMLInputElement | HTMLSelectElement).value;
  }

  hint: Ref<string>;
  valid: Ref<boolean>;
  private dataRef: Ref<DataT>;
  private val: (ev: Event) => DataT;
  private validator: (data: DataT) => boolean;
  private fail_hint: string;

  constructor(dataRef: Ref<DataT>, val: (ev: Event) => DataT, validator: (data: DataT) => boolean, fail_hint: string) {
    this.dataRef = dataRef;
    this.val = val;
    this.validator = validator;
    this.fail_hint = fail_hint;
    this.valid = ref(validator(dataRef.value));
    this.hint = ref("");
  }

  validate(value: DataT = this.dataRef.value): void {
    const valid = this.validator(value);
    this.valid.value = valid;
    if (valid) {
      this.hint.value = "";
      this.dataRef.value = value;
    } else {
      this.hint.value = this.fail_hint;
    }
  }

  input_change(ev: Event): void {
    this.validate(this.val(ev));
  }
}

const
  COLORS = ["#5522ff", "#00cc00", "#ffcc22", "#ff4444"],
  COLORS_DARK = ["#2200bb", "#008800", "#bb8800", "#bb1111"],
  height = ref(0),
  weight = ref(0),
  sex = ref(Sex.unselected as Sex),
  age = ref(0),
  height_sq = computed(() => height.value * height.value / 10000),
  bmi = computed(() => (weight.value / (height_sq.value))),
  bmi_display = computed(() => bmi.value.toFixed(2)),
  stage_margin = computed(() => {
    var key = age.value;
    for (let k of AGE_KEYS) {
      if (k > age.value)
        break;
      else
        key = k;
    };
    const val = MARGIN.get(key) as [BmiMargin, BmiMargin];
    console.debug("@StageMargin", key, val);
    return val[sex.value as number - 1];
  }),
  bmi_stage = computed(() => {
    if (bmi.value >= stage_margin.value[2]) return "肥胖";
    if (bmi.value >= stage_margin.value[1]) return "超重";
    if (bmi.value > stage_margin.value[0]) return "正常";
    return "偏瘦"
  }),
  margin_weight = computed(() => [
    (stage_margin.value[0] * height_sq.value).toFixed(1),
    (stage_margin.value[1] * height_sq.value).toFixed(1),
    (stage_margin.value[2] * height_sq.value).toFixed(1),
  ] as [string, string, string]),
  progress = computed(() => {
    const ext_margin = [0, stage_margin.value[0], stage_margin.value[1], stage_margin.value[2], 0];
    ext_margin[0] = ext_margin[1] * 2 - ext_margin[2];
    ext_margin[4] = ext_margin[3] * 2 - ext_margin[2];
    console.debug("@ExtendedMargin", ext_margin);
    if (bmi.value <= ext_margin[0])
      return { ratio: 0, color: COLORS_DARK[0] };
    if (bmi.value >= ext_margin[4])
      return { ratio: 1, color: COLORS_DARK[3] };
    for (let i = 1; i < 5; ++i) {
      if (bmi.value < ext_margin[i])
        return {
          ratio: (i - 1 + (bmi.value - ext_margin[i - 1]) / (ext_margin[i] - ext_margin[i - 1])) / 4,
          color: COLORS_DARK[i - 1]
        };
    }
    console.error("@Progress: Unreachable at the end");
    return { ratio: 1, color: "black" };
  }),
  weight_cfg = new BiConfig<number>(
    weight, (ev: Event) => parseFloat(BiConfig.get_val(ev)),
    (data: number) => data >= 5, "体重必须不低于 5kg"
  ),
  height_cfg = new BiConfig<number>(
    height, (ev: Event) => parseFloat(BiConfig.get_val(ev)),
    (data: number) => data >= 80, "身高必须不低于 80cm"
  ),
  sex_cfg = new BiConfig<Sex>(
    sex, (ev: Event) => parseInt(BiConfig.get_val(ev)),
    (data: number) => data === Sex.male || data === Sex.female, "请选择性别"
  ),
  age_cfg = new BiConfig<number>(
    age, (ev: Event) => parseInt(BiConfig.get_val(ev)),
    (data: number) => data >= 7, "年龄必须不小于 7 周岁"
  ),
  info_valid = computed(() => (
    weight_cfg.valid.value && height_cfg.valid.value &&
    sex_cfg.valid.value && age_cfg.valid.value
  )),
  submitted = ref(false),
  calculate = () => {
    weight_cfg.validate();
    height_cfg.validate();
    sex_cfg.validate();
    age_cfg.validate();
    if (info_valid.value)
      submitted.value = true;
  }

</script>

<template lang="pug">
div#basic-info
  h1 个人信息
  form(name="basic-info" @submit.prevent="calculate")
    div.b-item
      span.bi-name
        span 体重
        strong (kg)
      span.bi-input
        input(type="number" min=5 step=0.1 placeholder="体重(kg)"
          @change="weight_cfg.input_change")
      span.bi-hint(v-if="!weight_cfg.valid.value") {{ weight_cfg.hint.value }}
    div.b-item
      span.bi-name 身高(cm)
      span.bi-input
        input(type="number" min=80 step=0.5 placeholder="身高(cm)"
          @change="height_cfg.input_change")
      span.bi-hint(v-if="!height_cfg.valid.value") {{ height_cfg.hint.value }}
    div.b-item
      span.bi-name 性别
      span.bi-input
        select(type="number" title="Your sex" @change="sex_cfg.input_change")
          option(value=0 v-show="false") --
          option(value=1) 男
          option(value=2) 女
      span.bi-hint(v-if="!sex_cfg.valid.value") {{ sex_cfg.hint.value }}
    div.b-item
      span.bi-name 年龄(周岁) [四舍五入/年级数+6/至少为7]
      span.bi-input
        input(type="number" min=7 step=1 placeholder="年龄(周岁)"
          @change="age_cfg.input_change")
      span.bi-hint(v-if="!age_cfg.valid.value") {{ age_cfg.hint.value }}
    div
      button.submit-btn(type="submit") 计算
div#report(v-if="submitted" :style='{"--result-color": progress.color}')
  h1 计算结果
  div#r-progress
    div#rp-bar(:style='{"--ratio": progress.ratio}')
    div.rp-rect(:style='{"--color": COLORS[0]}')
      div 偏瘦
      div BMI&le;{{ stage_margin[0] }}
      div ~ {{ margin_weight[0] }}kg
    div.rp-rect(:style='{"--color": COLORS[1]}')
      div 正常
      div {{ stage_margin[0] }}&lt;BMI&lt;{{ stage_margin[1] }}
      div {{ margin_weight[0] }}kg ~ {{ margin_weight[1] }}kg
    div.rp-rect(:style='{"--color": COLORS[2]}')
      div 超重
      div {{ stage_margin[1] }}&le;BMI&lt;{{ stage_margin[2] }}
      div {{ margin_weight[1] }}kg ~ {{ margin_weight[2] }}kg
    div.rp-rect(:style='{"--color": COLORS[3]}')
      div 肥胖
      div BMI&ge;{{ stage_margin[2] }}
      div {{ margin_weight[2] }}kg ~
  div#r-bmi
    div BMI=
    div {{ bmi_display }}
    div ({{ bmi_stage }})

CustomizedFooter(remote-url="https://github.com/cup113/BMI-Calculator"
version="v4.0.0" license="MIT" years="2022" detailed="true")
</template>

<style src="./assets/normalize.scss">

</style>

<style lang="scss">
@import "./assets/basic.scss";

#basic-info,
#report {
  @include hv-center();
  padding: 1em;
  border: 4px dashed black;
  margin-left: auto;
  margin-right: auto;

  >h1 {
    font-size: 1.5em;
    margin-bottom: 0.5rem;
  }
}

#basic-info {
  font-size: 1.25em;
  width: 20em;
  margin-bottom: 2rem;
}

.b-item {
  display: grid;
  margin: 0.5em 0;
  grid-template-rows: auto;
  grid-template-columns: 16em;
  grid-template-areas: "name" "input" "hint";
  justify-content: start;
  justify-items: start;

  >.bi-name {
    grid-area: name;
    font-size: 0.8em;
  }

  >.bi-input {
    grid-area: input;
    width: 100%;

    >input,
    >select {
      width: 100%;
      font-size: 1em;
    }
  }

  >.bi-hint {
    grid-area: hint;
    color: red;
  }
}

.submit-btn {
  padding: 0 0.5em;
}

#report {
  @include max-center();
  display: grid;
  grid-template-columns: 20em 10em;
  grid-template-areas: "h1 h1" "progress report";
  align-items: center;

  >h1 {
    grid-area: h1;
  }
}

#r-progress {
  grid-area: progress;
  position: relative;
  height: 36em;
}

#rp-bar {
  position: absolute;
  right: 0;
  height: calc(36em * var(--ratio, 0));
  width: 1em;
  opacity: 0.5;
  background-color: var(--result-color);
}

.rp-rect {
  background-color: var(--color);
  color: white;
  line-height: 1.5;
  height: 9em;
  width: calc(100% - 1em);

  >div:nth-child(1) {
    font-size: 3em;
  }

  >div:nth-child(2) {
    font-size: 1.5em;
  }

  >div:nth-child(3) {
    font-size: 1.5em;
  }
}

#r-bmi {
  grid-area: report;
  font-size: 2em;

  >div:nth-child(2) {
    color: var(--result-color);
    font-size: 1.5em;
  }

  >div:nth-child(3) {
    color: var(--result-color);
    font-size: 1.25em;
  }
}

</style>