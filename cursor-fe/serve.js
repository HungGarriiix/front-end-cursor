import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import serverModule from './dist/server/server.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.PORT || 4173
const server = serverModule

// Helper to serve static files
function serveStaticFile(filePath, res) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const ext = path.extname(filePath)
    const mimeTypes = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject',
    }
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  } catch (err) {
    res.writeHead(404)
    res.end('Not Found')
  }
}

const httpServer = http.createServer(async (req, res) => {
  // Try to serve static files first
  if (req.url.startsWith('/assets/')) {
    // Try dist/client/assets first (client-side assets)
    let filePath = path.join(__dirname, 'dist/client', req.url)
    if (fs.existsSync(filePath)) {
      return serveStaticFile(filePath, res)
    }

    // Try dist/server/assets (server-side assets)
    filePath = path.join(__dirname, 'dist/server', req.url)
    if (fs.existsSync(filePath)) {
      return serveStaticFile(filePath, res)
    }

    // Not found
    res.writeHead(404)
    return res.end('Not Found')
  }

  // Serve other static files from dist/client
  const staticPath = path.join(__dirname, 'dist/client', req.url)
  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    return serveStaticFile(staticPath, res)
  }

  // Default to SSR for everything else
  const url = new URL(req.url, `http://${req.headers.host}`)
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
  })

  try {
    const response = await server.fetch(request)

    // Write status
    res.writeHead(response.status, Object.fromEntries(response.headers))

    // Write body
    if (response.body) {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }

    res.end()
  } catch (error) {
    console.error('Server error:', error)
    res.writeHead(500)
    res.end('Internal Server Error')
  }
})

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`✓ SSR server running at http://0.0.0.0:${port}/`)
})
