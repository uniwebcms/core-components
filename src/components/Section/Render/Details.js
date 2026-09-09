import React, { useState } from 'react';
import Render from './index';
import { HiPlus, HiMinus } from 'react-icons/hi';
import SafeHtml from '../../SafeHtml';

export default function Details(props) {
    const { content, attrs } = props;

    const [open, setOpen] = useState(attrs.open || false);

    const title = content.find((c) => c.type === 'detailsSummary')?.content || '';
    const description = (content.find((c) => c.type === 'detailsContent')?.content || []).reduce(
        (acc, item) => {
            const prev = acc[acc.length - 1];
            if (item.type === 'orderedList' && prev?.type === 'orderedList') {
                prev.content = [...prev.content, ...item.content];
            } else {
                acc.push({ ...item });
            }
            return acc;
        },
        []
    );

    return (
        <div className='my-6 border-y border-text-color/20 py-4 px-2 collapsible'>
            <div
                role='button'
                tabIndex={0}
                aria-expanded={open}
                onClick={(e) => {
                    if (e.target.closest('a')) return;
                    setOpen(!open);
                }}
                onKeyDown={(e) => {
                    if (e.target.closest('a')) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen(!open);
                    }
                }}
                className='w-full flex items-center justify-between gap-2 group text-left focus:outline-none cursor-pointer'>
                <SafeHtml value={title} as='span' />
                {open ? (
                    <HiMinus className='w-6 h-6 text-text-color-50 group-hover:text-text-color-70 flex-shrink-0' />
                ) : (
                    <HiPlus className='w-6 h-6 text-text-color-50 group-hover:text-text-color-70 flex-shrink-0' />
                )}
            </div>
            {open && (
                <div className='[&>p]:text-text-color-70 [&>p]:mb-0'>
                    <Render content={description} />
                </div>
            )}
        </div>
    );
}
