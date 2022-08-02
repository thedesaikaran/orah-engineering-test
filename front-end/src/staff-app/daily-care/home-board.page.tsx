import React, { useState } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import HomeBoardProvider from "./home-board.context"
import Toolbar, { ToolbarAction } from "staff-app/components/toolbar/toolbar.component"
import StudentList from "staff-app/components/student-list/student-list.component"

const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <HomeBoardProvider>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} />
        <StudentList isRollMode={isRollMode} />
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </HomeBoardProvider>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
}

export default HomeBoardPage
