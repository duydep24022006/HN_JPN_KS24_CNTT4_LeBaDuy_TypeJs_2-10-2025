import React, { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autosave,
  Essentials,
  Paragraph,
  Autoformat,
  ImageInsertViaUrl,
  ImageBlock,
  ImageToolbar,
  AutoImage,
  BlockQuote,
  Bold,
  CKBox,
  CloudServices,
  Link,
  ImageUpload,
  ImageInsert,
  PictureEditing,
  CKBoxImageEdit,
  Heading,
  ImageCaption,
  ImageInline,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  Indent,
  IndentBlock,
  Italic,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  PasteFromOffice,
  Table,
  TableToolbar,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TextTransformation,
  TodoList,
  Underline,
  Emoji,
  Mention,
  BalloonToolbar,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

const LICENSE_KEY =
  "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjEwMDQ3OTksImp0aSI6IjllNWMzOTE1LWJkOTQtNGIxMS1iYjQ1LTg5YmJhMmZkZWY4ZSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjI0NTg3NDBiIn0.HqBUl_OO_IsYX_wBHBy5BYXaYg-ycNELFHsSmzCMCyQBZVVEazC8QQvLxxaDSHlW7--M3O3sbam7Hiwc7tFF4A";

const CLOUD_SERVICES_TOKEN_URL =
  "https://8cckzd6xkxuk.cke-cs.com/token/dev/e754229de733d694ed74a76b686204e09772224911f39394b0caa370af4d?limit=10";

interface EditorConfigType {
  toolbar?: {
    items?: string[];
    shouldNotGroupWhenFull?: boolean;
  };
  plugins?: any[];
  balloonToolbar?: string[];
  cloudServices?: {
    tokenUrl?: string;
  };
  heading?: {
    options?: Array<{
      model: string;
      view?: string;
      title: string;
      class: string;
    }>;
  };
  image?: {
    toolbar?: string[];
  };
  initialData?: string;
  licenseKey?: string;
  link?: {
    addTargetToExternalLinks?: boolean;
    defaultProtocol?: string;
    decorators?: {
      [key: string]: {
        mode: string;
        label: string;
        attributes: {
          [key: string]: string;
        };
      };
    };
  };
  list?: {
    properties?: {
      styles?: boolean;
      startIndex?: boolean;
      reversed?: boolean;
    };
  };
  mention?: {
    feeds?: Array<{
      marker: string;
      feed: any[];
    }>;
  };
  placeholder?: string;
  table?: {
    contentToolbar?: string[];
  };
  [key: string]: any;
}

type Props = {
  onChangeDescription?: (value: string) => void;
  taskDescription: string | undefined;
};

function InputTask({ onChangeDescription, taskDescription }: Props) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [value, setValue] = useState(taskDescription || "");

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  useEffect(() => {
    if (taskDescription !== undefined && onChangeDescription) {
      onChangeDescription(taskDescription);
    }
  }, [taskDescription]);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return { editorConfig: undefined };
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "emoji",
            "link",
            "insertImage",
            "ckbox",
            "mediaEmbed",
            "insertTable",
            "blockQuote",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Autoformat,
          AutoImage,
          Autosave,
          BalloonToolbar,
          BlockQuote,
          Bold,
          CKBox,
          CKBoxImageEdit,
          CloudServices,
          Emoji,
          Essentials,
          Heading,
          ImageBlock,
          ImageCaption,
          ImageInline,
          ImageInsert,
          ImageInsertViaUrl,
          ImageResize,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          Indent,
          IndentBlock,
          Italic,
          Link,
          LinkImage,
          List,
          ListProperties,
          MediaEmbed,
          Mention,
          Paragraph,
          PasteFromOffice,
          PictureEditing,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableProperties,
          TableToolbar,
          TextTransformation,
          TodoList,
          Underline,
        ],
        balloonToolbar: [
          "bold",
          "italic",
          "|",
          "link",
          "insertImage",
          "|",
          "bulletedList",
          "numberedList",
        ],
        cloudServices: {
          tokenUrl: CLOUD_SERVICES_TOKEN_URL,
        },
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
        image: {
          toolbar: [
            "toggleImageCaption",
            "imageTextAlternative",
            "|",
            "imageStyle:inline",
            "imageStyle:wrapText",
            "imageStyle:breakText",
            "|",
            "resizeImage",
            "|",
            "ckboxImageEdit",
          ],
        },
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true,
          },
        },
        mention: {
          feeds: [
            {
              marker: "@",
              feed: [
                /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
              ],
            },
          ],
        },
        placeholder: "Type or paste your content here!",
        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableProperties",
            "tableCellProperties",
          ],
        },
      } as EditorConfigType,
    };
  }, [isLayoutReady]);

  useEffect(() => {
    if (editorConfig) {
      configUpdateAlert(editorConfig);
    }
  }, [editorConfig]);

  return (
    <div className="flex items-center justify-center  ">
      <style>{`
        .ck-editor__editable {
          min-height: 200px !important;
          max-height: 200px !important;
          height: 200px !important;
        }
        .ck.ck-editor__main {
          height: calc(275px - 75px) !important;
        }
      `}</style>
      <div className="w-full h-full">
        <div ref={editorContainerRef}>
          <div ref={editorRef}>
            {editorConfig && (
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                data={value}
                onChange={(_, editor) => {
                  const data = editor.getData();
                  setValue(data);
                  if (onChangeDescription) {
                    onChangeDescription(data);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function configUpdateAlert(config: EditorConfigType): void {
  if ((configUpdateAlert as any).configUpdateAlertShown) {
    return;
  }

  const isModifiedByUser = (
    currentValue: string | undefined,
    forbiddenValue: string
  ): boolean => {
    if (currentValue === forbiddenValue) {
      return false;
    }

    if (currentValue === undefined) {
      return false;
    }

    return true;
  };

  const valuesToUpdate: string[] = [];

  (configUpdateAlert as any).configUpdateAlertShown = true;

  if (!isModifiedByUser(config.licenseKey, "<YOUR_LICENSE_KEY>")) {
    valuesToUpdate.push("LICENSE_KEY");
  }

  if (
    !isModifiedByUser(
      config.cloudServices?.tokenUrl,
      "<YOUR_CLOUD_SERVICES_TOKEN_URL>"
    )
  ) {
    valuesToUpdate.push("CLOUD_SERVICES_TOKEN_URL");
  }

  if (valuesToUpdate.length) {
    window.alert(
      [
        "Please update the following values in your editor config",
        "to receive full access to Premium Features:",
        "",
        ...valuesToUpdate.map((value) => ` - ${value}`),
      ].join("\n")
    );
  }
}
export default React.memo(InputTask);
