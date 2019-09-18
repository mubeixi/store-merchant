import Vue from 'vue';
//const i18n = require('i18n');
import interceptorsConfig from './interceptors';
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Carousel,
  CarouselItem,
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
  Switch,
  TabPane,
  Tabs,
  Tooltip,
  Tree,
  Upload,
  TimePicker,
  Col,
  DatePicker,
  CheckboxGroup,
  Checkbox,
  ColorPicker
} from 'element-ui'

Vue.use(Input);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Loading.directive);
Vue.use(Radio);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(Alert);
Vue.use(FormItem);
Vue.use(Upload);
Vue.use(Select);
Vue.use(Option);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tree);
Vue.use(Tooltip);
Vue.use(Switch);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(TimePicker);
Vue.use(Col);
Vue.use(DatePicker);
Vue.use(CheckboxGroup);
Vue.use(Checkbox)
Vue.use(ColorPicker)


const fun = {
  success : ({msg = '操作成功',title = '成功'})=>Notification({
    title: title,
    message: msg,
    type: 'success'
  }),
  warning : ({msg = '',title = '警告'})=>Notification({
    title: title,
    message: msg,
    type: 'warning'
  }),
  info : ({msg = '',title = '消息'})=>Notification({
    title: title,
    message: msg,
    type: 'info'
  }),
  error : ({msg = '错误',title = '错误'})=>Notification({
    title: title,
    message: msg,
    type: 'error'
  }),

}

import filter from './filter'
console.log(filter)

export default {
  install(){
    //Vue.prototype.$i18n = i18n
    Vue.prototype.$loading = Loading.service;
    Vue.prototype.$notify = Notification;
    Vue.prototype.$message = Message;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$fun = fun;
    Vue.http.interceptors.push(interceptorsConfig);
    filter.map(value => {
      Vue.filter(value.name, value.methods);
    });

  }
}
