import React, { useEffect } from 'react';
import Prism from 'prismjs';

import 'prismjs/themes/prism.min.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-yaml';

export default function Code(props) {
    const { language, content } = props;

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <pre>
            <code className={`language-${language}`}>{content}</code>
        </pre>
    );
}
