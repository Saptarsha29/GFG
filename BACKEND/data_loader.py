# import pandas as pd
# from pathlib import Path
# import logging

# logger = logging.getLogger(__name__)


# class DataLoader:
#     def __init__(self, dataset_path: str = None):
#         if dataset_path is None:
#             dataset_path = Path(__file__).parent / "dataset" / "Amazon Sales.csv"

#         self.dataset_path = dataset_path
#         self.df = None
#         self.load_data()

#     def load_data(self):
#         """Load the Amazon Sales dataset with encoding fallback"""
#         try:
#             logger.info(f"Loading dataset from {self.dataset_path}")

#             try:
#                 self.df = pd.read_csv(self.dataset_path, encoding="utf-8")
#                 logger.info("Loaded dataset using UTF-8 encoding")
#             except UnicodeDecodeError:
#                 self.df = pd.read_csv(self.dataset_path, encoding="latin-1")
#                 logger.info("UTF-8 failed. Loaded dataset using latin-1 encoding")

#             # -----------------------------
#             # Normalize column names
#             # -----------------------------
#             self.df.columns = (
#                 self.df.columns
#                 .str.strip()
#                 .str.lower()
#                 .str.replace(" ", "_")
#                 .str.replace("-", "_")
#             )

#             # -----------------------------
#             # Convert order_date
#             # -----------------------------
#             if "order_date" in self.df.columns:
#                 self.df["order_date"] = pd.to_datetime(
#                     self.df["order_date"], errors="coerce"
#                 )

#                 self.df["month"] = self.df["order_date"].dt.month
#                 self.df["year"] = self.df["order_date"].dt.year
#                 self.df["month_year"] = (
#                     self.df["order_date"].dt.to_period("M").astype(str)
#                 )

#             # -----------------------------
#             # Convert numeric columns
#             # -----------------------------
#             numeric_cols = [
#                 "price",
#                 "discount_percent",
#                 "quantity_sold",
#                 "rating",
#                 "review_count",
#                 "discounted_price",
#                 "total_revenue",
#             ]

#             for col in numeric_cols:
#                 if col in self.df.columns:
#                     self.df[col] = pd.to_numeric(self.df[col], errors="coerce")

#             logger.info(f"Dataset loaded successfully. Shape: {self.df.shape}")
#             logger.info(f"Columns: {list(self.df.columns)}")

#         except Exception as e:
#             logger.error(f"Error loading dataset: {e}")
#             raise

#     def get_dataframe(self):
#         """Return the loaded dataframe"""
#         return self.df

#     def get_summary_stats(self):
#         """Get summary statistics of the dataset"""
#         return {
#             "total_rows": len(self.df),
#             "columns": list(self.df.columns),
#             "date_range": {
#                 "start": str(self.df["order_date"].min()),
#                 "end": str(self.df["order_date"].max()),
#             } if "order_date" in self.df.columns else None,
#             "total_revenue": float(self.df["total_revenue"].sum())
#             if "total_revenue" in self.df.columns
#             else 0,
#             "unique_products": int(self.df["product_id"].nunique())
#             if "product_id" in self.df.columns
#             else 0,
#             "unique_categories": int(self.df["product_category"].nunique())
#             if "product_category" in self.df.columns
#             else 0,
#         }

import pandas as pd
import io
import logging
import os

logger = logging.getLogger(__name__)

