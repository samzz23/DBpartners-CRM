from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.campaign import Campaign, CampaignMetric, CampaignReport
from ..schemas.campaign import (
    CampaignCreate, CampaignUpdate, CampaignResponse,
    CampaignMetricCreate, CampaignMetricResponse,
    CampaignReportCreate, CampaignReportResponse
)

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

# Campaign Endpoints
@router.post("/", response_model=CampaignResponse)
def create_campaign(campaign: CampaignCreate, db: Session = Depends(get_db)):
    db_campaign = Campaign(**campaign.model_dump())
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

@router.get("/", response_model=List[CampaignResponse])
def get_campaigns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).offset(skip).limit(limit).all()
    return campaigns

@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(campaign_id: int, campaign_update: CampaignUpdate, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    update_data = campaign_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(campaign, field, value)

    db.commit()
    db.refresh(campaign)
    return campaign

@router.delete("/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    db.delete(campaign)
    db.commit()
    return {"message": "Campaign deleted successfully"}

# Campaign Metrics Endpoints
@router.post("/metrics", response_model=CampaignMetricResponse)
def create_campaign_metric(metric: CampaignMetricCreate, db: Session = Depends(get_db)):
    db_metric = CampaignMetric(**metric.model_dump())

    # Calculate derived metrics
    if db_metric.impressions > 0:
        db_metric.ctr = (db_metric.clicks / db_metric.impressions) * 100

    if db_metric.clicks > 0:
        db_metric.cpc = db_metric.cost / db_metric.clicks

    if db_metric.conversions > 0:
        db_metric.cpa = db_metric.cost / db_metric.conversions
        db_metric.conversion_rate = (db_metric.conversions / db_metric.clicks) * 100 if db_metric.clicks > 0 else 0

    if db_metric.cost > 0:
        db_metric.roi = ((db_metric.revenue - db_metric.cost) / db_metric.cost) * 100

    # Calculate engagement rate for social media
    total_engagements = db_metric.likes + db_metric.shares + db_metric.comments
    if db_metric.impressions > 0:
        db_metric.engagement_rate = (total_engagements / db_metric.impressions) * 100

    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

@router.get("/metrics", response_model=List[CampaignMetricResponse])
def get_campaign_metrics(campaign_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(CampaignMetric)
    if campaign_id:
        query = query.filter(CampaignMetric.campaign_id == campaign_id)
    metrics = query.offset(skip).limit(limit).all()
    return metrics

@router.get("/metrics/{metric_id}", response_model=CampaignMetricResponse)
def get_campaign_metric(metric_id: int, db: Session = Depends(get_db)):
    metric = db.query(CampaignMetric).filter(CampaignMetric.id == metric_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    return metric

# Campaign Report Endpoints (for ingestion)
@router.post("/reports", response_model=CampaignReportResponse)
def ingest_campaign_report(report: CampaignReportCreate, db: Session = Depends(get_db)):
    """
    Ingest a campaign report from external sources.
    The report_data should contain the raw data from the marketing platform.
    """
    db_report = CampaignReport(**report.model_dump())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.get("/reports", response_model=List[CampaignReportResponse])
def get_campaign_reports(campaign_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(CampaignReport)
    if campaign_id:
        query = query.filter(CampaignReport.campaign_id == campaign_id)
    reports = query.offset(skip).limit(limit).all()
    return reports

@router.get("/reports/{report_id}", response_model=CampaignReportResponse)
def get_campaign_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(CampaignReport).filter(CampaignReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
