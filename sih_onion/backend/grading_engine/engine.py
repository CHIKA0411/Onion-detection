"""
engine.py - Configurable Quality Grading Engine for Onion Procurement Batches.
Calculates Grade A %, URS %, defect breakdown, and manages human review overrides.
"""

import os
import json
import yaml
from datetime import datetime
from typing import Dict, Any, List, Optional


class GradingEngine:
    def __init__(self, rules_config_path: str = "sih_onion/backend/config/grading_rules.yaml"):
        """
        Loads configurable grading rules from YAML file.
        """
        if os.path.exists(rules_config_path):
            with open(rules_config_path, "r") as f:
                self.config = yaml.safe_load(f)
        else:
            # Fallback default rules
            self.config = {
                "center_id": "DEFAULT_CENTER",
                "rules": {
                    "min_confidence_threshold": 0.50,
                    "urs_categories": ["undersized", "rotten", "damaged", "sprouted"],
                    "grade_a_categories": ["grade_a"],
                    "undersized_size_cm": 4.5
                }
            }

        self.rules = self.config.get("rules", {})
        self.urs_categories = set(self.rules.get("urs_categories", ["undersized", "rotten", "damaged", "sprouted"]))
        self.grade_a_categories = set(self.rules.get("grade_a_categories", ["grade_a"]))
        self.min_confidence = self.rules.get("min_confidence_threshold", 0.50)
        self.audit_log: List[Dict[str, Any]] = []

    def evaluate_batch(self, inference_json: Dict[str, Any], operator_id: str = "OPERATOR_01") -> Dict[str, Any]:
        """
        Evaluates Stage 1 JSON output against center rules and computes lot-level stats.
        """
        onions = inference_json.get("onions", [])
        total_count = len(onions)

        if total_count == 0:
            return {
                "batch_id": f"BATCH_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "timestamp": datetime.now().isoformat(),
                "operator_id": operator_id,
                "center_id": self.config.get("center_id", "UNKNOWN"),
                "total_count": 0,
                "grade_a_count": 0,
                "grade_a_pct": 0.0,
                "urs_count": 0,
                "urs_pct": 0.0,
                "defect_breakdown": {},
                "review_flagged_count": 0,
                "onions": [],
                "audit_trail": []
            }

        grade_a_count = 0
        urs_count = 0
        defect_breakdown: Dict[str, int] = {
            "grade_a": 0,
            "damaged": 0,
            "rotten": 0,
            "sprouted": 0,
            "undersized": 0
        }
        flagged_count = 0

        evaluated_onions = []
        for item in onions:
            item_copy = dict(item)
            cls_name = item_copy.get("class", "grade_a")
            if not cls_name or cls_name.startswith("class_") or cls_name not in ["grade_a", "damaged", "rotten", "sprouted", "undersized"]:
                cls_name = "grade_a"
                item_copy["class"] = "grade_a"
            conf = item_copy.get("confidence", 1.0)

            # Check low confidence
            if conf < self.min_confidence:
                item_copy["flagged_for_review"] = True
                flagged_count += 1

            # Update counters
            if cls_name in self.grade_a_categories:
                grade_a_count += 1
            if cls_name in self.urs_categories:
                urs_count += 1

            defect_breakdown[cls_name] = defect_breakdown.get(cls_name, 0) + 1
            evaluated_onions.append(item_copy)

        grade_a_pct = round((grade_a_count / total_count) * 100.0, 2)
        urs_pct = round((urs_count / total_count) * 100.0, 2)

        return {
            "batch_id": f"BATCH_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "operator_id": operator_id,
            "center_id": self.config.get("center_id", "UNKNOWN"),
            "total_count": total_count,
            "grade_a_count": grade_a_count,
            "grade_a_pct": grade_a_pct,
            "urs_count": urs_count,
            "urs_pct": urs_pct,
            "defect_breakdown": defect_breakdown,
            "review_flagged_count": flagged_count,
            "onions": evaluated_onions,
            "audit_trail": list(self.audit_log)
        }

    def apply_human_override(self, 
                             evaluation_result: Dict[str, Any], 
                             onion_id: int, 
                             new_class: str, 
                             reviewer_id: str, 
                             reason: str = "Manual visual confirmation") -> Dict[str, Any]:
        """
        Applies human reclassification of a specific onion and logs the override for auditability.
        """
        onions = evaluation_result.get("onions", [])
        target_onion = None
        for item in onions:
            if item.get("id") == onion_id:
                target_onion = item
                break

        if target_onion is None:
            raise ValueError(f"Onion ID {onion_id} not found in batch evaluation.")

        original_class = target_onion.get("class")
        if original_class == new_class:
            return evaluation_result

        # Update onion record
        target_onion["class"] = new_class
        target_onion["flagged_for_review"] = False
        target_onion["human_overridden"] = True
        target_onion["overridden_by"] = reviewer_id

        # Log audit entry
        audit_entry = {
            "timestamp": datetime.now().isoformat(),
            "onion_id": onion_id,
            "original_class": original_class,
            "new_class": new_class,
            "reviewer_id": reviewer_id,
            "reason": reason
        }
        evaluation_result.setdefault("audit_trail", []).append(audit_entry)

        # Recalculate totals
        return self._recalculate_batch_totals(evaluation_result)

    def _recalculate_batch_totals(self, batch_data: Dict[str, Any]) -> Dict[str, Any]:
        onions = batch_data.get("onions", [])
        total_count = len(onions)
        grade_a_count = 0
        urs_count = 0
        defect_breakdown = {"grade_a": 0, "damaged": 0, "rotten": 0, "sprouted": 0, "undersized": 0}
        flagged_count = 0

        for item in onions:
            cls_name = item.get("class")
            if item.get("flagged_for_review", False):
                flagged_count += 1

            if cls_name in self.grade_a_categories:
                grade_a_count += 1
            if cls_name in self.urs_categories:
                urs_count += 1

            defect_breakdown[cls_name] = defect_breakdown.get(cls_name, 0) + 1

        batch_data["total_count"] = total_count
        batch_data["grade_a_count"] = grade_a_count
        batch_data["grade_a_pct"] = round((grade_a_count / total_count) * 100.0, 2) if total_count > 0 else 0.0
        batch_data["urs_count"] = urs_count
        batch_data["urs_pct"] = round((urs_count / total_count) * 100.0, 2) if total_count > 0 else 0.0
        batch_data["defect_breakdown"] = defect_breakdown
        batch_data["review_flagged_count"] = flagged_count

        return batch_data
