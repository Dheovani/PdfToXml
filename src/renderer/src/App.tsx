import { useState } from "react";
import FileUploader from "./components/FileUploader";
import OutputPath from "./components/OutputPath";
import TranslationProvider from "./components/Translator";

function App(): JSX.Element {
  const [path, setPath] = useState("C:\\PDFtoXML\\Documents");
  
  return (
    <TranslationProvider>
      <FileUploader />
      <OutputPath path={path} setPath={setPath} />
    </TranslationProvider>
  );
}

export default App
