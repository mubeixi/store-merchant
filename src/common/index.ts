import Vue from 'vue';
import interceptorsConfig from './interceptors';
import './filter';

// const i18n = require('i18n');
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Carousel,
  CarouselItem,
  Checkbox,
  CheckboxGroup,
  Col,
  ColorPicker,
  DatePicker,
  Dialog,
  Form,
  FormItem,
  Input,
  Loading,
  Message,
  MessageBox,
  Notification,
  Option,
  Pagination,
  Radio,
  RadioButton,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Table,
  TableColumn,
  TabPane,
  Tabs,
  TimePicker,
  Tooltip,
  Tree,
  Upload,
  Autocomplete,
  Progress,
  InfiniteScroll,
  InputNumber,
  Timeline,
  TimelineItem,
  Row,
  Tag,
  Image,
  Popover,
  DropdownMenu,
  DropdownItem,
  Dropdown
} from 'element-ui';

Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Popover)
Vue.use(Tag)
Vue.use(Row)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(InputNumber)
Vue.use(InfiniteScroll)
Vue.use(Progress)
Vue.use(Autocomplete)
Vue.use(Input)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Loading.directive)
Vue.use(Radio)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(Alert)
Vue.use(FormItem)
Vue.use(Upload)
Vue.use(Select)
Vue.use(Option)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tree)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(TimePicker)
Vue.use(Col)
Vue.use(DatePicker)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(ColorPicker)
Vue.use(Slider)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Image)

export const fun = {
  success: ({msg = '操作成功', title = '成功'}) => Notification({
    title,
    message: msg,
    type: 'success',
  }),
  warning: ({msg = '', title = '警告'}) => Notification({
    title,
    message: msg,
    type: 'warning',
  }),
  info: ({msg = '', title = '提示'}) => Notification({
    title,
    message: msg,
    type: 'info',
  }),
  error: ({msg = '错误', title = '错误'}) => Notification({
    title,
    message: msg,
    type: 'error',
  }),
  // Loading:({text = 'loading',fullscreen = false,lock = true,spinner = 'el-icon-loading',mask = false}) =>{
  //   window.funLoading = Loading.service({text,fullscreen,lock,spinner,background:mask?'rgba(0, 0, 0, 0.1)':null})
  //
  // },
  // close:()=>{window.funLoading.close()}

};
// console.log(filter)

require('./directive');

export default {
  install() {
    // Vue.prototype.$i18n = i18n
    Vue.prototype.$loading = Loading.service;
    Vue.prototype.$notify = Notification;
    Vue.prototype.$message = Message;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$fun = fun;
    Vue.http.interceptors.push(interceptorsConfig);
    // filter.map((value) => {
    //   Vue.filter(value.name, value.methods);
    // });
  },
};
