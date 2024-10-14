import "../styles/output.css";

import { useCallback, useState } from "react";
import { MdBrowserUpdated } from "react-icons/md";
import { Language, translate, TranslationKey } from "./Translator";

interface OutputPathInterface {
    defaultOutputPath?: string;
};

const OutputPath = ({ defaultOutputPath = "C:\\PDFtoXML\\Documents"}: OutputPathInterface) => {
    const [path, setPath] = useState(defaultOutputPath);

    const callPathSelector = useCallback(async () => {
        const response = await window.electron.openFileDialog();

        if (response[0]) {
            setPath(response[0]);
        }
    }, [setPath]);

    return (
        <div className="output-container">
            <h2>{translate(TranslationKey.SELECT_DIRECTORY, Language.PT)}</h2>
            
            <input
                id="output-path"
                name="output-path"
                type="text"
                value={path}
                placeholder={translate(TranslationKey.EXAMPLE_PATH, Language.PT)} />
            
            <button className="select-button" onClick={() => callPathSelector()}>
                <MdBrowserUpdated />
            </button>
        </div>
    );
};

export default OutputPath;