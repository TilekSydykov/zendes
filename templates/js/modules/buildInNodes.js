export const Nodes = {
    domain: {
        id: "d1",
        name: "Domain",
        outputs: [
            {
                name: "domain name",
                editable: true,
            }
        ],
        inputs: []
    },
    entry:{
        id: "e1",
        name: "Entry",
        outputs: [
            {
                name: "entry name",
                editable: true
            }
        ],
        inputs: [
            {
                name: "/",
                editable: false
            }
        ]
    },
    post: {
        id: "post",
        name: "POST",
        outputs: [
            {
                name: "data",
                editable: true
            }
        ],
        inputs: [
            {
                name: "entry",
                editable: false
            }
        ]
    },
    get: {
        id: "get",
        name: "GET",
        outputs: [
            {
                name: "data",
                editable: true
            }
        ],
        inputs: [
            {
                name: "entry",
                editable: false
            }
        ]
    },
    template: {
        id: "template",
        name: "Template",
        outputs: [
            {
                name: "html",
                editable: true
            }
        ],
        inputs: [
            {
                name: "title",
                editable: true
            },
            {
                name: "style",
                editable: true
            },
            {
                name: "link",
                editable: true
            },
            {
                name: "user",
                editable: true
            }
        ]
    },
    database: {
        id: "database",
        name: "Database",
        outputs: [
            {
                name: "html",
                editable: true
            }
        ],
        inputs: [
            {
                name: "connection",
                editable: true
            }
        ]
    },
    response: {
        id: "response",
        name: "Response",
        outputs: [

        ],
        inputs: [
            {
                name: "html/json",
                editable: true
            }
        ]
    }
};
