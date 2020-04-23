export const WEB_CRAWLER_OPEN_NEW_CRAWL = 'WEB_CRAWLER/OPEN_NEW_CRAWL';
export const WEB_CRAWLER_CLOSE_NEW_CRAWL = 'WEB_CRAWLER/CLOSE_NEW_CRAWL';
export const WEB_CRAWLER_OPEN_SIDE_BAR = 'WEB_CRAWLER/OPEN_SIDE_BAR';
export const WEB_CRAWLER_CLOSE_SIDE_BAR = 'WEB_CRAWLER/CLOSE_SIDE_BAR';

export const webCrawlerActions = {
  openNewCrawl,
  closeNewCrawl,
  openSidebar,
  closeSidebar
}

function openNewCrawl() {
  return dispatch => dispatch({
    type: WEB_CRAWLER_OPEN_NEW_CRAWL
  })
}

function closeNewCrawl() {
  return dispatch => dispatch({
    type: WEB_CRAWLER_CLOSE_NEW_CRAWL
  })
}

function openSidebar() {
  return dispatch => dispatch({
    type: WEB_CRAWLER_OPEN_SIDE_BAR
  })
}

function closeSidebar() {
  return dispatch => dispatch({
    type: WEB_CRAWLER_CLOSE_SIDE_BAR
  })
}
