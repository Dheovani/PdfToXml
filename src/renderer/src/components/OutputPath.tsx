import "../styles/output.css";

import { useCallback, useMemo, useState } from "react";
import { MdBrowserUpdated } from "react-icons/md";
import { TranslationKey, useTranslation } from "./Translator";

interface OutputPathInterface {
    defaultOutputPath?: string;
};

const OutputPath = ({ defaultOutputPath = "C:\\PDFtoXML\\Documents"}: OutputPathInterface) => {
    const [path, setPath] = useState(defaultOutputPath);
    const { language, translate } = useTranslation();

    const title = useMemo(() => translate(TranslationKey.SELECT_DIRECTORY), [language, translate]);
    const placeholder = useMemo(() => translate(TranslationKey.EXAMPLE_PATH), [language, translate]);

    const callPathSelector = useCallback(async () => {
        const response = await window.electron.openFileDialog();

        if (response) {
            setPath(response[0]);
        }
    }, [setPath]);

    return (
        <div className="container">
            <h2>{title}</h2>
        
            <div className="output-container">            
                <input
                    type="text"
                    value={path}
                    id="output-path"
                    name="output-path"
                    className="output-path"
                    placeholder={placeholder}
                    onChange={(e) => setPath(e.target.value)} />
                
                <button className="select-button" onClick={() => callPathSelector()}>
                    <MdBrowserUpdated />
                </button>
            </div>
        </div>
    );
};

export default OutputPath;