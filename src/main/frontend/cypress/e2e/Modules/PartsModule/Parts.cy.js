// beforeEach('Launch site', ()=>{
//     cy.visit('http://localhost:3000')
// });

it('Can access the login page and log-in.',()=>{
    // cy.login('user','Pa$$wor_D');
    // cy.visit('/');

    cy.visit('/', {
        auth: {
            username: 'user',
            password: 'Pa$$wor_D',
        },
    })

    cy.get('.username-field').type('user');
    cy.get('.password-field').type('Pa$$wor_D');
    cy.get('button[type="submit"]').click();
});

it('Part view button opens the Parts view.',()=>{
    cy.visit('/', {
        auth: {
            username: 'user',
            password: 'Pa$$wor_D',
        },
    })

    cy.get('.username-field').type('user');
    cy.get('.password-field').type('Pa$$wor_D');
    cy.get('button[type="submit"]').click();

    cy.contains('button', 'Parts').click();
    cy.get('.parts-table-container').should('be.visible');
});

it('Can create a new part.',()=>{
    cy.visit('/', {
        auth: {
            username: 'user',
            password: 'Pa$$wor_D',
        },
    })

    cy.get('.username-field').type('user');
    cy.get('.password-field').type('Pa$$wor_D');
    cy.get('button[type="submit"]').click();

    cy.contains('button', 'Parts').click();
    cy.get('.parts-table-container').should('be.visible');
    cy.contains('button', 'Add New Part').click();
    cy.get('.modal-content').should('be.visible');

    cy.intercept('POST', `/parts`).as('postPart');

    cy.get('input[name="name"]').type('Test Part');
    cy.get('input[name="description"]').type('test description');
    cy.get('input[name="totalCount"]').type('10');
    cy.get('input[name="reservedCount"]').type('0');
    cy.get('input[name="availableCount"]').type('10');
    cy.get('input[name="price"]').type('49.99');

    cy.get('form').submit();

    cy.wait('@postPart').its('response.statusCode').should('eq', 201);
});

it('Can update any and all fields of a part.',()=>{
    cy.visit('/', {
        auth: {
            username: 'user',
            password: 'Pa$$wor_D',
        },
    })

    cy.get('.username-field').type('user');
    cy.get('.password-field').type('Pa$$wor_D');
    cy.get('button[type="submit"]').click();

    cy.contains('button', 'Parts').click();
    cy.get('.parts-table-container').should('be.visible');

    cy.contains('tr', 'Test Part').within(() => {
        cy.contains('button', 'Update').click();
    });

    cy.get('input[name="name"]').eq(1).clear();
    cy.get('input[name="name"]').eq(1).type('Test Part2');

    cy.get('input[name="description"]').eq(1).clear();
    cy.get('input[name="description"]').eq(1).type('test description2');

    cy.get('input[name="totalCount"]').eq(1).clear();
    cy.get('input[name="totalCount"]').eq(1).type('20');

    cy.get('input[name="reservedCount"]').eq(1).clear();
    cy.get('input[name="reservedCount"]').eq(1).type('0');

    cy.get('input[name="availableCount"]').eq(1).clear();
    cy.get('input[name="availableCount"]').eq(1).type('20');

    cy.get('input[name="price"]').eq(1).clear();
    cy.get('input[name="price"]').eq(1).type('30.00');

    cy.get('form').eq(1).submit();

    cy.get('div.modal-content').should('not.be.visible');
});

it('Can delete a part.',()=>{
    cy.visit('/', {
        auth: {
            username: 'user',
            password: 'Pa$$wor_D',
        },
    })

    cy.get('.username-field').type('user');
    cy.get('.password-field').type('Pa$$wor_D');
    cy.get('button[type="submit"]').click();

    cy.contains('button', 'Parts').click();
    cy.get('.parts-table-container').should('be.visible');

    cy.contains('tr', 'Test Part2').within(() => {
        cy.contains('button', 'Delete').click();
    });

    cy.get('.dialog-overlay').should('be.visible');
    cy.get('div.dialog div button').eq(0).click();

    cy.get('.parts-table-container').within(() => {
        cy.contains('tr', 'Test Part2').should('not.exist');
    });

});
