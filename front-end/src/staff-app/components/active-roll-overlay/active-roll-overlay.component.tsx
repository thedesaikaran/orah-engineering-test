import React, { useContext, useEffect, useMemo } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList, StateList, ItemType } from "staff-app/components/roll-state/roll-state-list.component"
import { HomeBoardContext } from "staff-app/daily-care/home-board.context"
import { useApi } from "shared/hooks/use-api"
import { useNavigate } from "react-router-dom"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}

const INITIAL_ROLL_STATE_LIST_OBJECT: { [key in ItemType]: number } = {
  all: 0,
  present: 0,
  late: 0,
  absent: 0,
  unmark: 0,
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const { isActive, onItemClick } = props
  const { students, setFilterAttendanceStatus } = useContext(HomeBoardContext)
  const rollStateList = useMemo(() => {
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

    return Object.entries(rollsObject)
      .map((rollState) => ({ type: rollState[0], count: rollState[1] } as StateList))
      .slice(0, -1)
  }, [students])

  function handleFilter(type: ItemType) {
    setFilterAttendanceStatus(type === "all" ? "" : type)
  }

  const [saveRollAPI, data, loadState] = useApi({ url: "save-roll", initialLoadState: "unloaded" })

  function handleSubmit() {
    const payload = {
      student_roll_states: students.map((student) => ({ student_id: student.id, roll_state: student.rollState || "unmark" })),
    }

    saveRollAPI(payload)
  }

  useEffect(() => {
    if (loadState === "loaded") {
      navigate("/staff/activity")
    }
  }, [loadState])

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
            <Button disabled={loadState === "loading"} color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={handleSubmit}>
              {loadState === "loading" ? "Completing" : "Complete"}
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
