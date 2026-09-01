import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[3]
INPUT_FILE = BASE_DIR / "data" / "Delivery_Logistics.csv"
OUTPUT_FILE = BASE_DIR / "data" / "delivery_logistics_clean.csv"


def load_and_clean_data() -> pd.DataFrame:
    df = pd.read_csv(INPUT_FILE)

    # Normalize column names
    df.columns = [column.strip().lower() for column in df.columns]

    # delivery_id is incorrectly stored as float in the source dataset.
    df["delivery_id"] = df["delivery_id"].astype(str)

    # Convert the timestamp-looking values back to their original
    # nanosecond component, which represents the intended hour value.
    df["delivery_time_hours"] = (
        pd.to_datetime(df["delivery_time_hours"])
        .dt.nanosecond
        .astype(float)
    )

    df["expected_time_hours"] = (
        pd.to_datetime(df["expected_time_hours"])
        .dt.nanosecond
        .astype(float)
    )

    # Convert categorical values to clean strings
    string_columns = [
        "delivery_partner",
        "package_type",
        "vehicle_type",
        "delivery_mode",
        "region",
        "weather_condition",
        "delayed",
        "delivery_status",
    ]

    for column in string_columns:
        df[column] = df[column].astype(str).str.strip().str.lower()

    # Numeric fields
    numeric_columns = [
        "distance_km",
        "package_weight_kg",
        "delivery_time_hours",
        "expected_time_hours",
        "delivery_rating",
        "delivery_cost",
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    # Calculate our own operational metrics
    df["time_variance_hours"] = (
        df["delivery_time_hours"] - df["expected_time_hours"]
    )

    df["on_time"] = (
        df["delivery_time_hours"] <= df["expected_time_hours"]
    )

    df["cost_per_km"] = (
        df["delivery_cost"] / df["distance_km"].replace(0, pd.NA)
    )

    df["cost_per_kg"] = (
        df["delivery_cost"] / df["package_weight_kg"].replace(0, pd.NA)
    )

    # Remove invalid rows
    df = df.dropna(
        subset=[
            "delivery_partner",
            "region",
            "distance_km",
            "delivery_cost",
            "delivery_time_hours",
            "expected_time_hours",
        ]
    )

    df.to_csv(OUTPUT_FILE, index=False)

    return df


if __name__ == "__main__":
    data = load_and_clean_data()

    print("=" * 60)
    print("DELIVERY DATA PROCESSING COMPLETE")
    print("=" * 60)
    print(f"Rows: {len(data):,}")
    print(f"Columns: {len(data.columns)}")
    print(f"Partners: {data['delivery_partner'].nunique()}")
    print(f"Regions: {data['region'].nunique()}")
    print(f"Output: {OUTPUT_FILE}")
    print()
    print("Partners:")
    print(data["delivery_partner"].value_counts())
    print()
    print("Regions:")
    print(data["region"].value_counts())
