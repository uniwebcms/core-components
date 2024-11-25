import React from 'react';
import { twJoin } from '../_utils';
import Render from './Render';
import { buildArticleBlocks } from './parser';
import styles from './Section.module.scss';

export default function (props) {
    const { block, extra, website } = props;

    const Tag = extra?.as || 'section';
    const noPadding = extra?.noPadding || false;

    const {
        width = 'lg',
        columns = '1',
        vertical_padding: verticalPadding = 'lg'
    } = block.getBlockProperties();

    const { content } = block;

    if (!content || !Object.keys(content).length) return null;

    const parsedContent = buildArticleBlocks(website.parseLinksInArticle(content));

    return (
        <Tag
            className={twJoin(
                verticalPadding === 'lg' ? 'py-12 lg:py-24' : '',
                verticalPadding === 'md' ? 'py-6 lg:py-12' : '',
                verticalPadding === 'sm' ? 'py-3 lg:py-6' : '',
                verticalPadding === 'center' ? 'min-h-screen flex flex-col justify-center' : '',
                noPadding ? 'py-0 lg:py-0' : ''
            )}
        >
            <div className={twJoin('max-w-full relative flex flex-col')}>
                <div
                    className={twJoin(
                        'mx-auto w-full prose prose-base lg:prose-lg px-6 lg:px-8 lg:gap-8 xl:gap-12 2xl:gap-16',
                        width === 'md' && 'max-w-2xl',
                        width === 'lg' && 'max-w-3xl',
                        width === 'xl' && 'max-w-5xl',
                        width === '2xl' && 'max-w-7xl',
                        styles.SectionWrapper,
                        columns == '1' && 'columns-1',
                        columns == '2' && 'columns-1 lg:columns-2',
                        columns == '3' && 'columns-1 lg:columns-2 xl:columns-3'
                    )}
                >
                    <Render {...props} content={parsedContent}></Render>
                </div>
            </div>
        </Tag>
    );
}
