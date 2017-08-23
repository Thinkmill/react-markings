// @flow
'use strict';

const md = require('./');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');

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
