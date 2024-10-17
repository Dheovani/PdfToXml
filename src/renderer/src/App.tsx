import "./styles/app.css";
import 'react-toastify/dist/ReactToastify.css';

import { DragEvent, MouseEvent, useCallback, useState } from "react";
import FileUploader from "./components/FileUploader";
import OutputPath from "./components/OutputPath";
import { TranslationKey, useTranslation } from "./components/Translator";
import { ToastContainer, toast } from 'react-toastify';
import PasswordField from "./components/Password";

function App(): JSX.Element {
  const [path, setPath] = useState("");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { translate } = useTranslation();

  const onDropFiles = useCallback((event: DragEvent | MouseEvent, files: File[]) => {
    setFiles(files);

    event.preventDefault();
    event.stopPropagation();
  }, [setFiles]);

  const processData = useCallback(async () => {
    if (path.length == 0) {
      toast(translate(TranslationKey.PROVIDE_OUTPUT_PATH), { type: 'warning' });
      return;
    }

    if (files.length == 0) {
      toast(translate(TranslationKey.LOAD_PDF_FILES), { type: 'warning' });
      return;
    }

    const toBase64 = (buffer: ArrayBuffer) => {
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      
      let binary = '';
      for (let i = 0; i < len; i++)
        binary += String.fromCharCode(bytes[i]);

      return window.btoa(binary);
    };

    const filesToSend = await Promise.all(files.map(async file => ({
      fileName: file.name,
      fileContent: await file.arrayBuffer().then(buffer => toBase64(buffer)),
    })));

    await window.electron.processData(path, password, filesToSend);
  }, [path, files, translate]);

  const openOutputPath = useCallback(async () => {
    await window.electron.openPathDialog(path);
  }, [path]);
  
  return (
    <>
      <ToastContainer />
      <FileUploader onDropFiles={onDropFiles} />
      <PasswordField password={password} setPassword={setPassword} />
      <OutputPath path={path} setPath={setPath} />

      <div className="button-container">
        <button className="data-button" onClick={processData}>{translate(TranslationKey.PROCESS_DATA)}</button>
        {path.length > 0 &&
        <button className="data-button" onClick={openOutputPath}>{translate(TranslationKey.OPEN_DIRECTORY)}</button>}
      </div>
    </>
  );
}

export default App;