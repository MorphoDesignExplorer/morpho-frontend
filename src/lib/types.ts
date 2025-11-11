export interface Model {
    id: string,
    scoped_id: number,
    parameters: Record<string, string | number>,
    output_parameters: Record<string, string | number>,
    files: Record<string, string>[]
}

export type DisplayOptions = {
    filter: boolean,
    grid: boolean,
    graph: boolean,
    sidepane: boolean
}

export type Caption = {
    tag_name: string,
    display_name: string
}

export interface ProjectField {
    field_name: string
    field_step: number
    field_type: string
    field_unit: string
    field_range: [number, number]
    field_precision: number | null
}

export interface ProjectAsset {
    tag: string
    extension: string
    mime_type: string
    description: string
}

export interface Project {
    project_name: string
    creation_date: string
    variable_metadata: ProjectField[]
    output_metadata: ProjectField[]
    assets: ProjectAsset[],
    metadata: Metadata,
    options: ProjectOptions
}

export interface Metadata {
    captions: Caption[]
    description: {
        slug: string
        text: string
    }
    human_name: string
}

export interface Document {
    id: string
    slug: string
    text: string
    title: string
    parent: string
    timestamp: string
}

export type AdminForm =
    {
        type: "document",
        form: {
            text: string,
            id: string,
            title: string,
            parent: string
        }
    } |
    {
        type: "project",
        form: {
            project_name: string,
            is_public: boolean,
            human_name: string,
            captions: Caption[],
            variable_metadata_options: { field_name: string, field_unit: string, display_name: string }[],
            output_metadata_options: { field_name: string, field_unit: string, display_name: string }[],
            asset_options: { tag: string, description: string, is_public: boolean }[],
            description: string
        }
    } |
    { type: "none" };


/**
Options defined for a project at the server-level, by an admin or a collaborator.

NOTE for maintainers: this is meant to be extended over time not fundamentally changed.
Please test any changes in a dev environment before pushing it to production.
*/
export interface ProjectOptions {
    /** Display name of the project.*/
    display_name: string
    /** Variables to display under a swatch in the design explorer. */
    captions: Caption[]
    /** List of options for each input variable. */
    variable_metadata_options: { field_name: string, field_unit: string, display_name: string }[]
    /** List of options for each output variable. */
    output_metadata_options: { field_name: string, field_unit: string, display_name: string }[]
    /** List of options for each asset. */
    asset_options: { tag: string, description: string, is_public: boolean }[]
    /** Is this project publicly visible? */
    is_public: boolean,
}

const EmptyOptions: ProjectOptions = {
    display_name: "",
    captions: [],
    variable_metadata_options: [],
    output_metadata_options: [],
    asset_options: [],
    is_public: false
}

export function mergeDefaultOptions(input: Partial<ProjectOptions>): ProjectOptions {
    return Object.assign(JSON.parse(JSON.stringify(EmptyOptions)), input);
}

/**
User Management Types
*/

/**
Represents a user in the database.
*/
export type User = {
    email: string
    password_hash: string
};

/**
Represents the permissions a role has.
This is structed as a JSON object to keep it extendible in the future.
*/
export type Role = {
    role_name: string
    /// user management permissions
    can_invite: boolean
    can_drop_user: boolean
    can_assign_user: boolean
    /// project management permissions
    can_create_project: boolean
    can_upload_to_project: boolean
    can_update_project_options: boolean
    can_delete_project: boolean
    /// document management permissions
    can_create_document: boolean
    can_delete_document: boolean
    can_update_document: boolean
    /// special permissions
    is_admin: boolean
    is_original_project_owner: boolean
};

export function DefaultRole(): Role {
    return {
        role_name: "",
        can_invite: false,
        can_drop_user: false,
        can_assign_user: false,
        can_create_project: false,
        can_upload_to_project: false,
        can_update_project_options: false,
        can_delete_project: false,
        can_create_document: false,
        can_delete_document: false,
        can_update_document: false,
        is_admin: false,
        is_original_project_owner: false,
    }
}

export type UserDetails = {
    email: string
    permissions: [string, Role][]
}

export type CollaborationMatrixForm = {
    email: string,
    roles: {email: string, role: string, project: string}[]
}[]