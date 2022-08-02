import React, { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import RollActivityCard from "staff-app/components/roll-activity-card/roll-activity-card.component"
import RollActivityStudentsList from "staff-app/components/roll-activity-card/roll-activity-students-list-popup.component"
import { ItemType } from "staff-app/components/roll-state/roll-state-list.component"
import RollActivityPlaceholderCard from "staff-app/components/roll-activity-card/roll-activity-placeholder-card.component"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"

export const ActivityPage: React.FC = () => {
  const [getActivities, rollActivitiesData, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  const [selectedRollActivity, setSelectedRollActivity] = useState<Activity>({} as Activity)
  const [rollActivityPopupFilter, setRollActivityPopupFilter] = useState<ItemType>("all")
  useEffect(() => void getActivities(), [])

  const handleViewStudentsPopup = useCallback((rollActivity: Activity, rollStateFilter: ItemType) => {
    setSelectedRollActivity(rollActivity)
    setRollActivityPopupFilter(rollStateFilter)
  }, [])
  return (
    <S.Container>
      <RollActivityStudentsList
        open={Object.keys(selectedRollActivity).length > 0}
        onClose={() => setSelectedRollActivity({} as Activity)}
        rollActivity={selectedRollActivity}
        initialFilter={rollActivityPopupFilter}
      />
      {loadState === "loading" && Array.from({ length: 3 }, (_, placeholderIndex) => <RollActivityPlaceholderCard key={`placeholder-card-${placeholderIndex}`} />)}
      {loadState === "loaded" &&
        (rollActivitiesData?.activity.length ? (
          rollActivitiesData?.activity.map((rollActivity: Activity) => (
            <RollActivityCard rollActivityData={rollActivity} key={`roll-activity-card-${rollActivity.date}`} onPopupOpen={handleViewStudentsPopup} />
          ))
        ) : (
          <CenteredContainer>
            <div>No activities completed</div>
          </CenteredContainer>
        ))}
      {loadState === "error" && (
        <CenteredContainer>
          <div>Failed to load</div>
        </CenteredContainer>
      )}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
