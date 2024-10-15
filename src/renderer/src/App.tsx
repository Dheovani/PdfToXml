import FileUploader from "./components/FileUploader";
import OutputPath from "./components/OutputPath";
import TranslationProvider from "./components/Translator";

function App(): JSX.Element {
  return (
    <TranslationProvider>
      <FileUploader />
      <OutputPath />
    </TranslationProvider>
  );
}

export default App
