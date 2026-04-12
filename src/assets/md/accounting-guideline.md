# Account Reference Guide

Most accounts in the chart of accounts behave intuitively — Cash goes up when money comes in, Accounts Payable goes up when you owe a supplier. However, a handful of accounts have less obvious behavior, either because they work against their parent type (contra accounts), represent abstract concepts, or serve as system-managed parent containers.

This document explains those accounts, why they exist, and how they behave with examples.

<details>
<summary>Numbering System</summary>

Account codes use dot-notation with zero-padded 3-digit segments:

```
001             root
001.001         category
001.001.001     leaf
```

Displayed without leading zeros: `1.1.1`

The numeric position encodes the hierarchy — `1.2.1` is the first child of `1.2`, which is the second child of `1`. There is no depth limit. Each parent can have up to 999 children.

Entries can only be posted to accounts with no children. Parent accounts exist solely for grouping.

System roots are reserved from `001` to `099`. Organisation-created roots start from `100` onwards.

</details>

<details>
<summary>Account Type</summary>

Account type is a separate field — not encoded in the code. It determines the side of the accounting equation and the normal balance direction.

| Type             | Normal Balance | Meaning                  |
|------------------|----------------|--------------------------|
| Asset            | Debit          | Things the business owns |
| Asset Contra     | Credit         | Reduces asset value      |
| Liability        | Credit         | Things the business owes |
| Liability Contra | Debit          | Reduces liability value  |
| Equity           | Credit         | Owner's stake            |
| Equity Contra    | Debit          | Reduces equity           |
| Revenue          | Credit         | Income earned            |
| Revenue Contra   | Debit          | Reduces revenue          |
| Expense          | Debit          | Costs incurred           |


</details>

<details>
<summary>Seeded Account Structure</summary>

All seeded accounts are system-maintained and cannot be renamed or deactivated. Three system accounts are extensible — organisations create children under them:

- `1.1.4 Tax Recoverable`
- `1.1.5 Digital Payments`
- `2.2 Tax Payable`

Organization-created root accounts (from `100` onwards) and their children are fully managed by the org admin.

```
001                 Assets
001.001             Current Assets
001.001.001         Cash
001.001.002         Accounts Receivable
001.001.002.001     Trade Receivables
001.001.002.002     Allowance for Doubtful Accounts
001.001.003         Inventory
001.001.004         Tax Recoverable         ← extensible
001.001.005         Digital Payments        ← extensible
001.001.005.001     Bank

001.002             Fixed Assets
001.002.001         Furniture & Fixtures
001.002.002         Equipment
001.002.003         Vehicles
001.002.004         Buildings
001.002.005         Land
001.002.006         Accumulated Depreciation

002                 Liabilities
002.001             Accounts Payable
002.001.001         Trade Payables
002.001.002         Purchase Discounts
002.002             Tax Payable             ← extensible
002.003             Wages Payable

003                 Equity
003.001             Owner's Capital
003.002             Retained Earnings
003.003             Owner's Draws

004                 Revenue
004.001             Sales Revenue
004.001.001         Gross Sales
004.001.002         Sales Returns
004.001.003         Sales Allowances
004.001.004         Sales Discounts
004.002             Other Income

005                 Expenses
005.001             Cost of Goods Sold
005.002             Wages Expense
005.003             Rent Expense
005.004             Utilities Expense
005.005             Inbound Shipping
005.005.001         Supplier Delivery Charges
005.005.002         Third-Party Freight/Haulage
005.006             Outbound Shipping
005.007             Office Supplies
005.008             Staff Welfare
005.009             Equipment & Electronics
005.010             Repairs & Maintenance
005.011             Shrinkage & Losses
005.012             Bad Debt Expense
005.013             Other Operating Expenses
```

</details>

<details>
<summary>Contra Accounts</summary>

A contra account reduces the net value of a related account rather than increasing it. Its normal balance is the opposite of its parent type.

<details>
<summary>1.1.2.2 Allowance for Doubtful Accounts</summary>

**Type:** Asset Contra
**Normal balance:** Credit
**Parent:** 1.1.2 Accounts Receivable

