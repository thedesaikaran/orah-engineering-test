import React, { createContext, useCallback, useEffect, useState } from "react"
import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"

export enum SortKeys {
  FIRST_NAME = "first_name",
  LAST_NAME = "last_name",
}

interface ISortDetails {
  key: string
  isAscendingOrder: boolean
}

const INITIAL_SORT_DETAILS = {
  key: SortKeys.FIRST_NAME,
  isAscendingOrder: true,
}

export interface IHomeBoardContext {
  students: Person[]
  filteredStudents: Person[]
  setStudents: (students: Person[]) => void
  handleStudentsSort: (key: string, isAscendingOrder: boolean) => void
  setSearchKeyword: (keyword: string) => void
  setFilterAttendanceStatus: (status: RolllStateType | "") => void
  handleStudentAttendance: (student: Person, rollState: RolllStateType) => void
}

const INITIAL_CONTEXT_VALUES: IHomeBoardContext = {
  students: [],
  filteredStudents: [],
  setStudents: (students: Person[]) => {},
  handleStudentsSort: (key: string, isAscendingOrder: boolean) => {},
  setSearchKeyword: (keyword: string) => {},
  setFilterAttendanceStatus: (status: RolllStateType | "") => {},
  handleStudentAttendance: (student: Person, rollState: RolllStateType) => {},
}
export const HomeBoardContext = createContext<IHomeBoardContext>(INITIAL_CONTEXT_VALUES)

const HomeBoardProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [students, setStudents] = useState<Person[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Person[]>([])
  const [sortDetails, setSortDetails] = useState<ISortDetails>(INITIAL_SORT_DETAILS)
  const [searchKeyword, setSearchKeyword] = useState<string>("")
  const [filterAttendanceStatus, setFilterAttendanceStatus] = useState<RolllStateType | "">("")
  const handleStudentsSort = useCallback((key: string, isAscendingOrder: boolean) => {
    setSortDetails({ key, isAscendingOrder })
  }, [])

  const handleStudentAttendance = useCallback(
    (student: Person, rollState: RolllStateType) =>
      setStudents((previousStudents) => previousStudents.map((previousStudent) => (previousStudent.id === student.id ? { ...student, rollState } : previousStudent))),
    []
  )

  function handleFilterStudents() {
    let updatedFilteredStudents = [...students]

    if (searchKeyword) {
      updatedFilteredStudents = updatedFilteredStudents.filter(({ first_name, last_name }) => `${first_name} ${last_name}`.toLowerCase().includes(searchKeyword))
    }

    if (filterAttendanceStatus) {
      updatedFilteredStudents = updatedFilteredStudents.filter(({ rollState }) => rollState === filterAttendanceStatus)
    }

    const { key: sortFieldKey, isAscendingOrder } = sortDetails
    updatedFilteredStudents.sort((a: any, b: any) => {
      return a[sortFieldKey] < b[sortFieldKey] ? (isAscendingOrder ? -1 : 1) : a[sortFieldKey] > b[sortFieldKey] ? (isAscendingOrder ? 1 : -1) : 0
    })
    setFilteredStudents(updatedFilteredStudents)
  }

  useEffect(() => {
    handleFilterStudents()
  }, [sortDetails, searchKeyword, filterAttendanceStatus, students])

  return (
    <HomeBoardContext.Provider
      value={{
        students,
        filteredStudents,
        setStudents,
        handleStudentsSort,
        setSearchKeyword,
        setFilterAttendanceStatus,
        handleStudentAttendance,
      }}
    >
      {children}
    </HomeBoardContext.Provider>
  )
}

export default HomeBoardProvider
