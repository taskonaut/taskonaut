afterEach(() => {
    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
                registration.unregister();
            });
        });
    }
});

describe('Test task creation', () => {
    it('create new task', () => {
        const taskText = 'Buy milk';
        cy.visit('/');
        cy.contains('.v-list-item', 'Add New Task').click();
        cy.get('input').eq(0).type(taskText);
        cy.get('.v-toolbar-items > .v-btn').click();
        cy.get('.mdi-close').click();
        cy.contains(taskText).should('exist');
    });
});
