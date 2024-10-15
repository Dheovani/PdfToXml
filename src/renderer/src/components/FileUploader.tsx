import "../styles/uploader.css";

import { useCallback, useEffect, useState } from "react";
import { TranslationKey, useTranslation } from "./Translator";

interface FileUploaderInterface {
    inputText?: string;
    onFilesDrop?: (event: React.DragEvent, files: File[]) => any;
}

const FileUploader = ({ inputText = undefined, onFilesDrop = undefined }: FileUploaderInterface) => {
    const [text, setText] = useState(inputText);
    const [files, setFiles] = useState<File[]>([]); // TODO: Implementar listagem dos arquivos
    const { language, translate } = useTranslation();

    useEffect(() => {
        if (!text)
            setText(translate(TranslationKey.DRAG_AND_DROP));
    }, [text, setText, language, translate]);

    const onClick = useCallback(async (event: React.MouseEvent) => {
        const response = await window.electron.openFileDialog();

        if (response)
            setFiles(response);

        event.preventDefault();
        event.stopPropagation();
    }, [setFiles, onFilesDrop]);

    const handleDrop = useCallback(async (event: React.DragEvent) => {
        let filelist = Object.values(event.dataTransfer.files);
        setFiles(filelist);

        if (onFilesDrop)
            await onFilesDrop(event, filelist);

        event.preventDefault();
        event.stopPropagation();
    }, [setFiles, onFilesDrop]);

    const handleDrag = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    return (
        <div
            className="input-container"
            onClick={onClick}
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
        >
            <div className="input-zone">{text}</div>
        </div>
    );
};

export default FileUploader;