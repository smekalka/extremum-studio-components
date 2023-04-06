import * as React from 'react';
import { FC } from 'react';

interface ISubscriptionsProps {
  vscode: any;
}

function syntaxHighlight(json: string) {
  if (!json) {
    return '';
  } //no JSON from response

  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function(match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
}

const ChangesManager: FC<ISubscriptionsProps> = ({ vscode }) => {
  const { changed, newRows, removedRows } = vscode.getState();
  const newRowsWithoutId = newRows.map(row=>{
      const {id,...args} = row
      return {...args}
  })
  return (
    <pre
      dangerouslySetInnerHTML={{
        __html: syntaxHighlight(
          JSON.stringify({ changed, newRows:newRowsWithoutId, removedRows }, null, 2)
        ),
      }}
    />
  );
};

export default ChangesManager;
