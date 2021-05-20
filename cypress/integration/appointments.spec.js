describe("Appointment", () => {
  beforeEach(() => {
    cy.request("GET", "http://localhost:8001/api/debug/reset");
    cy.visit("/");
  });
  it("should book an interview", () => {
    // Visits the root of our web server
    cy.contains("li", "Monday").click();
    // Clicks on the "Add" button in the second appointment
    cy.get("[alt='Add']").eq(0).click();
    // Enters their name
    cy.get("form").find("input").type("Lydia Miller-Jones");
    // Chooses an interviewer
    cy.get(".interviewers__list").find(".interviewers__item").eq(0).click();
    // Clicks the save button
    cy.contains("Save").click();
    // Sees the booked appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    // Clicks the edit button for the existing appointment
    cy.contains(".appointment__card--show", "Archie Cohen")
      .find("[alt='Edit']")
      .click({ force: true });
    // Changes the name and interviewer
    cy.get("[data-testid=student-name-input]").clear().type("Alvin");
    cy.get("[alt='Tori Malcolm']").click();
    // Clicks the save button
    cy.contains("Save").click();
    // Sees the edit to the appointment
    cy.contains(".appointment__card--show", "Alvin");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it.only("should cancel an interview", () => {
    // Clicks the delete button for the existing appointment
    cy.get("[alt='Delete']")
      .click({ force: true })
    // Clicks the confirm button
    cy.contains("Confirm")
      .click()
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");
    // Sees that the appointment slot is empty
    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist")
  });
});
