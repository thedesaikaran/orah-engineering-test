import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useContext, useEffect } from "react"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { useApi } from "shared/hooks/use-api"
import { Person } from "shared/models/person"
import { HomeBoardContext } from "staff-app/daily-care/home-board.context"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"

const StudentList: React.FC<{ isRollMode: boolean }> = ({ isRollMode }) => {
  const { filteredStudents, setStudents } = useContext(HomeBoardContext)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudents(data?.students || [])
  }, [data])

  return (
    <>
      {loadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}

      {loadState === "loaded" && (
        <>
          {filteredStudents.map((student) => (
            <StudentListTile key={student.id} isRollMode={isRollMode} student={student} />
          ))}
        </>
      )}

      {loadState === "error" && (
        <CenteredContainer>
          <div>Failed to load</div>
        </CenteredContainer>
      )}
    </>
  )
}

export default StudentList
