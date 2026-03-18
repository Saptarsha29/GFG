# from google import genai
# import os
# import json
# import logging
# from dotenv import load_dotenv

# logger = logging.getLogger(__name__)
# load_dotenv()

# client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# SYSTEM_PROMPT = """You are an expert business intelligence analyst specializing in e-commerce data analysis.

# You have access to an Amazon Sales dataset with the following columns:
# - order_id: Unique transaction ID
# - order_date: Transaction date
# - product_id: Product identifier
# - product_category: Product category
# - price: Original price
# - discount_percent: Discount percentage
# - quantity_sold: Quantity sold
# - Customer region: Customer region
# - payment_method: Payment method used
# - rating: Product rating (out of 5)
# - review_count: Number of reviews
# - discounted_price: Price after discount
# - total_revenue: Final revenue (discounted_price * quantity_sold)

# Your task is to interpret natural language queries and return structured JSON instructions for data analysis and visualization.

# RETURN FORMAT (JSON only, no markdown):
# {
#   "metric": "column_name_to_analyze",
#   "aggregation": "sum|mean|count|max|min",
#   "group_by": "column_name_to_group_by",
#   "chart_type": "line|bar|pie|area",
#   "title": "Chart title",
#   "x_axis_label": "X-axis label",
#   "y_axis_label": "Y-axis label",
#   "filters": {},
#   "sort_by": "value|key",
#   "sort_order": "asc|desc",
#   "limit": 10,
#   "insight": "Brief insight about what this analysis reveals"
# }

# EXAMPLES:

# Query: "Show total revenue by region"
# Response:
# {
#   "metric": "total_revenue",
#   "aggregation": "sum",
#   "group_by": "customer_region",
#   "chart_type": "bar",
#   "title": "Total Revenue by Region",
#   "x_axis_label": "Region",
#   "y_axis_label": "Total Revenue ($)",
#   "sort_by": "value",
#   "sort_order": "desc",
#   "insight": "Revenue distribution across different customer regions"
# }

# Query: "Monthly revenue trend"
# Response:
# {
#   "metric": "total_revenue",
#   "aggregation": "sum",
#   "group_by": "month_year",
#   "chart_type": "line",
#   "title": "Monthly Revenue Trend",
#   "x_axis_label": "Month",
#   "y_axis_label": "Revenue ($)",
#   "sort_by": "key",
#   "sort_order": "asc",
#   "insight": "Revenue trend over time showing seasonal patterns"
# }

# Query: "Top 5 product categories by sales"
# Response:
# {
#   "metric": "total_revenue",
#   "aggregation": "sum",
#   "group_by": "product_category",
#   "chart_type": "bar",
#   "title": "Top 5 Product Categories",
#   "x_axis_label": "Category",
#   "y_axis_label": "Revenue ($)",
#   "sort_by": "value",
#   "sort_order": "desc",
#   "limit": 5,
#   "insight": "Top performing product categories by revenue"
# }

# Query: "Payment method distribution"
# Response:
# {
#   "metric": "order_id",
#   "aggregation": "count",
#   "group_by": "payment_method",
#   "chart_type": "pie",
#   "title": "Payment Method Distribution",
#   "x_axis_label": "Payment Method",
#   "y_axis_label": "Number of Orders",
#   "insight": "Distribution of payment methods used by customers"
# }

# IMPORTANT:
# - Return ONLY valid JSON, no markdown formatting
# - For time series, use "month_year" as group_by
# - For categorical comparisons, use "bar" or "pie" charts
# - For trends over time, use "line" or "area" charts
# - Always provide meaningful titles and labels
# - Include a brief insight about what the analysis reveals
# """

# class LLMAgent:
#     def __init__(self, api_key: str = None):
#         self.api_key = api_key or os.getenv('GEMINI_API_KEY')
#         if not self.api_key:
#             raise ValueError("Gemini API key is required")
    
#     async def parse_query(self, user_query: str, session_id: str = "default") -> dict:
#         """Parse user query and return structured instructions"""
#         try:
#             logger.info(f"Parsing query: {user_query}")
            
#             # Initialize chat with Gemini
#             response = client.models.generate_content(
#                 model="gemini-2.5-flash",
#                 contents=SYSTEM_PROMPT + "\n\nUser Query:\n" + user_query
#             )

#             response = response.text
        
            
#             logger.info(f"LLM Response: {response}")
            
#             # Parse JSON response
#             # Remove markdown formatting if present
#             response_text = response.strip()
#             if response_text.startswith('```json'):
#                 response_text = response_text[7:]
#             if response_text.startswith('```'):
#                 response_text = response_text[3:]
#             if response_text.endswith('```'):
#                 response_text = response_text[:-3]
            
#             parsed = json.loads(response_text.strip())
#             return parsed
            
