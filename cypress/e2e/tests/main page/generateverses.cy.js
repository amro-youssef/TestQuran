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

describe('Generate verses', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
        cy.reload();
    })

    it('generate any verse', () => {
        clickRandomizeButton();
        cy.get('.verseText').should('not.be.empty');

    })

    it('generate bismillah', () => {
        input('1 Al-Fatihah', '1', '1 Al-Fatihah', '1');
        clickRandomizeButton();

        cy.get('.verseText').contains('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ');
    })

    it('generate first ayat of surah an nas', () => {
        input('114 An-Nas', '1', '114 An-Nas', '1');
        clickRandomizeButton();

        cy.get('.verseText').contains('قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ');
    })

})


