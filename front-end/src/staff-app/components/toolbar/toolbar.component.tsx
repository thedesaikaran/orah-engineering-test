import { Button } from "@material-ui/core"
import React, { useContext } from "react"
import SearchInput from "shared/components/search-input.component"
import SortButtonWithOptions, { SortOption } from "shared/components/sort-button-with-options.component"
import { Colors } from "shared/styles/colors"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { HomeBoardContext } from "staff-app/daily-care/home-board.context"
import styled from "styled-components"

const SORT_OPTIONS: SortOption[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
]

export type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick } = props
  const { handleStudentsSort, setSearchKeyword } = useContext(HomeBoardContext)

  function handleSort(option: SortOption, isAscendingOrder: boolean) {
    const { key } = option
    handleStudentsSort(key, isAscendingOrder)
  }
  return (
    <S.ToolbarContainer>
      <SortButtonWithOptions sortOptions={SORT_OPTIONS} handleSort={handleSort} />
      <SearchInput handleSearch={setSearchKeyword} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
      color: #fff;
    }
  `,
}

export default Toolbar
