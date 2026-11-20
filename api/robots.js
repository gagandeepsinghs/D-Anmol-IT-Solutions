import { robotsHandler } from '../api-helpers/seoResponses.js'

export default function robots(request, response) {
  return robotsHandler(request, response)
}
