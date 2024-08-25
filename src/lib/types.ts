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

interface Field {
    field_name: string
    field_step: number
    field_type: string
    field_unit: string
    field_range: [number, number]
    field_precision: number | null
}

interface Asset {
    tag: string
    extension: string
    mime_type: string
    description: string
}

export interface Project {
    project_name: string
    creation_date: string
    variable_metadata: Field[]
    output_metadata: Field[]
    assets: Asset[],
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
