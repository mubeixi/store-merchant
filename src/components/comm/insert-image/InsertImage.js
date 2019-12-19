
// import imageIcon2 from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
// import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';


import InsertImageUi from './InsertImageUi';
import InsertImageEditing from './InsertImageEditing';
/**
 * The InsertImg feature for the editor.
 * 手动上传或者选择素材库中图片，加入到富文本
 */
export default class InsertImage extends Plugin {


  //,
  static get requires() {
    return [ InsertImageUi,InsertImageEditing ];
  }

  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'insertImage';
  }

}
