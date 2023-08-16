import { camelCase, upperFirst } from "lodash";

const pascalCase = (str) => upperFirst(camelCase(str));

export {
  pascalCase,
};
