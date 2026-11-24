import { readFile, unlink, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PassThrough } from 'node:stream'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server.js'
import { createServer } from 'vite'
import { publicSitePaths } from '../src/data/publicSitePaths.js'

const projectDirectory = fileURLToPath(new URL('../', import.meta.url))
const outputDirectory = resolve(projectDirectory, 'dist')
const appRootPattern = /<div id="root"><\/div>/

function renderMarkup(element) {
  return new Promise((resolveMarkup, rejectMarkup) => {
    const chunks = []
    const output = new PassThrough()
    let renderError
    let renderStream

    output.on('data', (chunk) => chunks.push(chunk))
    output.on('error', rejectMarkup)
    output.on('end', () => {
      if (renderError) {
        rejectMarkup(renderError)
        return
      }
      resolveMarkup(Buffer.concat(chunks).toString('utf8'))
    })

    renderStream = renderToPipeableStream(element, {
      onAllReady() {
        renderStream.pipe(output)
      },
      onShellError(error) {
        rejectMarkup(error)
      },
      onError(error) {
        renderError = error
      },
    })
  })
}

const vite = await createServer({
  configFile: resolve(projectDirectory, 'vite.config.js'),
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
  const manifestPath = resolve(outputDirectory, '.vite/manifest.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const builtAssets = new Map(
    Object.entries(manifest)
      .filter(([source, entry]) => source.startsWith('src/assets/') && entry.file)
      .map(([source, entry]) => [`/${source}`, `/${entry.file}`]),
  )
  await unlink(manifestPath)
  const routes = [...publicSitePaths, '/admin']

  for (const pathname of routes) {
    const filePath = pathname === '/'
      ? resolve(outputDirectory, 'index.html')
      : resolve(outputDirectory, pathname.slice(1), 'index.html')
    const html = await readFile(filePath, 'utf8')
    const renderedMarkup = await renderMarkup(
      React.createElement(
        StaticRouter,
        { location: pathname },
        React.createElement(App),
      ),
    )
    if (!appRootPattern.test(html)) {
      throw new Error(`The HTML root element is missing for ${pathname}.`)
    }
    if (renderedMarkup.includes('<!--$!-->') || renderedMarkup.includes('Loading…')) {
      throw new Error(`A Suspense fallback was rendered instead of page content for ${pathname}.`)
    }
    if (pathname !== '/admin' && !/<h1\b/.test(renderedMarkup)) {
      throw new Error(`No page heading was rendered for ${pathname}.`)
    }

    const markup = renderedMarkup.replace(/\/src\/assets\/[^"'()\s]+/g, (assetUrl) => {
      let source
      try {
        source = decodeURIComponent(assetUrl).replace(/^\//, '')
      } catch {
        throw new Error(`An invalid asset URL was rendered for ${pathname}: ${assetUrl}`)
      }
      const builtUrl = builtAssets.get(`/${source}`)
      if (!builtUrl) throw new Error(`No production asset was found for ${assetUrl} on ${pathname}.`)
      return builtUrl
    })
    if (markup.includes('/src/assets/')) {
      throw new Error(`An unbundled source asset URL remains for ${pathname}.`)
    }
    await writeFile(filePath, html.replace(appRootPattern, `<div id="root">${markup}</div>`))
  }
} finally {
  await vite.close()
}
