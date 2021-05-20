import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { id, time, interview, interviewers, bookInterview, cancelInterview } =
    props;
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  const save = function (name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);

    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch((err) => transition(ERROR_SAVE, true));
  };

  const trash = () => {
    transition(DELETE, true);
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR_DELETE, true));
  };
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={time} />
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form
          name={interview.student}
          interviewers={interviewers}
          interviewer={interview.interviewer.id}
          onSave={save}
          onCancel={() => transition(SHOW)}
        />
      )}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === ERROR_SAVE && (
        <Error message={"Could not save appointment"} onClose={() => back()} />
      )}
      {mode === DELETE && <Status message={"Deleting"} />}
      {mode === ERROR_DELETE && (
        <Error
          message={"Could not delete appointment"}
          onClose={() => back()}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={"Do you wish to trash the appointment?"}
          onConfirm={trash}
          onCancel={() => back()}
        />
      )}
    </article>
  );
}
