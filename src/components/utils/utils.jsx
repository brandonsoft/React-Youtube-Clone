import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import moment from 'moment'
import { request } from './api'

// heights and widths of components
export const MOBILE_VIEW_SCROLL_THRESHOLD = 48
export const NOTIFICATION_MENU_TOP_HEIGHT = 48
export const MOBILE_VIEW_HEADER_HEIGHT = 48
export const DESKTOP_VIEW_HEADER_HEIGHT = 56
export const MINI_SIDEBAR_WIDTH = 72
export const FULL_SIDEBAR_WIDTH = 240
// Breakpoints
export const MOBILE_VIEW_MAX_WIDTH = 495
export const TWO_COL_MIN_WIDTH = 496
export const TWO_COL_MAX_WIDTH = 672
export const THREE_COL_MIN_WIDTH = 872
export const THREE_COL_MAX_WIDTH = 1008
export const FOUR_COL_MIN_WIDTH = 1128
export const FOUR_COL_MAX_WIDTH = 1504
export const SIX_COL_MIN_WIDTH = 2288
export const SIX_COL_MAX_WIDTH = 2256
export const SHOW_SEARCH_BOX_BREAKPOINT = 657
export const SHOW_MINI_SIDEBAR_BREAKPOINT = 792
export const SHOW_FULL_SIDEBAR_BREAKPOINT = 1313
export const CHIPS_BAR_MAX_WIDTH = 1680
// font size
export const DEFAULT_FONT_SIZE = 14
export const HEADER_OPACITY = 0.98

// useMediaQuery hooks
export const useIsMobileView = () =>
  useMediaQuery(`(max-width: ${MOBILE_VIEW_MAX_WIDTH}px)`)

export const useShouldOpenSidebarDrawer = () =>
  !useMediaQuery(`(min-width:${SHOW_FULL_SIDEBAR_BREAKPOINT}px)`)

export const useMinWidthToShowFullSidebar = () =>
  useMediaQuery(`(min-width: ${SHOW_FULL_SIDEBAR_BREAKPOINT}px)`)

export const useShouldShowMiniSidebar = () =>
  useMediaQuery(`(min-width: ${SHOW_MINI_SIDEBAR_BREAKPOINT}px)`)

// clear the searchTerm when navigate back to home screen
export const useClearSearchTerm = (history, searchTermSetterFunction) => {
  useEffect(() => {
    const unListen = history.listen((location) => {
      // console.log('new location: ', location)
      if (location.pathname === '/') {
        searchTermSetterFunction('')
      }
    })
    return () => {
      unListen()
    }
  }, [])
}

export const getSearchTermVideos = async (
  queryString,
  searchTermNextPageTokenSetterFunction,
  searchTermTotalResultsSetterFunction,
  searchResultsSetterFunction,
  shouldQueryAndStore = true
) => {
  try {
    const { data } = await request('/search', {
      params: {
        part: 'snippet',
        maxResults: 25,
        regionCode: 'GB',
        q: queryString,
      },
    })
    if (shouldQueryAndStore) {
      // store data into localStorage, not just `items`
      localStorage.setItem(queryString, JSON.stringify(data))
    }
    // store nextPageToken and totalResults into a state variable
    searchTermNextPageTokenSetterFunction(data.pageInfo.nextPageToken)
    searchTermTotalResultsSetterFunction(data.pageInfo.totalResults)
    searchResultsSetterFunction(data.items)
  } catch (error) {
    console.log(error)
  }
}

export const handleSearchFormSubmit = (
  event,
  queryString,
  searchTermNextPageTokenSetterFunction,
  searchTermTotalResultsSetterFunction,
  searchResultsSetterFunction,
  history,
  useLocalData = true,
  shouldQueryAndStore = true
) => {
  event.preventDefault()

  if (useLocalData) {
    // temporary if then statement to load search results from localStorage
    var storedResults = JSON.parse(localStorage.getItem(queryString))
  }

  if (useLocalData && storedResults) {
    searchTermNextPageTokenSetterFunction(storedResults.pageInfo.nextPageToken)
    searchTermTotalResultsSetterFunction(storedResults.pageInfo.totalResults)
    searchResultsSetterFunction(storedResults.items)
  } else {
    // query API with the searchTerm
    getSearchTermVideos(
      queryString,
      searchTermNextPageTokenSetterFunction,
      searchTermTotalResultsSetterFunction,
      searchResultsSetterFunction,
      shouldQueryAndStore
    )
  }
  // jump to the search Page
  history.push('/results?search_query=' + queryString)
}

export const queryChannelDetails = async (
  setAvatarFunction,
  setChannelInfoFunction,
  channelId,
  // no need videoId if not using localStorage
  videoId,
  isVideo
) => {
  // if (!isVideo) {
  //   console.log('not a video, getting channel info')
  // }
  try {
    const {
      data: { items },
    } = await request('/channels', {
      params: {
        part: isVideo ? 'snippet' : 'snippet,statistics',
        id: channelId,
      },
    })
    
    // console.log(items)

    if (isVideo) {
      localStorage.setItem(
        `${videoId}_channelAvatar`,
        JSON.stringify(items[0].snippet.thumbnails.default.url)
      )
      setAvatarFunction(items[0].snippet.thumbnails.default.url)
    } else {
      // data is a channel instead of video
      console.log(items[0])
      localStorage.setItem(`${channelId}_channelInfo`, JSON.stringify(items[0]))
      setChannelInfoFunction(items[0])
    }
  } catch (error) {
    console.log(error)
  }
}

export const getFormattedDurationString = (duration) => {
  let formattedDuration = moment.duration(duration).asSeconds()
  formattedDuration = moment.utc(formattedDuration * 1000).format('mm:ss')
  // remove leading '0'
  formattedDuration =
    formattedDuration[0] === '0'
      ? formattedDuration.slice(1)
      : formattedDuration
  return formattedDuration
}

// To hide AppBar when scroll passed threshold
export function HideOnScroll({ children }) {
  const displayMobileHeader = !useScrollTrigger({
    threshold: MOBILE_VIEW_SCROLL_THRESHOLD,
  })

  const displayDesktopHeader = !useMediaQuery(
    `(max-width:${MOBILE_VIEW_MAX_WIDTH}px)`
  )
  // always show Header in desktop view
  const showHeader = displayDesktopHeader
    ? displayDesktopHeader
    : displayMobileHeader

  return (
    // previously added a <div> to wrap around {children}, the hide animation didn't work as a result}
    <Slide in={showHeader}>{children}</Slide>
  )
}

// Tooltip styling for all IconButton, expect YouTube logo
export const IconTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  .MuiTooltip-tooltip {
    background: gray;
    color: white;
    border: 1px solid gray;
    font-size: 0.8rem;
    padding: 0.4rem 0.4rem;
    border-radius: 2px;
  }
`
// common settings of padding for all IconButton
export const StyledIconButton = styled(IconButton)`
  && {
    @media screen and (max-width: ${MOBILE_VIEW_MAX_WIDTH}px) {
      padding: 12px;
    }
    padding: 8px;
  }
`
export const StyledMenuItem = styled(MenuItem)`
  && {
    padding-top: 8px;
    padding-bottom: 8px;
    min-height: 40px;
  }
`

// The icon on the left of each list item
export const StyledListItemIcon = styled(ListItemIcon)`
  && {
    min-width: 0;
    margin-right: 16px;
  }
`
