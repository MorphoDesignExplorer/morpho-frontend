import { type CollaborationMatrixForm, type Project, type Role,  type UserDetails } from "$lib/types";

/**
 * Checks if the user has a set of permissions.
 * Specify permissions by name.
 */
export function CheckUserProperties(user: UserDetails, ...properties: (keyof Omit<Role, "role_name">)[]): boolean {
  const propertyFunc = ([_, role]: [any, Omit<Role, "role_name">]) => {
    return properties.map(
      key => role[key]
    )
    .reduce(
      (truthValue, current) => (
        truthValue || (current === true)
      ), false
    )
  };

  return user
    .permissions
    .map(
      propertyFunc
    )
    .find(
      truthVal => truthVal === true
    ) || false
}

export const UserCanCreateProject= (user: UserDetails) => CheckUserProperties(user, "can_create_project");
export const UserIsAdmin = (user: UserDetails) => CheckUserProperties(user, "is_admin");
export const UserCanCollaborate = (user: UserDetails) => CheckUserProperties(
  user,
  "can_assign_user",
  "can_drop_user",
  "can_invite",
);
export const UserCanEditDocuments = (user: UserDetails) => CheckUserProperties(
  user, 
  "can_create_document",
  "can_update_document",
  "can_delete_document"
);


export function UserEditableProjects(user: UserDetails, projects: Project[]): Project[] {
  if (UserIsAdmin(user)) {
    return projects
  } else {
    return projects.filter(project => RoleOnProject(user, project.project_name) != undefined)
  }
}

export function RoleOnProject(user: UserDetails, projectName: string): Role | undefined {
  return user.permissions.find(
    ([_projectName, role]) => projectName == _projectName
  )?.[1]
}

export function RoleCmp(left: Role, right: Role)  {
  const leftKeys = new Set((Object.keys(left) as (keyof Role)[]).filter(key => left[key] === true))
  const rightKeys= new Set((Object.keys(right) as (keyof Role)[]).filter(key => right[key] === true))

  if (leftKeys.isSubsetOf(rightKeys) && leftKeys.size < rightKeys.size) {
      return -1;
  } else if (rightKeys.isSubsetOf(leftKeys) && leftKeys.size < rightKeys.size) {
      return 1;
  } else {
      return 0;
  }
}

/** Check if the user has any permission that can manage this role on this project. */
export function CanManageRole(user: UserDetails,  projectName: string, role: Role): boolean {
  if (UserIsAdmin(user)) {
    return true
  }

  const targetRole = user
    .permissions
    .find(
      ([_projectName, _]) => projectName == _projectName
    )
    ?.[1]

  if (targetRole) {
    return RoleCmp(role, targetRole) == -1
  } else {
    return false
  }
}

export function SortRoles(roles: Role[]): Role[] {
    return roles.sort(RoleCmp)
}

export function ToMatrixForm(users: UserDetails[]): CollaborationMatrixForm {
  return users.map(user => ({
    email: user.email,
    roles: user.permissions.map(([projectName, role]) => ({
      email: user.email,
      role: role.role_name,
      project: projectName
    }))
  }))
}