When credit sales are made, some customers may not pay. Rather than waiting for the debt to go bad, the org estimates uncollectable amounts and records them here. This reduces the net receivable balance without removing the original invoice.

**Example: Estimate $200 in uncollectable receivables**
```
Debit:  5.12 Bad Debt Expense                    $200
Credit: 1.1.2.2 Allowance for Doubtful Accounts  $200
```

**Reporting:**
```
1.1.2.1 Trade Receivables                  $5,000
1.1.2.2 Allowance for Doubtful Accounts     ($200)
──────────────────────────────────────────────────
Net Receivables                            $4,800
```

**If the customer pays up:**
```
Debit:  1.1.2.2 Allowance for Doubtful Accounts  $200
Credit: 5.12 Bad Debt Expense                     $200

Debit:  1.1.1 Cash                   $200
Credit: 1.1.2.1 Trade Receivables    $200
```

</details>

<details>
<summary>1.2.6 Accumulated Depreciation</summary>

**Type:** Asset Contra
**Normal balance:** Credit
**Parent:** 1.2 Fixed Assets

Fixed assets lose value over time. Rather than reducing the asset account directly, depreciation is recorded here. This preserves the original cost on the asset account while showing the total reduction separately.

**Example: Record monthly depreciation on a vehicle ($500/month)**
```
Debit:  5.10 Repairs & Maintenance      $500
Credit: 1.2.6 Accumulated Depreciation  $500
```

**Reporting:**
```
1.2.3 Vehicles                    $50,000
1.2.6 Accumulated Depreciation    ($6,000)
────────────────────────────────────────────
Net Book Value                    $44,000
```

</details>

<details>
<summary>2.1.2 Purchase Discounts</summary>

**Type:** Liability Contra
**Normal balance:** Debit
**Parent:** 2.1 Accounts Payable

When a supplier offers an early payment discount, the full invoice is recorded to Trade Payables. When payment is made early and the discount is taken, the saving is recorded here.

**Example: $100 invoice, 2% early payment discount taken**
```
Debit:  1.1.3 Inventory          $100
Credit: 2.1.1 Trade Payables     $100

Debit:  2.1.1 Trade Payables     $100
Credit: 1.1.1 Cash                $98
Credit: 2.1.2 Purchase Discounts   $2
```

**Reporting:**
```
2.1.1 Trade Payables        $10,000
2.1.2 Purchase Discounts      ($200)
──────────────────────────────────────
Net Payables                  $9,800
```

</details>

<details>
<summary>3.3 Owner's Draws</summary>

**Type:** Equity Contra
**Normal balance:** Debit
**Parent:** 3 Equity

When an owner takes money out of the business for personal use, it is not an expense — it is a reduction in the owner's stake.

**Example: Owner withdraws $2,000**
```
Debit:  3.3 Owner's Draws  $2,000
Credit: 1.1.1 Cash         $2,000
```

**Reporting:**
```
3.1 Owner's Capital    $50,000
3.2 Retained Earnings  $12,000
3.3 Owner's Draws      ($2,000)
───────────────────────────────
Total Equity           $60,000
```

</details>

<details>
<summary>4.1.2 Sales Returns</summary>

**Type:** Revenue Contra
**Normal balance:** Debit
**Parent:** 4.1 Sales Revenue

When a customer returns goods, the original sale is not reversed. The return is recorded here, reducing net revenue while preserving the original transaction.

**Example: Customer returns $50 goods, refund issued**
```
Debit:  4.1.2 Sales Returns  $50
Credit: 1.1.1 Cash           $50

Debit:  1.1.3 Inventory          $30
Credit: 5.1 Cost of Goods Sold   $30
```

</details>

<details>
<summary>4.1.3 Sales Allowances</summary>

**Type:** Revenue Contra
**Normal balance:** Debit
**Parent:** 4.1 Sales Revenue

When a customer keeps goods but receives a partial refund due to damage or quality issues.

**Example: $20 allowance granted on damaged goods**
```
Debit:  4.1.3 Sales Allowances  $20
Credit: 1.1.1 Cash              $20
```

</details>

<details>
<summary>4.1.4 Sales Discounts</summary>

**Type:** Revenue Contra
**Normal balance:** Debit
**Parent:** 4.1 Sales Revenue