class DataLoader:
    def __init__(self, dataset_path: str = None):
        self.dataset_name = "Amazon Sales.csv"
        if dataset_path is None:
            dataset_path = os.path.join(os.getcwd(), "dataset", "Amazon Sales.csv")

        self.dataset_path = dataset_path
        self.df = None
        self.load_data()

    def process_dataframe(self, raw_df: pd.DataFrame, name: str = "Dataset"):
        """Clean and normalize any loaded DataFrame"""
        self.dataset_name = name
        # Normalize column names: lowercase, strip, replace spaces/dashes with underscores
        raw_df.columns = (
            raw_df.columns
            .astype(str)
            .str.strip()
            .str.lower()
            .str.replace(" ", "_")
            .str.replace("-", "_")
            .str.replace(r"[^\w]", "", regex=True)
        )

        # Detect and format potential date columns
        for col in raw_df.columns:
            if "date" in col or "time" in col:
                try:
                    converted = pd.to_datetime(raw_df[col], errors="coerce")
                    if converted.notna().sum() > 0.5 * len(raw_df):
                        raw_df[col] = converted
                        if "month" not in raw_df.columns:
                            raw_df["month"] = raw_df[col].dt.month
                        if "year" not in raw_df.columns:
                            raw_df["year"] = raw_df[col].dt.year
                        if "month_year" not in raw_df.columns:
                            raw_df["month_year"] = raw_df[col].dt.to_period("M").astype(str)
                except Exception:
                    pass

        # Detect and normalize numeric columns
        for col in raw_df.columns:
            if raw_df[col].dtype == object:
                # Remove currency symbols and commas if present
                cleaned = raw_df[col].astype(str).str.replace("$", "").str.replace(",", "").str.strip()
                numeric_try = pd.to_numeric(cleaned, errors="coerce")
                if numeric_try.notna().sum() > 0.6 * len(raw_df):
                    raw_df[col] = numeric_try.fillna(0)
            elif pd.api.types.is_numeric_dtype(raw_df[col]):
                raw_df[col] = raw_df[col].fillna(0)

        self.df = raw_df
        logger.info(f"Dataset '{name}' processed. Shape: {self.df.shape}")

    def load_data(self):
        """Load default dataset"""
        try:
            logger.info(f"Loading dataset from {self.dataset_path}")
            try:
                raw_df = pd.read_csv(self.dataset_path, encoding="utf-8")
            except UnicodeDecodeError:
                raw_df = pd.read_csv(self.dataset_path, encoding="latin-1")

            filename = os.path.basename(self.dataset_path)
            self.process_dataframe(raw_df, filename)

        except Exception as e:
            logger.error(f"Error loading dataset: {e}")
            raise

    def reset_to_default(self):
        """Reset dataset back to original default Amazon Sales dataset"""
        self.load_data()
        return self.get_summary_stats()

    def load_from_bytes(self, content: bytes, filename: str):
        """Load user uploaded CSV file bytes"""
        try:
            try:
                raw_df = pd.read_csv(io.BytesIO(content), encoding="utf-8")
            except UnicodeDecodeError:
                raw_df = pd.read_csv(io.BytesIO(content), encoding="latin-1")

            self.process_dataframe(raw_df, filename)
            return self.get_summary_stats()
        except Exception as e:
            logger.error(f"Failed to parse uploaded CSV dataset: {e}")
            raise ValueError(f"Invalid CSV file format: {str(e)}")

    def get_dataframe(self):
        return self.df

    def get_summary_stats(self):
        if self.df is None:
            return {"total_rows": 0, "columns": [], "dataset_name": "None"}

        columns_meta = []
        numeric_cols = []
        categorical_cols = []

        for col in self.df.columns:
            dtype = str(self.df[col].dtype)
            is_num = pd.api.types.is_numeric_dtype(self.df[col])
            if is_num:
                numeric_cols.append(col)
            else:
                categorical_cols.append(col)

            columns_meta.append({
                "name": col,
                "type": "numeric" if is_num else "category",
                "sample": str(self.df[col].iloc[0]) if len(self.df) > 0 else ""
            })

        total_rev = float(self.df["total_revenue"].sum()) if "total_revenue" in self.df.columns else (
            float(self.df[numeric_cols[0]].sum()) if numeric_cols else 0.0
        )

        return {
            "dataset_name": self.dataset_name,
            "total_rows": len(self.df),
            "columns": list(self.df.columns),
            "columns_meta": columns_meta,
            "numeric_columns": numeric_cols,
            "categorical_columns": categorical_cols,
            "total_revenue": total_rev,
        }