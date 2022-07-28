import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, ButtonGroup, ClickAwayListener, MenuItem, MenuList, Paper, Popper } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"

export interface SortOption {
  key: string
  label: string
}

interface Props {
  sortOptions: SortOption[]
  handleSort: (option: SortOption, isAscendingOrder: boolean) => void
}

const SortButtonWithOptions: React.FC<Props> = ({ sortOptions, handleSort }) => {
  const sortButtonWrapperRef = useRef<HTMLDivElement>(null)
  const [selectedOption, setSelectedOption] = useState<SortOption>(sortOptions[0])
  const [isOptionsDropdownOpen, setIsOptionsDropdownOpen] = useState<boolean>(false)
  const [isAscendingOrder, setIsAscendingOrder] = useState<boolean>(true)

  const handleOptionsDropdownToggle = useCallback(() => setIsOptionsDropdownOpen((isOpen) => !isOpen), [])

  const handleOptionSelect = useCallback((option: SortOption) => {
    setSelectedOption(option)
    setIsOptionsDropdownOpen(false)
  }, [])

  useEffect(() => {
    handleSort(selectedOption, isAscendingOrder)
  }, [selectedOption, isAscendingOrder])

  return (
    <React.Fragment>
      <ButtonGroup variant="outlined" ref={sortButtonWrapperRef}>
        <Button color="inherit" size="small" onClick={handleOptionsDropdownToggle}>
          {selectedOption.label}
        </Button>
        <Button color="inherit" size="small" onClick={() => setIsAscendingOrder(!isAscendingOrder)}>
          <FontAwesomeIcon icon={`sort-alpha-down${isAscendingOrder ? "-alt" : ""}`} />
        </Button>
      </ButtonGroup>
      <Popper placement="bottom-start" open={isOptionsDropdownOpen} anchorEl={sortButtonWrapperRef.current}>
        <ClickAwayListener onClickAway={handleOptionsDropdownToggle}>
          <Paper>
            <MenuList autoFocusItem>
              {sortOptions.map((option) => (
                <MenuItem key={option.key} selected={selectedOption.key === option.key} onClick={() => handleOptionSelect(option)}>
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </React.Fragment>
  )
}

export default SortButtonWithOptions
