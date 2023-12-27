export const select = (items = {}) => ({
  search: true,
  clearOnSearch: true,
  trackBy: ["req_cat"],
  type: "select",
  delay: 500,
  object: true,
  filterResults: false,
  native: false,
  ...items,
});
