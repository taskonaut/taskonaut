afterEach(() => {
    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
                registration.unregister();
            });
        });
    }
});

const createTask = (taskText: string) => {
    cy.contains('.v-list-item', 'Add New Task').click();
    cy.get('input').eq(0).type(taskText);
    cy.get('.v-toolbar-items > .v-btn').click();
    cy.get('.mdi-close').click();
};

describe('Test task creation/editing/deletion', () => {
    const taskText = 'Buy milk';
    beforeEach(() => {
        cy.visit('/');
    });

    it('should create new task', () => {
        createTask(taskText);
        cy.get('.v-container > .v-list')
            .find('.v-list-item')
            .should('have.length', 2);
        cy.contains(taskText).should('exist');
        cy.get('.completed > .v-list').should('not.exist');
    });

    it('should set task as done', () => {
        cy.get('.completed > .v-list').should('not.exist');
        createTask(taskText);
        cy.get('.v-selection-control__input').find('input').click();
        cy.get('.completed > .v-list')
            .find('.v-list-item')
            .should('have.length', 1);
    });

    it('should delete task', () => {
        createTask(taskText);
        cy.get('.v-container > .v-list')
            .find('.v-list-item')
            .should('have.length', 2);
        cy.get('.v-container > .v-list')
            .find('.v-list-item')
            .eq(0)
            .trigger('mouseover');
        cy.get('.show-on-hover').eq(1).invoke('show').click();
        cy.contains('Delete Task?').should('exist');
        cy.get('.v-card-actions > .v-btn').click();
        cy.get('.v-container > .v-list')
            .find('.v-list-item')
            .should('have.length', 1);
        cy.get('.completed > .v-list').should('not.exist');
        cy.contains(taskText).should('not.exist');
    });

    it('should edit task', () => {
        const updatedText = 'Buy juice';
        createTask(taskText);
        cy.get('.v-container > .v-list')
            .find('.v-list-item')
            .should('have.length', 2);
        cy.get('.v-container > .v-list')
            .find('.v-list-item')
            .eq(0)
            .trigger('mouseover');
        cy.get('.show-on-hover').eq(0).invoke('show').click();
        cy.contains('Edit Task').should('exist');
        cy.get('input').eq(1).clear().type(updatedText);
        cy.get('.v-toolbar-items > .v-btn').click();
        cy.get('.v-container > .v-list')
            .find('.v-list-item')
            .should('have.length', 2);
        cy.get('.completed > .v-list').should('not.exist');
        cy.contains(taskText).should('not.exist');
        cy.contains(updatedText).should('exist');
    });
});
