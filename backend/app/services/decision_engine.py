import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_FILE = BASE_DIR / "data" / "delivery_logistics_clean.csv"


class DecisionEngine:

    def __init__(self):
        self.df = pd.read_csv(DATA_FILE)

    def partner_performance(self):
        """
        Calculate performance metrics for every delivery partner.
        """

        result = (
            self.df
            .groupby("delivery_partner")
            .agg(
                deliveries=("delivery_id", "count"),
                avg_cost=("delivery_cost", "mean"),
                avg_delivery_time=("delivery_time_hours", "mean"),
                avg_expected_time=("expected_time_hours", "mean"),
                on_time_rate=("on_time", "mean"),
                avg_rating=("delivery_rating", "mean"),
                avg_distance=("distance_km", "mean"),
            )
            .reset_index()
        )

        result["on_time_rate"] *= 100

        result["delay_rate"] = 100 - result["on_time_rate"]

        return result.round(2)

    def regional_performance(self):
        """
        Calculate delivery performance by region.
        """

        result = (
            self.df
            .groupby("region")
            .agg(
                deliveries=("delivery_id", "count"),
                avg_cost=("delivery_cost", "mean"),
                avg_delivery_time=("delivery_time_hours", "mean"),
                on_time_rate=("on_time", "mean"),
                avg_rating=("delivery_rating", "mean"),
            )
            .reset_index()
        )

        result["on_time_rate"] *= 100
        result["delay_rate"] = 100 - result["on_time_rate"]

        return result.round(2)

    def partner_by_region(self):
        """
        Compare delivery partners inside each region.
        """

        result = (
            self.df
            .groupby(["region", "delivery_partner"])
            .agg(
                deliveries=("delivery_id", "count"),
                avg_cost=("delivery_cost", "mean"),
                avg_delivery_time=("delivery_time_hours", "mean"),
                on_time_rate=("on_time", "mean"),
                avg_rating=("delivery_rating", "mean"),
            )
            .reset_index()
        )

        result["on_time_rate"] *= 100
        result["delay_rate"] = 100 - result["on_time_rate"]

        return result.round(2)

    def recommendations(self):
        """
        Recommend the best delivery partner for each region.

        The score balances:
        - Cost
        - Delivery speed
        - Reliability
        - Customer rating
        """

        df = self.partner_by_region().copy()

        # Normalize metrics between 0 and 1.

        # Lower cost is better
        cost_score = (
            1
            - (
                (df["avg_cost"] - df["avg_cost"].min())
                /
                (df["avg_cost"].max() - df["avg_cost"].min())
            )
        )

        # Lower delivery time is better
        speed_score = (
            1
            - (
                (df["avg_delivery_time"] - df["avg_delivery_time"].min())
                /
                (df["avg_delivery_time"].max() - df["avg_delivery_time"].min())
            )
        )

        # Higher on-time rate is better
        reliability_score = (
            (df["on_time_rate"] - df["on_time_rate"].min())
            /
            (df["on_time_rate"].max() - df["on_time_rate"].min())
        )

        # Higher rating is better
        rating_score = (
            (df["avg_rating"] - df["avg_rating"].min())
            /
            (df["avg_rating"].max() - df["avg_rating"].min())
        )

        # Weighted decision score
        df["decision_score"] = (
            cost_score * 0.30
            + speed_score * 0.25
            + reliability_score * 0.30
            + rating_score * 0.15
        ) * 100

        recommendations = (
            df
            .sort_values(
                ["region", "decision_score"],
                ascending=[True, False]
            )
            .groupby("region")
            .first()
            .reset_index()
        )

        recommendations = recommendations[
            [
                "region",
                "delivery_partner",
                "decision_score",
                "avg_cost",
                "avg_delivery_time",
                "on_time_rate",
                "avg_rating",
            ]
        ]

        return recommendations.round(2)


if __name__ == "__main__":

    engine = DecisionEngine()

    print("\n" + "=" * 70)
    print("DELIVERY PARTNER PERFORMANCE")
    print("=" * 70)

    print(engine.partner_performance().to_string(index=False))

    print("\n" + "=" * 70)
    print("REGIONAL PERFORMANCE")
    print("=" * 70)

    print(engine.regional_performance().to_string(index=False))

    print("\n" + "=" * 70)
    print("RECOMMENDED DELIVERY PARTNER BY REGION")
    print("=" * 70)

    print(engine.recommendations().to_string(index=False))
