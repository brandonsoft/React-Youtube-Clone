import React from 'react'
// import { useParams, useHistory, useLocation } from 'react-router-dom'
import { OuterVideoContainer as SearchContainer } from '../Videos/Videos'
import { useGlobalContext } from '../../context'
import { List } from '@material-ui/core'
import styled from 'styled-components'
import ResultsVideoCard from './ResultsVideoCard'
import { searchResultsAtom } from '../../store'
import { useAtom } from 'jotai'
import { useIsMobileView } from '../utils/utils'
import Button from '@material-ui/core/Button'
import TuneIcon from '@material-ui/icons/Tune'

const Search = () => {
  const { marginLeftToOffset } = useGlobalContext()
  const isMobileView = useIsMobileView()

  // load result directly from localStorage for now to test the layout
  // const results = JSON.parse(localStorage.getItem('kitten')).items
  // console.log(results)

  const [searchResults] = useAtom(searchResultsAtom)

  return (
    <SearchContainer marginLeftToOffset={marginLeftToOffset}>
      <InnerSearchContainer>
        {/* FILTERS button here */}
        {!isMobileView && (
          <FilterButton
            variant="contained"
            color="default"
            startIcon={<TuneIcon />}
            disableElevation
            disableRipple
          >
            FILTERS
          </FilterButton>
        )}
        <StyledList component="div">
          {searchResults &&
            searchResults.map((video) => {
              return <ResultsVideoCard key={video.id.videoId} video={video} />
            })}
        </StyledList>
      </InnerSearchContainer>
    </SearchContainer>
  )
}

export default Search

const StyledList = styled(List)`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`

const FilterButton = styled(Button)`
  && {
    background: transparent;
    width: fit-content;
    padding: 6px 16px;

    &:hover {
      background: transparent;
    }
  }
`

const InnerSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1096px;
  margin: 0 auto;
  padding: 16px 24px;
`
