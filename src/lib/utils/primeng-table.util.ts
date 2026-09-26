import {Table} from 'primeng/table'

export const resetVirtualScrollOnSearch = (table: Table): void => {
  table.resetScrollTop()
  table.scroller()?.init()
}
