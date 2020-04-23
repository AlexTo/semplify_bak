import {WEB_CRAWLER_CLOSE_NEW_CRAWL, WEB_CRAWLER_OPEN_NEW_CRAWL} from "../actions";

const initialState = {
  newCrawlOpen: false,
  sidebarOpen: true
}

export const webCrawlerReducer = (state = initialState, action) => {
  switch (action.type) {
    case WEB_CRAWLER_OPEN_NEW_CRAWL:
      return Object.assign({}, state, {newCrawlOpen: true})

    case WEB_CRAWLER_CLOSE_NEW_CRAWL:
      return Object.assign({}, state, {newCrawlOpen: false})
    default:
      return state;

  }
}
