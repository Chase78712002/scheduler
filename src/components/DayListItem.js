import React from "react";
import "./DayListItem.scss";
import classNames from 'classnames';

export default function DayListItem (props) {
  const {name, spots, setDay, selected} = props
  let dayClass = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": spots === 0,
  })

  const formatSpots = (remainingSpots) => {
    switch (remainingSpots) {
      case 0: return "no spots remaining"
      case 1: return "1 spot remaining"
      default: return `${remainingSpots} spots remaining`
    }
  }


  return (
    <li className={dayClass} onClick={()=> setDay(name)} data-testid="day">
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}