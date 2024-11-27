<template>
  <section class="width100">
    <QustionaireTemplate ref="questionRef" v-if="type == 1 && show" :content.sync="content" :hideSubmit="hideSubmit" :state="questionState" @submit="submit" :review.sync="review"></QustionaireTemplate>
    <div v-if="type == 2 && show" class="img-auto" v-html="content"></div>
  </section>
</template>

<script setup>
import QustionaireTemplate from './questionaireTemplate.vue';
import { onMounted, ref, inject, toRefs, defineProps, defineEmits, defineExpose, watch } from 'vue';
const _http = inject('http');
const _apiUrl = inject('apiUrl');
const props = defineProps({
  type: Number,
  query: Object,
  hideSubmit: {
    type: Boolean,
    default: false,
  },
  preview: {
    type: Boolean,
    default: false,
  },
  questionnaireRecord: Object,
  planDetailContent: Object,
});
const questionRef = ref();
const { type, query, hideSubmit, preview, questionnaireRecord, planDetailContent } = toRefs(props);
// console.log(planDetailContent, 'nnnnnnnnnnnn', type, 'dddddddddddddddddddddd');
const content = ref('');
const show = ref(false);
const questionState = ref(-1);
// const contentSubstitute = ref('-=');
const review = ref(null);
watch(planDetailContent, (newName, oldName) => {
  // console.log(newName, 'newNamenewName');
  init();
});
onMounted(() => {
  init();
});
const emit = defineEmits(['submit']);
const submit = (v) => {
  emit('submit', v);
};
defineExpose({
  getAnswerContent,
});
const init = () => {
  getData({
    ...{ serialNo: planDetailContent.value.serialNo },
  }).then((res) => {
    // console.log('执行')
    console.log('this:res', res);
    show.value = true;
    if (type.value === 2) {
      //健康宣教
      if (preview.value) {
        content.value = this.HTMLDecode(res.result ? res.result : res.contentHtml);
      } else {
        content.value = res.result ? res.result : res.contentHtml;
      }
    } else {
      if (preview.value) {
        content.value = res.contentHtml;
      } else {
        //用于问卷反填
        if (isJSON(res.result)) {
          review.value = res;
          content.value = JSON.parse(res.result);
          if (res.point) {
            content.value.point = res.point;
          }
          if (res.predictResult) {
            content.value.predictResult = res.predictResult;
          }
          if (questionnaireRecord.value) {
            if (questionnaireRecord.value.questionList) {
              for (var i in content.value.questionList) {
                for (var j in questionnaireRecord.value.questionList) {
                  if (questionnaireRecord.value.questionList[j].label == content.value.questionList[i].label) {
                    content.value.questionList[i].value = questionnaireRecord.value.questionList[j].value;
                    if (content.value.questionList[i].type == 'radio' || content.value.questionList[i].type == 'checkbox') {
                      for (var k in content.value.questionList[i].options) {
                        if (content.value.questionList[i].options[k].label == content.value.questionList[i].value && content.value.questionList[i].options[k].abnormal) {
                          content.value.questionList[i].options[k].abnormal = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          content.value = JSON.stringify(content.value);
        } else {
          // console.log(content, 'aaaaaaaaaaaaaaaaaaaaaaaaa');
        }
      }
      questionState.value = res.state;
    }
  });
  // console.log(content, 'lllllllllllll');
};
function getAnswerContent() {
  return questionRef.value.getAnswerContent();
}
function getData(v) {
  // console.log(v, 'jjjjjjjjjjjjjjjjjjjj');
  if (preview.value) {
    return _http.get(_apiUrl.getFlupPatientPlusPlan, { params: v });
    // return this.$apis.templatequeryTemplateContent(v);
  } else {
    return _http.get(_apiUrl.getTelSaveContent, { params: v });
    // return this.$apis.getTelSaveContent(v);
  }
}
function HTMLDecode(text) {
  var temp = document.createElement('div');
  temp.innerHTML = text;
  var output = temp.innerText || temp.textContent;
  temp = null;
  return output;
}
function isJSON(str) {
  try {
    if (typeof JSON.parse(str) == 'object') {
      return true;
    }
  } catch (e) {}
  return false;
}
</script>
