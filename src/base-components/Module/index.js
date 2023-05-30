/**
 * 业务组件（整合基础控件），用来做动态组件
 */
import TextShow from "./TextShow"; // 文本组件
import FileShow from "./FileShow"; // 文件组件
import TableShow from "./TableShow"; // 表格组件
import FormControl from "./FormControl"; // 表单组件

export default {
  "component-text": TextShow,
  "component-file": FileShow,
  "component-table": TableShow,
  "component-form": FormControl,
};
