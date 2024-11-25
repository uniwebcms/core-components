import React, { useRef } from 'react';
import { Link, twJoin, website, Asset, FileLogo } from '../../_utils';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { IoDownload } from 'react-icons/io5';

const MapComponent = ({ address }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: website.getMapAPIKey()
    });

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const location = address.geometry.location;

    return (
        <GoogleMap
            mapContainerStyle={{
                width: '100%',
                height: '100%'
            }}
            center={location}
            zoom={15}
            options={{
                streetViewControl: false, // Disable Street View control
                mapTypeControl: false // Disable Map/Satellite switch}
            }}>
            <Marker position={location} />
        </GoogleMap>
    );
};

export default function Card(props) {
    const {
        address,
        caption,
        contact,
        date,
        datetime,
        document,
        href,
        targetId,
        title,
        type,
        hidden,
        info,
        displayMode
    } = props;

    if (hidden) {
        return null;
    }

    switch (type) {
        case 'event':
            return <Event {...{ title, caption, href, address, datetime, contact }}></Event>;
        case 'address':
            return <Address {...{ title, caption, href, address, date, contact }}></Address>;
        case 'document':
            return <Document {...{ title, caption, document, displayMode }}></Document>;
    }
}

const Event = (props) => {
    const { title, caption, href, address, datetime, contact } = props;

    let phoneNumber, extension, cleanedPhoneNum;

    if (contact) {
        [phoneNumber, extension] = contact.split('|').map((part) => part.trim());
        cleanedPhoneNum = phoneNumber.replace(/[^+\d]/g, '');
    }

    const Wrapper = href ? Link : 'div';
    const wrapperProps = href ? { to: href } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={twJoin(
                'block not-prose border rounded-lg p-6 text-center w-full sm:max-w-64 lg:max-w-[312px] shadow-lg bg-bg-color',
                href ? 'hover:shadow-xl' : ''
            )}>
            {title ? <h3 className={'text-xl lg:text-2xl font-semibold mb-2'}>{title}</h3> : null}
            {caption ? (
                <p className={'mt-2 text-base lg:text-lg text-accent-700 font-medium'}>{caption}</p>
            ) : null}
            {datetime ? (
                <p className={'mt-4 text-base lg:text-lg font-medium text-text-color-90'}>
                    {datetime}
                </p>
            ) : null}
            {address ? (
                <p className={'mt-4 text-sm lg:text-base text-text-color-80 !leading-relaxed'}>
                    {address.formatted_address}
                </p>
            ) : null}
            {contact && (
                <span className='block mt-2 text-sm lg:text-base text-text-color-80'>
                    {href ? (
                        <span>{phoneNumber}</span>
                    ) : (
                        <a
                            href={`tel:${cleanedPhoneNum}`}
                            className='text-inherit hover:text-link-color'>
                            {phoneNumber}
                        </a>
                    )}
                    {extension && <span> ext. {extension}</span>}
                </span>
            )}
        </Wrapper>
    );
};

const Address = (props) => {
    const { title, caption, href, address, date, contact } = props;

    let phoneNumber, extension, cleanedPhoneNum;

    if (contact) {
        [phoneNumber, extension] = contact.split('|').map((part) => part.trim());
        cleanedPhoneNum = phoneNumber.replace(/[^+\d]/g, '');
    }

    const Wrapper = href ? Link : 'div';
    const wrapperProps = href ? { to: href } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={twJoin(
                'not-prose flex flex-col md:flex-row border rounded-lg p-6 w-full sm:max-w-[512px] lg:max-w-[39rem] shadow-lg bg-bg-color',
                href ? 'hover:shadow-xl' : ''
            )}>
            <div className='flex-1 text-left md:pr-6 mb-4 md:mb-0'>
                {title ? <h3 className='text-xl lg:text-2xl font-semibold mb-2'>{title}</h3> : null}
                {caption ? (
                    <p className='text-base lg:text-lg text-accent-700 font-medium'>{caption}</p>
                ) : null}
                {date ? (
                    <p className='mt-2 text-base lg:text-lg font-medium text-text-color-90'>
                        {date}
                    </p>
                ) : null}
                {address ? (
                    <p className='mt-2 text-sm lg:text-base text-text-color-80 !leading-relaxed'>
                        {address.formatted_address}
                    </p>
                ) : null}
                {contact && (
                    <span className='block mt-2 text-sm lg:text-base text-text-color-80'>
                        {href ? (
                            <span>{phoneNumber}</span>
                        ) : (
                            <a
                                href={`tel:${cleanedPhoneNum}`}
                                className='text-inherit hover:text-link-color'>
                                {phoneNumber}
                            </a>
                        )}
                        {extension && <span> ext. {extension}</span>}
                    </span>
                )}
            </div>
            <div className='w-full h-48 md:h-auto md:flex-1 md:min-h-[192px] rounded-md overflow-hidden shadow-md'>
                <MapComponent address={address} />
            </div>
        </Wrapper>
    );
};

const Document = (props) => {
    const { caption, document, displayMode } = props;

    const assetRef = useRef(null);

    if (!document) {
        return null;
    }

    const data = document.at('info');

    const displayName = data.name;
    const { url } = data.metadata;

    return (
        <div className='not-prose border rounded-lg w-full sm:max-w-64 lg:max-w-[312px] shadow-lg bg-bg-color overflow-hidden'>
            <div
                className={twJoin(
                    'h-48',
                    displayMode !== 'card_file_content' && 'absolute inset-0 -z-10'
                )}>
                <Asset
                    {...{
                        ref: assetRef,
                        value: url,
                        profile: document
                    }}
                />
            </div>
            {displayMode === 'card_file_logo' && (
                <div className='h-48 w-full flex items-center justify-center'>
                    <FileLogo filename={url} size='24'></FileLogo>
                </div>
            )}
            <div
                className={twJoin(
                    'px-6 py-3 flex items-center justify-between gap-x-2 text-left',
                    displayMode !== 'link' && 'border-t'
                )}>
                <div className='max-w-[calc(100%-40px)]'>
                    <h3
                        className='text-base lg:text-lg font-semibold line-clamp-1'
                        title={displayName}>
                        {displayName}
                    </h3>
                    {caption ? (
                        <p className='text-sm lg:text-base text-accent-700 font-medium'>
                            {caption}
                        </p>
                    ) : null}
                </div>
                <div
                    className='w-8 p-0.5 cursor-pointer group'
                    onClick={() => {
                        if (assetRef.current) {
                            assetRef.current.triggerDownload();
                        }
                    }}>
                    <IoDownload className='w-7 h-7 text-text-color-80 hover:text-link-color' />
                </div>
            </div>
        </div>
    );
};
