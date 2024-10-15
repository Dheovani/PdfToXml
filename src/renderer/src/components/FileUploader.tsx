import "../styles/uploader.css";

import { useCallback, useEffect, useState, DragEvent, MouseEvent } from "react";
import { TranslationKey, useTranslation } from "./Translator";

interface FileUploaderInterface {
    onFilesDrop?: (event: DragEvent | MouseEvent, files: File[]) => any;
}

const FileUploader = ({ onFilesDrop = undefined }: FileUploaderInterface) => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]); // TODO: Implementar listagem dos arquivos
    const { language, translate } = useTranslation();

    useEffect(() => {
        if (!text.length)
            setText(translate(TranslationKey.DRAG_AND_DROP));
    }, [text, setText, language, translate]);

    const onClick = useCallback(async (event: MouseEvent) => {
        const response = await window.electron.openFileDialog();

        if (response) {
            setFiles(response);

            if (onFilesDrop)
                await onFilesDrop(event, response);
        }

        event.preventDefault();
        event.stopPropagation();
    }, [setFiles, onFilesDrop]);

    const handleDrop = useCallback(async (event: DragEvent) => {
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