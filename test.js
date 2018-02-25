// @flow
'use strict';

const { md, withRenderers } = require('./');
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

test('withRenderers', () => {
  const mdWithCustomRenderers = withRenderers({
    heading: props => React.createElement('h' + props.level, { className: 'my-class'}, props.children),
  });

  expect(renderToStaticMarkup(mdWithCustomRenderers`
    # Heading
    ${element}
  `)).toBe('<div><h1 class="my-class">Heading</h1><div>MyComponent</div></div>');
});
