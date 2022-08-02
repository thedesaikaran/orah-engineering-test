import React, { useMemo } from "react"
import { getFormattedDate } from "shared/helpers/global"
import { Activity } from "shared/models/activity"
import style from "shared/styles/roll-activity-card.module.scss"
import { ItemType, RollStateList, StateList } from "staff-app/components/roll-state/roll-state-list.component"

interface Props {
  rollActivityData: Activity
  onPopupOpen: (activity: Activity, filter: ItemType) => void
}

const INITIAL_STATE_LIST: { [key in ItemType]: StateList } = {
  all: {
    type: "all",
    count: 0,
    tooltip: "View All students",
  },
  present: {
    type: "present",
    count: 0,
    tooltip: "View Present students",
  },
  late: {
    type: "late",
    count: 0,
    tooltip: "View Late students",
  },
  absent: {
    type: "absent",
    count: 0,
    tooltip: "View Absent students",
  },
  unmark: {
    type: "unmark",
    count: 0,
    tooltip: "View Unmarked students",
  },
}

const RollActivityCard: React.FC<Props> = ({ rollActivityData, onPopupOpen }) => {
  const { rollStateList, areAllStudentsPresent } = useMemo(() => {
    const { student_roll_states } = rollActivityData.entity
    const rollStateCounts = student_roll_states.reduce(
      (returnRollStates, studentRoll) => {
        const newCount = returnRollStates[studentRoll.roll_state].count + 1
        return { ...returnRollStates, [studentRoll.roll_state]: { ...returnRollStates[studentRoll.roll_state], count: newCount } }
      },
      {
        ...INITIAL_STATE_LIST,
        ["all" as ItemType]: {
          ...INITIAL_STATE_LIST.all,
          count: student_roll_states.length,
        } as StateList,
      }
    )
    return {
      rollStateList: Object.values(rollStateCounts),
      areAllStudentsPresent: rollStateCounts.present.count === rollStateCounts.all.count,
    }
  }, [rollActivityData])
  return (
    <div className={style["wrapper"]}>
      {areAllStudentsPresent && (
        <div className={style["all-present-tag"]}>
          <span>All Present</span>
        </div>
      )}
      <div className={style["activity-info-row"]}>
        <p className={style["label"]}>
          Activity: <span className={style["value"]}>{rollActivityData.entity.name}</span>
        </p>
        <p className={style["label"]}>
          Date: <span className={style["value"]}>{getFormattedDate(rollActivityData.entity.completed_at)}</span>
        </p>
      </div>
      <div className={style["roll-info-row"]}>
        <RollStateList stateList={rollStateList} onItemClick={(type) => onPopupOpen(rollActivityData, type)} />
        <button type="button" className={style["view-students-btn"]} onClick={() => onPopupOpen(rollActivityData, "all")}>
          View Students
        </button>
      </div>
    </div>
  )
}

export default RollActivityCard