Discounts given at point of sale. Revenue is posted at full price to `4.1.1 Gross Sales` and the discount captured separately.

**Example: $100 item sold with 10% discount**
```
Debit:  1.1.1 Cash             $90
Debit:  4.1.4 Sales Discounts  $10
Credit: 4.1.1 Gross Sales     $100
```

**Reporting:**
```
4.1.1 Gross Sales         $100,000
4.1.2 Sales Returns        ($2,000)
4.1.3 Sales Allowances       ($500)
4.1.4 Sales Discounts      ($3,000)
────────────────────────────────────
Net Revenue                 $94,500
```

</details>

</details>

<details>
<summary>Abstract Accounts</summary>

<details>
<summary>3.2 Retained Earnings</summary>

**Type:** Equity
**Normal balance:** Credit
**Parent:** 3 Equity

Accumulated profit the business has kept since founding. Not posted to during normal operations — updated at year-end via closing entries.

**Example: Year-end close with $15,000 net profit**
```
Debit:  4.1.1 Gross Sales          $80,000
Credit: 5.1 Cost of Goods Sold     $45,000
Credit: 5.2 Wages Expense          $20,000
Credit: 3.2 Retained Earnings      $15,000
```

**Example: Year-end close with $5,000 net loss**
```
Debit:  4.1.1 Gross Sales          $60,000
Debit:  3.2 Retained Earnings       $5,000
Credit: 5.1 Cost of Goods Sold     $45,000
Credit: 5.2 Wages Expense          $20,000
```

</details>

<details>
<summary>5.12 Bad Debt Expense</summary>

**Type:** Expense
**Normal balance:** Debit
**Parent:** 5 Expenses

The expense recognized when a receivable is estimated to be uncollectable. Works in tandem with `1.1.2.2 Allowance for Doubtful Accounts`. See that account for full examples.

</details>

</details>

<details>
<summary>System-managed Parent Containers</summary>

These accounts exist solely to group related accounts. They cannot receive entries directly. The system protects them from deactivation or renaming.

<details>
<summary>1.1.4 Tax Recoverable</summary>

**Type:** Asset
**Normal balance:** Debit
**Extensible:** Yes

Groups all taxes the org has paid to suppliers and is entitled to reclaim from the government. The org admin creates child accounts here for each recoverable tax type they configure.

</details>

<details>
<summary>1.1.5 Digital Payments</summary>

**Type:** Asset
**Normal balance:** Debit
**Extensible:** Yes

Groups all bank and mobile money accounts the org operates. The admin creates a child account for each payment channel. Each payment method maps to its corresponding child account for ledger routing.

```
1.1.5     Digital Payments
1.1.5.1   Bank              ← system seeded
1.1.5.2   Mpesa Float       ← admin created
1.1.5.3   Airtel Float      ← admin created
```

</details>

<details>
<summary>2.2 Tax Payable</summary>

**Type:** Liability
**Normal balance:** Credit
**Extensible:** Yes

Groups all taxes collected on behalf of the government that have not yet been remitted. The org admin creates child accounts here for each tax type they configure.

**Example: Sale generates TOT at 2%**
```
Debit:  1.1.1 Cash           $100.00
Credit: 4.1.1 Gross Sales     $98.04
Credit: 2.2.1 TOT Payable      $1.96
```

**Remitting to government:**
```
Debit:  2.2.1 TOT Payable   $1.96
Credit: 1.1.1 Cash          $1.96
```

</details>

<details>
<summary>5.5 Inbound Shipping</summary>

**Type:** Expense
**Normal balance:** Debit

Groups costs incurred bringing goods into the business:

- `5.5.1 Supplier Delivery Charges` — delivery fee on the supplier invoice
- `5.5.2 Third-Party Freight/Haulage` — separate invoices from logistics providers

**Example:**
```
Debit:  1.1.3 Inventory                    $100
Debit:  5.5.1 Supplier Delivery Charges     $10
Credit: 2.1.1 Trade Payables               $110

Debit:  5.5.2 Third-Party Freight/Haulage   $25
Credit: 2.1.1 Trade Payables                $25
```

</details>

</details>
