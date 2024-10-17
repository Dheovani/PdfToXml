import "../styles/output.css";

import { useCallback, useMemo } from "react";
import { GiBroom } from 'react-icons/gi'
import { MdBrowserUpdated } from "react-icons/md";
import { TranslationKey, useTranslation } from "./Translator";

interface OutputPathInterface {
    path: string;
    setPath: (path: string) => void;
};

const OutputPath = ({ path, setPath }: OutputPathInterface) => {
    const { language, translate } = useTranslation();

    const title = useMemo(() => translate(TranslationKey.SELECT_DIRECTORY), [language, translate]);
    const placeholder = useMemo(() => translate(TranslationKey.EXAMPLE_PATH), [language, translate]);

    const callPathSelector = useCallback(async () => {
        const response = await window.electron.openDirDialog();

        if (response)
            setPath(response[0]);
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

                <button className="clear-button" onClick={() => setPath("")}>
                    <GiBroom />
                </button>
            </div>
        </div>
    );
};

export default OutputPath;