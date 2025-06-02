import React, { useState } from 'react';
import Render from './index';
import { HiPlus, HiMinus } from 'react-icons/hi';

export default function Details(props) {
    const { content, attrs } = props;

    const [open, setOpen] = useState(attrs.open || false);

    const title = content.find((c) => c.type === 'detailsSummary')?.content || '';
    const description = content.find((c) => c.type === 'detailsContent')?.content || [];

    return (
        <div className='my-6 border-y border-text-color/20 py-4 px-2 collapsible'>
            <button
                onClick={() => setOpen(!open)}
                className='w-full flex items-center justify-between gap-2 group focus:outline-none'>
                <span title={title}>{title}</span>
                {open ? (
                    <HiMinus className='w-6 h-6 text-text-color-50 group-hover:text-text-color-70' />
                ) : (
                    <HiPlus className='w-6 h-6 text-text-color-50 group-hover:text-text-color-70' />
                )}
            </button>
            {open && (
                <div className='[&>p]:text-text-color-70 [&>p]:mb-0'>
                    <Render content={description} />
                </div>
            )}
        </div>
    );
}
