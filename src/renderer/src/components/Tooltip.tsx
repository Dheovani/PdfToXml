import "../styles/tooltip.css";

import { Tooltip as MuiTooltip, } from "@mui/material";

interface TooltipInterface {
    info: React.ReactNode;
    children: any;
};

const Tooltip = ({ info, children }: TooltipInterface): JSX.Element => {
    const componentsProps = {
        tooltip: {
            sx: {
                bgcolor: 'rgba(35, 35, 35, 0.95);',
                fontSize: '12px',
                '& .MuiTooltip-arrow': {
                    color: 'rgba(35, 35, 35, 0.95);',
                }
            }
        }
    };

    return (
        <MuiTooltip className="tooltip" title={info} arrow enterDelay={200} leaveDelay={100} slotProps={componentsProps}>
            {children}
        </MuiTooltip>
    );
};

export default Tooltip;