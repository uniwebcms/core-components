import React from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import Render from './Render';
import { buildArticleBlocks } from './parser';
import styles from './Section.module.scss';

export default function (props) {
    const { website, block } = props;
    const { content } = block;

    if (!content || !Object.keys(content).length) return null;

    const parsedContent = buildArticleBlocks(website.parseLinksInArticle(content));

    return (
        <div className='tw-core-component'>
            <div
                className={twJoin(
                    'max-w-5xl mx-auto w-full prose prose-base lg:prose-lg px-6 lg:px-8',
                    styles.SectionWrapper
                )}>
                <Render {...props} content={parsedContent}></Render>
            </div>
        </div>
    );
}
