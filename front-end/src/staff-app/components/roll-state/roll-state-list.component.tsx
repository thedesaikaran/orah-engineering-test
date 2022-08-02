import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Spacing, FontWeight } from "shared/styles/styles"
import { RolllStateType } from "shared/models/roll"
import { Tooltip } from "@material-ui/core"

interface Props {
  stateList: StateList[]
  onItemClick?: (type: ItemType) => void
  size?: number
}
export const RollStateList: React.FC<Props> = ({ stateList, size = 14, onItemClick }) => {
  const onClick = (type: ItemType) => {
    if (onItemClick) {
      onItemClick(type)
    }
  }

  return (
    <S.ListContainer>
      {stateList.map((state, stateIndex) => {
        return (
          <Tooltip title={state.tooltip || ''}>
            <S.ListItem key={`state-list-${stateIndex}`}>
              {state.type === "all" ? (
                <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} onClick={() => onClick(state.type)} />
              ) : (
                <RollStateIcon type={state.type} size={size} onClick={() => onClick(state.type)} />
              )}
              <span>{state.count}</span>
            </S.ListItem>
          </Tooltip>
        )
      })}
    </S.ListContainer>
  )
}

const S = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
}

export interface StateList {
  type: ItemType
  count: number
  tooltip?: string
}

export type ItemType = RolllStateType | "all"
