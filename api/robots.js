import { robotsHandler } from './lib/seoResponses.js'

export default function robots(request, response) {
  return robotsHandler(request, response)
}
