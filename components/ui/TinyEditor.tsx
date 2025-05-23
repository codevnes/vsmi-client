"use client";

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

// Add types for TinyMCE's blob info and progress function
interface BlobInfo {
  blob: () => Blob;
  filename: () => string;
}

type ProgressFn = (percent: number) => void;

export default function TinyEditor({
  value,
  onChange,
  height = 500,
  placeholder = 'Viết nội dung ở đây...'
}: TinyEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey="your-api-key" // You may want to get an API key from TinyMCE
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={value}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
        ],
        toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image | help',
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
            font-size: 16px;
            line-height: 1.6;
            padding: 1rem;
          }
          img { max-width: 100%; height: auto; }
          p { margin: 0 0 1rem 0; }
        `,
        placeholder,
        images_upload_handler: (blobInfo: BlobInfo, progress: ProgressFn) => new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', 'http://localhost:3001/api/uploads');
          
          xhr.upload.onprogress = (e) => {
            progress(e.loaded / e.total * 100);
          };
          
          xhr.onload = () => {
            if (xhr.status === 403) {
              reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
              return;
            }
            
            if (xhr.status < 200 || xhr.status >= 300) {
              reject('HTTP Error: ' + xhr.status);
              return;
            }
            
            const json = JSON.parse(xhr.responseText);
            
            if (!json || typeof json.url != 'string') {
              reject('Invalid JSON: ' + xhr.responseText);
              return;
            }
            
            resolve(json.url);
          };
          
          xhr.onerror = () => {
            reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
          };
          
          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          
          xhr.send(formData);
        }),
        file_picker_types: 'image',
        images_upload_base_path: 'http://localhost:3001',
        relative_urls: false,
        remove_script_host: false
      }}
      onEditorChange={(content) => onChange(content)}
    />
  );
} 