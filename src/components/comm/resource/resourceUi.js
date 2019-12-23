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
import { createDropdown, addListToDropdown, addToolbarToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { createImageTypeRegExp } from '@ckeditor/ckeditor5-image/src/imageupload/utils';
// import imageIcon from './chuan.svg'
import ImageUploadCommand from '@ckeditor/ckeditor5-image/src/imageupload/imageuploadcommand';
import ImageUploadEditing from '@ckeditor/ckeditor5-image/src/imageupload/imageuploadediting';
import ImageUploadUI from '@ckeditor/ckeditor5-image/src/imageupload/imageuploadui';
import ImageUploadProgress from '@ckeditor/ckeditor5-image/src/imageupload/imageuploadprogress';

export const PLUGIN_NAME = 'resource'
/**
 * The code block UI plugin.
 *
 * Introduces the `'codeBlock'` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ResourceUi extends Plugin {

  static get requires() {
    return [ ImageUploadEditing,ImageUploadProgress ];
  }

  /**
   * @inheritDoc
   */
  init() {

    const editor = this.editor;
    const t = editor.t;
    const componentFactory = editor.ui.componentFactory;


    componentFactory.add( PLUGIN_NAME, locale => {


      const dropdownView = createDropdown( locale );
      const imageTypes = editor.config.get( 'image.upload.types' );
      const command = editor.commands.get( PLUGIN_NAME );
      //,{model:'up',title:'直接上传'}
      const  options = [{model:{type:'img',limit:9},title:'素材库选择',command:'openResource'}]
      addListToDropdown( dropdownView, _prepareListOptions( options, command ) );

      const imageTypesRegExp = createImageTypeRegExp( imageTypes );

      const view = new FileDialogButtonView( locale );
      view.set( {
        acceptedType: imageTypes.map( type => `image/${ type }` ).join( ',' ),
        allowMultipleFiles: true
      } );

      view.buttonView.set( {
        label: t( '上传图片' ),
        withText: true,
        //icon: imageIcon,
        tooltip: true
      } );

      view.on( 'done', ( evt, files ) => {
        const imagesToUpload = Array.from( files ).filter( file => imageTypesRegExp.test( file.type ) );

        if ( imagesToUpload.length ) {
          editor.execute( 'imageUpload', { file: imagesToUpload } );
        }
      } );

      let buttons = []
      buttons.push( view );
      // buttons.push( view2 );
      addToolbarToDropdown( dropdownView, buttons );
      // addToolbarToDropdown( dropdownView, view2 );


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
        console.log(`触发 command ${evt.source.commandName}参数${evt.source.commandParam}`)
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
        commandName: option.command,
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

    def.model.bind( 'isOn' ).to( command, 'value', value => value === option.model );

    // Add the option to the collection.
    itemDefinitions.add( def );
  }

  return itemDefinitions;
}
