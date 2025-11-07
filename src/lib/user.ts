import { type Role, type Project, DefaultRole } from "$lib/types";
import { type ProjectName } from "$lib/database_get";

type PermissionMatrix = [ProjectName, Role][]

export function CanCreateProject(permissions: PermissionMatrix): boolean {
  return permissions.reduce(
    (prev, current) => (
      prev || current[1].is_admin || current[1].can_create_project
    ),
    false
  )
}

export function PermitFilteredProjects(permissions: PermissionMatrix, projects: Project[]): Project[] {
  return projects.filter(project => {
    permissions.reduce(
      (prev, [project_name, role]) => (
        prev || (project_name === project.project_name
          && (
            role.can_delete_project
            || role.can_upload_to_project
            || role.can_update_project_options
            || role.is_admin
          ))
      ),
      false
    )
    return false;
  })
}

export function CanManage(permissions: PermissionMatrix): boolean {
  return permissions.reduce(
    (prev, [_, role]) => (
      prev || (role.is_admin, role.can_assign_user, role.can_invite, role.can_drop_user)
    ), false);
}

export function GetProjectPermissions(permissions: PermissionMatrix, name: ProjectName): Role {
  let project = permissions.filter(([project_name, role]) => (
    project_name == name
  )).at(0)

  if (project) {
    return project[1]
  } else {
    return DefaultRole();
  }
}

