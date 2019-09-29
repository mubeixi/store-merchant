export default {
  activeAttr: {attrData: {}},
  editStatus: true,
  templateEditIndex: 0, // 一般都是0，除非有switchNav那样的划分多个页面的组件出现
  tabIndex: 0, // 二级的index，即具体
  tmplData: [], // 所有页面数据，在setAtter组件的标题中有用（判断是否显示),以及在right组件中有用，显示右侧的工具菜单栏
  // eTitle:''
};
