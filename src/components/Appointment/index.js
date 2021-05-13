import React, { useEffect } from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import { action } from "@storybook/addon-actions/dist/preview";

export default function Appointment(props) {
  const { time, interview } = props;
  return (
    <article className="appointment">
      <Header time={time} />
      {interview ? (
        <Show 
        student={interview.student} 
        interviewer={interview.interviewer} 
        onEdit={action("onEdit")}
        onDelete={action("onDelete")}
        />
      ) : (
        <Empty onAdd={action("onAdd")} />
      )}
    </article>
  );
}
