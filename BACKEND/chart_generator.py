import pandas as pd
import logging
from typing import Dict, Any, List
from models import ChartData

logger = logging.getLogger(__name__)

class ChartGenerator:
    def __init__(self):
        pass
    
    def generate_chart_data(self, result: pd.DataFrame, instructions: Dict[str, Any]) -> ChartData:
        """Convert pandas result to chart-ready JSON format"""
        try:
            metric = instructions.get('metric')
            group_by = instructions.get('group_by')
            chart_type = instructions.get('chart_type', 'bar')
            title = instructions.get('title', 'Chart')
            x_axis_label = instructions.get('x_axis_label', group_by)
            y_axis_label = instructions.get('y_axis_label', metric)
            
            # Convert DataFrame to list of dictionaries
            chart_data = result.to_dict('records')
            
            # Format the data for frontend consumption
            formatted_data = []
            for row in chart_data:
                formatted_row = {
                    'name': str(row[group_by]),
                    'value': float(row[metric]) if pd.notna(row[metric]) else 0
                }
                formatted_data.append(formatted_row)
            
            chart_obj = ChartData(
                chart_type=chart_type,
                title=title,
                x_axis=x_axis_label,
                y_axis=y_axis_label,
                data=formatted_data,
                description=instructions.get('insight', '')
            )
            
            logger.info(f"Chart data generated: {chart_type} with {len(formatted_data)} points")
            return chart_obj
            
        except Exception as e:
            logger.error(f"Error generating chart data: {e}")
            raise
    
    def generate_multi_chart(self, results: List[pd.DataFrame], instructions_list: List[Dict[str, Any]]) -> List[ChartData]:
        """Generate multiple charts from multiple queries"""
        charts = []
        for result, instructions in zip(results, instructions_list):
            chart = self.generate_chart_data(result, instructions)
            charts.append(chart)
        return charts
