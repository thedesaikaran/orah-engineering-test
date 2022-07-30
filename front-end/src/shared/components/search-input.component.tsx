import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { InputAdornment, TextField } from "@material-ui/core"
import Style from "../styles/search-input.module.scss"

interface Props {
  handleSearch: (searchKeyword: string) => void
}

const SearchInput: React.FC<Props> = ({ handleSearch }) => {
  const [searchText, setSearchText] = useState<string>("")
  return (
    <TextField
      value={searchText}
      onChange={(event) => setSearchText(event.target.value)}
      onKeyUp={() => handleSearch(searchText.trim().toLowerCase())}
      variant="outlined"
      size="small"
      color="primary"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon icon="search" size="sm" />
          </InputAdornment>
        ),
      }}
      className={Style["search-input-wrapper"]}
    />
  )
}

export default SearchInput
