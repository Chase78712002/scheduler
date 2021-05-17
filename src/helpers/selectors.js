const getAppointmentsForDay = (state, day) => {
  const result = [];
  const filterByDay = state.days.filter((dayObj) => {
    return dayObj.name === day;
  });

  if (filterByDay.length !== 0) {
    const appointmentArr = filterByDay[0].appointments;
    for (const apptID of appointmentArr) {
      result.push(state.appointments[apptID]);
    }
  }
  return result;
};

const getInterview = function (state, interviewObj) {
  let result = null;
  if (interviewObj) {
    const interviewerID = interviewObj.interviewer;
    const interviewerInfo = state.interviewers[interviewerID];
    result = { ...interviewObj, interviewer: interviewerInfo };
  }

  return result;
};

const getInterviewersForDay = (state, day) => {
  const result = [];
  const filterByDay = state.days.filter((dayObj) => {
    return dayObj.name === day;
  });

  if (filterByDay.length !== 0) {
    const interviewersArr = filterByDay[0].interviewers;
    for (const interviewerID of interviewersArr) {
      result.push(state.interviewers[interviewerID]);
    }
  }
  return result;
};

export { getAppointmentsForDay, getInterview, getInterviewersForDay };
