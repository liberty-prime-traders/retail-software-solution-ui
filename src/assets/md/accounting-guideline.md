# Account Reference Guide

## Introduction

Most accounts in the chart of accounts behave intuitively — Cash goes up when money comes in, Accounts Payable goes up when you owe a supplier. However, a handful of accounts have less obvious behavior, either because they work against their parent type (contra accounts), represent abstract concepts, or serve as system-managed parent containers.

This document explains those accounts, why they exist, and how they behave with examples.

---

## Numbering System

Account codes follow a structured pattern:

```
X-1000   root       (type container, system managed)
X-1100   category   (grouping, usually not postable)
X-1110   leaf       (postable, receives entries)
```

The letter prefix denotes the account type:

| Prefix | Type                         |
|--------|------------------------------|
| A      | Asset / Asset Contra         |
| L      | Liability / Liability Contra |
| E      | Equity / Equity Contra       |
| R      | Revenue / Revenue Contra     |
| X      | Expense                      |

The numeric part encodes the hierarchy — a child's numeric part always starts with its parent's numeric part. `A-1210` is a child of `A-1200`, which is a child of `A-1000`.

Each parent can have a maximum of **9 direct children**, incrementing by 10 at each level:
- Root children: `X-1000` → `X-1100`, `X-1200` ... `X-1900`
- Category children: `X-1100` → `X-1110`, `X-1120` ... `X-1190`

A maximum of **3 levels** are supported. If a category exhausts its 9 children, a sibling category is created to continue the grouping.

---

## Account Flags

Each account carries three structural flags:

**`account_type`**
Determines the side of the accounting equation and the normal balance — the direction that increases the account.

| Type             | Normal Balance |
|------------------|----------------|
| Asset            | Debit          |
| Asset Contra     | Credit         |
| Liability        | Credit         |
| Liability Contra | Debit          |
| Equity           | Credit         |
| Equity Contra    | Debit          |
| Revenue          | Credit         |
| Revenue Contra   | Debit          |
| Expense          | Debit          |

**`is_postable`**
Whether ledger entries can be posted directly to this account. Parent/grouping accounts are not postable — entries go to their children. When the first child is created under an account, it flips to `is_postable = false`.

**`is_system`**
All seeded accounts are system accounts. System accounts cannot be deactivated or renamed. They form the structural backbone the accounting consumer depends on.

---

## Contra Accounts

A contra account reduces the net value of a related account rather than increasing it. Its normal balance is the **opposite** of its parent type. Contra accounts share the same letter prefix as their parent type — `A-` for asset contras, `R-` for revenue contras, etc.

---

### A-1220 Allowance for Doubtful Accounts

**Type:** Asset Contra
**Normal balance:** Credit
**Parent:** A-1200 Accounts Receivable

When credit sales are made, some customers may not pay. Rather than waiting for the debt to go bad, the org estimates uncollectable amounts and records them here. This reduces the net receivable balance without removing the original invoice.

**Example: Estimate $200 in uncollectable receivables**
```
Debit:  X-2200 Bad Debt Expense                  $200
Credit: A-1220 Allowance for Doubtful Accounts   $200
```

**Reporting:**
```
A-1210 Trade Receivables                  $5,000
A-1220 Allowance for Doubtful Accounts     ($200)
──────────────────────────────────────────────────
Net Receivables                           $4,800
```

**If the customer pays up:**
```
// Reverse the allowance
Debit:  A-1220 Allowance for Doubtful Accounts   $200
Credit: X-2200 Bad Debt Expense                  $200

// Record the payment
Debit:  A-1100 Cash                  $200
Credit: A-1210 Trade Receivables     $200
```

---

### A-2600 Accumulated Depreciation

**Type:** Asset Contra
**Normal balance:** Credit
**Parent:** A-2000 Fixed Assets

Fixed assets lose value over time. Rather than reducing the asset account directly, depreciation is recorded here. This preserves the original cost on the asset account while showing the total reduction separately.

**Example: Record monthly depreciation on a vehicle ($500/month)**
```
Debit:  X-2000 Repairs & Maintenance     $500
Credit: A-2600 Accumulated Depreciation  $500
```

**Reporting:**
```
A-2300 Vehicles                   $50,000
A-2600 Accumulated Depreciation   ($6,000)
────────────────────────────────────────────
Net Book Value                    $44,000
```

---

### L-1120 Purchase Discounts

**Type:** Liability Contra
**Normal balance:** Debit
**Parent:** L-1100 Accounts Payable

When a supplier offers an early payment discount (e.g. "pay within 10 days, get 2% off"), the full invoice is recorded to Trade Payables. When payment is made early and the discount is taken, the saving is recorded here rather than reducing the original payable.

**Example: $100 invoice, 2% early payment discount taken**
```
// Original invoice
Debit:  A-1300 Inventory          $100
Credit: L-1110 Trade Payables     $100

// Early payment
Debit:  L-1110 Trade Payables     $100
Credit: A-1100 Cash                $98
Credit: L-1120 Purchase Discounts   $2
```

**Reporting:**
```
L-1110 Trade Payables        $10,000
L-1120 Purchase Discounts      ($200)
──────────────────────────────────────
Net Payables                  $9,800
```

---

### E-1300 Owner's Draws

**Type:** Equity Contra
**Normal balance:** Debit
**Parent:** E-1000 Equity

When an owner takes money out of the business for personal use, it is not an expense — it is a reduction in the owner's stake. Recording it as an expense would distort profit figures.

**Example: Owner withdraws $2,000**
```
Debit:  E-1300 Owner's Draws  $2,000
Credit: A-1100 Cash           $2,000
```

