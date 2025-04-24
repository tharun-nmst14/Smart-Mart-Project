import React from 'react';
import { QRCode } from 'qrcode.react'; // Corrected import statement

const QRCodeWrapper = ({ value, size, level }) => {
    return <QRCode value={value} size={size} level={level} />;
};

export default QRCodeWrapper;
