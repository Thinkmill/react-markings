# react-markings

> Markdown in components, components in markdown

- Allows you to write markdown using [commonmark.js](https://github.com/commonmark/commonmark.js)
- Renders markdown as React elements using [commonmark-react-renderer](https://github.com/rexxars/commonmark-react-renderer)
- Embed React components inside your markdown (in any paragraph position) like this:

```js
import * as React from 'react';
import md from 'react-markings';

function Example() {
  return (
    <pre>
      <code>...</code>
    </pre>
  );
}

export default function ReadMe() {
  return md`
    # react-markings

    > Markdown in components, components in markdown

    - Allows you to write markdown using [commonmark.js](https://github.com/commonmark/commonmark.js)
    - Renders markdown as React elements using [commonmark-react-renderer](https://github.com/rexxars/commonmark-react-renderer)
    - Embed React components inside your markdown (in any paragraph position) like this:

    ${<Example/>}
  `;
}
```

If you want to customize rendering further, you can use `customize` to pass your
own [renderers](https://github.com/rexxars/commonmark-react-renderer#type-renderer-options).

```js
import * as React from 'react';
import md from 'react-markings';

let customMd = md.customize({
  renderers: {
    // customize heading with class
    heading: props => React.createElement('h' + props.level, { className: 'fancy-heading' }, props.children),
  },
});

export default function CustomHeading() {
  return customMd`
    # Fancy Heading
  `;
}
```
