import pandas as pd
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class QueryParser:
    def __init__(self, dataframe: pd.DataFrame):
        self.df = dataframe
    
    def execute_query(self, instructions: Dict[str, Any]) -> pd.DataFrame:
        """Execute pandas operations based on LLM instructions"""
        try:
            df = self.df.copy()
            
            # Apply filters if any
            filters = instructions.get('filters', {})
            for column, value in filters.items():
                if column in df.columns:
                    df = df[df[column] == value]
            
            # Get the metric and group_by columns
            metric = instructions.get('metric')
            group_by = instructions.get('group_by')
            aggregation = instructions.get('aggregation', 'sum')
            
            if not metric or not group_by:
                raise ValueError("Missing required fields: metric or group_by")
            
            # Perform aggregation
            if aggregation == 'sum':
                result = df.groupby(group_by)[metric].sum().reset_index()
            elif aggregation == 'mean':
                result = df.groupby(group_by)[metric].mean().reset_index()
            elif aggregation == 'count':
                result = df.groupby(group_by)[metric].count().reset_index()
            elif aggregation == 'max':
                result = df.groupby(group_by)[metric].max().reset_index()
            elif aggregation == 'min':
                result = df.groupby(group_by)[metric].min().reset_index()
            else:
                result = df.groupby(group_by)[metric].sum().reset_index()
            
            # Sort the results
            sort_by = instructions.get('sort_by', 'value')
            sort_order = instructions.get('sort_order', 'desc')
            ascending = sort_order == 'asc'
            
            if sort_by == 'value':
                result = result.sort_values(by=metric, ascending=ascending)
            else:
                result = result.sort_values(by=group_by, ascending=ascending)
            
            # Apply limit
            limit = instructions.get('limit')
            if limit:
                result = result.head(limit)
            
            logger.info(f"Query executed successfully. Result shape: {result.shape}")
            return result
            
        except Exception as e:
            logger.error(f"Error executing query: {e}")
            raise
    
    def generate_insight(self, result: pd.DataFrame, instructions: Dict[str, Any]) -> str:
        """Generate detailed insight from the query result"""
        try:
            metric = instructions.get('metric')
            group_by = instructions.get('group_by')
            aggregation = instructions.get('aggregation', 'sum')
            base_insight = instructions.get('insight', '')
            
            if len(result) == 0:
                return "No data available for the specified query."
            
            # Calculate statistics
            total = result[metric].sum()
            avg = result[metric].mean()
            top_item = result.iloc[0][group_by] if len(result) > 0 else 'N/A'
            top_value = result.iloc[0][metric] if len(result) > 0 else 0
            
            # Format numbers
            if metric in ['total_revenue', 'price', 'discounted_price']:
                total_str = f"${total:,.2f}"
                avg_str = f"${avg:,.2f}"
                top_value_str = f"${top_value:,.2f}"
            else:
                total_str = f"{total:,.0f}"
                avg_str = f"{avg:,.2f}"
                top_value_str = f"{top_value:,.0f}"
            
            # Build insight
            insight_parts = [base_insight]
            
            if aggregation == 'sum':
                insight_parts.append(f"Total {metric}: {total_str}.")
                insight_parts.append(f"Top performer: {top_item} with {top_value_str}.")
            elif aggregation == 'mean':
                insight_parts.append(f"Average {metric}: {avg_str}.")
            elif aggregation == 'count':
                insight_parts.append(f"Total count: {total_str}.")
            
            if len(result) > 1:
                bottom_item = result.iloc[-1][group_by]
                bottom_value = result.iloc[-1][metric]
                if metric in ['total_revenue', 'price', 'discounted_price']:
                    bottom_value_str = f"${bottom_value:,.2f}"
                else:
                    bottom_value_str = f"{bottom_value:,.0f}"
                insight_parts.append(f"Lowest: {bottom_item} with {bottom_value_str}.")
            
            return ' '.join(insight_parts)
            
        except Exception as e:
            logger.error(f"Error generating insight: {e}")
            return instructions.get('insight', 'Analysis completed successfully.')
