import React, { useContext, useMemo } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList, StateList, ItemType } from "staff-app/components/roll-state/roll-state-list.component"
import { HomeBoardContext } from "staff-app/daily-care/home-board.context"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}

const INITIAL_ROLL_STATE_LIST_OBJECT: { [key: ItemType]: number } = {
  all: 0,
  present: 0,
  late: 0,
  absent: 0,
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick } = props
  const { students, setFilterAttendanceStatus } = useContext(HomeBoardContext)
  const rollStateList: StateList = useMemo(() => {
    const rollsObject = students.reduce(
      (returnRollObject, student) => {
        if (student?.rollState) {
          const newCount = (returnRollObject[student.rollState] || 0) + 1
          return { ...returnRollObject, [student.rollState as ItemType]: newCount as number }
        }
        return returnRollObject
      },
      { ...INITIAL_ROLL_STATE_LIST_OBJECT, ["all" as ItemType]: students.length as number } as any
    )

    return Object.entries(rollsObject).map((rollState: Array<[ItemType, number]>) => ({ type: rollState[0], count: rollState[1] }))
  }, [students])

  function handleFilter(type: ItemType) {
    setFilterAttendanceStatus(type === "all" ? "" : type)
  }

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList stateList={rollStateList} onItemClick={handleFilter} />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => onItemClick("exit")}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
