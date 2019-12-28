/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global window */

/**
 * @module ckfinder/ckfindercommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import CKEditorError from '@ckeditor/ckeditor5-utils/src/ckeditorerror';
import {FUNFinder} from './FUNFinder'

/**
 * The CKFinder command. It is used by the {@link module:ckfinder/ckfinderediting~CKFinderEditing CKFinder editing feature}
 * to open the CKFinder file manager to insert an image or a link to a file into the editor content.
 *
 *		editor.execute( 'ckfinder' );
 *
 * **Note:** This command uses other features to perform tasks:
 * - To insert images the {@link module:image/image/imageinsertcommand~ImageInsertCommand 'imageInsert'} command
 * from the {@link module:image/image~Image Image feature}.
 * - To insert links to files the {@link module:link/linkcommand~LinkCommand 'link'} command
 * from the {@link module:link/link~Link Link feature}.
 *
 * @extends module:core/command~Command
 */
export default class CkedittResourceCommand extends Command {
  /**
   * @inheritDoc
   */
  constructor( editor ) {

    super( editor );

    // Remove default document listener to lower its priority.
    //this.stopListening( this.editor.model.document, 'change' );

    // Lower this command listener priority to be sure that refresh() will be called after link & image refresh.
    //this.listenTo( this.editor.model.document, 'change', () => this.refresh(), { priority: 'low' } );
  }

  /**
   * @inheritDoc
   */
  refresh() {
    const imageCommand = this.editor.commands.get( 'imageInsert' );
    //const linkCommand = this.editor.commands.get( 'link' );

    // The CKFinder command is enabled when one of image or link command is enabled.
    this.isEnabled = imageCommand.isEnabled ; //|| linkCommand.isEnabled;
  }

  /**
   * @inheritDoc
   */
  execute(opt) {

    console.log(opt)
    const editor = this.editor;


    // const model = editor.model;
    // model.change( writer => {
    //   const filesToUpload = Array.isArray( options.file ) ? options.file : [ options.file ];
    //
    //   for ( const file of filesToUpload ) {
    //     uploadImage( writer, model, fileRepository, file );
    //   }
    // } );

    //const openerMethod = 'modal';

    const options = Object.assign({limit:10,type:'img'},opt);


    const callFn = {
      up:(url)=>{
        insertImages( editor, [url] );
        editor.editing.view.focus();
      },
      choose:(urls)=>{
        insertImages( editor, urls );
        editor.editing.view.focus();
      },
      chooseMedia:(urls)=>{
        insertMediaFunc(editor, urls)
        editor.editing.view.focus();
      }
    }

    //console.log(window.CKFinder)
    FUNFinder.open({editor,options,callFn});
  }
}

import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';
import { fun } from '../../../common';

const utilsInsertImageFunc = function( writer, model, attributes = {} ) {
  const imageElement = writer.createElement( 'image', attributes );
  const insertAtSelection = findOptimalInsertionPosition( model.document.selection, model );
  model.insertContent( imageElement,insertAtSelection);
  // Inserting an image might've failed due to schema regulations.
  //就是这个，让无法再次插入了
  if ( imageElement.parent ) {
    writer.setSelection( imageElement, 'on' );
  }



  // // const Paragraph = writer.createElement( 'paragraph', { alignment: 'center' });
  // model.insertContent( Paragraph);
  // console.log(Paragraph)
  //model.insertElement('paragraph');

}

function focusEditor(editor)
{
  // // 获取焦点
  // editor.focus();
  //
  // // 将光标移至最末
  // var range = editor.createRange();
  // range.moveToElementEditEnd(editor.editable());
  //
  // range.select();
  // range.scrollIntoView();
}

function insertImages( editor, urls ) {
  console.log(urls)
  const imageCommand = editor.commands.get( 'imageInsert' );

  // Check if inserting an image is actually possible - it might be possible to only insert a link.
  if ( !imageCommand.isEnabled ) {
    const notification = editor.plugins.get( 'Notification' );
    const t = editor.locale.t;

    notification.showWarning( t( 'Could not insert image at the current position.' ), {
      title: t( 'Inserting image failed' ),
      namespace: 'ckfinder'
    } );

    return;
  }


  //editor.execute( 'imageInsert', { source: urls } );

  const options = { source: urls }
  //自己实现imageInsert的cocommand
  const model = editor.model;
  model.change( writer => {
    const sources = Array.isArray( options.source ) ? options.source : [ options.source ];

    for ( const src of sources ) {
      utilsInsertImageFunc( writer, model, { src } );
    }
  } );

  focusEditor(editor)


}

function insertMediaFunc(editor, urls){


  console.log(urls)
  const mediaCommand = editor.commands.get( 'mediaEmbed' );

  // Check if inserting an image is actually possible - it might be possible to only insert a link.
  if ( !mediaCommand.isEnabled ) {
    const notification = editor.plugins.get( 'Notification' );
    const t = editor.locale.t;

    notification.showWarning( t( 'Could not insert media at the current position.' ), {
      title: t( 'Inserting media failed' ),
      namespace: 'ckfinder'
    } );

    return;
  }

  for ( const src of urls ) {
    editor.execute( 'mediaEmbed', src );
  }

  focusEditor(editor)

}
