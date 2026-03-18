# # import pandas as pd
# # from pathlib import Path
# # import logging

# # logger = logging.getLogger(__name__)


# # class DataLoader:
# #     def __init__(self, dataset_path: str = None):
# #         if dataset_path is None:
# #             dataset_path = Path(__file__).parent / "dataset" / "Amazon Sales.csv"

# #         self.dataset_path = dataset_path
# #         self.df = None
# #         self.load_data()

# #     def load_data(self):
# #         """Load the Amazon Sales dataset with encoding fallback"""
# #         try:
# #             logger.info(f"Loading dataset from {self.dataset_path}")

# #             try:
# #                 self.df = pd.read_csv(self.dataset_path, encoding="utf-8")
# #                 logger.info("Loaded dataset using UTF-8 encoding")
# #             except UnicodeDecodeError:
# #                 self.df = pd.read_csv(self.dataset_path, encoding="latin-1")
# #                 logger.info("UTF-8 failed. Loaded dataset using latin-1 encoding")

# #             # -----------------------------
# #             # Normalize column names
# #             # -----------------------------
# #             self.df.columns = (
# #                 self.df.columns
# #                 .str.strip()
# #                 .str.lower()
# #                 .str.replace(" ", "_")
# #                 .str.replace("-", "_")
# #             )

# #             # -----------------------------
# #             # Convert order_date
# #             # -----------------------------
# #             if "order_date" in self.df.columns:
# #                 self.df["order_date"] = pd.to_datetime(
# #                     self.df["order_date"], errors="coerce"
# #                 )

# #                 self.df["month"] = self.df["order_date"].dt.month
# #                 self.df["year"] = self.df["order_date"].dt.year
# #                 self.df["month_year"] = (
# #                     self.df["order_date"].dt.to_period("M").astype(str)
# #                 )

# #             # -----------------------------
# #             # Convert numeric columns
# #             # -----------------------------
# #             numeric_cols = [
# #                 "price",
# #                 "discount_percent",
# #                 "quantity_sold",
# #                 "rating",
# #                 "review_count",
# #                 "discounted_price",
# #                 "total_revenue",
# #             ]

# #             for col in numeric_cols:
# #                 if col in self.df.columns:
# #                     self.df[col] = pd.to_numeric(self.df[col], errors="coerce")

# #             logger.info(f"Dataset loaded successfully. Shape: {self.df.shape}")
# #             logger.info(f"Columns: {list(self.df.columns)}")

# #         except Exception as e:
# #             logger.error(f"Error loading dataset: {e}")
# #             raise

# #     def get_dataframe(self):
# #         """Return the loaded dataframe"""
# #         return self.df

# #     def get_summary_stats(self):
# #         """Get summary statistics of the dataset"""
# #         return {
# #             "total_rows": len(self.df),
# #             "columns": list(self.df.columns),
# #             "date_range": {
# #                 "start": str(self.df["order_date"].min()),
# #                 "end": str(self.df["order_date"].max()),
# #             } if "order_date" in self.df.columns else None,
# #             "total_revenue": float(self.df["total_revenue"].sum())
# #             if "total_revenue" in self.df.columns
# #             else 0,
# #             "unique_products": int(self.df["product_id"].nunique())
# #             if "product_id" in self.df.columns
# #             else 0,
# #             "unique_categories": int(self.df["product_category"].nunique())
# #             if "product_category" in self.df.columns
# #             else 0,
# #         }

# import pandas as pd
# from pathlib import Path
# import logging
# import os

# logger = logging.getLogger(__name__)

# class DataLoader:
#     def __init__(self, dataset_path: str = None):
#         if dataset_path is None:
#             # Sahi path taki file kahin bhi ho, pakad le
#             dataset_path = os.path.join(os.getcwd(), "dataset", "Amazon Sales.csv")

#         self.dataset_path = dataset_path
#         self.df = None
#         self.load_data()

#     def load_data(self):
#         try:
#             logger.info(f"Loading dataset from {self.dataset_path}")
#             try:
#                 self.df = pd.read_csv(self.dataset_path, encoding="utf-8")
#             except UnicodeDecodeError:
#                 self.df = pd.read_csv(self.dataset_path, encoding="latin-1")

