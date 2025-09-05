// src/Layout/ParaEditor.js
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const ParaEditor = ({ value, onChange }) => {
  const handleEditorChange = (content, editor) => {
    // Count words (TinyMCE has its own wordcount plugin too)
    const words = content
      .replace(/<[^>]+>/g, " ") // strip HTML
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
        plugins: [
          "advlist autolink lists link charmap preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste help wordcount"
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic underline | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default ParaEditor;
