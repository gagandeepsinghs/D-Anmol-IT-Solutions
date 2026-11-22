import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server.js'
import { createServer } from 'vite'
import { publicSitePaths } from '../src/data/publicSitePaths.js'

const projectDirectory = fileURLToPath(new URL('../', import.meta.url))
const outputDirectory = resolve(projectDirectory, 'dist')
const appRootPattern = /<div id="root"><\/div>/
const vite = await createServer({
  configFile: resolve(projectDirectory, 'vite.config.js'),
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
  const routes = [...publicSitePaths, '/admin']

  for (const pathname of routes) {
    const filePath = pathname === '/'
      ? resolve(outputDirectory, 'index.html')
      : resolve(outputDirectory, pathname.slice(1), 'index.html')
    const html = await readFile(filePath, 'utf8')
    const markup = renderToString(
      React.createElement(
        StaticRouter,
        { location: pathname },
        React.createElement(App),
      ),
    )
    if (!appRootPattern.test(html)) {
      throw new Error(`The HTML root element is missing for ${pathname}.`)
    }
    await writeFile(filePath, html.replace(appRootPattern, `<div id="root">${markup}</div>`))
  }
} finally {
  await vite.close()
}
