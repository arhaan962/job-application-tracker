const applications = [
    {
        id: 1,
        company: "Google",
        role: "SWE Intern",
        status: "Applied"
    },
    {
        id: 2,
        company: "Microsoft",
        role: "Backend Intern",
        status: "Interview"
    },
    {
        id: 3,
        company: "Amazon",
        role: "SDE Intern",
        status: "Applied"
    }
];

function listApplications() {
    applications.forEach(app => {
        console.log(
            `${app.company} | ${app.role} | ${app.status}`
        );
    });
}

function getApplicationsByStatus(status) {
    return applications.filter(
        app => app.status === status
    );
}

function addApplication(company, role) {
    const newApplication = {
        id: Date.now(),
        company: company,
        role: role,
        status: "Applied"
    };

    applications.push(newApplication);
}
listApplications();

console.log(
    getApplicationsByStatus("Interview")
);

addApplication("Adobe", "Frontend Intern");

console.log("After adding Adobe:");
listApplications();