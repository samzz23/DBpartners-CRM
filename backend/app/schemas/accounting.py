from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.accounting import InvoiceStatus, PaymentMethod, ExpenseCategory

class InvoiceBase(BaseModel):
    invoice_number: str
    client_id: int
    amount: float
    status: InvoiceStatus = InvoiceStatus.DRAFT
    issue_date: datetime
    due_date: Optional[datetime] = None
    description: Optional[str] = None
    notes: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    amount: Optional[float] = None
    status: Optional[InvoiceStatus] = None
    due_date: Optional[datetime] = None
    description: Optional[str] = None
    notes: Optional[str] = None

class InvoiceResponse(InvoiceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaymentBase(BaseModel):
    client_id: int
    invoice_id: Optional[int] = None
    amount: float
    payment_method: PaymentMethod = PaymentMethod.BANK_TRANSFER
    payment_date: datetime
    reference_number: Optional[str] = None
    notes: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    description: str
    amount: float
    category: ExpenseCategory = ExpenseCategory.OTHER
    expense_date: datetime
    vendor: Optional[str] = None
    receipt_number: Optional[str] = None
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[ExpenseCategory] = None
    expense_date: Optional[datetime] = None
    vendor: Optional[str] = None
    receipt_number: Optional[str] = None
    notes: Optional[str] = None

class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
