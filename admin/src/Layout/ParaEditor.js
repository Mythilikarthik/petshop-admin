// src/Layout/ParaEditor.js
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const ParaEditor = ({ value, onChange }) => {
  const handleEditorChange = (content, editor) => {
    const words = content
      .replace(/<[^>]+>/g, " ") 
      .trim()
      .split(/\s+/).filter(Boolean).length;

    onChange(content, words);
  };

  return (
    <Editor
      apiKey="23ful9ihnqzftdyc7aw9m10rc6mlpirlq276z06cml7pgcdj"
      value={value}
      init={{
        height: 300,
        menubar: false,

        plugins:
          "advlist autolink lists link charmap preview anchor " +
          "searchreplace visualblocks code fullscreen " +
          "insertdatetime media table paste help wordcount" +
          "image link media code",

        toolbar:
          "undo redo | formatselect | bold italic underline | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | " +
          "link | removeformat | help |" +
          "image | code",
          images_upload_url: "http://localhost:5000/api/upload",
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default ParaEditor;
