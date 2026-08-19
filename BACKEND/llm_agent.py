from google import genai
import os
import json
import logging
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def build_system_prompt(columns_meta: list = None, dataset_name: str = "Amazon Sales Dataset") -> str:
    if columns_meta:
        col_descriptions = "\n".join(
            [f"- {c['name']} ({c['type']}): Sample value: '{c.get('sample', '')}'" for c in columns_meta]
        )
    else:
        col_descriptions = """
- order_id: Unique transaction ID
- order_date: Transaction date (YYYY-MM-DD)
- product_id: Product identifier
- product_category: Product category
- price: Original price
- discount_percent: Discount percentage
- quantity_sold: Quantity of items sold
- customer_region: Customer region
- payment_method: Payment method used
- rating: Product rating (1.0 to 5.0)
- review_count: Number of customer reviews
- discounted_price: Price after discount
- total_revenue: Final revenue (discounted_price * quantity_sold)
- month: Month integer (1-12)
- year: Year (2023, 2024)
- month_year: Month and Year string ("2023-01", "2023-02")
"""

    return f"""You are an expert business intelligence analyst specializing in dataset analytics.

You have access to the active dataset '{dataset_name}' with the following exact available columns:
{col_descriptions}

CRITICAL DOMAIN VALIDATION INSTRUCTION:
First, check if the user query can be answered using the available dataset columns above.
- IF THE QUERY IS NOT RELATED TO THIS DATASET (e.g. asking about weather, sports, stock market, employee salaries, recipes, politics, general world facts, or non-existent columns/entities):
  Set "is_valid": false and provide a polite explanation in "error".
- IF THE QUERY IS VALID AND CAN BE ANSWERED BY THE DATASET:
  Set "is_valid": true.

RETURN FORMAT (JSON ONLY, no markdown formatting):
For VALID queries:
{{
  "is_valid": true,
  "metric": "column_name_to_analyze",
  "aggregation": "sum|mean|count|max|min",
  "group_by": "column_name_to_group_by",
  "chart_type": "line|bar|pie|area|donut",
  "title": "Chart title",
  "x_axis_label": "X-axis label",
  "y_axis_label": "Y-axis label",
  "filters": {{}},
  "sort_by": "value|key",
  "sort_order": "asc|desc",
  "limit": 10,
  "insight": "Brief summary of what this analysis reveals"
}}

For INVALID/OUT-OF-DATASET queries:
{{
  "is_valid": false,
  "error": "Invalid Question: This question does not belong to or cannot be answered using the active dataset '{dataset_name}'.",
  "insight": "Out of domain query."
}}

IMPORTANT:
- Return ONLY valid JSON
- Never invent metric or group_by columns that do not exist in the dataset column list above.
- Always set "is_valid": true or false.
"""

