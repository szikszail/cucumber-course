Feature: Google searching
  As a user
  I want to search quickly
  So that I can find easily what interests me

  Scenario: Search for text „Epam Debrecen”
    Given the Google page is opened

    When the text "Epam Debrecen" is entered into the search field
    Then the first result is "Debreceni iroda: EPAM Systems"

    When the text "Debreceni iroda: EPAM Systems" is clicked
    Then the Epam Debrecen page should be opened