import React from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import LeftContainer from './LeftContainer/LeftContainer'
import MiddleContainer from './MiddleContainer/MiddleContainer'
import RightContainer from './RightContainer/RightContainer'
import {
  MOBILE_VIEW_BREAKPOINT,
  MOBILE_VIEW_HEADER_HEIGHT,
  DESKTOP_VIEW_HEADER_HEIGHT,
  HideOnScroll,
  useIsMobileView,
} from '../utils/utils'
// import { TextForScrollingTest } from '../utils/TextForScrollingTest'

function Header() {
  const isMobileView = useIsMobileView()
  return (
    <>
      <HideOnScroll>
        {/* not sure if color=transparent will affect the look when scroll */}
        <StyledAppBar elevation={isMobileView ? 2 : 0}>
          <StyledToolbar disableGutters>
            <LeftContainer />
            <MiddleContainer />
            <RightContainer />
          </StyledToolbar>
        </StyledAppBar>
      </HideOnScroll>

      {/* Below text only to test if hiding the AppBar works */}
      {/* <TextForScrollingTest /> */}
    </>
  )
}

export default Header

export const StyledAppBar = styled(AppBar)`
  && {
    background-color: white;
    /* opacity: 0.9; */
    @media screen and (min-width: ${MOBILE_VIEW_BREAKPOINT + 1}px) {
      transition: none !important; // can't override without !important
    }
  }

  .MuiToolbar-regular {
    @media screen and (max-width: ${MOBILE_VIEW_BREAKPOINT}px) {
      min-height: ${MOBILE_VIEW_HEADER_HEIGHT}px;
      height: ${MOBILE_VIEW_HEADER_HEIGHT}px;
    }

    min-height: ${DESKTOP_VIEW_HEADER_HEIGHT}px;
    height: ${DESKTOP_VIEW_HEADER_HEIGHT}px;
  }
`

const StyledToolbar = styled(Toolbar)`
  @media screen and (max-width: ${MOBILE_VIEW_BREAKPOINT}px) {
    padding-left: 0;
    padding-right: 0;
  }

  /* remove the border later */
  /* border-bottom: 1px solid lightgray; */
  padding-left: 16px;
  padding-right: 16px;
  /* background-color: white; */
`
