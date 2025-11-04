export interface Model {
    id: string,
    scoped_id: number,
    parameters: Record<string, string|number>,
    output_parameters: Record<string, string|number>,
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
    id:         string
    slug:       string
    text:       string
    title:      string
    parent:     string
    timestamp:  string
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
        vmetadata: {field_name: string, field_unit: string, display_name: string}[],
        ometadata: {field_name: string, field_unit: string, display_name: string}[],
        ametadata: {tag: string, description: string, is_public: boolean}[],
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
    variable_metadata_options: {field_name: string, field_unit: string, display_name: string }[]
    /** List of options for each output variable. */
    output_metadata_options: {field_name: string, field_unit: string, display_name: string }[]
    /** List of options for each asset. */
    asset_options: {tag: string, description: string, is_public: boolean}[]
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
    return Object.assign(input, EmptyOptions);
}
