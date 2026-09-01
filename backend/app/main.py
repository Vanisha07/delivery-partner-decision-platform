from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    KPIOut,
    PartnerPerformanceOut,
    RegionPerformanceOut,
    RecommendationOut,
)

from .services.decision_engine import DecisionEngine


app = FastAPI(
    title="Delivery Partner Decision Intelligence API",
    version="1.0.0",
    description=(
        "Decision-support API for analyzing delivery partner "
        "performance and recommending partners by region."
    ),
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://delivery-partner-decision-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


engine = DecisionEngine()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "delivery-partner-decision-api",
    }


@app.get("/api/kpis", response_model=KPIOut)
def kpis():

    df = engine.df

    return KPIOut(
        deliveries=len(df),
        delivery_cost=round(float(df["delivery_cost"].sum()), 2),
        on_time_rate=round(float(df["on_time"].mean() * 100), 2),
        avg_delivery_time=round(
            float(df["delivery_time_hours"].mean()), 2
        ),
        avg_rating=round(
            float(df["delivery_rating"].mean()), 2
        ),
        partners=int(df["delivery_partner"].nunique()),
        regions=int(df["region"].nunique()),
    )


@app.get(
    "/api/partners",
    response_model=list[PartnerPerformanceOut],
)
def partners():

    result = engine.partner_performance()

    return result.to_dict(orient="records")


@app.get(
    "/api/regions",
    response_model=list[RegionPerformanceOut],
)
def regions():

    result = engine.regional_performance()

    return result.to_dict(orient="records")


@app.get(
    "/api/recommendations",
    response_model=list[RecommendationOut],
)
def recommendations():

    result = engine.recommendations()

    return result.to_dict(orient="records")


@app.get("/api/partner-region")
def partner_region():

    result = engine.partner_by_region()

    return result.to_dict(orient="records")

from pydantic import BaseModel


class SimulationRequest(BaseModel):
    region: str
    current_partner: str
    new_partner: str
    shift_percentage: float


@app.post("/api/simulate")
def simulate(request: SimulationRequest):

    df = engine.df

    # Validate shift percentage
    if not 0 <= request.shift_percentage <= 100:
        return {
            "error": "Shift percentage must be between 0 and 100"
        }

    # Filter selected region
    region_df = df[
        df["region"].str.lower() == request.region.lower()
    ]

    if region_df.empty:
        return {
            "error": "Region not found"
        }

    # Filter current partner
    current_df = region_df[
        region_df["delivery_partner"].str.lower()
        == request.current_partner.lower()
    ]

    # Filter new partner
    new_df = region_df[
        region_df["delivery_partner"].str.lower()
        == request.new_partner.lower()
    ]

    if current_df.empty:
        return {
            "error": "Current partner not found for selected region"
        }

    if new_df.empty:
        return {
            "error": "New partner not found for selected region"
        }

    # Calculate shifted deliveries
    shift = request.shift_percentage / 100

    total_deliveries = len(region_df)
    shifted_deliveries = total_deliveries * shift

    # Current partner metrics
    current_cost = current_df["delivery_cost"].mean()
    current_on_time = current_df["on_time"].mean() * 100
    current_time = current_df["delivery_time_hours"].mean()

    # New partner metrics
    new_cost = new_df["delivery_cost"].mean()
    new_on_time = new_df["on_time"].mean() * 100
    new_time = new_df["delivery_time_hours"].mean()

    # Cost impact
    cost_saving_per_delivery = current_cost - new_cost
    projected_savings = (
        shifted_deliveries * cost_saving_per_delivery
    )

    # Regional baseline
    regional_on_time = region_df["on_time"].mean() * 100
    regional_delivery_time = (
        region_df["delivery_time_hours"].mean()
    )

    # Projected impact
    projected_on_time = (
        regional_on_time
        + shift * (new_on_time - current_on_time)
    )

    projected_delivery_time = (
        regional_delivery_time
        + shift * (new_time - current_time)
    )

    return {
        "region": request.region,
        "current_partner": request.current_partner,
        "new_partner": request.new_partner,
        "shift_percentage": request.shift_percentage,

        "shifted_deliveries": round(
            shifted_deliveries
        ),

        "current_cost": round(
            current_cost, 2
        ),

        "new_cost": round(
            new_cost, 2
        ),

        "projected_savings": round(
            projected_savings, 2
        ),

        "current_on_time_rate": round(
            current_on_time, 2
        ),

        "new_on_time_rate": round(
            new_on_time, 2
        ),

        "projected_on_time_rate": round(
            projected_on_time, 2
        ),

        "current_delivery_time": round(
            current_time, 2
        ),

        "new_delivery_time": round(
            new_time, 2
        ),

        "projected_delivery_time": round(
            projected_delivery_time, 2
        ),
    }