/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module code-block/codeblockui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import SplitButtonView from '@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview';
import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
// import imageIcon from './chuan.svg'

export const INSERT_IMAGE = 'insertImage'
/**
 * The code block UI plugin.
 *
 * Introduces the `'codeBlock'` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class InsertImageUi extends Plugin {
  /**
   * @inheritDoc
   */
  init() {

    const editor = this.editor;
    const t = editor.t;
    const componentFactory = editor.ui.componentFactory;

    componentFactory.add( INSERT_IMAGE, locale => {


      const dropdownView = createDropdown( locale );

      const command = editor.commands.get( INSERT_IMAGE );
      const  options = [{model:'source',title:'素材库选择'},{model:'up',title:'直接上传'}]
      addListToDropdown( dropdownView, _prepareListOptions( options, command ) );

      // Create dropdown model.
      dropdownView.buttonView.set( {
        label: '插入图片',
        icon: imageIcon,
        tooltip: true
      } );


      dropdownView.extendTemplate( {
        attributes: {
          class: [
            'ck-font-size-dropdown'
          ]
        }
      } );

      // dropdownView.bind( 'isEnabled' ).to( command );

      // Execute command when an item from the dropdown is selected.
      this.listenTo( dropdownView, 'execute', evt => {
        console.log("选择了")
        editor.execute( evt.source.commandName, { value: evt.source.commandParam } );
        editor.editing.view.focus();
      } );

      return dropdownView;

      // const view = new ButtonView( locale );
      //
      // view.set( {
      //   label: 'Insert image',
      //   icon: imageIcon,
      //   tooltip: true
      // } );
      //
      // // Callback executed once the image is clicked.
      // view.on( 'execute', () => {
      //
      //   // const imageUrl = prompt( 'Image URL' );
      //   //
      //   // editor.model.change( writer => {
      //   //   const imageElement = writer.createElement( 'image', {
      //   //     src: imageUrl
      //   //   } );
      //   //
      //   //   // Insert the image in the current selection location.
      //   //   editor.model.insertContent( imageElement, editor.model.document.selection );
      //   // } );
      // } );
      //
      // return view;
    } );

  }


}

function _prepareListOptions( options, command ) {
  const itemDefinitions = new Collection();

  for ( const option of options ) {
    const def = {
      type: 'button',
      model: new Model( {
        commandName: INSERT_IMAGE,
        commandParam: option.model,
        label: option.title,
        class: 'ck-fontsize-option',
        withText: true
      } )
    };

    if ( option.view && option.view.styles ) {
      def.model.set( 'labelStyle', `font-size:${ option.view.styles[ 'font-size' ] }` );
    }

    if ( option.view && option.view.classes ) {
      def.model.set( 'class', `${ def.model.class } ${ option.view.classes }` );
    }

    // def.model.bind( 'isOn' ).to( command, 'value', value => value === option.model );

    // Add the option to the collection.
    itemDefinitions.add( def );
  }

  return itemDefinitions;
}
