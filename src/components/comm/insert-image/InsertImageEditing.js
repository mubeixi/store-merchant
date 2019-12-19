/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontsize/fontsizeediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import InsertImageCommand from './InsertImageCommand';

import {INSERT_IMAGE} from './InsertImageUi';

/**
 * The font size editing feature.
 *
 * It introduces the {@link module:font/fontsize/fontsizecommand~FontSizeCommand command} and the `fontSize`
 * attribute in the {@link module:engine/model/model~Model model} which renders in the {@link module:engine/view/view view}
 * as a `<span>` element with either:
 * * a style attribute (`<span style="font-size:12px">...</span>`),
 * * or a class attribute (`<span class="text-small">...</span>`)
 *
 * depending on the {@link module:font/fontsize~FontSizeConfig configuration}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class InsertImageEditing extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'InsertImageEditing';
  }

  /**
   * @inheritDoc
   */
  constructor( editor ) {
    super( editor );

    // Add FontSize command.
    editor.commands.add( INSERT_IMAGE, new InsertImageCommand( editor ) );
  }

  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;

    // Allow fontSize attribute on text nodes.
    // editor.model.schema.extend( '$text', { allowAttributes: FONT_SIZE } );
    // editor.model.schema.setAttributeProperties( FONT_SIZE, {
    //   isFormatting: true,
    //   copyOnEnter: true
    // } );
  }
}
