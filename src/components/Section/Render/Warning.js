import React from 'react';
import { HiExclamation, HiInformationCircle, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import styles from '../Section.module.scss';

// 1. The config object now holds the FULL, STATIC class strings.
//    Tailwind's scanner can read and find every one of these.
const ALERT_CONFIG = {
    warning: {
        Icon: HiExclamation,
        bgColor: "bg-[var(--bg-warning,theme('colors.yellow.50'))]",
        borderColor: "border-l-[var(--border-warning,theme('colors.yellow.400'))]",
        wrapperStyle:
            "text-[var(--text-warning,theme('colors.yellow.700'))] [&_svg]:text-[var(--text-warning,theme('colors.yellow.400'))]"
    },
    success: {
        Icon: HiCheckCircle,
        bgColor: "bg-[var(--bg-success,theme('colors.green.50'))]",
        borderColor: "border-l-[var(--border-success,theme('colors.green.400'))]",
        wrapperStyle:
            "text-[var(--text-success,theme('colors.green.700'))] [&_svg]:text-[var(--text-success,theme('colors.green.400'))]"
    },
    danger: {
        Icon: HiXCircle,
        bgColor: "bg-[var(--bg-danger,theme('colors.red.50'))]",
        borderColor: "border-l-[var(--border-danger,theme('colors.red.400'))]",
        wrapperStyle:
            "text-[var(--text-danger,theme('colors.red.700'))] [&_svg]:text-[var(--text-danger,theme('colors.red.400'))]"
    },
    info: {
        Icon: HiInformationCircle,
        bgColor: "bg-[var(--bg-info,theme('colors.blue.50'))]",
        borderColor: "border-l-[var(--border-info,theme('colors.blue.400'))]",
        wrapperStyle:
            "text-[var(--text-info,theme('colors.blue.700'))] [&_svg]:text-[var(--text-info,theme('colors.blue.400'))]"
    }
};

const DEFAULT_CONFIG = ALERT_CONFIG.info;

export default function Alert(props) {
    const {
        attrs: { type },
        content,
        selected
    } = props;

    // 2. Look up the config, or use the default
    const { Icon, bgColor, borderColor, wrapperStyle } = ALERT_CONFIG[type] || DEFAULT_CONFIG;

    return (
        <div selected={selected} className="relative clear-both outline-none z-10 mt-10 mx-auto">
            {/* 3. Apply the static classes directly */}
            <div className={`outline-none border-l-4 p-4 ${bgColor} ${borderColor}`}>
                <div className={`flex items-center ${wrapperStyle}`}>
                    <div className="flex-shrink-0">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="ml-3 flex-1">
                        <div
                            className={`w-full block outline-none border-none text-lg ${styles.Alert} whitespace-pre-line`}
                            dangerouslySetInnerHTML={{ __html: content }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
