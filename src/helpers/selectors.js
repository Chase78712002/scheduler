export default function getAppointmentsForDay (state, day) {
  const result = []
  const filterByDay = state.days.filter(dayObj => {
    return dayObj.name === day
  })
  
  if (filterByDay.length !== 0) {
    const appointmentArr = filterByDay[0].appointments;
    for (const apptID of appointmentArr ) {
       result.push(state.appointments[apptID])
    }
  }
  return result;
}