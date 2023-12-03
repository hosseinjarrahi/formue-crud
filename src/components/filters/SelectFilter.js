const fetchLanguages = async (query) => {
  // From: https://www.back4app.com/database/paul-datasets/list-of-all-programming-languages/get-started/javascript/rest-api/fetch?objectClassSlug=dataset

  let where = ''

  if (query) {
    where =
      '&where=' +
      encodeURIComponent(
        JSON.stringify({
          ProgrammingLanguage: {
            $regex: `${query}|${query.toUpperCase()}|${query[0].toUpperCase() + query.slice(1)}`
          }
        })
      )
  }

  const response = await fetch(
    'https://parseapi.back4app.com/classes/All_Programming_Languages?limit=9999&order=ProgrammingLanguage&keys=ProgrammingLanguage' +
      where,
    {
      headers: {
        'X-Parse-Application-Id': 'XpRShKqJcxlqE5EQKs4bmSkozac44osKifZvLXCL', // This is the fake app's application id
        'X-Parse-Master-Key': 'Mr2UIBiCImScFbbCLndBv8qPRUKwBAq27plwXVuv' // This is the fake app's readonly master key
      }
    }
  )

  const data = await response.json() // Here you have the data that you need

  return data.results.map((item) => {
    return { value: item.ProgrammingLanguage, label: item.ProgrammingLanguage }
  })
}

export default (field) => {
  return {
    op: {
      placeholder: 'operator',
      type: 'select',
      items: [
        { value: '=', text: 'equal_to' },
        { value: '!=', text: 'not_equal_to' }
      ],
      'label-prop': 'text',
      'value-prop': 'value',
      columns: 4
    },
    value: {
      type: 'tags',
      placeholder: 'value',
      items: async (query) => {
        return await fetchLanguages(query)
      },
      search: true,
      hideSelected: true,
      closeOnSelect: false,
      columns: 4,
      native: false,
      autocomplete: 'off',
      filterResults: false,
      minChars: 0,
      resolveOnLoad: false,
      infinite: true,
      limit: 100,
      clearOnSearch: true,
      delay: 0,
      onOpen: (select$) => {
        if (select$.noOptions) {
          select$.resolveOptions()
        }
      }
    }
  }
}