class LLMAgent:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        self.cache = {}

    def _fast_parse(self, query_lower: str, columns_meta: list) -> dict:
        """Fast instant heuristic matcher for standard BI queries (0ms network latency)"""
        col_names = [c["name"] for c in columns_meta] if columns_meta else []

        # Out of domain obvious checks
        out_keywords = ["weather", "cricket", "football", "president", "recipe", "salary", "movie", "stock", "actor", "capital of"]
        if any(kw in query_lower for kw in out_keywords):
            return {
                "is_valid": False,
                "error": f"Invalid Question: This question is out-of-domain and cannot be answered using the active dataset.",
                "insight": "Out of domain query."
            }

        # 1. Regional revenue/sales
        if "region" in query_lower:
            reg_col = "customer_region" if "customer_region" in col_names else ("region" if "region" in col_names else col_names[0] if col_names else "region")
            num_col = "total_revenue" if "total_revenue" in col_names else ("price" if "price" in col_names else col_names[0] if col_names else "revenue")
            return {
                "is_valid": True,
                "metric": num_col,
                "aggregation": "sum",
                "group_by": reg_col,
                "chart_type": "bar",
                "title": "Total Revenue by Region",
                "x_axis_label": "Region",
                "y_axis_label": "Revenue ($)",
                "sort_by": "value",
                "sort_order": "desc",
                "limit": 10,
                "insight": "Regional revenue breakdown across geographic customer sectors."
            }

        # 2. Category sales / top categories
        if "category" in query_lower or "categories" in query_lower:
            cat_col = "product_category" if "product_category" in col_names else ("category" if "category" in col_names else col_names[0] if col_names else "category")
            num_col = "total_revenue" if "total_revenue" in col_names else ("price" if "price" in col_names else col_names[1] if len(col_names) > 1 else col_names[0])
            return {
                "is_valid": True,
                "metric": num_col,
                "aggregation": "sum",
                "group_by": cat_col,
                "chart_type": "bar",
                "title": f"Sales Breakdown by {cat_col.replace('_', ' ').title()}",
                "x_axis_label": cat_col.replace('_', ' ').title(),
                "y_axis_label": "Sales Volume ($)",
                "sort_by": "value",
                "sort_order": "desc",
                "limit": 5 if ("top 5" in query_lower or "5" in query_lower) else 10,
                "insight": f"Top performing {cat_col} categories ranked by overall volume."
            }

        # 3. Monthly / Trend / Date breakdown
        if "month" in query_lower or "monthly" in query_lower or "trend" in query_lower or "date" in query_lower or "year" in query_lower:
            date_col = "month_year" if "month_year" in col_names else ("month" if "month" in col_names else ("order_date" if "order_date" in col_names else col_names[0]))
            num_col = "total_revenue" if "total_revenue" in col_names else (col_names[0] if col_names else "revenue")
            return {
                "is_valid": True,
                "metric": num_col,
                "aggregation": "sum",
                "group_by": date_col,
                "chart_type": "line",
                "title": "Monthly Revenue & Sales Trajectory",
                "x_axis_label": "Timeline",
                "y_axis_label": "Revenue ($)",
                "sort_by": "key",
                "sort_order": "asc",
                "limit": 24,
                "insight": "Monthly sales performance trajectory highlighting seasonal growth phases."
            }

        # 4. Payment method split
        if "payment" in query_lower or "pay" in query_lower or "card" in query_lower:
            pay_col = "payment_method" if "payment_method" in col_names else col_names[0]
            num_col = "total_revenue" if "total_revenue" in col_names else col_names[0]
            return {
                "is_valid": True,
                "metric": num_col,
                "aggregation": "count",
                "group_by": pay_col,
                "chart_type": "donut",
                "title": "Payment Method Share & Distribution",
                "x_axis_label": "Payment Method",
                "y_axis_label": "Transaction Count",
                "sort_by": "value",
                "sort_order": "desc",
                "limit": 10,
                "insight": "Distribution of customer payment preferences across transactions."
            }

        # 5. Ratings / Reviews / Customer satisfaction
        if "rating" in query_lower or "review" in query_lower or "satisfaction" in query_lower:
            rating_col = "rating" if "rating" in col_names else (col_names[0] if col_names else "rating")
            cat_col = "product_category" if "product_category" in col_names else col_names[0]
            return {
                "is_valid": True,
                "metric": rating_col,
                "aggregation": "mean",
                "group_by": cat_col,
                "chart_type": "bar",
                "title": "Average Customer Rating by Category",
                "x_axis_label": "Category",
                "y_axis_label": "Average Rating (1.0 - 5.0)",
                "sort_by": "value",
                "sort_order": "desc",
                "limit": 10,
                "insight": "Customer satisfaction score distribution across key product categories."
            }

        # 6. Discount impact / Discount percent
        if "discount" in query_lower or "price" in query_lower or "pricing" in query_lower:
            disc_col = "discount_percent" if "discount_percent" in col_names else ("price" if "price" in col_names else col_names[0])
            cat_col = "product_category" if "product_category" in col_names else col_names[0]
            return {
                "is_valid": True,
                "metric": disc_col,
                "aggregation": "mean",
                "group_by": cat_col,
                "chart_type": "bar",
                "title": "Average Pricing & Discount Level by Category",
                "x_axis_label": "Category",
                "y_axis_label": "Average Rate",
                "sort_by": "value",
                "sort_order": "desc",
                "limit": 10,
                "insight": "Pricing structure and discount impact evaluation."
            }

        # 7. Quantity / Volume / Units sold
        if "quantity" in query_lower or "unit" in query_lower or "sold" in query_lower or "volume" in query_lower:
            qty_col = "quantity_sold" if "quantity_sold" in col_names else (col_names[0] if col_names else "quantity")
            cat_col = "product_category" if "product_category" in col_names else col_names[0]
            return {
                "is_valid": True,
                "metric": qty_col,
                "aggregation": "sum",
                "group_by": cat_col,
                "chart_type": "bar",
                "title": "Total Units Sold by Category",
                "x_axis_label": "Category",
                "y_axis_label": "Units Sold",
                "sort_by": "value",
                "sort_order": "desc",
                "limit": 10,
                "insight": "Volume sales distribution across product categories."
            }

        # 8. Single column summary request (e.g. "Show summary for column X")
        for c in col_names:
            if c in query_lower or c.replace("_", " ") in query_lower:
                num_col = "total_revenue" if "total_revenue" in col_names else (col_names[0] if col_names else c)
                return {
                    "is_valid": True,
                    "metric": num_col,
                    "aggregation": "sum" if c != "rating" else "mean",
                    "group_by": c,
                    "chart_type": "bar",
                    "title": f"Metrics Breakdown by {c.replace('_', ' ').title()}",
                    "x_axis_label": c.replace('_', ' ').title(),
                    "y_axis_label": "Value",
                    "sort_by": "value",
                    "sort_order": "desc",
                    "limit": 12,
                    "insight": f"Analysis grouped by field '{c}'."
                }

        return None

    async def parse_query(self, user_query: str, session_id: str = "default", columns_meta: list = None, dataset_name: str = "Dataset") -> dict:
        """Parse user query and return structured instructions tailored to the dataset"""
        query_key = f"{dataset_name}:{user_query.strip().lower()}"
        
        # Check LRU cache first (0ms instantaneous response)
        if query_key in self.cache:
            logger.info(f"LRU Cache HIT for query: '{user_query}'")
            return self.cache[query_key]

        try:
            logger.info(f"Parsing query for '{dataset_name}': {user_query}")
            
            # Fast heuristic check first (0ms latency for common queries)
            fast_res = self._fast_parse(user_query.lower(), columns_meta or [])
            if fast_res:
                logger.info("Fast heuristic match triggered!")
                self.cache[query_key] = fast_res
                return fast_res

            system_prompt = build_system_prompt(columns_meta, dataset_name)
            
            response_text = ""
            for model_name in ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"]:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=system_prompt + "\n\nUser Query:\n" + user_query
                    )
                    response_text = response.text.strip()
                    if response_text:
                        break
                except Exception as model_err:
                    logger.warning(f"Model {model_name} attempt failed: {model_err}")
                    continue

            if not response_text:
                # Fallback if LLM API call is unreachable or fails
                return {
                    "is_valid": True,
                    "metric": columns_meta[0]["name"] if columns_meta else "total_revenue",
                    "aggregation": "sum",
                    "group_by": columns_meta[1]["name"] if len(columns_meta) > 1 else (columns_meta[0]["name"] if columns_meta else "category"),
                    "chart_type": "bar",
                    "title": f"Summary Analysis for {user_query}",
                    "x_axis_label": "Category",
                    "y_axis_label": "Total",
                    "sort_by": "value",
                    "sort_order": "desc",
                    "limit": 10,
                    "insight": "Automated dataset analysis."
                }

            logger.info(f"LLM Raw Response: {response_text}")
            
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            parsed = json.loads(response_text.strip())
            self.cache[query_key] = parsed
            return parsed
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            return {
                "is_valid": False,
                "error": f"Invalid Question: Unable to interpret query against the dataset '{dataset_name}'.",
                "insight": "Parsing issue"
            }
        except Exception as e:
            logger.error(f"Error in parse_query: {e}")
            return {
                "is_valid": False,
                "error": f"Execution error interpreting query: {str(e)}",
                "insight": "API error"
            }



