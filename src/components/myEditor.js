import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import { PreviewModal } from './previewModal';

const getHtml = editorState =>
  draftToHtml(convertToRaw(editorState.getCurrentContent()));

class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      content: '',
    };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
      content: getHtml(editorState),
    });
  };

  handleTextareaChange = e => {
    console.log(e.target.value);
    const blocksFromHtml = htmlToDraft(e.target.value);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    const editorState = EditorState.createWithContent(contentState);
    this.setState({
      content: e.target.value,
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName='rich-editor demo-wrapper'
          editorClassName='demo-editor'
          onEditorStateChange={this.onEditorStateChange}
          placeholder='The message goes here...'
        />
        <h4>Underlying HTML</h4>
        <div className='html-view'>
          {/* {getHtml(editorState)} */}
          <textarea
            value={this.state.content}
            onChange={this.handleTextareaChange}
            style={{ width: '100%' }}>
            {/* {getHtml(editorState)} */}
          </textarea>
        </div>
        <button
          className='btn btn-success'
          data-toggle='modal'
          data-target='#previewModal'>
          Preview message
        </button>
        <PreviewModal output={getHtml(editorState)} />
      </div>
    );
  }
}

export { MyEditor };
