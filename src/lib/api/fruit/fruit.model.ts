import {BaseModel} from '../base-api/base.model'

export interface Fruit extends BaseModel{
    createdBy?: string
    createdOn?: number
    usageCount?: number
    name?: string
    alternativeName?:string
    color?:string
    cost?:number
    edibleInd?:boolean
}
