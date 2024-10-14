import "../styles/uploader.css";
import { Language, translate, TranslationKey } from "./Translator";

interface FileUploaderInterface {
    inputText?: String
}

const FileUploader = ({ inputText = translate(TranslationKey.DRAG_AND_DROP, Language.PT) }: FileUploaderInterface) => (
    <div className="input-container">
        <div className="input-zone">{inputText}</div>
    </div>
);

export default FileUploader;