import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  prettyDOM,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  getAllByText,
} from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";
import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then((response) => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const dayList = getAllByTestId(container, "day");
    const day = dayList.find((day) => queryByText(day, "Monday"));

    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on Archie's appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(
      getByText(appointment, "Do you wish to trash the appointment?")
    ).toBeInTheDocument();
    // 4. Click "Confirm" button.
    fireEvent.click(getByText(appointment, "Confirm"));
    // 7. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 8. Wait until the element with the  "Add" is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 9. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on Archie's appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));
    // 4. Change Archie's name to Alvin
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Alvin" },
    });
    // 5. Click "Save" button.
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 8. Wait until the element with the text "Alvin" is displayed.
    await waitForElement(() => getByText(appointment, "Alvin"));
    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Alvin" },
    });
    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Save"));
    // Wait until "Error" is displayed
    await waitForElement(() => getByText(appointment, "Error"));
    // Click the "Close" button
    fireEvent.click(getByAltText(appointment, "Close"));
    // Check to see the "Save" button is display again
    expect(getByText(appointment, "Save")).toBeInTheDocument();
    console.log(prettyDOM(appointment));
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(
      getByText(appointment, "Do you wish to trash the appointment?")
    ).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    await waitForElement(() => getByText(appointment, "Error"));
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByAltText(appointment, "Delete")).toBeInTheDocument();
    console.log(prettyDOM(appointment));
  });
});
