"""
size_calibration.py - Pixel-to-centimeter calibration using in-frame reference marker.
Calculates real physical dimensions (cm) for segmented onions and flags undersized instances.
"""

import cv2
import numpy as np
from typing import Tuple, Optional, List, Dict


class SizeCalibrator:
    def __init__(self, 
                 reference_type: str = "card", 
                 ref_width_cm: float = 8.56, 
                 ref_height_cm: float = 5.39,
                 coin_diameter_cm: float = 2.3,
                 undersized_threshold_cm: float = 4.5):
        """
        :param reference_type: 'card' (standard ID/credit card) or 'coin' (e.g. ₹5 coin).
        :param ref_width_cm: Width of reference card in cm.
        :param ref_height_cm: Height of reference card in cm.
        :param coin_diameter_cm: Diameter of reference coin in cm.
        :param undersized_threshold_cm: Size threshold in cm below which onions are flagged.
        """
        self.reference_type = reference_type
        self.ref_width_cm = ref_width_cm
        self.ref_height_cm = ref_height_cm
        self.coin_diameter_cm = coin_diameter_cm
        self.undersized_threshold_cm = undersized_threshold_cm

    def detect_reference_object(self, image: np.ndarray, ref_bbox_hint: Optional[Tuple[int, int, int, int]] = None) -> Tuple[float, bool]:
        """
        Detects the reference object in the image and calculates scale (pixels per cm).
        If a reference bounding box hint is provided (e.g. from UI guide or detector), it uses that.
        Otherwise, scans the top-left area for blue/card or circular coin contours.
        
        :return: (pixels_per_cm, is_calibrated)
        """
        h, w, _ = image.shape

        if ref_bbox_hint is not None:
            rx1, ry1, rx2, ry2 = ref_bbox_hint
            rw_px = abs(rx2 - rx1)
            rh_px = abs(ry2 - ry1)
            if rw_px > 10:
                scale = rw_px / self.ref_width_cm
                return scale, True

        # Automatic detection heuristic for reference card in upper-left quadrant
        roi = image[0:int(h * 0.4), 0:int(w * 0.4)]
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blur, 50, 150)

        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for cnt in sorted(contours, key=cv2.contourArea, reverse=True):
            area = cv2.contourArea(cnt)
            if area < 1000:
                continue

            rect = cv2.minAreaRect(cnt)
            (cx, cy), (rw, rh), angle = rect

            if rw == 0 or rh == 0:
                continue

            aspect_ratio = max(rw, rh) / min(rw, rh)
            
            # Credit card aspect ratio is ~1.58 (8.56 / 5.39)
            if self.reference_type == "card" and 1.3 <= aspect_ratio <= 1.8:
                card_long_px = max(rw, rh)
                scale = card_long_px / self.ref_width_cm
                return scale, True

            # Coin aspect ratio is ~1.0
            elif self.reference_type == "coin" and 0.85 <= aspect_ratio <= 1.15:
                coin_px = (rw + rh) / 2.0
                scale = coin_px / self.coin_diameter_cm
                return scale, True

        # Fallback default scale estimation if no marker found (assuming standard camera distance ~40cm)
        default_pixels_per_cm = 25.0
        print("[SizeCalibrator] Warning: No reference marker detected automatically. Using fallback scale (25.0 px/cm).")
        return default_pixels_per_cm, False

    def estimate_onion_size(self, mask_pts: np.ndarray, bbox: List[int], pixels_per_cm: float) -> Tuple[float, bool]:
        """
        Calculates physical diameter (cm) for an onion instance.
        
        :param mask_pts: Polygon contour points or binary mask
        :param bbox: [x1, y1, x2, y2]
        :param pixels_per_cm: Calibrated scale
        :return: (estimated_size_cm, is_undersized)
        """
        x1, y1, x2, y2 = bbox
        w_px = abs(x2 - x1)
        h_px = abs(y2 - y1)
        
        # Equivalent diameter in pixels
        major_axis_px = max(w_px, h_px)
        size_cm = round(float(major_axis_px / pixels_per_cm), 2)
        
        is_undersized = size_cm < self.undersized_threshold_cm
        return size_cm, is_undersized
