import marked from 'marked'
import xss from 'xss'
import hljs from 'highlight.js'

const renderer = new marked.Renderer()

renderer.code = function (code, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const prepared = hljs.highlight(lang, code)
      return `<pre><code class="hljs ${prepared.language}">${
        prepared.value
      }</code></pre>`
    } catch (err) {}
  }

  try {
    const prepared = hljs.highlightAuto(code)
    return `<pre><code class="hljs ${prepared.language}">${
      prepared.value
    }</code></pre>`
  } catch (err) {}

  return `<pre><code>${code}</code></pre>`
}

const renderMarkdown = text => {
  return xss(marked(text, { renderer, mangle: false, gfm: true }), {
    whiteList: {
      ...xss.getDefaultWhiteList(),
      code: ['class'],
      span: ['class'],
      h1: ['id'],
      h2: ['id'],
      h3: ['id'],
      h4: ['id'],
      h5: ['id'],
      h6: ['id']
    }
  })
}

export default renderMarkdown
