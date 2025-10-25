from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base

class CampaignStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CampaignType(str, enum.Enum):
    SOCIAL_MEDIA = "social_media"
    EMAIL = "email"
    PPC = "ppc"
    DISPLAY = "display"
    CONTENT = "content"
    SEO = "seo"
    OTHER = "other"

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    campaign_type = Column(Enum(CampaignType), nullable=False)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT)
    budget = Column(Float, nullable=False)
    spent = Column(Float, default=0.0)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime)
    description = Column(Text)
    target_audience = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="campaigns")
    metrics = relationship("CampaignMetric", back_populates="campaign", cascade="all, delete-orphan")
    reports = relationship("CampaignReport", back_populates="campaign", cascade="all, delete-orphan")

class CampaignMetric(Base):
    __tablename__ = "campaign_metrics"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)

    # Core Metrics
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    cost = Column(Float, default=0.0)
    revenue = Column(Float, default=0.0)

    # Calculated Metrics
    ctr = Column(Float, default=0.0)  # Click-through rate
    cpc = Column(Float, default=0.0)  # Cost per click
    cpa = Column(Float, default=0.0)  # Cost per acquisition
    roi = Column(Float, default=0.0)  # Return on investment
    conversion_rate = Column(Float, default=0.0)

    # Social Media Metrics
    likes = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    followers_gained = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)

    # Additional metrics as JSON for flexibility
    additional_metrics = Column(JSON)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    campaign = relationship("Campaign", back_populates="metrics")

class CampaignReport(Base):
    __tablename__ = "campaign_reports"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    report_name = Column(String, nullable=False)
    report_date = Column(DateTime, default=datetime.utcnow)
    report_data = Column(JSON, nullable=False)  # Store ingested report data
    source = Column(String)  # Where the report came from (e.g., "Google Ads", "Facebook", "Manual")
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    campaign = relationship("Campaign", back_populates="reports")
