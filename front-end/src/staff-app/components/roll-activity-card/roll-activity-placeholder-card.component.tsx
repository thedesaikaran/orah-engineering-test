import React from "react"
import style from "shared/styles/roll-activity-card.module.scss"
import cx from "classnames"

const RollActivityPlaceholderCard: React.FC = () => {
  return (
    <div className={cx(style["wrapper"], style["placeholder"])}>
      <div className={style["activity-info-row"]}>
        <p className={style["label"]} />
        <p className={style["label"]} />
      </div>
      <div className={style["roll-info-row"]}>
        <span className={style["roll-state-list"]} />
        <span className={style["view-students-btn"]} />
      </div>
    </div>
  )
}

export default RollActivityPlaceholderCard
