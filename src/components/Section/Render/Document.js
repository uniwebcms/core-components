import { LuExternalLink, LuDownload } from 'react-icons/lu';
import FileLogo from '../../FileLogo';
import React from 'react';

const downloadFile = (href, filename) => {
    fetch(href + '&download=true')
        .then((res) => res.json())
        .then((res) => {
            // window.location.href = res;
            const link = document.createElement('a');
            link.href = res;
            link.target = '_blank';
            link.download = filename;

            // Trigger a click event on the link to initiate the download.
            link.click();
        })
        .catch((err) => {
            console.warn(err);
        });
};

export default function Document(props) {
    const { title, description, coverImg, info, src, alt = '' } = props;

    const identifier = info?.identifier || '';

    let filename = '';

    let downloadable = false;

    if (identifier) {
        filename = identifier.split('/')?.[1];
        downloadable =
            new uniweb.Profile(`docufolio/profile`, '_template').getAssetInfo(identifier)?.href ||
            '';
    } else if (src) {
        filename = src.split('/').pop();
    }

    let fileType = filename
        ? filename.substring(filename.lastIndexOf('.') + 1, filename.length)
        : '';

    let coverUrl = '';

    if (coverImg?.src) {
        coverUrl = coverImg.src;
    } else if (coverImg?.identifier) {
        coverUrl = new uniweb.Profile(`docufolio/profile`, '_template').getAssetInfo(
            coverImg.identifier
        )?.src;
    }

    const previewMarkup = coverUrl ? (
        <img src={coverUrl} alt={alt || title || ''} className={`w-full h-full object-cover`} />
    ) : (
        <div className={`mr-4 bg-bg-color p-2 rounded shadow-sm flex items-center justify-center`}>
            <FileLogo filename={filename} size="16"></FileLogo>
        </div>
    );

    return (
        <div
            className={`not-prose w-64 bg-bg-color border rounded-lg !shadow-sm transition-shadow cursor-pointer group relative `}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (downloadable) {
                    downloadFile(downloadable, filename);
                } else if (src) {
                    window.open(src, '_blank');
                }
            }}
        >
            <div
                className={`h-40 bg-neutral-100 relative overflow-hidden flex items-center justify-center rounded-t-lg`}
            >
                {previewMarkup}
            </div>
            <div className={`p-4`}>
                <div className={`flex items-start justify-between`}>
                    <div className={`flex-1 min-w-0`}>
                        <h4 className={`text-sm font-semibold text-text-color truncate`}>
                            {title || filename}
                        </h4>
                        {!!description && (
                            <p className={`text-xs text-text-color-50 mt-1 line-clamp-2`}>
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                <div
                    className={`mt-4 flex items-center justify-between pt-3 border-t border-neutral-100`}
                >
                    <div className={`flex items-center gap-2`}>
                        <span className={`text-xs text-text-color-40 uppercase font-semibold`}>
                            {fileType}
                        </span>
                    </div>
                    <div className={`flex gap-2`}>
                        {downloadable && <LuDownload className={`w-4 h-4`} />}
                        {!downloadable && src && <LuExternalLink className={`w-4 h-4`} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
