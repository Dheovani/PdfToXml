import "../styles/password.css";

import { useCallback, useMemo, useState } from "react";
import { GiBroom } from "react-icons/gi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { TranslationKey, useTranslation } from "./Translator";
import Tooltip from "./Tooltip";
import { IconButton } from "@mui/material";
import { MdOutlineInfo } from "react-icons/md";

interface PasswordFieldInterface {
    password: string;
    setPassword: (password: string) => void;
}

const disabledStyle = {
    border: '1px solid black',
    borderRadius: '5px',
    opacity: 0.5
};

const PasswordField = ({ password, setPassword }: PasswordFieldInterface) => {
    const [show, setShow] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const { translate } = useTranslation();

    const clear = useCallback(() => setPassword(""), [setPassword]);

    const onChange = useCallback((value: string) => setPassword(value), [password, setPassword]);

    const disablePasswordField = useCallback(() => {
        setEnabled(!enabled);
        setPassword("");
    }, [enabled, setEnabled, setPassword]);

    const passwordButtons = useMemo(() => (
        <>
            <button className="view-button" onClick={() => setShow(!show)}>
                {show ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
            
            <button className="clear-button" onClick={clear}>
                <GiBroom />
            </button>
        </>
    ), [show, setShow, clear]);

    return (
        <div className="container">
            <input
                id="enabled"
                name="enabled"
                type="checkbox"
                checked={enabled}
                onChange={disablePasswordField} />
                
            <label htmlFor="enabled">{translate(TranslationKey.PASSWORD_LABEL)}</label>

            <Tooltip info={translate(TranslationKey.PASSWORD_TOOLTIP)}>
                <IconButton>
                    <MdOutlineInfo />
                </IconButton>
            </Tooltip>
                
            <div className="password-container">
                <input
                    type={show ? "text" : "password"}
                    value={password}
                    id="password-field"
                    name="password-field"
                    className="password-field"
                    disabled={!enabled}
                    style={enabled ? {} : disabledStyle}
                    placeholder={translate(TranslationKey.PASSWORD_PLACEHOLDER)}
                    onChange={(e) => onChange(e.target.value)} />

                {enabled && passwordButtons}
            </div>
        </div>
    );
};

export default PasswordField;