#             # Column names lowercase aur clean
#             self.df.columns = self.df.columns.str.strip().str.lower().str.replace(" ", "_").str.replace("-", "_")

#             # Date formatting
#             if "order_date" in self.df.columns:
#                 self.df["order_date"] = pd.to_datetime(self.df["order_date"], errors="coerce")
#                 self.df["month"] = self.df["order_date"].dt.month
#                 self.df["year"] = self.df["order_date"].dt.year
#                 self.df["month_year"] = self.df["order_date"].dt.to_period("M").astype(str)

#             # 🔥 MAIN FIX: Sabhi numeric columns ko properly float/int mein convert karna
#             numeric_cols = ["price", "discount_percent", "quantity_sold", "rating", "review_count", "discounted_price", "total_revenue"]
            
#             for col in numeric_cols:
#                 if col in self.df.columns:
#                     # Pehle comma hatao (jaise 1,000 ko 1000 karo), fir number banao
#                     if self.df[col].dtype == object:
#                         self.df[col] = self.df[col].str.replace(',', '')
#                     self.df[col] = pd.to_numeric(self.df[col], errors="coerce").fillna(0) # Error aaye to 0 daalo

#             logger.info(f"Dataset loaded successfully. Shape: {self.df.shape}")

#         except Exception as e:
#             logger.error(f"Error loading dataset: {e}")
#             raise

#     def get_dataframe(self):
#         return self.df

#     def get_summary_stats(self):
#         return {
#             "total_rows": len(self.df),
#             "columns": list(self.df.columns),
#             "total_revenue": float(self.df["total_revenue"].sum()) if "total_revenue" in self.df.columns else 0,
#         }

import pandas as pd
from pathlib import Path
import logging
import os

logger = logging.getLogger(__name__)

class DataLoader:
    def __init__(self, dataset_path: str = None):
        if dataset_path is None:
            # Sahi path taki file kahin bhi ho, pakad le
            dataset_path = os.path.join(os.getcwd(), "dataset", "Amazon Sales.csv")

        self.dataset_path = dataset_path
        self.df = None
        self.load_data()

    def load_data(self):
        try:
            logger.info(f"Loading dataset from {self.dataset_path}")
            try:
                self.df = pd.read_csv(self.dataset_path, encoding="utf-8")
            except UnicodeDecodeError:
                self.df = pd.read_csv(self.dataset_path, encoding="latin-1")

            # Column names lowercase aur clean
            self.df.columns = self.df.columns.str.strip().str.lower().str.replace(" ", "_").str.replace("-", "_")

            # Date formatting
            if "order_date" in self.df.columns:
                self.df["order_date"] = pd.to_datetime(self.df["order_date"], errors="coerce")
                self.df["month"] = self.df["order_date"].dt.month
                self.df["year"] = self.df["order_date"].dt.year
                self.df["month_year"] = self.df["order_date"].dt.to_period("M").astype(str)

            # 🔥 MAIN FIX: Sabhi numeric columns ko properly float/int mein convert karna
            numeric_cols = ["price", "discount_percent", "quantity_sold", "rating", "review_count", "discounted_price", "total_revenue"]
            
            for col in numeric_cols:
                if col in self.df.columns:
                    # Pehle comma hatao (jaise 1,000 ko 1000 karo), fir number banao
                    if self.df[col].dtype == object:
                        self.df[col] = self.df[col].str.replace(',', '')
                    self.df[col] = pd.to_numeric(self.df[col], errors="coerce").fillna(0) # Error aaye to 0 daalo

            logger.info(f"Dataset loaded successfully. Shape: {self.df.shape}")

        except Exception as e:
            logger.error(f"Error loading dataset: {e}")
            raise

    def get_dataframe(self):
        return self.df

    def get_summary_stats(self):
        return {
            "total_rows": len(self.df),
            "columns": list(self.df.columns),
            "total_revenue": float(self.df["total_revenue"].sum()) if "total_revenue" in self.df.columns else 0,
        }