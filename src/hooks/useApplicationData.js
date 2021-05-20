import { useEffect, useState } from "react";
import axios from "axios";

const useApplicationData = () => {
  const [state, setState] = useState({
    daySelected: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const updateSpots = function (dayName, days, appointments) {
    const filterByDay = days.filter((day) => dayName === day.name);
    const selectedDayObj = filterByDay[0];
    const nullArr = [];
    for (const apptID of selectedDayObj.appointments) {
      const interviewStatus = appointments[apptID].interview;
      if (interviewStatus === null) {
        nullArr.push(interviewStatus);
      }
    }
    const numSpots = nullArr.length;
    const newDay = { ...selectedDayObj, spots: numSpots };
    const finalDays = days.map((day) => {
      return dayName === day.name ? newDay : day;
    });

    return finalDays;
  };

  const setSelectedDay = (daySelected) => setState({ ...state, daySelected });

  const bookInterview = function (id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then((response) => {
        const updatedDays = updateSpots(
          state.daySelected,
          state.days,
          appointments
        );

        setState({ ...state, appointments, days: updatedDays });
      });
  };

  const cancelInterview = function (id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${id}`).then((response) => {
      const updatedDays = updateSpots(
        state.daySelected,
        state.days,
        appointments
      );

      setState({ ...state, appointments, days: updatedDays });
    });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  return { state, setSelectedDay, bookInterview, cancelInterview };
};

export default useApplicationData;
