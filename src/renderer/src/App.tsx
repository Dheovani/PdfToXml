import { DragEvent, MouseEvent, useCallback, useState } from "react";
import FileUploader from "./components/FileUploader";
import OutputPath from "./components/OutputPath";
import { TranslationKey, useTranslation } from "./components/Translator";

const buttonStyle = {
  backgroundColor: 'rgb(53, 53, 53)',
  color: 'white',
  display: 'flex',
  padding: '5px 10px',
  border: '1px solid black',
  borderRadius: '5px',
};

function App(): JSX.Element {
  const [path, setPath] = useState("");
  const [files, setFiles] = useState<File[]>([]); // TODO: Implementar geração dos XMLs
  const { translate } = useTranslation();

  const onDropFiles = useCallback((event: DragEvent | MouseEvent, files: File[]) => {
    setFiles(files);

    event.preventDefault();
    event.stopPropagation();
  }, [setFiles]);
  
  return (
    <>
      <FileUploader onDropFiles={onDropFiles} />
      <OutputPath path={path} setPath={setPath} />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button style={buttonStyle}>{translate(TranslationKey.COMPUTE_DATA)}</button>
      </div>
    </>
  );
}

export default App;