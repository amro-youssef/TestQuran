/* eslint-disable no-undef */
/// <reference types="cypress" />
const input = (startChapter, startVerse, endChapter, endVerse) => {
    // Wait for the start chapter input to be visible, have at least one element, and be enabled
    cy.get('#start-chapter')
        .should('be.visible')
        .and('have.length.gt', 0)
        .and('be.enabled', { timeout: 10000 }) // Wait for up to 10 seconds for the input to be enabled
        .type(startChapter);

    // Wait for the dropdown to appear and select the first option
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]')
        .should('be.visible')
        .click();

    cy.get('#start-verse')
        .should('be.visible')
        .and('have.length.gt', 0)
        .and('be.enabled', { timeout: 10000 })
        .type(startVerse);

    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]')
        .should('be.visible')
        .click();

    cy.get('#end-chapter')
        .should('be.visible')
        .and('have.length.gt', 0)
        .and('be.enabled', { timeout: 10000 })
        .type(endChapter);

    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]')
        .should('be.visible')
        .click();

    cy.get('#end-verse')
        .should('be.visible')
        .and('have.length.gt', 0)
        .and('be.enabled', { timeout: 10000 })
        .type(endVerse);

    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]')
        .should('be.visible')
        .click();
}

const clickRandomizeButton = () => {
    cy.get('button').contains('Randomize').click();
}

describe('Expand and read more', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
        cy.reload();
    })

    it('expand shows other verses', () => {
        input('114 An-Nas', '1', '114 An-Nas', '1');
        clickRandomizeButton();
        cy.get('#expand-button').click()

        cy.get('.verseText').eq(0).contains('قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ');
        cy.get('.verseText').eq(1).contains('مَلِكِ ٱلنَّاسِ');
        cy.get('.verseText').eq(2).contains('إِلَـٰهِ ٱلنَّاسِ');
        
    })

    it('read more button works', () => {
        input('114 An-Nas', '1', '114 An-Nas', '1');
        clickRandomizeButton();
        cy.get('#expand-button').click();
        cy.get('#read-rest-of-chapter').click();

        cy.get('.verseText')
        .should('have.length', 6)
        
    })

    it('read more button works on Surat Al-Baqara', () => {
        cy.timeout(30000); // Increase the timeout to 30 seconds
        input('2 Al-Baqarah', '1', '2 Al-Baqarah', '1');
        clickRandomizeButton();
        cy.get('#expand-button').click();
        cy.get('#read-rest-of-chapter').click();

        cy.get('.verseText')
        .should('have.length', 286)
    })
})