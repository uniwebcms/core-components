import React from 'react';
import Render from './index';

export default function Table(props) {
    const { content } = props;

    return (
        <table className='border-collapse border border-text-color/50'>
            <tbody className='divide-y divide-text-color/70'>
                {content.map((row, i) => {
                    const { content: rowContent } = row;

                    const tabRow = (
                        <tr key={i}>
                            {rowContent.map((cell, j) => {
                                const { content: cellContent, attrs } = cell;

                                return (
                                    <td
                                        key={j}
                                        colSpan={attrs.colspan}
                                        rowSpan={attrs.rowspan}
                                        className='text-left text-text-color border border-text-color/50 px-3 py-0 [&>p]:my-3 [&_*_p]:my-3'>
                                        <Render content={cellContent} />
                                    </td>
                                );
                            })}
                        </tr>
                    );

                    return tabRow;
                })}
            </tbody>
        </table>
    );
}
