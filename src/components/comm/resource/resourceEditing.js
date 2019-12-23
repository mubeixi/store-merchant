/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontsize/fontsizeediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import resourceCommand from './resourceCommand';

import {PLUGIN_NAME} from './resourceUi';
import ImageUploadCommand from '@ckeditor/ckeditor5-image/src/imageupload/imageuploadcommand';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

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
export default class ResourceEditing extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'ResourceEditing';
  }

  /**
   * @inheritDoc
   */
  constructor( editor ) {
    super( editor );

    // Add FontSize command.
    //editor.commands.add( PLUGIN_NAME, new InsertImageCommand( editor ) );
  }

  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;
    const doc = editor.model.document;
    const schema = editor.model.schema;
    const conversion = editor.conversion;
    const fileRepository = editor.plugins.get( FileRepository );

    // Register imageUpload command.
    editor.commands.add( PLUGIN_NAME, new resourceCommand( editor ) );

    // Allow fontSize attribute on text nodes.
    // editor.model.schema.extend( '$text', { allowAttributes: FONT_SIZE } );
    // editor.model.schema.setAttributeProperties( FONT_SIZE, {
    //   isFormatting: true,
    //   copyOnEnter: true
    // } );

    doc.on( 'change', () => {
      const changes = doc.differ.getChanges({ includeChangesInGraveyard: true });

      for (const entry of changes) {
        if (entry.type == 'insert' && entry.name != '$text') {
          const item = entry.position.nodeAfter;
          const isInGraveyard = entry.position.root.rootName == '$graveyard';

          for (const image of getImagesFromChangeItem(editor, item)) {
            // Check if the image element still has upload id.
            const uploadId = image.getAttribute('uploadId');

            if (!uploadId) {
              continue;
            }

            // Check if the image is loaded on this client.
            const loader = fileRepository.loaders.get(uploadId);

            if (!loader) {
              continue;
            }

            if (isInGraveyard) {
              // If the image was inserted to the graveyard - abort the loading process.
              loader.abort();
            } else if (loader.status == 'idle') {
              // If the image was inserted into content and has not been loaded yet, start loading it.
              this._readAndUpload(loader, image);
            }
          }
        }
      }
    })


  }

  /**
   * Reads and uploads an image.
   *
   * The image is read from the disk and as a Base64-encoded string it is set temporarily to
   * `image[src]`. When the image is successfully uploaded, the temporary data is replaced with the target
   * image's URL (the URL to the uploaded image on the server).
   *
   * @protected
   * @param {module:upload/filerepository~FileLoader} loader
   * @param {module:engine/model/element~Element} imageElement
   * @returns {Promise}
   */
  _readAndUpload( loader, imageElement ) {
    const editor = this.editor;
    const model = editor.model;
    const t = editor.locale.t;
    const fileRepository = editor.plugins.get( FileRepository );
    const notification = editor.plugins.get( Notification );

    model.enqueueChange( 'transparent', writer => {
      writer.setAttribute( 'uploadStatus', 'reading', imageElement );
    } );

    return loader.read()
      .then( () => {
        const promise = loader.upload();

        // Force re–paint in Safari. Without it, the image will display with a wrong size.
        // https://github.com/ckeditor/ckeditor5/issues/1975
        /* istanbul ignore next */
        if ( env.isSafari ) {
          const viewFigure = editor.editing.mapper.toViewElement( imageElement );
          const viewImg = viewFigure.getChild( 0 );

          editor.editing.view.once( 'render', () => {
            // Early returns just to be safe. There might be some code ran
            // in between the outer scope and this callback.
            if ( !viewImg.parent ) {
              return;
            }

            const domFigure = editor.editing.view.domConverter.mapViewToDom( viewImg.parent );

            if ( !domFigure ) {
              return;
            }

            const originalDisplay = domFigure.style.display;

            domFigure.style.display = 'none';

            // Make sure this line will never be removed during minification for having "no effect".
            domFigure._ckHack = domFigure.offsetHeight;

            domFigure.style.display = originalDisplay;
          } );
        }

        model.enqueueChange( 'transparent', writer => {
          writer.setAttribute( 'uploadStatus', 'uploading', imageElement );
        } );

        return promise;
      } )
      .then( data => {
        model.enqueueChange( 'transparent', writer => {
          writer.setAttributes( { uploadStatus: 'complete', src: data.default }, imageElement );
          this._parseAndSetSrcsetAttributeOnImage( data, imageElement, writer );
        } );

        clean();
      } )
      .catch( error => {
        // If status is not 'error' nor 'aborted' - throw error because it means that something else went wrong,
        // it might be generic error and it would be real pain to find what is going on.
        if ( loader.status !== 'error' && loader.status !== 'aborted' ) {
          throw error;
        }

        // Might be 'aborted'.
        if ( loader.status == 'error' && error ) {
          notification.showWarning( error, {
            title: t( 'Upload failed' ),
            namespace: 'upload'
          } );
        }

        clean();

        // Permanently remove image from insertion batch.
        model.enqueueChange( 'transparent', writer => {
          writer.remove( imageElement );
        } );
      } );

    function clean() {
      model.enqueueChange( 'transparent', writer => {
        writer.removeAttribute( 'uploadId', imageElement );
        writer.removeAttribute( 'uploadStatus', imageElement );
      } );

      fileRepository.destroyLoader( loader );
    }
  }

  /**
   * Creates the `srcset` attribute based on a given file upload response and sets it as an attribute to a specific image element.
   *
   * @protected
   * @param {Object} data Data object from which `srcset` will be created.
   * @param {module:engine/model/element~Element} image The image element on which the `srcset` attribute will be set.
   * @param {module:engine/model/writer~Writer} writer
   */
  _parseAndSetSrcsetAttributeOnImage( data, image, writer ) {
    // Srcset attribute for responsive images support.
    let maxWidth = 0;

    const srcsetAttribute = Object.keys( data )
    // Filter out keys that are not integers.
      .filter( key => {
        const width = parseInt( key, 10 );

        if ( !isNaN( width ) ) {
          maxWidth = Math.max( maxWidth, width );

          return true;
        }
      } )

      // Convert each key to srcset entry.
      .map( key => `${ data[ key ] } ${ key }w` )

      // Join all entries.
      .join( ', ' );

    if ( srcsetAttribute != '' ) {
      writer.setAttribute( 'srcset', {
        data: srcsetAttribute,
        width: maxWidth
      }, image );
    }
  }



}


// Returns `true` if non-empty `text/html` is included in the data transfer.
//
// @param {module:clipboard/datatransfer~DataTransfer} dataTransfer
// @returns {Boolean}
export function isHtmlIncluded( dataTransfer ) {
  return Array.from( dataTransfer.types ).includes( 'text/html' ) && dataTransfer.getData( 'text/html' ) !== '';
}

function getImagesFromChangeItem( editor, item ) {
  return Array.from( editor.model.createRangeOn( item ) )
    .filter( value => value.item.is( 'image' ) )
    .map( value => value.item );
}


