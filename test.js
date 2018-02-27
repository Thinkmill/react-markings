// @flow
'use strict';

const md = require('./');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup;

const element = React.createElement('div', null, 'MyComponent');

test('blocks', () => {
  expect(renderToStaticMarkup(md`
    # Heading
    ${element}
  `)).toBe('<div><h1>Heading</h1><div>MyComponent</div></div>');

  expect(renderToStaticMarkup(md`
    > ${element}
  `)).toBe('<div><blockquote><div>MyComponent</div></blockquote></div>');
});

test('regular paragraphs', () => {
  expect(renderToStaticMarkup(md`
    test
  `)).toBe('<div><p>test</p></div>');
});

test('non-blocks', () => {
  expect(() => {
    renderToStaticMarkup(md`
      # Heading ${element}
    `)
  }).toThrow();

  expect(() => {
    renderToStaticMarkup(md`
      Paragraph ${element}
    `)
  }).toThrow();

  expect(() => {
    renderToStaticMarkup(md`
      \`\`\`
      ${element}
      \`\`\`
    `)
  }).toThrow();

  expect(() => {
    renderToStaticMarkup(md`
      _${element}_
    `);
  }).toThrow();

  expect(() => {
    renderToStaticMarkup(md`
      \`${element}\`
    `);
  }).toThrow();
});

test('customize', () => {
  const customMd = md.customize({
    renderers: {
      heading: props => React.createElement('h' + props.level, { className: 'fancy' }, props.children),
      paragraph: props => React.createElement('p', { className: 'blink' }, props.children)
    }
  });

  expect(renderToStaticMarkup(customMd`
    # Heading

    ${element}

    paragraph
  `)).toBe('<div><h1 class="fancy">Heading</h1><div>MyComponent</div><p class="blink">paragraph</p></div>');
});
