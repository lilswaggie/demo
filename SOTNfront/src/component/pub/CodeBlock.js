import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightEighties } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import mermaid from 'mermaid';

// 初始化mermaid
mermaid.initialize({
  startOnLoad: false,
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true
  }
});

class CodeBlock extends React.PureComponent {
  /**
   * 随机生成mermaid生成svg用的id.
   */
  randomId = () => {
    return 'graph-' + new Date().getTime() + '';
  };

  render() {
    const { value, language } = this.props;

    if (value.match(/^sequenceDiagram/) || value.match(/^graph/)) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: mermaid.render(this.randomId(), value)
          }}
        />
      );
    }

    return (
      <SyntaxHighlighter language={language} style={tomorrowNightEighties}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default CodeBlock;
