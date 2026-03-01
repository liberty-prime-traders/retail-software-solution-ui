import {PageResponse} from '../../api/util/paginated-api/page-response.model'

export namespace RtsDeclaredTypes {
  export declare type OrPaginated<T> = T | T[] | PageResponse<T>

  export declare type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T
}
