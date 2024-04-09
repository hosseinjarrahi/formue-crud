<script setup>
import MCrud from '@/components/MCrud.vue'

const fields = ({ get, useFields: _ }) => {
  return {
    content_headline: _.select({
      isHeader: false,
      title: 'سرفصل',
      items: get({ url: 'http://192.168.190.69:9090/api/_/content/content-headline' }),
      sendKey: 'content_headline_id',
      labelProp: 'title',
      valueProp: 'id',
      rules: 'required',
      ..._.hasRel('content_sub_headline')
    }),
    content_sub_headline: _.select({
      isHeader: false,
      title: 'گروه',
      items: get({
        url: 'http://192.168.190.69:9090/api/_/content/content-sub-headline',
        foreignKey: 'content_headline',
        dataKey: 'content_headline.id'
      }),
      sendKey: 'content_sub_headline_id',
      labelProp: 'title',
      valueProp: 'id',
      rules: 'required'
    })
  }
}

</script>

<template>
  <div class="w-full mx-auto pt-10">
    <client-only>
      <MCrud :fields="fields" route="http://192.168.190.69:9090/api/_/content/content-requirement" />
    </client-only>
  </div>
</template>
