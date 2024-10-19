import "../styles/uploader.css";

import { DragEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { TranslationKey, useTranslation } from "./Translator";
import Tooltip from "./Tooltip";

interface FileUploaderInterface {
    files: File[];
    setFiles: (files: File[]) => void;
}

const FileUploader = ({ files, setFiles }: FileUploaderInterface) => {
    const [text, setText] = useState("");
    const { language, translate } = useTranslation();

    useEffect(() => {
        const newTxt = translate(TranslationKey.DRAG_AND_DROP);

        if (!text.length || text != newTxt)
            setText(newTxt);
    }, [text, setText, language, translate]);

    const tooltipInfo = useMemo(
        () => files?.length > 0
            ? <ul>{files.map((file, index) => <li key={index}>{file.name}</li>)}</ul>
            : null,
        [files]
    );

    const onClick = useCallback(async (event: MouseEvent) => {
        const response = await window.electron.openFileDialog();

        if (response)
            setFiles(response);

        event.preventDefault();
        event.stopPropagation();
    }, [setFiles]);

    const handleDrop = useCallback(async (event: DragEvent) => {
        let filelist = Object.values(event.dataTransfer.files);
        setFiles(files.concat(filelist));

        event.preventDefault();
        event.stopPropagation();
    }, [setFiles]);

    const handleDrag = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    return (
        <Tooltip info={tooltipInfo}>
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
        </Tooltip>
    );
};

export default FileUploader;