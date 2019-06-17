export function isBot (ua) {
  return /curl|bot|googlebot|google|facebook|twitter|instagram|baidu|bing|msn|duckduckgo|teoma|slurp|crawler|spider|robot|crawling/i.test(ua)
}
