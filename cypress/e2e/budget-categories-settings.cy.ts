import { testUsers } from "#utils/testing/test-users"

describe("Budget categories settings", () => {
  it("fetched and rendered correctly", () => {
    cy.authorize(testUsers.johnDoe.id)
    cy.visit("/boards/1/settings")

    cy.contains("clothes").should("be.visible")
    cy.contains("education").should("be.visible")
  })

  it("category form modal opens and closes correctly", () => {
    cy.authorize(testUsers.johnDoe.id)
    cy.visit("/boards/1/settings")

    cy.contains("+New").click()
    cy.get('[role="dialog"]').should("be.visible")
    cy.contains("Cancel").click()
    cy.get('[role="dialog"]').should("not.exist")
  })

  it("a new category is created correctly", () => {
    cy.authorize(testUsers.johnDoe.id)
    cy.visit("/boards/1/settings")

    cy.contains("+New").click()
    cy.contains("Submit").should("be.disabled")
    cy.get('input[name="name"]').type("travel")
    cy.get('input[name="typeId"][value="1"]').click() // Select "Expense" category type.
    cy.contains("Submit").click()
    cy.get('[role="dialog"]').should("not.exist")
    cy.contains("travel").should("be.visible")
  })

  it("case: user tries to create a category that already exists and then fixes input values", () => {
    cy.authorize(testUsers.johnDoe.id)
    cy.visit("/boards/1/settings")

    cy.contains("+New").click()
    cy.get('input[name="name"]').type("education")
    cy.get('input[name="typeId"][value="1"]').click() // Select "Expense" category type.
    cy.contains("Submit").click()
    cy.get("body")
      .find("p")
      .filter((index, node) => node.innerText === '"education" expense category already exists in this board.')
      .should("have.length", 2)
    cy.contains("Submit").should("be.disabled")
    cy.get('input[name="name"]').clear()
    cy.get("body")
      .find("p")
      .filter((index, node) => node.innerText === '"education" expense category already exists in this board.')
      .should("have.length", 1)
    cy.get('input[name="name"]').type("teaching")
    cy.get('input[name="typeId"][value="2"]').click() // Select "Income" category type.
    cy.get("body")
      .find("p")
      .filter((index, node) => node.innerText === '"education" expense category already exists in this board.')
      .should("have.length", 0)
    cy.contains("Submit").click()
    cy.get('[role="dialog"]').should("not.exist")
    cy.contains("teaching").should("be.visible")
  })

  it("category is edited correctly", () => {
    cy.authorize(testUsers.jessicaStark.id)
    cy.visit("/boards/2/settings")

    cy.contains("salary").should("be.visible")
    cy.get("#salary-income-category-edit-button").click()
    cy.get('[role="dialog"]').should("be.visible")
    cy.get('input[name="name"]').should("have.value", "salary")
    cy.get('input[name="typeId"][value="2"]').should("be.checked") // "Income" category type is selected.
    cy.get('input[name="name"]').clear().type("casino")
    cy.get('input[name="typeId"][value="1"]').click() // Select "expense" category type.
    cy.contains("Submit").click()
    cy.get('[role="dialog"]').should("not.exist")
    cy.contains("salary").should("not.exist")
    cy.contains("casino").should("be.visible")
    cy.get("#casino-expense-category-edit-button").should("be.visible")
  })

  it("is deleted correctly", () => {
    cy.authorize(testUsers.johnDoe.id)
    cy.visit("/boards/1/settings")

    cy.contains("clothes").should("be.visible")
    cy.get("#clothes-expense-category-delete-button").click()
    cy.get('[role="dialog"]').should("be.visible")
    cy.contains("Yes, delete").click()
    cy.get('[role="dialog"]').should("not.exist")
    cy.contains("clothes").should("not.exist")
  })
})