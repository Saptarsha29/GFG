import pandas as pd
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class InsightsEngine:
    def __init__(self, dataframe: pd.DataFrame):
        self.df = dataframe
    
    def generate_insights(self, query: str, result: pd.DataFrame, instructions: Dict[str, Any]) -> str:
        """Generate comprehensive business insights"""
        try:
            insights = []
            
            # Get basic statistics from result
            metric = instructions.get('metric')
            group_by = instructions.get('group_by')
            
            if len(result) == 0:
                return "No data available for this query."
            
            # Top performer insight
            if len(result) > 0:
                top = result.iloc[0]
                top_name = top[group_by]
                top_value = top[metric]
                
                if metric in ['total_revenue', 'price', 'discounted_price']:
                    value_str = f"${top_value:,.2f}"
                else:
                    value_str = f"{top_value:,.0f}"
                
                insights.append(f"🏆 Top performer: {top_name} ({value_str})")
            
            # Bottom performer insight
            if len(result) > 1:
                bottom = result.iloc[-1]
                bottom_name = bottom[group_by]
                bottom_value = bottom[metric]
                
                if metric in ['total_revenue', 'price', 'discounted_price']:
                    value_str = f"${bottom_value:,.2f}"
                else:
                    value_str = f"{bottom_value:,.0f}"
                
                insights.append(f"📉 Lowest: {bottom_name} ({value_str})")
            
            # Calculate percentage distribution for top 3
            if len(result) >= 3:
                total = result[metric].sum()
                top3_total = result.head(3)[metric].sum()
                percentage = (top3_total / total * 100) if total > 0 else 0
                insights.append(f"📊 Top 3 account for {percentage:.1f}% of total")
            
            # Add LLM-generated insight
            base_insight = instructions.get('insight', '')
            if base_insight:
                insights.append(f"💡 {base_insight}")
            
            return ' | '.join(insights)
            
        except Exception as e:
            logger.error(f"Error generating insights: {e}")
            return "Analysis completed."
    
    def get_overall_stats(self) -> Dict[str, Any]:
        """Get overall dataset statistics"""
        return {
            "total_revenue": float(self.df['total_revenue'].sum()),
            "total_orders": len(self.df),
            "avg_order_value": float(self.df['total_revenue'].mean()),
            "top_category": self.df.groupby('product_category')['total_revenue'].sum().idxmax(),
            "top_region": self.df.groupby('customer_region')['total_revenue'].sum().idxmax()
        }
