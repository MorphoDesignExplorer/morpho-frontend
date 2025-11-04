import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    // TODO get MID matrix
    // TODO calculate unique users from matrix
    // TODO get All roles possible from the roles table
    // TODO cluster matrix by user, and have options to add roles under each user instead of the current approach.
    return {
        role: "Admin",
        roles: ["Admin", "Project Owner", "Collaborator", "Viewer"],
        users: ["A@y.com", "B@x.com", "C@z.nz", "JM@umass.edu"],
        matrix: [
            { email: "A@y.com", role: "Project Owner", project: "GCGA_27" },
            { email: "B@x.com", role: "Viewer", project: "GCGA_27" },
            { email: "C@z.nz", role: "Collaborator", project: "GCGA_19" },
        ]
    }
}
