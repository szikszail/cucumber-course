Feature: Check my incoming messages under Gmail
	As a gmail user
	I want to check my incoming messages
	So that I can read my messages

	Scenario: 1. Check the first result
		Given I login to my gmail account
				
		When I click on „incoming” menu item
		Then the first result should be „Teszt”
		And the number of the „incoming” result should be 10

	Scenario: 2. Click on the first result
		Given I login to my gmail account
		
		When I click on „incoming” menu item
		And I click on the result „Teszt”
		Then the text „Reply” should be displayed	