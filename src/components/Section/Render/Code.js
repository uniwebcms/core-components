import React, { useEffect } from 'react';
import Prism from 'prismjs';
// import { website } from '@uniwebcms/module-sdk';

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

// const label = {
//     plain: website.localize({
//         en: 'Plain text',
//         fr: 'Texte brut',
//     }),
//     c: 'C',
//     csharp: 'C#',
//     cpp: 'C++',
//     css: 'CSS',
//     html: 'HTML',
//     java: 'Java',
//     javascript: 'JavaScript',
//     json: 'JSON',
//     php: 'PHP',
//     python: 'Python',
//     ruby: 'Ruby',
//     typescript: 'TypeScript',
//     xml: 'XML',
//     yaml: 'YAML',
// };

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
