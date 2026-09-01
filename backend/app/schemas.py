from pydantic import BaseModel


class KPIOut(BaseModel):
    deliveries: int
    delivery_cost: float
    on_time_rate: float
    avg_delivery_time: float
    avg_rating: float
    partners: int
    regions: int


class PartnerPerformanceOut(BaseModel):
    delivery_partner: str
    deliveries: int
    avg_cost: float
    avg_delivery_time: float
    on_time_rate: float
    avg_rating: float
    delay_rate: float


class RegionPerformanceOut(BaseModel):
    region: str
    deliveries: int
    avg_cost: float
    avg_delivery_time: float
    on_time_rate: float
    avg_rating: float
    delay_rate: float


class RecommendationOut(BaseModel):
    region: str
    delivery_partner: str
    decision_score: float
    avg_cost: float
    avg_delivery_time: float
    on_time_rate: float
    avg_rating: float