import "../styles/uploader.css";
import { TranslationKey, useTranslation } from "./Translator";

interface FileUploaderInterface {
    inputText?: String
}

const FileUploader = ({ inputText = undefined }: FileUploaderInterface) => {
    const { translate } = useTranslation();

    return (
        <div className="input-container">
            <div className="input-zone">{inputText ?? translate(TranslationKey.DRAG_AND_DROP)}</div>
        </div>
    );
};

export default FileUploader;