import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core"
import { Activity } from "shared/models/activity"
import { useApi } from "shared/hooks/use-api"
import { Person, PersonHelper } from "shared/models/person"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "../roll-state/roll-state-icon.component"
import { RolllStateType } from "shared/models/roll"
import style from "../../../shared/styles/roll-activity-students-list-popup.module.scss"
import { ItemType } from "../roll-state/roll-state-list.component"
import cx from "classnames"

interface Props {
  rollActivity: Activity
  open: boolean
  onClose: (event: object, reason: string) => void
  initialFilter: ItemType
}

const ALL_ROLL_STATE_TYPES: RolllStateType[] = ["unmark", "present", "late", "absent"]

const RollActivityStudentsList: React.FC<Props> = ({ rollActivity, open = false, onClose, initialFilter = "all" }) => {
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [filteredRollStates, setFilteredRollStates] = useState<RolllStateType[]>(ALL_ROLL_STATE_TYPES)
  const [filteredStudents, setFilteredStudents] = useState<Person[]>([])

  useEffect(() => {
    void getStudents()
  }, [])

  useEffect(() => {
    setFilteredRollStates(initialFilter === "all" ? ALL_ROLL_STATE_TYPES : [initialFilter])
  }, [initialFilter])

  const studentIdRolls = useMemo(
    () =>
      rollActivity.entity?.student_roll_states.reduce(
        (returnStudentRolls, studentRoll: { student_id: number; roll_state: RolllStateType }) => ({
          ...returnStudentRolls,
          [studentRoll.student_id]: studentRoll.roll_state,
        }),
        {} as { [key in number]: RolllStateType }
      ),
    [rollActivity]
  )

  function filterStudentsRoll() {
    let updatedFilteredStudents = data?.students || []

    if (ALL_ROLL_STATE_TYPES.length !== filteredRollStates.length && studentIdRolls) {
      updatedFilteredStudents = updatedFilteredStudents.filter((student) => filteredRollStates.includes(studentIdRolls[student.id]))
    }

    setFilteredStudents(updatedFilteredStudents)
  }

  const handleFilterRollState = useCallback(
    (rollStateType: RolllStateType) => {
      let updatedFilteredRollStates = []
      if (filteredRollStates.includes(rollStateType)) {
        updatedFilteredRollStates = filteredRollStates.filter((rollState) => rollState !== rollStateType)
      } else {
        updatedFilteredRollStates = [...filteredRollStates, rollStateType]
      }

      setFilteredRollStates(updatedFilteredRollStates.length ? updatedFilteredRollStates : ALL_ROLL_STATE_TYPES)
    },
    [filteredRollStates]
  )

  useEffect(() => filterStudentsRoll(), [data, filteredRollStates, studentIdRolls])

  return studentIdRolls && Object.keys(studentIdRolls).length ? (
    <Dialog open={open} onClose={onClose} scroll="paper" fullWidth maxWidth="sm">
      <DialogTitle className={style["popup-title"]}>
        <span>{rollActivity.entity?.name} Activity Students</span>
        <button type="button" className={style["close-btn"]} onClick={(event) => onClose(event, "escapeKeyDown")}>
          <FontAwesomeIcon icon="times" color="inherit" />
        </button>
      </DialogTitle>
      <DialogContent dividers>
        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && (
          <>
            <div className={style["filter-state-row"]}>
              {ALL_ROLL_STATE_TYPES.map((type) => (
                <button
                  type="button"
                  onClick={() => handleFilterRollState(type)}
                  className={cx(style["roll-state-item"], {
                    [style[`${type}-active`]]: filteredRollStates.includes(type),
                  })}
                  key={`roll-state-filter-${type}`}
                >
                  <RollStateIcon type={type} size={14} />
                  <span className={style["label"]}>{type}</span>
                </button>
              ))}
            </div>
            {filteredStudents.length ? (
              filteredStudents.map((student) => (
                <div className={style["student-roll-row"]} key={`student-list-popup-${student.id}`}>
                  <p>{PersonHelper.getFullName(student)}</p>
                  <RollStateIcon type={studentIdRolls[student.id]} size={24} />
                </div>
              ))
            ) : (
              <div className={style["no-students-placeholder"]}>
                No students {ALL_ROLL_STATE_TYPES.length !== filteredRollStates.length && `for ${filteredRollStates.join(", ")} roll states`}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  ) : (
    <></>
  )
}

export default RollActivityStudentsList
