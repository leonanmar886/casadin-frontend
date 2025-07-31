import React, { useState } from "react";

interface CopyWeddingCodeButtonProps {
    code: string;
    primaryColor?: string;
    textColor?: string;
}

const CopyWeddingCodeButton: React.FC<CopyWeddingCodeButtonProps> = ({ code, primaryColor = '#138263', textColor = '#fff' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handleCopy}
            style={{
                margin: '16px auto 0',
                padding: '8px 20px',
                borderRadius: 8,
                border: `1.5px solid ${primaryColor}`,
                color: primaryColor,
                fontWeight: 600,
                fontSize: 18,
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'inline-block',
            }}
            title="Clique para copiar o código do casamento"
        >
            {copied ? 'Copiado!' : `Código do Casamento: ${code}`}
        </button>
    );
};

export default CopyWeddingCodeButton;