#         except json.JSONDecodeError as e:
#             logger.error(f"JSON parsing error: {e}")
#             logger.error(f"Response was: {response}")
#             return {
#                 "error": "Failed to parse LLM response",
#                 "metric": "total_revenue",
#                 "aggregation": "sum",
#                 "group_by": "customer_region",
#                 "chart_type": "bar",
#                 "title": "Revenue by Region (Fallback)",
#                 "x_axis_label": "Region",
#                 "y_axis_label": "Revenue",
#                 "insight": "Showing revenue distribution by region"
#             }
#         except Exception as e:
#             logger.error(f"Error in parse_query: {e}")
#             raise


import os
import json
import logging
from dotenv import load_dotenv
from google import genai

logger = logging.getLogger(__name__)
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# 🔥 FIX: SYSTEM_PROMPT ko aur strict aur detail banaya gaya hai
SYSTEM_PROMPT = """You are an expert business intelligence analyst specializing in e-commerce data analysis.

You have access to an Amazon Sales dataset with the exact following columns (use exactly these names):
- order_id: Unique transaction ID
- order_date: Transaction date
- product_id: Product identifier
- product_category: Product category
- price: Original price
- discount_percent: Discount percentage
- quantity_sold: Quantity sold
- customer_region: Customer region
- payment_method: Payment method used
- rating: Product rating (out of 5)
- review_count: Number of reviews
- discounted_price: Price after discount
- total_revenue: Final revenue (discounted_price * quantity_sold)
- month_year: Month and year of the order

Your task is to interpret natural language queries and return structured JSON instructions for data analysis and visualization.

RETURN FORMAT (JSON only, no markdown):
{
  "metric": "column_name_to_analyze",
  "aggregation": "sum|mean|count|max|min",
  "group_by": "column_name_to_group_by",
  "chart_type": "line|bar|pie|area",
  "title": "Chart title",
  "x_axis_label": "X-axis label",
  "y_axis_label": "Y-axis label",
  "filters": {"column_name": "exact_value_to_match"}, 
  "sort_by": "value|key",
  "sort_order": "asc|desc",
  "limit": 10,
  "insight": "Brief insight about what this analysis reveals"
}

EXAMPLES:

Query: "Show total revenue by region"
Response:
{
  "metric": "total_revenue",
  "aggregation": "sum",
  "group_by": "customer_region",
  "chart_type": "bar",
  "title": "Total Revenue by Region",
  "x_axis_label": "Region",
  "y_axis_label": "Total Revenue ($)",
  "filters": {},
  "sort_by": "value",
  "sort_order": "desc",
  "insight": "Revenue distribution across different customer regions"
}

Query: "Show North America revenue"
Response:
{
  "metric": "total_revenue",
  "aggregation": "sum",
  "group_by": "customer_region",
  "chart_type": "bar",
  "title": "North America Revenue",
  "x_axis_label": "Region",
  "y_axis_label": "Revenue ($)",
  "filters": {"customer_region": "North America"},
  "sort_by": "value",
  "sort_order": "desc",
  "insight": "Total revenue generated specifically from the North America region"
}

Query: "Monthly revenue trend"
Response:
{
  "metric": "total_revenue",
  "aggregation": "sum",
  "group_by": "month_year",
  "chart_type": "line",
  "title": "Monthly Revenue Trend",
  "x_axis_label": "Month",
  "y_axis_label": "Revenue ($)",
  "filters": {},
  "sort_by": "key",
  "sort_order": "asc",
  "insight": "Revenue trend over time showing seasonal patterns"
}

IMPORTANT RULES:
- Return ONLY valid JSON, no markdown formatting.
- ALWAYS include a valid "group_by" column (like "customer_region", "product_category", "month_year"). NEVER leave it null or empty. If the user asks for a specific category/region, group by that column and use the "filters" object.
- Use "bar" or "pie" charts for categories, "line" or "area" for time trends.
- Always provide meaningful titles and labels.
"""

class LLMAgent:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key is required")
    
    async def parse_query(self, user_query: str, session_id: str = "default") -> dict:
        """Parse user query and return structured instructions"""
        try:
            logger.info(f"Parsing query: {user_query}")
            
            # Initialize chat with Gemini
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=SYSTEM_PROMPT + "\n\nUser Query:\n" + user_query
            )

            response = response.text
            logger.info(f"LLM Response: {response}")
            
            # Parse JSON response
            response_text = response.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            parsed = json.loads(response_text.strip())
            
            # 🔥 FIX: Agar AI galti se group_by bhool jaye, toh default fallback de do
            if not parsed.get("group_by"):
                parsed["group_by"] = "customer_region"
                
            return parsed
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            logger.error(f"Response was: {response}")
            return {
                "error": "Failed to parse LLM response",
                "metric": "total_revenue",
                "aggregation": "sum",
                "group_by": "customer_region",
                "chart_type": "bar",
                "title": "Revenue by Region (Fallback)",
                "x_axis_label": "Region",
                "y_axis_label": "Revenue",
                "insight": "Showing revenue distribution by region"
            }
        except Exception as e:
            logger.error(f"Error in parse_query: {e}")
            raise
