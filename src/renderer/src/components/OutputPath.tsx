import "../styles/output.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GiBroom } from 'react-icons/gi'
import { MdBrowserUpdated } from "react-icons/md";
import { TranslationKey, useTranslation } from "./Translator";
import Tooltip from "./Tooltip";

interface OutputPathInterface {
    path: string;
    setPath: (path: string) => void;
};

const OutputPath = ({ path, setPath }: OutputPathInterface) => {
    const [history, setHistory] = useState<string[]>([]);
    const { language, translate } = useTranslation();

    const title = useMemo(() => translate(TranslationKey.SELECT_DIRECTORY), [language, translate]);
    const placeholder = useMemo(() => translate(TranslationKey.EXAMPLE_PATH), [language, translate]);

    const callPathSelector = useCallback(async () => {
        const response = await window.electron.openDirDialog();

        if (response)
            setPath(response[0]);
    }, [setPath]);

    const updateHistory = useCallback(async () => {
        const response = await window.electron.getUsedPaths();

        if (response.length)
            setHistory(response.split(';'));
    }, [setHistory]);

    useEffect(() => { updateHistory(); });

    const usedPaths = useMemo(() => history.length == 0 ? null : (
        <div className="history">
            <ul>
                {history.map((path: string, index: number) => (
                    <li key={index} onClick={() => setPath(path)}>{path}</li>
                ))}
            </ul>
        </div>
    ), [history, setPath]);

    return (
        <div className="container">
            <h2>{title}</h2>
        
            <div className="output-container">
                <Tooltip info={usedPaths}>
                    <input
                        type="text"
                        value={path}
                        id="output-path"
                        name="output-path"
                        className="output-path"
                        placeholder={placeholder}
                        onChange={(e) => setPath(e.target.value)} />
                </Tooltip>
                
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