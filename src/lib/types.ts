export interface Model {
    id: number,
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
    metadata: Metadata
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
    id:     string
    slug:   string
    text:   string
}

export type AdminForm =
    { type: "document", form: { text: string, id: string } } |
    { type: "project", form: { project_name: string, human_name: string, captions: Caption[], vmetadata: ProjectField[], ometadata: ProjectField[], ametadata: ProjectAsset[], description: string } } |
    {type: "none"};

