<script setup>
import MCrud from './components/MCrud.vue'

const fields = ({ get, useFields: _ }) => {
  return {
    generalGroup: _.group('اطلاعات عمومی', {
      name: {
        title: 'نام کلاس',
        type: 'text',
        rules: 'required',
        isHeader: true
      },

      ship_mission: _.select({
        title: 'نوع ماموریت',
        items: get({
          url: '/_/track/ship|ship-mission'
        }),
        sendKey: 'ship_mission_id',
        labelProp: 'title',
        valueProp: 'id',
        rules: 'required',
        columns: 10
      }),

      plus_ship_mission: {
        type: 'plus',
        url: '/_/track/ship|ship-mission',
        columns: 2
      },

      country: _.select({
        title: 'کشور',
        items: get({
          url: '/_/map/country'
        }),
        type: 'select',
        labelProp: 'name',
        valueProp: 'id',
        sendKey: 'country_id',
        columns: 12
      }),

      reportable: {
        title: 'شناور عمده',
        text: 'شناور عمده',
        type: 'checkbox',
        columns: 12,
        isHeader: true
      },

      description: {
        title: 'چکیده',
        type: 'textarea',
        rules: 'required',
        isHeader: true
      },

      files: _.multiFile({
        title: 'تصاویر و فیلم ها',
        accept: ['.jpg', '.png', '.gif', '.jpeg', '.mp4']
      })
    }),

    technicalGroup: _.group('فنی', {
      speed: {
        title: 'سرعت',
        type: 'text'
      },
      displacement: {
        title: 'تناژ',
        type: 'text'
      },
      machinary: {
        title: 'نیرو محرکه',
        type: 'text',
        inputType: 'number'
      },
      dimension: {
        title: 'ابعاد',
        type: 'text'
        //todo: add structure
      },
      crew: {
        title: 'خدمه',
        type: 'text'
      }
    }),

    equipmentsGroup: _.group('تجهیزات', {
      missiles: _.multiSelect({
        title: 'موشک‌ها',
        items: get({
          url: '/_/track/equipment|missile'
        }),
        labelProp: 'name',
        valueProp: 'id',
        columns: 12
      }),
      guns: _.multiSelect({
        title: 'توپ‌ها',
        items: get({
          url: '/_/track/equipment|gun'
        }),
        labelProp: 'name',
        valueProp: 'id',
        columns: 12
      }),
      ecms: _.multiSelect({
        title: 'سامانه‌های جنگ الکترونیک',
        items: get({
          url: '/_/track/equipment|ecm'
        }),
        labelProp: 'name',
        valueProp: 'id',
        columns: 12
      }),
      airplanes: _.multiSelect({
        title: 'هواپیماهای بال ثابت',
        items: get({
          url: '/_/track/airplane|airplane'
        }),
        labelProp: 'name',
        valueProp: 'id',
        columns: 12
      }),
      radars: _.multiSelect({
        title: 'رادارها',
        items: get({
          url: '/_/track/radar|radar'
        }),
        labelProp: 'name',
        valueProp: 'id',
        columns: 12
      }),
      ships: _.multiSelect({
        title: 'ناوها',
        items: get({
          url: '/_/track/ship|ship'
        }),
        labelProp: 'hull_number',
        valueProp: 'id',
        columns: 12
      }),
      helicopters: _.multiSelect({
        title: 'بالگردها',
        items: get({
          url: '/_/track/airplane|helicopter'
        }),
        labelProp: 'name',
        valueProp: 'id',
        columns: 12
      })
    })
  }
}

const props = {
  tabs: {
    generalGroup: {
      label: 'اطلاعات فنی',
      elements: ['generalGroup']
    },
    technicalGroup: {
      label: 'اطلاعات فنی',
      elements: ['technicalGroup']
    },
    equipmentsGroup: {
      label: 'تجهیزات',
      elements: ['equipmentsGroup']
    }
  }
}
</script>

<template>
  <div class="w-6/12 mx-auto pt-10">
    <MCrud
      :hiddenActions="[]"
      :fields="fields"
      :structure="props"
      route="http://192.168.190.69:9090/api/_/track/ship|ship-class?_with=shipMission,missiles,guns,ecms,airplanes,radars,ships,helicopters,country"
    />
  </div>
</template>
