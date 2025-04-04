import React, { useState } from 'react';
import Render from './index';
import { HiPlus, HiMinus } from 'react-icons/hi';

export default function Details(props) {
    const { content, attrs } = props;

    const [open, setOpen] = useState(attrs.open || false);

    const title = content.find((c) => c.type === 'detailsSummary')?.content || '';
    const description = content.find((c) => c.type === 'detailsContent')?.content || [];

    return (
        <div className="mb-6 bg-text-color/10 border border-text-color/50 rounded-lg p-4">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-2"
            >
                <span className="text-lg font-medium truncate" title={title}>
                    {title}
                </span>
                {open ? (
                    <HiMinus className="w-6 h-6 text-text-color-70 hover:text-text-color-100" />
                ) : (
                    <HiPlus className="w-6 h-6 text-text-color-70 hover:text-text-color-100" />
                )}
            </button>
            {open && (
                <div>
                    <Render content={description} />
                </div>
            )}
        </div>
    );
}
