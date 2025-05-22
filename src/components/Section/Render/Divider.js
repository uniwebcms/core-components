import React from 'react';

const Circle = () => (
    <span
        style={{
            display: 'inline-block',
            width: 5,
            height: 5,
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.68)',
            verticalAlign: 'middle'
        }}></span>
);

export default function ({ dividerType }) {
    let body = null;

    if (dividerType === 'hr') {
        body = (
            <div
                className={`w-[896px] mx-auto flex justify-center mt-6 mb-4 pt-2`}
                contentEditable={false}>
                <hr className={`w-[896px]`}></hr>
            </div>
        );
    } else {
        body = (
            <div
                className={`my-4 py-2 w-[896px] mx-auto max-w-full flex justify-center text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] gap-[1.2em]`}
                contentEditable={false}>
                <Circle />
                <Circle />
                <Circle />
            </div>
        );
    }

    return body;
}