**Reporting:**
```
E-1100 Owner's Capital    $50,000
E-1200 Retained Earnings  $12,000
E-1300 Owner's Draws      ($2,000)
───────────────────────────────────
Total Equity              $60,000
```

At year end, Owner's Draws is closed into Owner's Capital, resetting it to zero for the new period.

---

### R-1120 Sales Returns

**Type:** Revenue Contra
**Normal balance:** Debit
**Parent:** R-1100 Sales Revenue

When a customer returns goods, the original sale is not reversed. Instead, the return is recorded here, reducing net revenue while preserving the original transaction for audit purposes.

**Example: Customer returns $50 goods, refund issued**
```
Debit:  R-1120 Sales Returns  $50
Credit: A-1100 Cash           $50

// Inventory reinstated at cost ($30)
Debit:  A-1300 Inventory           $30
Credit: X-1100 Cost of Goods Sold  $30
```

---

### R-1130 Sales Allowances

**Type:** Revenue Contra
**Normal balance:** Debit
**Parent:** R-1100 Sales Revenue

When a customer keeps goods but receives a partial refund due to damage or quality issues, the adjustment is recorded here rather than as a return.

**Example: $20 allowance granted on damaged goods, customer keeps them**
```
Debit:  R-1130 Sales Allowances  $20
Credit: A-1100 Cash              $20
```

No inventory entry — the goods were not returned.

---

### R-1140 Sales Discounts

**Type:** Revenue Contra
**Normal balance:** Debit
**Parent:** R-1100 Sales Revenue

Discounts given at point of sale are recorded here. Revenue is posted at full price to `R-1110 Gross Sales`, and the discount is captured separately — giving the org visibility into how much revenue was sacrificed through promotions and markdowns.

**Example: $100 item sold with 10% discount**
```
Debit:  A-1100 Cash              $90
Debit:  R-1140 Sales Discounts   $10
Credit: R-1110 Gross Sales      $100
```

**Reporting:**
```
R-1110 Gross Sales         $100,000
R-1120 Sales Returns        ($2,000)
R-1130 Sales Allowances       ($500)
R-1140 Sales Discounts      ($3,000)
────────────────────────────────────
Net Revenue                 $94,500
```

---

## Abstract Accounts

---

### E-1200 Retained Earnings

**Type:** Equity
**Normal balance:** Credit
**Parent:** E-1000 Equity

Retained Earnings represents the accumulated profit the business has kept since it was founded — all revenue minus all expenses minus owner draws, across all time. It is not posted to during normal operations. At year end, a closing entry moves net income into Retained Earnings and zeros out revenue and expense accounts.

**Example: Year-end close with $15,000 net profit**
```
Debit:  R-1110 Gross Sales          $80,000
Credit: X-1100 Cost of Goods Sold   $45,000
Credit: X-1200 Wages Expense        $20,000
Credit: E-1200 Retained Earnings    $15,000
```

**Example: Year-end close with $5,000 net loss**
```
Debit:  R-1110 Gross Sales          $60,000
Debit:  E-1200 Retained Earnings     $5,000
Credit: X-1100 Cost of Goods Sold   $45,000
Credit: X-1200 Wages Expense        $20,000
```

---

### X-2200 Bad Debt Expense

**Type:** Expense
**Normal balance:** Debit
**Parent:** X-1000 Expenses

The expense recognized when a receivable is estimated to be uncollectable. Works in tandem with `A-1220 Allowance for Doubtful Accounts`. See that account for full examples.

---

## System-Managed Parent Containers

These accounts exist solely to group related accounts. They are not postable — entries go to their children. The system protects them from deactivation or renaming.

---

### A-1400 Tax Recoverable

**Type:** Asset
**Normal balance:** Debit
**`is_postable`:** false

Groups all taxes the org has paid to suppliers and is entitled to reclaim from the government. The org admin creates child accounts here for each recoverable tax type they configure (e.g. A-1410 VAT Recoverable).

---

### A-1500 Bank Accounts

**Type:** Asset
**Normal balance:** Debit
**`is_postable`:** false

Groups all bank and mobile money accounts the org operates. The admin creates a child account for each payment method (e.g. A-1510 KCB Current Account, A-1520 M-Pesa Float). Each payment method maps to its corresponding child account for ledger routing.

---

### L-1200 Tax Payable

**Type:** Liability
**Normal balance:** Credit
**`is_postable`:** false

Groups all taxes collected on behalf of the government that have not yet been remitted. The org admin creates child accounts here for each tax type they configure (e.g. L-1210 TOT Payable).

**Example: Sale generates TOT at 2%**
```
Debit:  A-1100 Cash              $100.00
Credit: R-1110 Gross Sales        $98.04
Credit: L-1210 TOT Payable         $1.96
```

**Remitting to government:**
```
Debit:  L-1210 TOT Payable   $1.96
Credit: A-1100 Cash          $1.96
```

---

### X-1500 Inbound Shipping

**Type:** Expense
**Normal balance:** Debit
**`is_postable`:** false

Groups costs incurred bringing goods into the business. Split into two children:

- **X-1510 Supplier Delivery Charges** — delivery fee on the supplier invoice
- **X-1520 Third-Party Freight/Haulage** — separate invoices from logistics providers

**Example: Supplier charges $10 delivery, separate freight invoice for $25**
```
Debit:  A-1300 Inventory                     $100
Debit:  X-1510 Supplier Delivery Charges      $10
Credit: L-1110 Trade Payables                $110

Debit:  X-1520 Third-Party Freight/Haulage    $25
Credit: L-1110 Trade Payables                 $25
```
