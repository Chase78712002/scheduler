import React, { useState, useEffect } from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import axios from 'axios';
import {getAppointmentsForDay, getInterview} from '../helpers/selectors';

export default function Application(props) {
  const [state, setState] = useState({
    daySelected: "Monday",
    days: [],
    appointments:{},
    interviewers:{}
  })
  console.log(state.interviewers);
  const setSelectedDay = daySelected => setState({...state, daySelected });
  const dailyAppointments = getAppointmentsForDay(state, state.daySelected);

  useEffect(()=> {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(all => {
      setState(prev => ({...prev, days:all[0].data, appointments:all[1].data, interviewers:all[2].data}))
    })

  },[])

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.daySelected}
            setDay={setSelectedDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {dailyAppointments.map(appointment => {
          const interview = getInterview(state, appointment.interview);
          console.log(appointment.interview);
          return (
          <Appointment
            key={appointment.id}
            // {...appointment}
            id={appointment.id}
            time={appointment.time}
            interview={interview}
          />
          )
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
