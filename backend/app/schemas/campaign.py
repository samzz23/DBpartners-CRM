from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from ..models.campaign import CampaignStatus, CampaignType

class CampaignBase(BaseModel):
    name: str
    client_id: int
    campaign_type: CampaignType
    status: CampaignStatus = CampaignStatus.DRAFT
    budget: float
    spent: float = 0.0
    start_date: datetime
    end_date: Optional[datetime] = None
    description: Optional[str] = None
    target_audience: Optional[str] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    campaign_type: Optional[CampaignType] = None
    status: Optional[CampaignStatus] = None
    budget: Optional[float] = None
    spent: Optional[float] = None
    end_date: Optional[datetime] = None
    description: Optional[str] = None
    target_audience: Optional[str] = None

class CampaignResponse(CampaignBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CampaignMetricBase(BaseModel):
    campaign_id: int
    date: datetime
    impressions: int = 0
    clicks: int = 0
    conversions: int = 0
    cost: float = 0.0
    revenue: float = 0.0
    likes: int = 0
    shares: int = 0
    comments: int = 0
    followers_gained: int = 0
    additional_metrics: Optional[Dict[str, Any]] = None

class CampaignMetricCreate(CampaignMetricBase):
    pass

class CampaignMetricResponse(CampaignMetricBase):
    id: int
    ctr: float
    cpc: float
    cpa: float
    roi: float
    conversion_rate: float
    engagement_rate: float
    created_at: datetime

    class Config:
        from_attributes = True

class CampaignReportBase(BaseModel):
    campaign_id: int
    report_name: str
    report_date: datetime
    report_data: Dict[str, Any]
    source: Optional[str] = None
    notes: Optional[str] = None

class CampaignReportCreate(CampaignReportBase):
    pass

class CampaignReportResponse(CampaignReportBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
